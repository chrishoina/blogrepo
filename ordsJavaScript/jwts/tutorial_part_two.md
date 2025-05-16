# Configuring Roles-Based Access Claims in OCI Identity and Access Management JSON Web Tokens for accessing OAuth2.0 protected Oracle database REST APIs Part Two

## Intro

![Roles based ORDS js app demo gif](./blogimages/9-roles-based-with-iam-groups-white-background.gif " ")

This tutorial expands on Part One of the use of Roles-Based Access Control (RBAC) claims in an Oracle Cloud Infrastructure (OCI) Identity and Access Management (IAM) JSON Web Token (JWT) to access Oracle REST Data Services (ORDS) protected resources (i.e., API endpoints).

In Part Two of this tutorial we provide steps for testing and experimenting using a sample JavaScript single-page web application (using HTML, Node.js and the Express.js framework).

Two review important configuration steps, prerequisites and an expanded overview, visit Part One of this tutorial.

### Example 2: JavaScript and <code>Node.js</code>/<code>Express.js</code>

The following depicts the structure of this sample application:

```sh
jwts/
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── app.js
│   └── index.html
├── server.js
└── ordsdemo.sql
```

**Note:** Part Two relies on the same configuration as Part Two of this series. Review the configuration settings prior to attempting this example.

#### Project folder

All sample code can be found at the following [GitHub repository](https://github.com/chrishoina/blogrepo/tree/4e48076cbf0f8170f4f7620f73be3b18ad9491f7/ordsJavaScript/jwts).

You may optionally create your own project folder with the sample application code found on this page. The project consists of four main files:

##### App.js

```js
const loginButton = document.getElementById('login');

// There are several ways this can be accomplished. The focus shouldn't be on performance, or
// whether this conforms purely to ESM. 
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

    // With the response in hand, we display it on the screen
    // the results of the GET request.

    const dbActual = document.createElement('p');
    const crtUsr = document.createElement('p');

    // dbActual and crtUser refer to the output bind parameters found in the individual ORDS Resource Handlers. Refer to the ORDS > Resource Module section of part one of the blog series to review the ORDS Resource Module/Template/Handler definitons.
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

// Note: The callback needs to be added to your OCI Integrated Application's OAuth2.0 Configuration.

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantUrl = process.env.TENANT_URL;
const redirectUri = process.env.REDIRECT_URI;
const tokenEndpoint = `${tenantUrl}/oauth2/v1/token`;
const ordsEndpoint = process.env.ORDS_ENDPOINT;

// Adding this so we can securely retrieve the Client ID and Tenant URL from the .env file.

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

  // These parameters are ALL sent to the /oauth2/v1/token endpoint, so that the client/user can retrieve a valid JWT.
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
// header to "Content-Type: application/json". We also well as sending to the app.js
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

##### .ENV

```bash
CLIENT_ID=
CLIENT_SECRET=
TENANT_URL=
REDIRECT_URI=http://localhost:3000/callback
AUTH_ENDPOINT=
TOKEN_ENDPOINT=
ORDS_ENDPOINT=http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group
```

#### Application dependencies

##### NPM

The required dependencies for the application can be added with the following command:

```sh
npm install express dotenv node-fetch
```

##### .ENV file

If you choose to use a `.ENV` file, you must configure yours to match your development and OCI IAM settings. You should replace the following:

```bash
CLIENT_ID=[Your Integrated Application Client ID]
CLIENT_SECRET=[Your Integrated Application Client Secret]
TENANT_URL=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443
REDIRECT_URI=http://localhost:3000/callback
AUTH_ENDPOINT=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443/oauth2/v1/authorize
TOKEN_ENDPOINT=https://idcs-[Your unique Tenant Identifier].identity.oraclecloud.com:443/oauth2/v1/token
ORDS_ENDPOINT=http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group
```

> **Note:** Your ORDS endpoint may differ depending on your installation and deployment. The use of a `.ENV` file is optional; although, code changes will be required if you decide to omit it.

##### OCI IAM configuration

This demo application will rely on the settings configured in your OCI IAM `ords-jwt-demo-app` Integrated Application. Refer to part one of this tutorial for configuration settings. Verify that you have also included the following **Client configuration** settings:

- **Allowed grant types:** `Authorization code`
- **Redirect URL:** `http://localhost:3000/callback`

> **Note:** Additional grant types and redirect URLs may be included. However, the above values must be included to reproduce this demo as-is.

##### ORDS installation and configuration

In this demonstration, ORDS has been installed locally, with an Oracle 23ai database running in a Podman container. ORDS has been deployed in Standalone mode (embedded Jetty server) on `localhost` on port `8080`. The schema used is named `ORDSDEMO`. The ORDS Resource Modules, Templates, Handlers, Roles, and Privileges remain unchanged from the previous example.

> **Note:** ORDS and Oracle Database 23ai Docker/Podman containers are both available in the Oracle Container Registry.
>
> - [ORDS](https://container-registry.oracle.com/ords/ocr/ba/database/ords)
> - [23ai](https://container-registry.oracle.com/ords/ocr/ba/database/free)

#### Launching the demo app

With the configuration complete, you can launch the application using a Node.js server from your IDE's console. Use the following command:

```sh
node server.js
```

You will see the following output in your IDE's console:

```sh
Server running at http://localhost:3000
```

Click the link to open the app's `Index.html` page. Then click the <button>Login as IAM User</button> button. You will be temporarily redirected to the OCI IAM Sign In page. Sign in with the following credentials:

- **User Name:** `alphauser`
- **Password:** `[Password selected upon creating the alphauser]`

Once you have signed in, you will be redirected to the sample application. The results of the ORDS `GET` request will be displayed on screen:

```bash
The current SYSTIMESTAMP for your database server is: 13-MAY-25 06.55.23.452414 PM +00:00

You are currently logged in as the following user: alphauser
```

##### Video demonstration

<video src="./blogimages/11-roles-based-with-iam-groups1080.m4v" controls ></video>

<video src="./blogimages/12-roles-based-with-iam-groups720.m4v" controls ></video>

If you clear your browser's cache and press the <button>Login as IAM User</button> again, you'll be redirected to the OCI IAM Sign In page. Sign in as the Beta User, and you will be redirected back to the sample application. Both fields will return the following message:

```bash
The current SYSTIMESTAMP for your database server is: undefined

You are currently logged in as the following user: undefined
```

##### Invalid JWT/Unauthorized

The application will have received a valid JWT. But decoding it would reveal the following Custom Claim:

```json
{...
"iam_groups": [ "betagroup" ]
...}
```

Since the `/ordsdemo/alpha_v1/alpha_group` endpoint is protected by the `alphagroup` role and since the `alphagroup` privilege does not include the `betagroup` role, this Beta User cannot access this endpoint.

## Wrap-up

By now, you should have a better understanding of how to:

1. Create a custom claim from a Group in your Identity Domain's Integrated Application
2. Protect ORDS with a role that matches the custom claim and create the requisite JWT Profile
3. Navigate an OAuth2.0 Authorization Code grant type (for acquiring an OCI IAM JWT) two ways:
   - `cURL`
   - Single-page JavaScript web application using `Node.js` and `Express.js`

## Resources

The following are helpful resources when working with ORDS and JWTs

- [ORDS and JWT docs](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/25.1/orddg/developing-REST-applications.html#GUID-B1ED4DFD-9DD4-4FBF-B91D-35373D756538) (ORDS Developer's Guide)
- [Configuring OCI IAM JWTs and ORDS for Scope Based Access Control (SBAC) claims](https://followthecoffee.com/configuring-oci-iam-domain-jwts-to-use-with-ords/) (Blog)
- [Microsoft Entra JWTS with ORDS SBAC claims](https://followthecoffee.com/ords-apis-and-microsoft-entra-jwts-tutorial/) (Blog)
- [ORDS Troubleshooting a 401 invalid_token response](https://followthecoffee.com/401-unauthorized-invalid_token-troubleshooting-oracle-cloud-iam-jwts-with-ords/) (Blog)
- [About ORDS Implicit Parameters](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/25.1/orddg/implicit-parameters.html)
