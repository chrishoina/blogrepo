resource "oci_load_balancer_load_balancer" "mylb" {
  compartment_id             = var.compartment_ocid
  display_name               = "mylb"
  is_private                 = false
  shape                      = "flexible"
  subnet_ids                 = [oci_core_subnet.lb.id]
  network_security_group_ids = [oci_core_network_security_group.lb.id]
  freeform_tags              = var.tags

  shape_details {
    minimum_bandwidth_in_mbps = 10
    maximum_bandwidth_in_mbps = 10
  }
}

resource "tls_private_key" "mylb" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_self_signed_cert" "mylb" {
  private_key_pem       = tls_private_key.mylb.private_key_pem
  validity_period_hours = 8760
  is_ca_certificate     = false

  subject {
    common_name = "mycert"
  }

  allowed_uses = [
    "digital_signature",
    "key_encipherment",
    "server_auth",
  ]
}

resource "oci_load_balancer_certificate" "mylb" {
  load_balancer_id   = oci_load_balancer_load_balancer.mylb.id
  certificate_name   = "mycert"
  public_certificate = tls_self_signed_cert.mylb.cert_pem
  private_key        = tls_private_key.mylb.private_key_pem
}

resource "oci_load_balancer_backend_set" "ords" {
  load_balancer_id = oci_load_balancer_load_balancer.mylb.id
  name             = "ords-backend-set"
  policy           = "ROUND_ROBIN"

  health_checker {
    protocol          = "HTTP"
    port              = 8080
    url_path          = "/ords/_/public-properties/"
    return_code       = 200
    interval_ms       = 10000
    timeout_in_millis = 3000
    retries           = 3
  }
}

resource "oci_load_balancer_backend" "ords" {
  for_each         = oci_core_instance.ords
  load_balancer_id = oci_load_balancer_load_balancer.mylb.id
  backendset_name  = oci_load_balancer_backend_set.ords.name
  ip_address       = each.value.private_ip
  port             = 8080
  weight           = 1
  backup           = false
  drain            = false
  offline          = false
}

resource "oci_load_balancer_listener" "https" {
  load_balancer_id         = oci_load_balancer_load_balancer.mylb.id
  name                     = "ssl-listener"
  default_backend_set_name = oci_load_balancer_backend_set.ords.name
  port                     = 443
  protocol                 = "HTTP"

  ssl_configuration {
    certificate_name        = oci_load_balancer_certificate.mylb.certificate_name
    verify_peer_certificate = false
    verify_depth            = 1
    protocols               = ["TLSv1.2"]
    cipher_suite_name       = "oci-default-ssl-cipher-suite-v1"
    has_session_resumption  = true
    server_order_preference = "DISABLED"
  }
}
