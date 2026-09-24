# OCI Base Database requires at least two characters from each category and
# permits only _, #, and - as administrator-password special characters. Use
# that same shell- and SQL-safe alphabet for all generated stack passwords.
resource "random_password" "db_admin" {
  length           = 24
  upper            = true
  lower            = true
  numeric          = true
  special          = true
  min_upper        = 2
  min_lower        = 2
  min_numeric      = 2
  min_special      = 2
  override_special = "_#-"
}

resource "random_password" "ords_proxy" {
  length           = 24
  upper            = true
  lower            = true
  numeric          = true
  special          = true
  min_upper        = 2
  min_lower        = 2
  min_numeric      = 2
  min_special      = 2
  override_special = "_#-"
}

resource "random_password" "rest_schema" {
  length           = 24
  upper            = true
  lower            = true
  numeric          = true
  special          = true
  min_upper        = 2
  min_lower        = 2
  min_numeric      = 2
  min_special      = 2
  override_special = "_#-"
}

locals {
  effective_db_admin_password    = random_password.db_admin.result
  effective_ords_proxy_password  = random_password.ords_proxy.result
  effective_rest_schema_password = random_password.rest_schema.result

  generated_db_admin_password    = random_password.db_admin.result
  generated_ords_proxy_password  = random_password.ords_proxy.result
  generated_rest_schema_password = random_password.rest_schema.result
}
