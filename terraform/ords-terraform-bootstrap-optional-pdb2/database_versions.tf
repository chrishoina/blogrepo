# Queries OCI's ListDbVersions API through the Terraform provider. The result
# reflects versions available in the selected region/compartment for the chosen
# DB system shape and LVM storage management.

data "oci_database_db_versions" "selected_shape" {
  compartment_id     = var.compartment_ocid
  db_system_shape    = var.database_shape
  storage_management = "LVM"
}

locals {
  requested_database_version          = try(trimspace(var.database_version), "")
  requested_database_version_is_major = can(regex("^[0-9]+$", local.requested_database_version))

  available_database_versions = [
    for db_version in data.oci_database_db_versions.selected_shape.db_versions : db_version.version
  ]

  requested_major_database_version_candidates = [
    for db_version in data.oci_database_db_versions.selected_shape.db_versions : db_version.version
    if local.requested_database_version_is_major &&
    startswith(db_version.version, "${local.requested_database_version}.") &&
    db_version.is_latest_for_major_version &&
    !db_version.is_preview_db_version
  ]

  requested_major_database_version = try(
    local.requested_major_database_version_candidates[0],
    local.requested_database_version,
  )

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
  # resolved here during planning. A major-family input such as "19" is
  # resolved to that family's latest non-preview exact release. Any other
  # non-empty input remains an exact-version override.
  effective_database_version = local.requested_database_version == "" ? local.latest_database_version : (
    local.requested_database_version_is_major ? local.requested_major_database_version : local.requested_database_version
  )
}
