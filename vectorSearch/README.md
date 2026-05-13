# ORDS Park Search Flow

This sample Node.js app searches ORDS-backed National Parks data using OAuth 2.0 client credentials only. ORDS is the authorization server for this app.

## Overview

The browser sends a plain-language search string to the local Node server. The server:

1. Exchanges `ORDS_CLIENT_ID` and `ORDS_CLIENT_SECRET` for an ORDS access token.
2. Calls the ORDS vector embedding endpoint.
3. Calls the ORDS `vectorSearch` endpoint.
4. Returns ranked park results to the browser.

## Project Structure

- `server.js`: HTTP server, ORDS token exchange, embedding call, and vector search flow
- `auth/oauth2-client.js`: ORDS OAuth 2.0 client credentials exchange
- `auth/auth-service.js`: OAuth-only auth readiness and public auth configuration
- `app.js`: browser-side search behavior
- `index.html`: search UI

## Request Flow

### What `app.js` does

In the browser, `app.js` owns user interaction and screen updates.

- On page load, it binds the search form, quick-pick buttons, navigation buttons, and the distance-info dialog.
- When a user submits a search, it prevents the default form submit, trims and validates the input, disables the search button, shows a temporary "Searching..." message, and sends a JSON request to `POST /api/search`.
- The payload sent to the backend is just `{ "text": "..." }`.
- When the backend responds successfully, `app.js` validates that the response contains an `items` array, switches from the search view to the results view, and renders the rows into the results table.
- If the backend returns an error or times out, `app.js` shows the error message in the status area instead of leaving the page in a broken state.
- Quick-pick buttons simply populate the search box with a sample phrase and return focus to the input.
- The "New Search" button clears the current results and restores the initial search form.
- The distance-info dialog is handled entirely in the browser, including focus management for keyboard users.

### What `server.js` does

`server.js` receives the browser request and performs the ORDS-backed search workflow.

- The main user request is `POST /api/search`.
- The server first checks whether the ORDS base configuration exists, then parses the JSON request body and validates that `text` is present.
- It asks the auth service for an OAuth 2.0 access token using the configured `ORDS_CLIENT_ID` and `ORDS_CLIENT_SECRET`.
- It sends the user's search text to the ORDS `vecdb/embed` endpoint to get a vector embedding.
- It sends that vector to the ORDS `vectorSearch` endpoint.
- It sorts the returned rows by similarity, normalizes the fields returned to the browser, and responds with JSON containing `items`.
- If configuration is missing, the request body is invalid, ORDS returns an error, or a timeout occurs, the server returns a structured error response that the browser can display.

### End-to-end sequence

1. The user types a phrase or clicks a quick-pick button.
2. `app.js` sends the search text to `POST /api/search`.
3. `server.js` gets an ORDS OAuth token.
4. `server.js` calls ORDS `vecdb/embed`.
5. `server.js` calls ORDS `vectorSearch`.
6. `server.js` returns normalized results.
7. `app.js` renders the results table or shows an error message.

## Required Configuration

Create a `.env` file in the project root with:

- `ORDS_BASE_ENDPOINT`
- `ORDS_CLIENT_ID`
- `ORDS_CLIENT_SECRET`
- `ORDS_MODEL_NAME`

Example:

```env
ORDS_BASE_ENDPOINT=http://localhost:8080/ords/nationalparks
ORDS_CLIENT_ID=your-client-id
ORDS_CLIENT_SECRET=your-client-secret
ORDS_MODEL_NAME=minilm_l12_v2
```

## Local Development

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Endpoints Used By The App

- `POST {ORDS_BASE_ENDPOINT}/oauth/token`
- `POST {ORDS_BASE_ENDPOINT}/_/db-api/stable/vecdb/embed`
- `POST {ORDS_BASE_ENDPOINT}/parks/vectorSearch`

## Docker

Build the app image:

```bash
docker build -t vector-search-oauth-demo .
```

Run it:

```bash
docker run --rm -p 3000:3000 \
  -e ORDS_BASE_ENDPOINT=http://host.docker.internal:8080/ords/nationalparks \
  -e ORDS_CLIENT_ID=your-client-id \
  -e ORDS_CLIENT_SECRET=your-client-secret \
  -e ORDS_MODEL_NAME=minilm_l12_v2 \
  vector-search-oauth-demo
```

## Docker Compose

Run only the app:

```bash
docker compose up --build vector-search
```

Run the app with the local Oracle Database Free and ORDS stack:

```bash
docker compose --profile oracle-stack up --build
```

Useful Compose environment variables:

- `ORDS_BASE_ENDPOINT`
- `ORDS_CLIENT_ID`
- `ORDS_CLIENT_SECRET`
- `ORDS_MODEL_NAME`
- `ORACLE_PDB`
- `ORACLE_PWD`
- `DB_PORT`
- `ORDS_PORT`

## Health And Config

- `GET /healthcheck`
- `GET /api/auth/config`

## Notes

- The app no longer exposes JWT issuance, JWKS, or OpenID discovery endpoints.
- ORDS must be configured to support OAuth 2.0 client credentials for the configured client.
- The `db26ai` and `ords` services use Oracle’s official container images:
  - `container-registry.oracle.com/database/free:latest`
  - `container-registry.oracle.com/database/ords:latest`
