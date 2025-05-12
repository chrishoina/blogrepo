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