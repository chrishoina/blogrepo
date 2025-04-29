import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Purpose of `__filename` * `__filename` gives you the **absolute path to the current file**. 
// * It’s used to **construct file paths reliably**, especially for: * Sending static files (`res.sendFile(...)`)”
// “* Locating `.env` or other local files * Navigating relative directories”
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// This first line ensures we’re pointing to the correct absolute file path for `index.html`, 
// no matter where or how the app is launched.”
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth2 config
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantUrl = process.env.TENANT_URL;
const redirectUri = 'http://localhost:3000/callback';
const tokenEndpoint = `${tenantUrl}/oauth2/v1/token`;
const userInfoEndpoint = 'http://localhost:8080/ords/ordsdemo/jwtdemoalpha/alpha_group';

// Endpoint to share safe config with frontend
app.get('/config', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    tenantUrl: process.env.TENANT_URL
  });
});

// Handle Oracle redirect
app.get('/callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exchange auth code for access token
app.post('/exchange_token', async (req, res) => {
  const { code } = req.body;

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

    const tokenData = await response.json();

// The next line converts the JSON Object to a JSON-formatted string. And assigns/sets the 
// header to "Content-Type: application/json" as well as sending to the app,js
// front end. 
    res.json(tokenData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// Get user info using access token
app.get('/user_info', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    const userInfoResponse = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userInfo = await userInfoResponse.json();

    res.json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching user info failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
