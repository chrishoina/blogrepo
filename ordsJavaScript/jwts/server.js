import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// You'll need this in order to load the .env file from your project. I've optionally added in the following properties:
// - CLIENT_ID
// - CLIENT_SECRET
// - TENANT_URL

// BUT, you could take it even further, and include your JWT scope, Redirect/Callback URL, and other URLs too.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// The following are used to construct file paths reliably, especially for:
// - Sending static files 
// - Locating `.env` or other local files
// - Navigating relative directories”
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This first line ensures we’re pointing to the correct absolute file path for `index.html`, 
// no matter where or how the app is launched.”
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// These may need to be modified depending on which OAuth2.0 Code Flow you are using. In this case, it needs to be 
// Authorization Code, because I need to be able to identify the user. In this case, the user is assigned to an OCI IAM Group.
// And that Group is mapped to an ORDS Role. The ORDS Role is assigned to an ORDS Privilege. And THAT is how we map the OCI IAM 
// Group to the ORDS JWT Profile. If you are coming from my blog, this should make sense to you. 

// NOTE: The callback needs to be added to your OCI Integrated Application's OAuth2.0 Configuration. Again, these are all shown in my JWT blogs.
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantUrl = process.env.TENANT_URL;
const redirectUri = process.env.REDIRECT_URI;
const tokenEndpoint = `${tenantUrl}/oauth2/v1/token`;
const ordsEndpoint = 'http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group';

// Adding this bit so we can securely retrieve the Client Id and Tenant URL from the .env file. This saving us from having to save it in 
// the front end application code.
app.get('/config', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    tenantUrl: process.env.TENANT_URL
  });
});

// Because I wanted to keep this a simple single page app, the /callback endpoint ultimately ends up serving the index.html page.
app.get('/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// This step happens AFTER you have signed into IAM with your user credentials. You have arrived here via the handleRedirect() in the 
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

    // With the JWT "in hand," you exit the /exchange_token endpoint (and its functions), and then use that 
    const tokenData = await response.json();

// The next line converts the JSON Object to a JSON-formatted string. And assigns/sets the 
// header to "Content-Type: application/json" as well as sending to the app.js
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