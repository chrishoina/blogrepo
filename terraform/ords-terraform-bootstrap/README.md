# ORDS Terraform bootstrap

This stack creates only the requested OCI resources from the reference export:

- VCN `myvcn`, with fixed public load-balancer, private compute, and private database subnets. The database subnet reaches OCI Object Storage privately through a Service Gateway, which is required while provisioning the Base Database System.
- Base Database System `mydb`; its CDB creates `pdb1`, and Terraform adds `pdb2`.
- Private ORDS instances, with a configurable node count (default: two).
- Public flexible Load Balancer `mylb`, with an HTTPS listener and every ORDS node as a port-8080 backend.

## Bootstrap behavior

Cloud-init installs system updates, `nc`, ORDS, SQLcl, JDK 25, and firewalld. It permits TCP/8080 only from the LB subnet CIDR at the host firewall, sets ORDS directory ownership/permissions, waits for the database listener, and starts the systemd ORDS service.

The compute NSG also allows all outbound IPv4 traffic (`protocol = "all"`, destination `0.0.0.0/0`). The compute subnet routes this traffic through the NAT Gateway so cloud-init can install OS updates and required packages. This broad egress rule is a convenience for this demonstration stack, not a least-privilege production policy. Production deployments should restrict outbound destinations and ports to approved package repositories and required OCI services, potentially using a Service Gateway or an approved egress proxy. Allowlisting those destinations improves security but requires ongoing maintenance as package sources and dependencies change.

The first ORDS node (`compute01`) performs the full ORDS install for `pdb1` and `pdb2`. Every additional node uses `ords install --config-only` for both pools. All nodes set `security.httpsHeaderCheck` to `X-Forwarded-Proto: http`, because TLS terminates at `mylb`. 

After the full install, `compute01` also runs [sql/create_rest_user.sql](sql/create_rest_user.sql) once in each PDB with SQLcl. The script is non-interactive: cloud-init passes `rest_schema_username`, the effective sensitive REST schema password, and `ords_auto_rest_auth` as SQLcl `DEFINE` values before invoking it. The schema password is used only when the schema does not already exist; re-runs preserve an existing schema's password. Config-only nodes do not run this database-level bootstrap.

## Self-signed TLS

The TLS provider generates an RSA key and one-year self-signed certificate. Terraform uploads both to the OCI load balancer and enables TLS 1.2 on port 443. Clients must explicitly trust this generated certificate or accept the browser warning. 

## Prerequisites

Before creating the stack, choose values that are valid for the target tenancy and region:

- A compartment. Confirm that the selected database version and edition are available for the target region and shape.
- Capacity for the selected compute and Base DB shapes.

The network uses fixed CIDRs: VCN `10.0.0.0/16`, public load-balancer subnet `10.0.0.0/24`, private compute subnet `10.0.1.0/24`, and private database subnet `10.0.2.0/24`. The database uses `10.0.2.10`; ORDS nodes use consecutive private addresses starting at `10.0.1.10`. There is no random VCN-octet input. DNS labels are fixed to `myvcn`, `mylb`, `mycomputes`, and `mydb`; the generated TLS certificate common name is fixed to `mycert`.

By default, OCI places `mydb` and `compute01` in the first available Availability Domain, then distributes additional ORDS nodes across the available ADs. Set `availability_domain` to choose a different primary AD. In a single-AD region, all instances necessarily use that AD.

This provides Availability-Domain distribution for the ORDS tier. `mydb` remains the requested single-node Base Database System, so it is not database-level HA.

During planning, the stack calls OCI's `ListImageShapeCompatibilities` API for the resolved ORDS image. It rejects an incompatible `compute_shape` or flexible OCPU/memory range.

## Default settings and database choices

The stack defaults to two ORDS nodes, OCI's latest available non-preview Base Database release for the selected configuration, Enterprise Edition, and independently generated credentials. Leave `database_version` unset to use that dynamically selected release, or set an exact release if you need to pin it.

During planning, the stack calls OCI Database Service's `ListDbVersions` API for the selected compartment, database shape, and LVM storage option. When `database_version` is unset, the stack resolves the highest available non-preview release that OCI identifies as latest for its major version; OCI still receives its exact release string. Alternatively, supply an exact version returned by OCI. The plan fails if no matching release is available. The exact selection is exposed as the `selected_database_version` stack output after deployment.

| Setting | Default | Notes |
| --- | --- | --- |
| `ords_node_count` | `2` | `compute01` performs the full bootstrap; additional nodes use configuration-only mode. |
| `database_version` | Unset | Resolves at plan time to OCI's latest available non-preview release. Set an exact OCI release string to pin it; available values vary by region and selected shape. |
| `database_edition` | `ENTERPRISE_EDITION` | Standard Enterprise Edition. |
| `database_shape` | `VM.BaseDB.x86` | ECPU-based flexible x86 shape. Fixed `VM.Standard2` shapes are also supported. Availability depends on region, version, and edition. |
| `database_cpu_core_count` | `16` | ECPU count for x86 flexible shapes (32 GB at the default). Ignored for fixed `VM.Standard2` shapes. |
| `rest_schema_username` | `ORDSDEMO` | REST-enabled schema created in each PDB. Change this value to choose a different schema name. |
| `generated_db_admin_password` | Generated | Temporary 24-character SYS/admin password; sensitive stack output only. |
| `generated_ords_proxy_password` | Generated | Temporary 24-character password for `ORDS_PUBLIC_USER`; sensitive stack output only. |
| `generated_rest_schema_password` | Generated | Temporary 24-character password for the selected REST-enabled schema; sensitive stack output only. |

The `database_edition` can optionally be one of the following OCI API values:

| Database edition | Terraform value |
| --- | --- |
| Standard Edition | `STANDARD_EDITION` |
| Enterprise Edition | `ENTERPRISE_EDITION` |
| Enterprise Edition High Performance | `ENTERPRISE_EDITION_HIGH_PERFORMANCE` |
| Enterprise Edition Extreme Performance | `ENTERPRISE_EDITION_EXTREME_PERFORMANCE` |
| Enterprise Edition Developer | `ENTERPRISE_EDITION_DEVELOPER` |

> Note: Enterprise Edition Developer is intended for development use and has OCI service restrictions, including single-node deployment and Ampere A1 shape requirements. Database version and edition availability can also vary by region and shape.

## Generated passwords

Terraform automatically generates temporary, separate 24-character passwords for SYS, `ORDS_PUBLIC_USER`, and the selected REST-enabled schema. Each password includes at least two uppercase letters, two lowercase letters, two numbers, and two special characters. Special characters are restricted to `_`, `#`, and `-` to satisfy OCI Base Database requirements and remain safe through the non-interactive ORDS and SQLcl bootstrap.

After Apply, open the Resource Manager **Application Information** tab and unlock and securely record the three values under **Generated credentials**. No password inputs are required or accepted. Set `rest_schema_username` only if you want a schema name other than the default `ORDSDEMO`. Never place generated credentials in the stack archive or source control.

## SSH keys

Terraform automatically generates one stack-specific 4096-bit RSA SSH key pair and installs its public key on every ORDS instance and the Base Database System. No SSH key input is required. After Apply, open the Resource Manager **Application Information** tab, unlock **Generated SSH private key**, copy the complete value into a local file such as `~/.ssh/ords_stack`, and restrict its permissions:

```sh
chmod 600 ~/.ssh/ords_stack
```

The Resource Manager user/group also needs permission to manage VCNs, compute instances, load balancers, and database systems in the target compartment. To use Cloud Shell Private Networking after deployment, the user needs permission to use subnets, VNICs, and network security groups, and to inspect VCNs.

## IAM policies

The person who creates the Resource Manager stack and runs its Plan/Apply jobs must belong to an OCI IAM group with the required permissions. The policy names below are placeholders: replace `<deployment-group>` with that IAM group and `<target-compartment>` with the compartment name holding this deployment. Create the policies in the tenancy's root compartment.

```text
Allow group <deployment-group> to manage orm-family in compartment <target-compartment>
Allow group <deployment-group> to manage virtual-network-family in compartment <target-compartment>
Allow group <deployment-group> to manage instance-family in compartment <target-compartment>
Allow group <deployment-group> to manage volume-family in compartment <target-compartment>
Allow group <deployment-group> to manage load-balancers in compartment <target-compartment>
Allow group <deployment-group> to manage database-family in compartment <target-compartment>
Allow group <deployment-group> to read instance-images in tenancy
Allow group <deployment-group> to read availability-domains in tenancy
```

The `orm-family` permission permits creating and running Resource Manager stacks/jobs. The remaining policies permit Terraform to create the VCN, gateways, subnets, NSGs, compute/boot volumes, load balancer, and Base Database System. If the organization separates networking and database administration into different compartments, grant the corresponding policies in each resource compartment. A tenancy administrator can tailor these baseline policies to its least-privilege model.

For Cloud Shell Private Networking, grant the same deployment group these additional permissions in the target compartment:

```text
Allow group <deployment-group> to use subnets in compartment <target-compartment>
Allow group <deployment-group> to use vnics in compartment <target-compartment>
Allow group <deployment-group> to use network-security-groups in compartment <target-compartment>
Allow group <deployment-group> to inspect vcns in compartment <target-compartment>
```

## Deploy with OCI Resource Manager

Resource Manager recognizes the reserved Terraform variable names `tenancy_ocid`, `region`, and `compartment_ocid`. When this configuration is opened in the Console, it supplies the signed-in tenancy automatically and prepopulates the deployment compartment from the compartment selected for the stack. The tenancy value is hidden because it is context rather than a deployment choice. Region is a required deployment choice with no default; select it before creating the stack.

This automatic prepopulation is specific to Resource Manager. When using Terraform CLI, the OCI provider can read authentication, tenancy, and region from an OCI configuration profile, but Terraform has no general concept of a "current compartment." Continue to provide the `region` and `compartment_ocid` root-module inputs explicitly for local runs.

1. From the configuration root, create a fresh upload archive outside the project directory. Include the root-level `schema.yaml`: Resource Manager uses it to present grouped inputs, dynamic region/compartment/availability-domain/image/shape controls, and refined outputs in the Console. Include only the Terraform configuration, provider lock file, and bootstrap directories. Do not include local Terraform state (for example, `terraform.tfstate`, `terraform.tfstate.backup`, or `terraform.tfstate.*`), `.terraform/`, `terraform.tfvars`, old ZIP archives, or unrelated local artifacts. State can contain deployed resource IDs, sensitive cloud-init values, generated passwords, and private keys; OCI Resource Manager maintains its own stack state.

   ```sh
   zip -r ../ords-terraform-bootstrap.zip \
     *.tf schema.yaml .terraform.lock.hcl cloud-init sql
   ```

2. In OCI Console, open **Developer Services** → **Resource Manager** → **Stacks**. For a new stack, select **Create stack** → **My configuration** and upload `../ords-terraform-bootstrap.zip`. For an existing stack, select **Edit** and upload the revised ZIP instead; do not create a second stack or include Resource Manager state in the archive.

3. Select the compartment that owns the Resource Manager stack and choose Terraform **1.5.x** (OCI Resource Manager uses 1.5.7). Default settings can be used. Alter if needed. 

The stack automatically selects the latest Oracle Linux platform image compatible with `compute_shape`. `compute_operating_system_version` can be set to pin a major version such as `9`; `compute_image_ocid` is an optional override if you need to pin a tested image revision.

4. Create the stack without applying it. Run **Plan**, and review that it creates only the requested VCN, database/PDBs, selected number of compute instances, and load balancer.

5. Run **Apply** using the reviewed plan. Terraform creates the database before the compute instances; cloud-init then performs the ORDS and REST-schema bootstrap. When Apply succeeds, open **Application Information** and securely save all generated credentials that you need operationally.

6. When the apply job completes, save the generated SSH private key from the Resource Manager **Application Information** tab as described in **SSH keys** above. Configure Cloud Shell Private Networking for private-instance administration: in Cloud Shell, select **Network** → **Ephemeral private network** → **Set up**, select VCN `myvcn` and subnet `compute-subnet`, and activate the connection. The compute subnet security list permits this Cloud Shell VNIC to initiate SSH to the ORDS instances, and the compute NSG and host firewall permit SSH only from the VCN CIDR.

  **Example SSH commands:**

   ```sh
   ssh -i ~/.ssh/ords_stack opc@10.0.1.10 # compute01
   ssh -i ~/.ssh/ords_stack opc@10.0.1.11 # compute02
   ```

7. Wait for `mylb` to show healthy backends. Open either `ords_pdb1_landing_page` or `ords_pdb2_landing_page` from the stack outputs. The outputs use the load balancer's public IP and have the following form:

   ```text
   https://<load-balancer-public-ip>/ords/pdb1/_/landing
   ```

   The browser warning is expected because `mylb` uses a generated self-signed certificate.

   The Resource Manager **Application Information** tab provides details related to the Stack resources.

## Secret handling

The generated SYS/admin, ORDS proxy, and REST schema passwords are passed to cloud-init and retained in Terraform state. Generated passwords, the generated SSH private key, and the load-balancer private key are all sensitive state. Do not put secrets or private keys in the upload archive, source control, or job names; restrict access to the Resource Manager stack, jobs, sensitive outputs, and state. Save generated credentials immediately after deployment and store them securely. For production, prefer OCI Vault-backed secret retrieval and establish password and SSH key-rotation processes.
