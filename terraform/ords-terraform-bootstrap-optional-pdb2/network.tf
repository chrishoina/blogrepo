locals {
  vcn_cidr            = "10.0.0.0/16"
  lb_subnet_cidr      = "10.0.0.0/24"
  compute_subnet_cidr = "10.0.1.0/24"
  db_subnet_cidr      = "10.0.2.0/24"
}

resource "oci_core_vcn" "myvcn" {
  compartment_id = var.compartment_ocid
  display_name   = "myvcn"
  dns_label      = "myvcn"
  cidr_blocks    = [local.vcn_cidr]
  freeform_tags  = var.tags
}

# NSGs express the workload traffic policy. This narrow egress rule also lets a
# Cloud Shell ephemeral private-network VNIC in compute-subnet initiate SSH to
# the private ORDS instances.
resource "oci_core_default_security_list" "myvcn" {
  compartment_id             = var.compartment_ocid
  manage_default_resource_id = oci_core_vcn.myvcn.default_security_list_id
  display_name               = "myvcn-default-security-list"

  egress_security_rules {
    destination      = local.compute_subnet_cidr
    destination_type = "CIDR_BLOCK"
    protocol         = "6"
    description      = "Cloud Shell private-network SSH to ORDS compute instances"

    tcp_options {
      min = 22
      max = 22
    }
  }
}

resource "oci_core_internet_gateway" "myvcn" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "myvcn-internet-gateway"
  enabled        = true
  freeform_tags  = var.tags
}

resource "oci_core_nat_gateway" "myvcn" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "myvcn-nat-gateway"
  freeform_tags  = var.tags
}

# Base Database provisioning retrieves software from OCI Object Storage.  The
# private DB subnet therefore needs private access to the Oracle Services
# Network; a NAT gateway or internet gateway alone is not sufficient.
data "oci_core_services" "oracle_services_network" {
  filter {
    name   = "name"
    values = ["All .* Services In Oracle Services Network"]
    regex  = true
  }
}

resource "oci_core_service_gateway" "myvcn" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "myvcn-service-gateway"
  freeform_tags  = var.tags

  services {
    service_id = data.oci_core_services.oracle_services_network.services[0].id
  }
}

resource "oci_core_route_table" "lb" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "lb-subnet"
  freeform_tags  = var.tags

  route_rules {
    network_entity_id = oci_core_internet_gateway.myvcn.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }
}

resource "oci_core_route_table" "compute" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "compute-subnet"
  freeform_tags  = var.tags

  route_rules {
    network_entity_id = oci_core_nat_gateway.myvcn.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }
}

# The database subnet has no public route. This private route lets the DB System
# obtain required software and backups from OCI Object Storage during launch.
resource "oci_core_route_table" "db" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "db-subnet"
  freeform_tags  = var.tags

  route_rules {
    network_entity_id = oci_core_service_gateway.myvcn.id
    destination       = data.oci_core_services.oracle_services_network.services[0].cidr_block
    destination_type  = "SERVICE_CIDR_BLOCK"
  }
}

resource "oci_core_subnet" "lb" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.myvcn.id
  display_name               = "lb-subnet"
  dns_label                  = "mylb"
  cidr_block                 = local.lb_subnet_cidr
  route_table_id             = oci_core_route_table.lb.id
  prohibit_public_ip_on_vnic = false
  security_list_ids          = [oci_core_default_security_list.myvcn.id]
  freeform_tags              = var.tags
}

resource "oci_core_subnet" "compute" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.myvcn.id
  display_name               = "compute-subnet"
  dns_label                  = "mycomputes"
  cidr_block                 = local.compute_subnet_cidr
  route_table_id             = oci_core_route_table.compute.id
  prohibit_public_ip_on_vnic = true
  security_list_ids          = [oci_core_default_security_list.myvcn.id]
  freeform_tags              = var.tags
}

resource "oci_core_subnet" "db" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.myvcn.id
  display_name               = "db-subnet"
  dns_label                  = "mydb"
  cidr_block                 = local.db_subnet_cidr
  route_table_id             = oci_core_route_table.db.id
  prohibit_public_ip_on_vnic = true
  security_list_ids          = [oci_core_default_security_list.myvcn.id]
  freeform_tags              = var.tags
}

resource "oci_core_network_security_group" "lb" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "lb-nsg"
  freeform_tags  = var.tags
}

resource "oci_core_network_security_group" "compute" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "compute-nsg"
  freeform_tags  = var.tags
}

resource "oci_core_network_security_group" "db" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.myvcn.id
  display_name   = "db-nsg"
  freeform_tags  = var.tags
}

resource "oci_core_network_security_group_security_rule" "lb_https_ingress" {
  network_security_group_id = oci_core_network_security_group.lb.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = "0.0.0.0/0"
  source_type               = "CIDR_BLOCK"
  description               = "Public HTTPS listener"
  tcp_options {
    destination_port_range {
      min = 443
      max = 443
    }
  }
}

resource "oci_core_network_security_group_security_rule" "lb_to_compute_ords" {
  network_security_group_id = oci_core_network_security_group.lb.id
  direction                 = "EGRESS"
  protocol                  = "6"
  destination               = oci_core_network_security_group.compute.id
  destination_type          = "NETWORK_SECURITY_GROUP"
  description               = "Forward HTTP to ORDS nodes"
  tcp_options {
    destination_port_range {
      min = 8080
      max = 8080
    }
  }
}

resource "oci_core_network_security_group_security_rule" "compute_ords_from_lb" {
  network_security_group_id = oci_core_network_security_group.compute.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = oci_core_network_security_group.lb.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "ORDS traffic and health checks from mylb"
  tcp_options {
    destination_port_range {
      min = 8080
      max = 8080
    }
  }
}

resource "oci_core_network_security_group_security_rule" "compute_ssh" {
  network_security_group_id = oci_core_network_security_group.compute.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = local.vcn_cidr
  source_type               = "CIDR_BLOCK"
  description               = "Administration SSH from within myvcn, including Cloud Shell Private Networking"
  tcp_options {
    destination_port_range {
      min = 22
      max = 22
    }
  }
}

resource "oci_core_network_security_group_security_rule" "compute_to_db" {
  network_security_group_id = oci_core_network_security_group.compute.id
  direction                 = "EGRESS"
  protocol                  = "6"
  destination               = oci_core_network_security_group.db.id
  destination_type          = "NETWORK_SECURITY_GROUP"
  description               = "ORDS database connectivity"
  tcp_options {
    destination_port_range {
      min = 1521
      max = 1521
    }
  }
}

resource "oci_core_network_security_group_security_rule" "compute_egress" {
  network_security_group_id = oci_core_network_security_group.compute.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "OS updates and package downloads through NAT"
}

resource "oci_core_network_security_group_security_rule" "db_from_compute" {
  network_security_group_id = oci_core_network_security_group.db.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = oci_core_network_security_group.compute.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Oracle Net from ORDS nodes"
  tcp_options {
    destination_port_range {
      min = 1521
      max = 1521
    }
  }
}

resource "oci_core_network_security_group_security_rule" "db_egress" {
  network_security_group_id = oci_core_network_security_group.db.id
  direction                 = "EGRESS"
  protocol                  = "6"
  destination               = data.oci_core_services.oracle_services_network.services[0].cidr_block
  destination_type          = "SERVICE_CIDR_BLOCK"
  description               = "HTTPS access to Oracle Services Network through Service Gateway"

  tcp_options {
    destination_port_range {
      min = 443
      max = 443
    }
  }
}
