# ORDS Park Search Flow

This minimal sample application deploys a Node.js server. It uses a self-managed ORDS deployment (in Standalone mode), but the examples are applicable to an ORDS-in-ADB deployment[^1] as well. 

## vectorSearch

Beginning with ORDS version 26.1.0, the ORDS DB-API includes numerous APIs for working with Vectors, models, and vectorized tables and views in your Oracle database. In addition to these endpoints, ORDS exposes a new method (HTTP Operation) for ORDS Auto-REST enabled tables and views: `vectorSearch`. 

## Demo app

The example application is purely for demonstration purposes only. We have configured an ORDS OAuth2.0 Client with Client Credentials. In total the application relies on three ORDS endpoints (which you can see in the `app.js` file), one each for: 

- obtaining an OAuth Access Token
- VECTOR-embedding a user's input (from the app's `free-text` input)
- performing a simliarity search (via the `vectorSearch` endpoint) on the `PARKS` table park descriptions. 

## Testing The App

This sample application requires minimal dependencies; Node.js. Some familiarity with Node.js is assumed. 

### Steps to deploying

1. Ensure Node.js 18 or newer is installed.
2. Update the `.env.copy` file with your endpoints and desired properties. Save it as `.env`. 
3. Optionally set:
   - `PORT` (defaults to `3000`)
   - `ORDS_BASE_ENDPOINT` (the sample app uses `http://localhost:8080/ords/nationalparks`, yours will differ depending on the ORDS deployment type)
   - `ORDS_MODEL_NAME`
   - `REQUEST_TIMEOUT_MS`
4. Start the server with `npm start`.
5. Open `http://localhost:3000`.

[^1]: In other words, the ORDS that is automatically included in the Oracle Autonomous AI Database.
