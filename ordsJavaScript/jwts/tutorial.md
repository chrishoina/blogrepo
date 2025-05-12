# Tutorial

## Intro

### Prerequisites

1. An existing Identity Domain  

   - This Domain should have the **Configure client access** Domain Setting enabled.  

     You can enable this setting from within your Identity Domain's dashboard by navigating to **Settings**, locating the **Access signing certificate**, and verifying the **Configure client access** Check Box is checked.

2. Integrated Applications

   - You must configure two Integrated applications, one each for:

       1. Creating Custom Claims for your Identity Domain
       2. Your target/demo application
          - *Your target application must have at least one Group and one User*

3. An existing 25.1 or greater ORDS installation

   - You must configure the following to reproduce this demonstration:

       1. ORDS Roles and Privileges
       2. ORDS JWT Profile
       3. ORDS Resource Module, Template, and Handlers

4. An Oracle database installation; one of:

    - Oracle Autonomous Database (ADB or ATP)
    - Oracle Database 19c or later

5. An Integrated Development Environment capable of installing the required project dependencies via NPM

   - You will need to following packages to reproduce this demonstration:
     - `dotenv`
     - `express`
     - `node-fetch`

   - From within your project root folder, install these packages from the command line with the following command:

        ```sh
        npm install express dotenv node-fetch
        ```

### Configuration

Configuration will be required in three areas:

  1. Identity Domain
  2. ORDS
  3. IDE/Project Folder

#### Identity Domain

You will need to create and configure two Integrated Applications in your Identity Domain. In this example the two Integrated Applications are:

   1. `ords-jwt-demo-app`
   2. `manage-claims-app`

##### <code>ords-jwt-demo-app</code> configuration

This `ords-jwt-demo-app` is a Confidential Application type. The Resource server and Client configuration settings used for this Integrated Application are included for your reference. You may emulate these settings to better understand the demonstration.

###### Resource server configuration

- **Access token expiration:** `3600` (seconds)  
- **Primary Audience:** `audience01`  
- **Scopes:** `iam_groups`

###### Client configuration

- **Allowed grant types:** `Client credentials`, `JWT assertion`, `Authorization code`, `Implicit`
- **Allow non-HTTPS URLs:** `Enabled`
- **Redirect URL:** `http://localhost:3000/callback` `https://insomnia.rest` `https://oauth.pstmn.io/v1/callback`
- **Client type:** `Confidential`
- **Client IP address:** `Anywhere`
- **Token issuance policy: Authorized resources:** `All`

###### Groups

The `ords-jwt-demo-app` will have two Groups, an `alphagroup` and `betagroup`. For demonstration purpose, each group will have two users: `alphauser` and `betauser`. In a later section, you will see how these users are mapped to ORDS Roles. Those Roles will then be assigned to ORDS Privileges. And those together will be used when validating the OCI IAM JSON Web Token.

##### <code>manage-claims-app</code> configuration

You must update the claims in your Identity Domain to include user-created custom claims. Adding these claims will ensure they are automatically added to any JWTs from your Identity Domain.  

You must configure a separate *administative* Integrated Application (in this example the `manage-claims-app` application) to complete this task. After completing the steps in [this tutorial](https://docs.public.oneportal.content.oci.oraclecloud.com/en-us/iaas/Content/Identity/api-getstarted/OATOAuthClientWebApp.htm), you will be issued an Access Token. You will use this token to update your Identity Domain's claims to include a new Custom Claim.

###### Your Custom Claim domain

```sh
https://<domainURL>/admin/v1/CustomClaims/
```

> **NOTE:** Remove embedded comments in the above JSON object prior to using in your `POST` request.

###### Payload to include in your `POST` request

```json
{
    "schemas": [
        "urn:ietf:params:scim:schemas:oracle:idcs:CustomClaim"
    ],
    "name": "iam_groups",
    "value": "$user.groups.*.display", // A user expression which returns 
    "expression": true,                // an array (denoted by the "*") of the
    "mode": "always",                  // sub-attribute "display."
    "tokenType": "AT",
    "allScopes": false,
    "scopes": [
    "audience01iam_groups" // A concatenation of the Primary Audience and 
  ]                        // Scope of your target integrated application.
}                          
```

> Learn more: [System for Cross-domain Identity Management (SCIM) specifications](https://www.rfc-editor.org/rfc/rfc7643.html)

###### Sample `curl` command

```sh
curl --request POST \
  --url https://idcs-66de820ed85f41f0805119c5967689b2.identity.oraclecloud.com:443/admin/v1/CustomClaims/ \
  --header 'Authorization: Bearer [Your Access Token]' \
  --header 'Content-Type: application/json' \
  --data '{
    "schemas": [
        "urn:ietf:params:scim:schemas:oracle:idcs:CustomClaim"
    ],
    "name": "iam_groups",
    "value": "$user.groups.*.display",     
    "expression": true,
    "mode": "always",
    "tokenType": "AT",
    "allScopes": false,
    "scopes": [
    "audience01iam_groups"
  ]
}'
```

You will recieve an `HTTP/1.1 201 Created` response after your POST has completed. You may also issue a subsequent `GET` request to the same endpoint to review these changes.

###### Example `GET` request

```sh
curl --request GET \
  --url https://idcs-66de820ed85f41f0805119c5967689b2.identity.oraclecloud.com:443/admin/v1/CustomClaims/ \
  --header 'Authorization: Bearer [Your Access Token]' \
```

With this configuration complete, you will now configure your ORDS Resource Module, JWT Profile, Roles, and Privileges.

#### ORDS

##### Resource Module

##### Roles

##### Privileges

##### JWT Profile

