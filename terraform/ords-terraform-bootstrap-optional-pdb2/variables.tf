variable "region" {
  description = "Required OCI region in which to create the stack, for example us-ashburn-1."
  type        = string
  nullable    = false

  validation {
    condition     = length(trimspace(var.region)) > 0
    error_message = "region must be a non-empty OCI region name."
  }
}

variable "tenancy_ocid" {
  description = "OCI tenancy OCID supplied automatically by Resource Manager. It is optional for local Terraform because the OCI provider can obtain tenancy authentication from its configured profile."
  type        = string
  default     = null
}

variable "compartment_ocid" {
  description = "OCID of the compartment in which to create the stack."
  type        = string
}

variable "availability_domain" {
  description = "Optional primary Availability Domain override. mydb11 and the first ORDS node use this AD; additional ORDS nodes cycle through the available ADs."
  type        = string
  default     = null
}

variable "compute_image_ocid" {
  description = "Optional image OCID override. Leave null to use the latest Oracle Linux image compatible with compute_shape in the target region."
  type        = string
  default     = null
}

variable "compute_operating_system" {
  description = "OCI platform operating system used when discovering the default compute image."
  type        = string
  default     = "Oracle Linux"
}

variable "compute_operating_system_version" {
  description = "Optional OCI platform operating-system version used when discovering the default compute image. Leave null or empty to select the latest compatible image."
  type        = string
  default     = null
}

variable "compute_shape" {
  description = "Flexible VM shape used by both ORDS nodes."
  type        = string
  default     = "VM.Standard.E5.Flex"
}

variable "compute_ocpus" {
  description = "OCPUs assigned to each ORDS node."
  type        = number
  default     = 1
}

variable "compute_memory_in_gbs" {
  description = "Memory assigned to each ORDS node."
  type        = number
  default     = 12
}

variable "ords_node_count" {
  description = "Number of ORDS compute nodes to create. The first node performs the full ORDS and REST-schema bootstrap; remaining nodes use configuration-only (--db-only flag) mode."
  type        = number
  default     = 2

  validation {
    condition     = var.ords_node_count == floor(var.ords_node_count) && var.ords_node_count >= 1 && var.ords_node_count <= 200
    error_message = "ords_node_count must be an integer from 1 through 200."
  }
}

variable "rest_schema_username" {
  description = "Schema created and REST-enabled by the first ORDS node in each PDB."
  type        = string
  default     = "ORDSDEMO"

  validation {
    condition     = can(regex("^[A-Za-z][A-Za-z0-9_$#]{0,127}$", var.rest_schema_username))
    error_message = "rest_schema_username must be a valid unquoted Oracle identifier."
  }
}

variable "ords_auto_rest_auth" {
  description = "Whether ORDS schema auto-REST authorization is enabled."
  type        = bool
  default     = false
}

variable "deploy_pdb2" {
  description = "Whether to create pdb2 and configure ORDS and the REST schema for it."
  type        = bool
  default     = true
}

variable "database_version" {
  description = "Optional Base Database software version or major family such as 19. Leave null or empty to select OCI's latest non-preview release; a major family is resolved to its latest exact release."
  type        = string
  default     = null
}

variable "database_shape" {
  description = "OCI Base Database System shape. Availability depends on the selected region, database version, and edition."
  type        = string
  default     = "VM.BaseDB.x86"

  validation {
    condition = contains([
      "VM.BaseDB.x86",
      "VM.Standard.x86",
      "VM.Standard2.1",
      "VM.Standard2.2",
      "VM.Standard2.4",
      "VM.Standard2.8",
      "VM.Standard2.16",
      "VM.Standard2.24",
    ], var.database_shape)
    error_message = "database_shape must be a supported ECPU-based flexible shape or fixed VM.Standard2 shape listed by this stack."
  }
}

variable "database_cpu_core_count" {
  description = "ECPU count for x86 flexible shapes. Ignored for fixed VM.Standard2 shapes."
  type        = number
  default     = 16

  validation {
    condition     = var.database_cpu_core_count >= 1 && var.database_cpu_core_count <= 256
    error_message = "database_cpu_core_count must be between 1 and 256. Shape-specific validation occurs during planning."
  }
}

variable "database_edition" {
  description = "Base Database System software edition. Defaults to Enterprise Edition."
  type        = string
  default     = "ENTERPRISE_EDITION"
}

variable "database_license_model" {
  description = "OCI database license model."
  type        = string
  default     = "LICENSE_INCLUDED"
}

variable "tags" {
  description = "Freeform tags added to all supported resources."
  type        = map(string)
  default = {
    Stack = "ords-ha-terraform-deployment"
  }
}
