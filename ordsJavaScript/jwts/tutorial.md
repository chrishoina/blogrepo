# Tutorial

## Intro

This tutorial will demonstrate using Roles Based Access Control Claims of a JSON Web Token (JWT) to access Oracle REST Data Services (ORDS) protected resources (i.e. API endpoints).

We rely on Oracle Identity and Access Management (OCI IAM) JSON Web Tokens (JWTs) in his tutorial. Other third party Identity Providers may differ in their workflows, but there is likely to be overlap and valuable information contained here.  

This tutorial provides steps for testing and experimenting with two different use cases:

- an API testing tool example (in this example we use Insomnia; an alternative to Postman)
- a sample JavaScript single page web application (using Node.js and Express.js)

ORDS JWT Profiles can be Scope Based, or Role Based. This tutorial demonstrates using an Integrated Application's Groups, and users therein, as the basis for Roles-Based Access. You may optionally use custom User Attributes as the basis for your custom claims; but this is outside the scope of this tutorial.

Helpful resources are provided at the end of this tutorial.

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

   - You must configure the following to reproduce this demonstration (scripts are provided within this tutorial):

       1. ORDS Roles and Privileges
       2. ORDS JWT Profile
       3. ORDS Resource Module, Template, and Handlers

4. An Oracle database installation; one of:

    - Oracle Autonomous Database (ADB or ATP)
    - Oracle Database 19c or later

5. An Integrated Development Environment capable of installing the required project dependencies via NPM

   - You will need the following packages to follow along:
     - `dotenv`
     - `express`
     - `node-fetch`

   - From within your project root folder, install these packages with the following command:

        ```sh
        npm install express dotenv node-fetch
        ```

### Configuration

Additional configuration will be required in three areas:

  1. Identity Domain
  2. ORDS
  3. IDE/Project Folder

#### Identity Domain

You will need to create and configure two Integrated Applications in your Identity Domain. In this example we use:

   1. `ords-jwt-demo-app`
   2. `manage-claims-app`

##### <code>ords-jwt-demo-app</code> configuration

This `ords-jwt-demo-app` is a Confidential Application type. The Resource server and Client configuration settings used for this Integrated Application are included for your reference. You may copy these settings to better follow along.

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

> **NOTE:** We use the Authorization code grant type, others are included for convenience.

###### Groups

The `ords-jwt-demo-app` has two Groups:

- `alphagroup`
- `betagroup`

For demonstration purpose, each group will have two users:

- `alphauser`
- `betauser`

In a later section, you will see how these users are mapped to ORDS Roles. Those Roles will then be assigned to ORDS Privileges. And those together will be used when validating the OCI IAM JSON Web Token.

You may map your Identity Domain Groups to an ORDS Privilege *or* and ORDS Role. For finer grain control, mapping to an ORDS Role is recommended. This method allows to you add many roles to a single ORDS Privilege. Thus making it much easier to revoke a user's access by removing a Role, rather than a Privilege.

##### <code>manage-claims-app</code> configuration

You must update the claims in your Identity Domain to include user-created custom claims. Adding these claims will ensure they are included in the JWTs from your Identity Domain.  

You must configure a separate *administative* Integrated Application (in this example the `manage-claims-app` application) to complete this task. After completing the steps in [this tutorial](https://docs.public.oneportal.content.oci.oraclecloud.com/en-us/iaas/Content/Identity/api-getstarted/OATOAuthClientWebApp.htm), you will be issued an Access Token. You will then use this token to update your Identity Domain's claims to include a new Custom Claim.

Using the Access Token acquired from the tutorial, subimt a `POST` request to the `/admin/v1/CustomClaims/` endpoint.

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

An example cURL command to your `/admin/v1/CustomClaims/` endpoint (in our demo we perform this in the Insomnia API testing application).

```sh
curl --request POST \
  --url https://idcs-[Your Identity Doimain Unique Identifier].identity.oraclecloud.com:443/admin/v1/CustomClaims/ \
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

You will recieve an `HTTP/1.1 201 Created` response after your `POST` request is complete. You may also issue a subsequent `GET` request to the same endpoint to review these changes.

###### Example `GET` request

```sh
curl --request GET \
  --url https://idcs-[Your Identity Domain Unique Identifier].identity.oraclecloud.com:443/admin/v1/CustomClaims/ \
  --header 'Authorization: Bearer [Your Access Token]' \
```

With this configuration complete, we can now configure the ORDS Resource Modules, JWT Profile, Roles, and Privileges.

#### ORDS

You can use the following definitions to simulate this demonstration.

> **NOTE:** It is assumed you have an existing REST-enabled schema.

##### Resource Module

As the user, execute the following PL/SQL Schema import.

```sql
DECLARE
  l_roles     OWA.VC_ARR;
  l_modules   OWA.VC_ARR;
  l_patterns  OWA.VC_ARR;

BEGIN
  ORDS.DEFINE_MODULE(
      p_module_name    => 'alpha.group.module.v1',
      p_base_path      => '/alpha_v1/',
      p_items_per_page => 25,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);

  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'alpha.group.module.v1',
      p_pattern        => 'alpha_group',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);

  ORDS.DEFINE_HANDLER(
      p_module_name    => 'alpha.group.module.v1',
      p_pattern        => 'alpha_group',
      p_method         => 'GET',
      p_source_type    => 'plsql/block',
      p_mimes_allowed  => NULL,
      p_comments       => NULL,
      p_source         => 
'DECLARE
    l_date VARCHAR2(100);
    l_user varchar2(100);
    l_status varchar2(100);
BEGIN
    l_user := :current_user;
    SELECT
        SYSTIMESTAMP, :current_user
    INTO l_date, l_user
    FROM
        DUAL;

    :dbActual := l_date;
    :crtUser := l_user;
END;');

  ORDS.DEFINE_PARAMETER(
      p_module_name        => 'alpha.group.module.v1',
      p_pattern            => 'alpha_group',
      p_method             => 'GET',
      p_name               => 'dbActual',
      p_bind_variable_name => 'dbActual',
      p_source_type        => 'RESPONSE',
      p_param_type         => 'STRING',
      p_access_method      => 'OUT',
      p_comments           => NULL);

  ORDS.DEFINE_PARAMETER(
      p_module_name        => 'alpha.group.module.v1',
      p_pattern            => 'alpha_group',
      p_method             => 'GET',
      p_name               => 'crtUser',
      p_bind_variable_name => 'crtUser',
      p_source_type        => 'RESPONSE',
      p_param_type         => 'STRING',
      p_access_method      => 'OUT',
      p_comments           => NULL);

  ORDS.DEFINE_MODULE(
      p_module_name    => 'beta.group.module.v1',
      p_base_path      => '/beta_v1/',
      p_items_per_page => 25,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);

  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'beta.group.module.v1',
      p_pattern        => 'beta_group',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);

  ORDS.DEFINE_HANDLER(
      p_module_name    => 'beta.group.module.v1',
      p_pattern        => 'beta_group',
      p_method         => 'GET',
      p_source_type    => 'plsql/block',
      p_items_per_page => 25,
      p_mimes_allowed  => NULL,
      p_comments       => NULL,
      p_source         => 
'DECLARE
    l_date VARCHAR2(100);
    l_user varchar2(100);
    l_status varchar2(100);
BEGIN
    l_user := :current_user;
    SELECT
        SYSTIMESTAMP, :current_user
    INTO l_date, l_user
    FROM
        DUAL;

    :dbActual := l_date;
    :crtUser := l_user;
END;');

  ORDS.DEFINE_PARAMETER(
      p_module_name        => 'beta.group.module.v1',
      p_pattern            => 'beta_group',
      p_method             => 'GET',
      p_name               => 'crtUser',
      p_bind_variable_name => 'crtUser',
      p_source_type        => 'RESPONSE',
      p_param_type         => 'STRING',
      p_access_method      => 'OUT',
      p_comments           => NULL);

  ORDS.DEFINE_PARAMETER(
      p_module_name        => 'beta.group.module.v1',
      p_pattern            => 'beta_group',
      p_method             => 'GET',
      p_name               => 'dbActual',
      p_bind_variable_name => 'dbActual',
      p_source_type        => 'RESPONSE',
      p_param_type         => 'STRING',
      p_access_method      => 'OUT',
      p_comments           => NULL);

    
  ORDS.CREATE_ROLE(p_role_name => 'alphagroup');
  ORDS.CREATE_ROLE(p_role_name => 'betagroup');
    
  l_roles(1) := 'alphagroup';
  l_modules(1) := 'alpha.group.module.v1';

  ORDS.DEFINE_PRIVILEGE(
      p_privilege_name => 'alphagroup',
      p_roles          => l_roles,
      p_patterns       => l_patterns,
      p_modules        => l_modules,
      p_label          => 'alphagroup',
      p_description    => 'alphagroup',
      p_comments       => 'alphagroup'); 

  l_roles.DELETE;
  l_modules.DELETE;
  l_patterns.DELETE;
    
  l_roles(1) := 'betagroup';
  l_modules(1) := 'beta.group.module.v1';

  ORDS.DEFINE_PRIVILEGE(
      p_privilege_name => 'betagroup',
      p_roles          => l_roles,
      p_patterns       => l_patterns,
      p_modules        => l_modules,
      p_label          => 'betagroup',
      p_description    => 'betagroup',
      p_comments       => 'betagroup'); 

  l_roles.DELETE;
  l_modules.DELETE;
  l_patterns.DELETE;
    
          
COMMIT;

END;
```

You will now have two Resource Modules:

- `/ords/[Your schema]/alpha_v1/alpha_group`
- `/ords/[Your schema]/beta_v1/beta_group`

##### Roles

You will also notice two Roles:

- `alphagroup`
- `betagroup`

##### Privileges

Each role is then assigned to an ORDS Privilege. You will now have the following privileges:

- `alphagroup`
- `betagroup`

##### JWT Profile

You must create an ORDS JWT Profile. As of ORDS 25.1 each schema may have only one valid JWT Profile at a time. The JWT can be one of:

- Scope Based Sccess Claim (SBAC)
- Roles Based Access Claim (RBAC)

When configuring custom claims in OCI IAM you may do so with one of two options, an:

- Identity Domain's User Attributes (additional attribues that you may have created)
- Integrated Application's Groups (and users therein)

This tutorial demonstrates RBAC JWT Profiles. Execute the following PL/SQL procedure:

```sql
DECLARE
    L_P_ISSUER          VARCHAR2(200) := 'https://identity.oraclecloud.com/'; -- You must include a trailing backslash.
    L_P_AUDIENCE        VARCHAR2(200) := 'audience01';
    L_P_JWK_URL         VARCHAR2(200) := 'https://idcs-[Your Identity Doimain Unique Identifier].identity.oraclecloud.com:443/admin/v1/SigningCert/jwk'
    ;
    L_P_DESCRIPTION     VARCHAR2(200) := 'ORDS RBAC JWTs demonstration';
    L_P_ROLE_CLAIM_NAME VARCHAR2(200) := '/iam_groups'; -- You must include a leading backslash. ORDS will interpret this as a JSON Pointer.
BEGIN
    ORDS_METADATA.ORDS_SECURITY.DELETE_JWT_PROFILE(); -- This is a common best practice to delete an existing JWT Profile, and overwrite.
    ORDS_METADATA.ORDS_SECURITY.CREATE_JWT_PROFILE(
        P_ISSUER          => L_P_ISSUER,
        P_AUDIENCE        => L_P_AUDIENCE,
        P_JWK_URL         => L_P_JWK_URL,
        P_DESCRIPTION     => L_P_DESCRIPTION,
        P_ROLE_CLAIM_NAME => L_P_ROLE_CLAIM_NAME
    ); -- Not included here: P_ALLOWED_SKEW and P_ALLOWED_AGE. These are optional parameters; when omitted their values are set to NULL (i.e. infinity).
END;
```

ORDS will now expect a `stringArray[]` (which was set in the previous OCI IAM custom claims configuration steps) `iam_groups` since the `P_ROLE_CLAIM_NAME` parameter was used.

### Accessing protected ORDS resources

This section provides two examples for demonstrating the OAuth2.0 Authorization Code Flow method for obtaining a valid JWT (Access Token).

In the first example, we use Insomnia as well as `cURL` for this demonstration. These steps will be similar for Postman and other testing tools.

The second example will demonstrate using a simple JavaScript and `Node.js`/`Express.js` single-page web application.

#### Example 1: Insomnia and <code>cURL</code>

##### Requesting an Authorization Code and acquiring a JWT

We have configured our Insomnia client with the following values:

- **Grant Type:** `Authorization Code`
- **Authorization URL:** `https://idcs-[Your Identity Doimain Unique Identifier].identity.oraclecloud.com:443/oauth2/v1/authorize`
- **Access Token URL:** `https://idcs-[Your Identity Doimain Unique Identifier].identity.oraclecloud.com:443/oauth2/v1/token`
- **Client ID:**
- **Client Secret:**
- **Redirect URL:** `https://insomnia.rest`
- **Scope:** `audience01iam_groups`
- **Credentials:** `As Basic Auth Header (default)`

With these values, a request (i.e. clicking the `Fetch Tokens` button) for a valid JWT is sent. A new browser window or tab will open, enter in the credentials for the Alpha User with:

- **User Name:** `alphauser`
- **Password:** `[Password selected upon creating the alphauser]`

After submitting the user credentials, you will be redirected to Insomnia (or other tool used). You may inspect the JWT to review the properties of the JSON payload

###### Inspecting the JWT

You may use your tool of choice for decoding or inspecting a JWT. Notice how `iam_groups` `stringArray[]` has included in the JWT. ORDS will expect this since it was included as a JSON Pointer in the `CREATE_JWT_PROFILE` PL/SQL procedure.

```json
{
  "client_ocid": "ocid1.domainapp.oc1.eu-frankfurt-1.123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz",
  "user_tz": "America/Chicago",
  "sub": "alphauser",
  "user_locale": "en",
  "sidle": 480,
  "idp_name": "UserNamePassword",
  "user.tenant.name": "idcs-[Your unique Tenant Identifier]",
  "idp_guid": "UserNamePassword",
  "amr": [
    "USERNAME_PASSWORD"
  ],
  "iss": "https://identity.oraclecloud.com/",
  "domain_home": "eu-frankfurt-1",
  "ca_ocid": "ocid1.tenancy.oc1..abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
  "user_tenantname": "idcs-[Your unique Tenant Identifier]",
  "client_id": "ttylsmhrofl123456",
  "sid": "q1w2e3r4t5y6:411abc",
  "domain_id": "ocid1.domain.oc1..abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
  "sub_type": "user",
  "scope": "iam_groups",
  "user_ocid": "ocid1.user.oc1..aaaaaaaane7pcss3u6urqagkcnkyzp5gdwaehiwilkzsgykhnxagnsiewnuq",
  "client_tenantname": "idcs-[Your unique Tenant Identifier]",
  "region_name": "eu-frankfurt-idcs-1",
  "user_lang": "en",
  "exp": 1747065294,
  "iat": 1747061694,
  "client_guid": "abcdefghijk0123456789",
  "client_name": "ords-jwt-demo-app",
  "idp_type": "LOCAL",
  "tenant": "idcs-[Your unique Tenant Identifier]",
  "jti": "1ab2cd3ef4gh5ij6kl7mn8op9qr",
  "gtp": "azc",
  "user_displayname": "alpha user",
  "opc": false,
  "iam_groups": [
    "alphagroup"
  ],
  "sub_mappingattr": "userName",
  "primTenant": false,
  "tok_type": "AT",
  "aud": "audience01",
  "ca_name": "abcdef1",
  "user_id": "a1b2c3d4e5f6g7h8i9j01k2l3m4n5o6p",
  "domain": "ordsdomain",
  "tenant_iss": "https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443",
  "resource_app_id": "abcdefghijk0123456789"
}
```

> **OPTIONAL:** Two freely available options for decoding JWTs are [jwt.io](https://jwt.io) and [jwt.ms](https://jwt.ms).

We can now test two endpoints to review the expected behavior.

##### Issuing a GET request SUCCESS

We first issue a `GET` request to the `/alpha_v1/alpha_group` endpoint:

###### Success example curl command

```sh
curl --request GET \
  --url http://localhost:8080/ords/ordsdemo/alpha_v1/alpha_group \
  --header 'Authorization: Bearer [Replace with your JWT' \
```

###### Successful response

You should observe the following response:

```sh
HTTP/1.1 200 OK
< Content-Type: text/html;charset=utf-8
< X-ORDS_DEBUG: true
< ETag: " "
< Transfer-Encoding: chunked

{
   "data": "You are authorized to view this ALPHA group resource."
}
```

##### Issuing a GET request FAILURE

###### Failure example curl command

```sh
curl --request GET \
  --url http://localhost:8080/ords/ordsdemo/beta_v1/beta_group \
  --header 'Authorization: Bearer [Replace with your JWT' \
```

###### Failed response

```sh
< HTTP/1.1 401 Unauthorized
< Content-Type: text/html
< WWW-Authenticate: Bearer realm="Oracle REST Data Services", error="invalid_token"
< Content-Length: 467009
```

#### Example 2: JavaScript and <code>Node.js</code>/<code>Express.js</code>

##### Project folder

The sample code can be found at the following [GitHub repository](https://github.com/chrishoina/blogrepo/tree/4e48076cbf0f8170f4f7620f73be3b18ad9491f7/ordsJavaScript/jwts).

You may optionally create your own project folder with the sample application code found on this page:

###### App.js

```js
const loginButton = document.getElementById('login');

// There are several ways this can be acomplished. The focus shouldn't be on performance, or
// whether this is conformes purely to ESM. 
const { clientId, tenantUrl } = await fetch('/config').then(r => r.json());
const authorizationEndpoint = `${tenantUrl}/oauth2/v1/authorize`;
const redirectUri = window.location.origin + '/callback';
const scope = 'audience01iam_groups';

loginButton.addEventListener('click', () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope
  });

  // The "params" are sent to the IAM /oauth2/v1/authorize endpoint.
  window.location = `${authorizationEndpoint}?${params.toString()}`;
});

// Handling the redirect from Oracle IAM. RECALL, you'll need to set this redirect up in 
// the OAuth Configuration section for your Integrated Application (in IAM).
(async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) return;

  // Using this Authorization code, to retrieve a JWT from the IAM /oauth2/v1/token endpoint.
  const response = await fetch('/exchange_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const tokenData = await response.json();

  if (tokenData.error) {
    console.log("Token exchange error:\n" + tokenData);
  } else {

    // A GET request is issued to the ORDS endpoint via the Server.js backend.
    const accessToken = tokenData.access_token;

    const ordsInfo = await fetch('/to_ords', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(r => r.json());

    // With the response in hand, we display on the screen
    // the results of the GET request.

    const dbActual = document.createElement('p');
    const crtUsr = document.createElement('p');
    dbActual.innerHTML = `The current <code>SYSTIMESTAMP</code> for your database server is: <code>${ordsInfo.dbActual}</code>`;
    crtUsr.innerHTML = `You are currently logged in as the following user: <code>${ordsInfo.crtUser}</code>`
    document.body.appendChild(dbActual);
    document.body.appendChild(crtUsr);

      
      if (loginButton) {
        loginButton.classList.add('fade-out');
        setTimeout(() => loginButton.remove(), 500);
      };
    
    const backButton = document.createElement('button');
    backButton.textContent = 'Home';
    backButton.style.color = 'blue'
    backButton.style.marginTop = '1rem';
    backButton.addEventListener('click', () => {
      window.location.href = '/';
    });
    document.body.appendChild(backButton);
    
  };
})();
```

###### Server.js

```js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to load the .env file from your project. 
dotenv.config();

// We've "abstracted" the following properties:
// - CLIENT_ID
// - CLIENT_SECRET
// - TENANT_URL
// - REDIRECT_URI
// - AUTH_ENDPOINT
// - TOKEN_ENDPOINT
// - ORDS_ENDPOINT

const app = express();
const PORT = process.env.PORT || 3000;

// The following are used to construct file paths reliably, especially for:
// - Sending static files 
// - Locating `.env` or other local files
// - Navigating relative directories

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This first line ensures we’re pointing to the correct absolute file path for `index.html`, 
// no matter where or how the app is launched.

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// These may need to be modified depending on which OAuth2.0 Code Flow you are using. In this case, we use
// Authorization Code, since we need to identify the user. In this case, the user is assigned to an OCI IAM Group.
// And that Group is mapped to an ORDS Role. The ORDS Role is assigned to an ORDS Privilege. That is how we map the OCI IAM 
// Group to the ORDS JWT Profile. 

// NOTE: The callback needs to be added to your OCI Integrated Application's OAuth2.0 Configuration.

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantUrl = process.env.TENANT_URL;
const redirectUri = process.env.REDIRECT_URI;
const tokenEndpoint = `${tenantUrl}/oauth2/v1/token`;
const ordsEndpoint = process.env.ORDS_ENDPOINT;

// Adding this so we can securely retrieve the Client Id and Tenant URL from the .env file.

app.get('/config', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    tenantUrl: process.env.TENANT_URL
  });
});

// To keep this application simple, the /callback endpoint ultimately ends up serving the index.html page.
app.get('/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// This step happens AFTER you have signed into IAM with your user credentials. You have arrived here via the handleRedirect() function in the 
// app.js file.
app.post('/exchange_token', async (req, res) => {
  const { code } = req.body;

  // These paramaters are ALL sent to the /oauth2/v1/token endpoint, so that the client/user can retrieve a valid JWT.
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    // With the JWT "in hand," the application "exits" the /exchange_token endpoint (and its functions).

    const tokenData = await response.json();

// We convert the JSON Object to a JSON-formatted string. And assign/set the 
// header to "Content-Type: application/json". We als well as sending to the app.js
// front end. 
    res.json(tokenData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// "Splitting" on the whitespace between Bearer ' ' and the token, and using that to issue a GET
// request to the ORDS endpoint. 
app.get('/to_ords', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    const ordsInfoResponse = await fetch(ordsEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    // The response from the GET request to the ORDS endpoint.
    const ordsInfo = await ordsInfoResponse.json();

    // The "res" will be passed back to the app.js front end for display. Which will then in turn
    // pass to the index.html page.

    res.json(ordsInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching ORDS data failed, review console details for clues.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

###### Index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ORDS and RBAC JWTs</title>
  <style>
    #login.fade-out {
      transition: opacity 0.5s ease;
      opacity: 0;
    }
  </style>
</head>
<body>
  <h3 style="color: darkslategray">Demo: ORDS Roles-Based Access Claims (RBAC) and OCI Identity and Access Management JSON Web Tokens (JWTs)</h3>
  <button style="color: blue" id="login">Login as IAM user</button>
  <script type="module" src="app.js"></script>
</body>
</html>
```

###### .ENV

```bash
CLIENT_ID=
CLIENT_SECRET=
TENANT_URL=
REDIRECT_URI=http://localhost:3000/callback
AUTH_ENDPOINT=
TOKEN_ENDPOINT=
ORDS_ENDPOINT=http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group
```

The following depicts the structure of this sample application:

```sh
/jwts
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── app.js
│   └── index.html
├── server.js
├── ordsdemo.sql
└── tutorial.md
```

##### Application dependencies

###### NPM

The required dependencies for the application can be added with the following command:

```sh
npm install express dotenv node-fetch
```

###### .ENV file

You must configure your `.env` file to match your development and OCI IAM settings. You should replace the following:

```bash
CLIENT_ID=[Your Integrated Application Client ID]
CLIENT_SECRET=[Your Integrated Application Client Secret]
TENANT_URL=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443
REDIRECT_URI=http://localhost:3000/callback
AUTH_ENDPOINT=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443/oauth2/v1/authorize
TOKEN_ENDPOINT=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443/oauth2/v1/token
ORDS_ENDPOINT=http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group
```

> **NOTE:** Your ORDS endpoint may differ depending on your installation and deployment.

###### OCI IAM configuration

This demo application will rely on the settings configured in your OCI IAM `ords-jwt-demo-app` Integrated Application. Verify that you have also included the following **Client configuration** settings:

- **Allowed grant types:** `Authorization code`
- **Redirect URL:** `http://localhost:3000/callback`

> **NOTE:** Additional grant types and Redirect URLs may be included. But to reproduce this demo as-is, these values must be included.

###### ORDS installation and configuration

In this demonstration ORDS has been installed locally, with an Oracle 23ai database running in a Podman container. ORDS has been deployed in Standalone mode (embedded Jetty server) on `localhost` on port `8080`. The schema used is named `ORDSDEMO`. The ORDS Resource Modules, Templates, Handlers, Roles and Privileges remain unchanged from the previous example.

##### Launching the demo app

With the configuration complete, you can launch the application using a Node.js server with the following command:

```sh
node server.js
```

You will see the following output:

```sh
Server running at http://localhost:3000
```

Click the link in your terminal to open the app's `Index.html` page. Click the <button>Login as IAM User</button> button. You will be temporary redirected to the OCI IAM Sign In page. Sign in with the following credentials:

- **User Name:** `alphauser`
- **Password:** `[Password selected upon creating the alphauser]`

Once you have signed in, you will be redirected to the sample application. The results of the ORDS `GET` request will be displayed on screen:

```bash
The current SYSTIMESTAMP for your database server is: 13-MAY-25 06.55.23.452414 PM +00:00

You are currently logged in as the following user: alphauser
```

If you clear your browser's cache and press the <button>Login as IAM User</button> again, you'll be redirected to the OCI IAM Sign In page. Sign in as the `betauser` and you will be redirected back to the sample application. Both fields will return the following message:

```bash
The current SYSTIMESTAMP for your database server is: undefined

You are currently logged in as the following user: undefined
```

The application will have recieved a valid JWT. But decoding it would reveal the following Custom Claim:

```json
{...
"iam_groups": [ "betagroup" ]
...}
```

Since the `/ordsdemo/alpha_v1/alpha_group` endpoint is protected by the `alphagroup` role. Since the `alphagroup` privilege does not include the `betagroup` role, this `betauser` cannot access this end point.

### Wrap-up

By now, you should have a better understanding of how to:

1. Create a custom claim from a Group in your Identity Domain's Integrated Application
2. Protect ORDS with a role that matches the custom claim and create the requisite JWT Profile
3. Navigate an OAuth2.0 Authorization Code grant type (for acquiring an OCI IAM JWT) two ways:
   - `cURL`
   - Single-page JavaScript web application using `Node.js` and `Express.js`

### Resources

The following are helpful resources when working with ORDS and JWTs

- [ORDS and JWT docs](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/25.1/orddg/developing-REST-applications.html#GUID-B1ED4DFD-9DD4-4FBF-B91D-35373D756538) (ORDS Developer's Guide)
- [Configuring OCI IAM JWTs and ORDS for Scope Based Access Control (SBAC) claims](https://followthecoffee.com/configuring-oci-iam-domain-jwts-to-use-with-ords/) (Blog)
- [MicroSoft Entra JWTS with ORDS SBAC claims](https://followthecoffee.com/ords-apis-and-microsoft-entra-jwts-tutorial/) (Blog)
- [ORDS Troubleshooting a 401 invalid_token response](https://followthecoffee.com/401-unauthorized-invalid_token-troubleshooting-oracle-cloud-iam-jwts-with-ords/) (Blog)
