locals {
  ecpu_database_shapes = toset(["VM.BaseDB.x86", "VM.Standard.x86"])
}

resource "oci_database_db_system" "mydb" {
  compartment_id      = var.compartment_ocid
  availability_domain = local.primary_availability_domain
  display_name        = "mydb"
  hostname            = "mydb"
  domain              = local.db_domain
  subnet_id           = oci_core_subnet.db.id
  nsg_ids             = [oci_core_network_security_group.db.id]
  private_ip          = local.db_private_ip
  time_zone           = "UTC"

  shape         = var.database_shape
  compute_model = contains(local.ecpu_database_shapes, var.database_shape) ? "ECPU" : null
  # BaseDB x86 and Standard x86 use OCI's ECPU compute model, whose API
  # requires compute_count. Fixed VM.Standard2 shapes use neither setting.
  compute_count                   = contains(local.ecpu_database_shapes, var.database_shape) ? var.database_cpu_core_count : null
  database_edition                = var.database_edition
  license_model                   = var.database_license_model
  node_count                      = 1
  data_storage_size_in_gb         = 256
  reco_storage_size_in_gb         = 256
  storage_volume_performance_mode = "BALANCED"
  disk_redundancy                 = "NORMAL"
  source                          = "NONE"
  ssh_public_keys                 = [local.effective_ssh_public_key]
  freeform_tags                   = var.tags

  db_system_options {
    storage_management = "LVM"
  }

  db_home {
    display_name = "mydb"
    db_version   = local.effective_database_version

    database {
      db_name        = "mydb"
      admin_password = local.effective_db_admin_password
      character_set  = "AL32UTF8"
      ncharacter_set = "AL16UTF16"
      pdb_name       = "pdb1"

      db_backup_config {
        auto_backup_enabled       = false
        run_immediate_full_backup = false
      }
    }
  }

  lifecycle {
    precondition {
      condition     = contains(local.available_database_versions, local.effective_database_version)
      error_message = "database_version must be omitted (so OCI's latest non-preview available release is selected) or exactly match a version returned by OCI ListDbVersions for the selected database_shape in this region with LVM storage."
    }

    precondition {
      condition = !contains(local.ecpu_database_shapes, var.database_shape) || (
        var.database_cpu_core_count >= 4 &&
        var.database_cpu_core_count <= (var.database_shape == "VM.BaseDB.x86" ? 256 : 252) &&
        var.database_cpu_core_count % 4 == 0
      )
      error_message = "database_cpu_core_count must be a multiple of 4 from 4 through 256 for VM.BaseDB.x86, or from 4 through 252 for VM.Standard.x86; it is ignored for fixed VM.Standard2 shapes."
    }

    ignore_changes = [db_home[0].database[0].admin_password]
  }
}

# pdb1 is created with the CDB. This resource adds the second requested PDB.
resource "oci_database_pluggable_database" "pdb2" {
  container_database_id             = oci_database_db_system.mydb.db_home[0].database[0].id
  container_database_admin_password = local.effective_db_admin_password
  pdb_name                          = "pdb2"
  pdb_admin_password                = local.effective_db_admin_password
  # The CDB is created with the administrator password as its TDE wallet
  # password. OCI still requires that existing wallet password when adding PDB2.
  tde_wallet_password = local.effective_db_admin_password
}
