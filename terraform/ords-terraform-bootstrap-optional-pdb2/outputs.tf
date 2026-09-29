output "ords_pdb1_landing_page" {
  description = "HTTPS ORDS landing page for pdb1 through mylb. Browsers will warn because the listener uses a self-signed certificate."
  value       = "https://${oci_load_balancer_load_balancer.mylb.ip_address_details[0].ip_address}/ords/pdb1/_/landing"

  # Do not publish the URL until its listener and every ORDS backend have been
  # created. The backend set's health checker then evaluates the backends.
  depends_on = [
    oci_load_balancer_listener.https,
    oci_load_balancer_backend.ords,
  ]
}

output "ords_pdb2_landing_page" {
  description = "HTTPS ORDS landing page for pdb2 through mylb, or null when pdb2 is disabled."
  value = var.deploy_pdb2 ? (
    "https://${oci_load_balancer_load_balancer.mylb.ip_address_details[0].ip_address}/ords/pdb2/_/landing"
  ) : null

  # Do not publish the URL until its listener and every ORDS backend have been
  # created. The backend set's health checker then evaluates the backends.
  depends_on = [
    oci_load_balancer_listener.https,
    oci_load_balancer_backend.ords,
  ]
}

output "selected_database_version" {
  description = "Exact OCI Base Database release selected for this deployment."
  value       = local.effective_database_version
}

output "generated_ssh_private_key" {
  description = "Stack-generated OpenSSH private key installed on the ORDS compute instances and Base Database System. Save this key securely; Terraform retains it in state."
  value       = local.generated_ssh_private_key
  sensitive   = true
}

output "generated_db_admin_password" {
  description = "Stack-generated temporary password for SYS, SYSTEM, PDB Admin and the TDE Wallet. Terraform retains it in state."
  value       = local.generated_db_admin_password
  sensitive   = true
}

output "generated_ords_proxy_password" {
  description = "Stack-generated ORDS_PUBLIC_USER password. Terraform retains it in state."
  value       = local.generated_ords_proxy_password
  sensitive   = true
}

output "generated_rest_schema_password" {
  description = "Stack-generated temporary password for the selected REST-enabled schema. Terraform retains it in state."
  value       = local.generated_rest_schema_password
  sensitive   = true
}
