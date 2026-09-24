# Generate one stack-specific SSH key pair for every deployment. The private
# key is retained in Terraform state and exposed only as a sensitive output;
# the public key is installed on every SSH-accessible host.
resource "tls_private_key" "stack_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

locals {
  effective_ssh_public_key  = tls_private_key.stack_ssh.public_key_openssh
  generated_ssh_private_key = tls_private_key.stack_ssh.private_key_openssh
}
