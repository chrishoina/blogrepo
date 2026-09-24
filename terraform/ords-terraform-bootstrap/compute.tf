locals {
  db_domain     = "mydb.myvcn.oraclevcn.com"
  db_private_ip = cidrhost(local.db_subnet_cidr, 10)
}

data "oci_identity_availability_domains" "available" {
  compartment_id = var.compartment_ocid
}

locals {
  discovered_availability_domains = [for ad in data.oci_identity_availability_domains.available.availability_domains : ad.name]
  availability_domains = distinct(concat(
    var.availability_domain == null ? [] : [var.availability_domain],
    local.discovered_availability_domains,
  ))
  primary_availability_domain = local.availability_domains[0]
}

data "oci_core_images" "oracle_linux" {
  compartment_id   = var.compartment_ocid
  operating_system = var.compute_operating_system
  # OCI treats this filter as optional. Normalize Resource Manager's possible
  # empty-string input so the default discovers the latest image regardless of
  # whether Terraform receives null or an empty value.
  operating_system_version = try(trimspace(var.compute_operating_system_version), "") != "" ? trimspace(var.compute_operating_system_version) : null
  shape                    = var.compute_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

locals {
  compute_image_ocid = coalesce(var.compute_image_ocid, try(data.oci_core_images.oracle_linux.images[0].id, null))
  ords_nodes = {
    for index in range(var.ords_node_count) : format("compute%02d", index + 1) => {
      private_ip          = cidrhost(local.compute_subnet_cidr, index + 10)
      install_mode        = index == 0 ? "full" : "config-only"
      availability_domain = local.availability_domains[index % length(local.availability_domains)]
    }
  }
}

# Calls OCI ListImageShapeCompatibilities for the image selected above. This
# validates user-provided image overrides and exposes the current compatible
# shapes and flexible-shape resource limits.
data "oci_core_image_shapes" "selected" {
  image_id = local.compute_image_ocid
}

locals {
  compatible_compute_shapes = [
    for compatibility in data.oci_core_image_shapes.selected.image_shape_compatibilities : compatibility.shape
  ]
  selected_compute_shape_compatibility = one([
    for compatibility in data.oci_core_image_shapes.selected.image_shape_compatibilities : compatibility
    if compatibility.shape == var.compute_shape
  ])
  compute_ocpu_minimum   = try(local.selected_compute_shape_compatibility.ocpu_constraints[0].min, null)
  compute_ocpu_maximum   = try(local.selected_compute_shape_compatibility.ocpu_constraints[0].max, null)
  compute_memory_minimum = try(local.selected_compute_shape_compatibility.memory_constraints[0].min_in_gbs, null)
  compute_memory_maximum = try(local.selected_compute_shape_compatibility.memory_constraints[0].max_in_gbs, null)
}

resource "oci_core_instance" "ords" {
  for_each            = local.ords_nodes
  compartment_id      = var.compartment_ocid
  availability_domain = each.value.availability_domain
  display_name        = each.key
  shape               = var.compute_shape
  freeform_tags       = var.tags

  shape_config {
    ocpus         = var.compute_ocpus
    memory_in_gbs = var.compute_memory_in_gbs
  }

  create_vnic_details {
    assign_public_ip = false
    subnet_id        = oci_core_subnet.compute.id
    private_ip       = each.value.private_ip
    hostname_label   = each.key
    display_name     = each.key
    nsg_ids          = [oci_core_network_security_group.compute.id]
  }

  source_details {
    source_type             = "image"
    source_id               = local.compute_image_ocid
    boot_volume_vpus_per_gb = 10
  }

  metadata = {
    ssh_authorized_keys = local.effective_ssh_public_key
    user_data = base64encode(templatefile("${path.module}/cloud-init/ords.sh.tftpl", {
      db_hostname          = local.db_private_ip
      db_domain            = local.db_domain
      lb_subnet_cidr       = local.lb_subnet_cidr
      vcn_cidr             = local.vcn_cidr
      db_admin_password    = local.effective_db_admin_password
      ords_proxy_password  = local.effective_ords_proxy_password
      install_mode         = each.value.install_mode
      rest_schema_username = var.rest_schema_username
      rest_schema_password = local.effective_rest_schema_password
      ords_auto_rest_auth  = var.ords_auto_rest_auth
      rest_user_sql_b64    = base64encode(file("${path.module}/sql/create_rest_user.sql"))
    }))
  }

  depends_on = [oci_database_pluggable_database.pdb2]

  lifecycle {
    precondition {
      condition     = contains(local.compatible_compute_shapes, var.compute_shape)
      error_message = "compute_shape is not compatible with the selected compute image. Select a compatible shape or image."
    }

    precondition {
      # OCI does not publish flexible-resource constraints for every image and
      # shape. Use a conditional expression so null bounds are never compared.
      condition = local.compute_ocpu_minimum == null ? true : (
        var.compute_ocpus >= local.compute_ocpu_minimum && var.compute_ocpus <= local.compute_ocpu_maximum
      )
      error_message = "compute_ocpus is outside the selected image and shape's supported range."
    }

    precondition {
      condition = local.compute_memory_minimum == null ? true : (
        var.compute_memory_in_gbs >= local.compute_memory_minimum && var.compute_memory_in_gbs <= local.compute_memory_maximum
      )
      error_message = "compute_memory_in_gbs is outside the selected image and shape's supported range."
    }
  }
}
