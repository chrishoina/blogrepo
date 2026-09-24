# Queries OCI's ListDbVersions API through the Terraform provider. The result
# reflects versions available in the selected region/compartment for the chosen
# DB system shape and LVM storage management.

data "oci_database_db_versions" "selected_shape" {
  compartment_id     = var.compartment_ocid
  db_system_shape    = var.database_shape
  storage_management = "LVM"
}

locals {
  available_database_versions = [
    for db_version in data.oci_database_db_versions.selected_shape.db_versions : db_version.version
  ]

  # OCI marks the most recent release in each major-version family.  Sorting
  # those releases selects the highest available non-preview release overall.

  latest_database_version_candidates = [
    for db_version in data.oci_database_db_versions.selected_shape.db_versions : db_version.version
    if db_version.is_latest_for_major_version && !db_version.is_preview_db_version
  ]
  latest_database_version = try(
    element(
      sort(local.latest_database_version_candidates),
      length(local.latest_database_version_candidates) - 1,
    ),
    "",
  )

  # OCI requires the exact release string. An omitted database_version is
  # resolved here during planning; an exact value remains an override.
  effective_database_version = try(trimspace(var.database_version), "") != "" ? trimspace(var.database_version) : local.latest_database_version
}
