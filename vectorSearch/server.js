// Built-in Node modules used for the HTTP server and static file handling.
const http = require("http");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// Loads the `.env` values before reading configuration from `process.env`.
loadDotEnv();

// Reads configuration once at startup.
// Converts numeric settings once, avoiding the use of Number(...) throughout.
const PORT = Number(process.env.PORT);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS);
const ORDS_BASE_ENDPOINT = process.env.ORDS_BASE_ENDPOINT;
const ORDS_CLIENT_ID = process.env.ORDS_CLIENT_ID;
const ORDS_CLIENT_SECRET = process.env.ORDS_CLIENT_SECRET;
const ORDS_MODEL_NAME = process.env.ORDS_MODEL_NAME;

// Builds off the ORDS_BASE_ENDPOINT of your .env file.
const TOKEN_ENDPOINT = ORDS_BASE_ENDPOINT + "/oauth/token";
const EMBED_ENDPOINT = ORDS_BASE_ENDPOINT + "/_/db-api/stable/vecdb/embed";
const SEARCH_ENDPOINT = ORDS_BASE_ENDPOINT + "/parks/vectorSearch";

// These are purely for your convenience. Your own ORDS install (in ADB, or self-managed) already includes this endpoint and others in the ORDS DB-API.
const WEB_ROOT = __dirname;
const DOCS_DIST_ROOT = path.join(WEB_ROOT, "dist");
const DOCS_ROUTE_PREFIX = "/api-docs";
const STATIC_ASSET_DIRECTORIES = [
  path.join(WEB_ROOT, "fonts"),
  path.join(WEB_ROOT, "icon")
];

// A routing table for the frontend files, served by Node.js.
const STATIC_FILES = {
  "/": { filePath: "index.html", contentType: "text/html; charset=utf-8" },
  "/app.js": { filePath: "app.js", contentType: "application/javascript; charset=utf-8" },
  "/style.css": { filePath: "style.css", contentType: "text/css; charset=utf-8" },
  "/docs.css": { filePath: "docs.css", contentType: "text/css; charset=utf-8" },
  "/db-api.json": { filePath: "db-api.json", contentType: "application/yaml; charset=utf-8" }
};
const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

// A function to load the .env; avoids having to import an additional dotenv dependency.
// NOTE: Variables included in the .env will override any existing environment variables.
function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envText = fs.readFileSync(envPath, "utf8");
  const lines = envText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Exception handling for missing secrets. Checks prior-to Node.js server start-up.
function readRequiredConfig() {
  if (!ORDS_CLIENT_ID || !ORDS_CLIENT_SECRET) {
    throw new Error(
      "Set ORDS_CLIENT_ID and ORDS_CLIENT_SECRET before starting the Node server."
    );
  }
}

// Reads and parses the incoming request body (e.g. user's query) for POST requests.
// NOTE: Request streams arrive in chunks; collection occurs first.
async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString("utf8");

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

// Reads an upstream HTTP response as JSON.
// NOTE: In our self-managed ORDS deployment we've explicitly set the ORDS configuration setting error.responseFormat=json. 
// Although the default error.responseFormat=auto setting works just as well.
async function readResponseBody(response) {
  return response.json();
}

function getProblemMessage(problem) {
  return problem?.detail || problem?.title || JSON.stringify(problem, null, 2);
}

// A fetch with timeouts.
// Outbound network calls use this helper so behavior is consistent.
async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out after " + Math.ceil(timeoutMs / 1000) + " seconds.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Exchanges the ORDS Client ID and Client Secret for a OAuth2.0 Access Token.
// The Access Token is used for two HTTP requests: the initial vector embedding (the user's query), and 
// then the /vectorSearch operation. The second operation queries the Auto-REST enabled PARKS; using the query Vector from the first HTTP request.
async function getAccessToken() {
  const credentials = Buffer.from(ORDS_CLIENT_ID + ":" + ORDS_CLIENT_SECRET).toString("base64");
  const response = await fetchWithTimeout(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Basic " + credentials,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(getProblemMessage(body));
  }

  if (!body || typeof body.access_token !== "string") {
    throw new Error("Access token not found in OAuth response.");
  }

  return body.access_token;
}

// Obtains the Vector embedding [array] from the user's query, to use for the /vectorSearch operation.
function extractEmbedding(payload) {
  const embedding = payload?.data?.[0]?.embedding;

  if (Array.isArray(embedding)) {
    return embedding;
  }

  throw new Error("Embedding not found in vecdb/embed response.");
}

// Sends a user's 'plain language" query to the /vecdb/embed endpoint for converting to a Vector embed array.
async function postEmbedding(text, accessToken) {
  const response = await fetchWithTimeout(EMBED_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      modelName: ORDS_MODEL_NAME,
      inputs: [{ text }]
    })
  });
  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(getProblemMessage(body));
  }

  return extractEmbedding(body);
}

// Uses the newly created Vector array to search the PARKS /vectorSearch endpoint. The results of this search are the 
// Cosine (similarity) ranked results. Results are in order of most relevant to least relevant. 
async function postVectorSearch(vector, accessToken) {
  const response = await fetchWithTimeout(SEARCH_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      vector
    })
  });
  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(getProblemMessage(body));
  }

  return body;
}

// Reads the similarity/distance score that is returned from the /vectorSearch operation.
function extractSimilarityValue(row) {
  const value = Number(row?.vectorsearchdistance);

  return Number.isFinite(value) ? value : null;
}

// Sorts results by closest match (Cosine similarity).
function sortRowsBySimilarity(rows) {
  return [...rows].sort((left, right) => {
    const leftValue = extractSimilarityValue(left);
    const rightValue = extractSimilarityValue(right);

    if (leftValue === null && rightValue === null) {
      return 0;
    }

    if (leftValue === null) {
      return 1;
    }

    if (rightValue === null) {
      return -1;
    }

    return leftValue - rightValue;
  });
}

function normalizeResultRow(row) {
  return {
    similarity: extractSimilarityValue(row),
    name: row?.name || "Unnamed Park",
    description: row?.description || "No description returned.",
    url: row?.url || ""
  };
}

// Validates the shape of the vector search response; it should be an array.
function extractRows(payload) {
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  throw new Error("Search results not found in vectorSearch response.");
}

// Helper for JSON responses.
function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function sendProblem(response, statusCode, title, detail) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json+problem; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(
    JSON.stringify({
      title,
      detail,
      status: statusCode
    })
  );
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
}

function sendRedirect(response, location) {
  response.writeHead(302, { Location: location });
  response.end();
}

function getContentType(absolutePath) {
  return CONTENT_TYPES[path.extname(absolutePath).toLowerCase()] || "application/octet-stream";
}

async function sendFile(request, response, absolutePath, contentType) {
  const resolvedContentType = contentType || getContentType(absolutePath);

  if (request.method === "HEAD") {
    response.writeHead(200, { "Content-Type": resolvedContentType });
    response.end();
    return;
  }

  const content = await fsPromises.readFile(absolutePath);
  response.writeHead(200, { "Content-Type": resolvedContentType });
  response.end(content);
}

function resolveDocsAssetPath(pathname) {
  if (pathname === DOCS_ROUTE_PREFIX || pathname === DOCS_ROUTE_PREFIX + "/") {
    return path.join(DOCS_DIST_ROOT, "index.html");
  }

  if (!pathname.startsWith(DOCS_ROUTE_PREFIX + "/")) {
    return null;
  }

  const requestedPath = pathname.slice(DOCS_ROUTE_PREFIX.length + 1);
  const absolutePath = path.resolve(DOCS_DIST_ROOT, requestedPath);

  if (!absolutePath.startsWith(DOCS_DIST_ROOT + path.sep)) {
    return null;
  }

  return absolutePath;
}

function resolveStaticAssetPath(pathname) {
  const requestedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const absolutePath = path.resolve(WEB_ROOT, requestedPath);

  for (const directory of STATIC_ASSET_DIRECTORIES) {
    if (absolutePath.startsWith(directory + path.sep)) {
      return absolutePath;
    }
  }

  return null;
}

// Serves the frontend files needed by the browser.
// The root app uses an explicit file map. The sample (the subset) OpenAPI doc is exposed via
// /api-docs/. This is the /dist directory on the backend of the app.
async function serveStatic(request, response, pathname) {
  const file = STATIC_FILES[pathname];

  if (file) {
    const absolutePath = path.join(WEB_ROOT, file.filePath);
    await sendFile(request, response, absolutePath, file.contentType);
    return;
  }

  const staticAssetPath = resolveStaticAssetPath(pathname);

  if (staticAssetPath && fs.existsSync(staticAssetPath) && fs.statSync(staticAssetPath).isFile()) {
    await sendFile(request, response, staticAssetPath);
    return;
  }

  const docsAssetPath = resolveDocsAssetPath(pathname);

  if (docsAssetPath && fs.existsSync(docsAssetPath) && fs.statSync(docsAssetPath).isFile()) {
    await sendFile(request, response, docsAssetPath);
    return;
  }

  sendText(response, 404, "Not found.");
}

// Handle the app's main API route.
// The execution flow can be summarized as follows: validate user input -> retrieve OAuth token -> create vector embedding 
// -> perform vectorSearch on the PARKS table -> sort response into rows, in order of most similar to least 
// -> return the results to the browser front end. 
async function handleSearch(request, response) {
  const body = await readRequestBody(request);
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text) {
    sendProblem(response, 400, "Bad Request", "Enter a search term.");
    return;
  }

  const accessToken = await getAccessToken();
  const vector = await postEmbedding(text, accessToken);
  const searchResponse = await postVectorSearch(vector, accessToken);
  const rows = sortRowsBySimilarity(extractRows(searchResponse));
  const items = rows.map(normalizeResultRow);
  sendJson(response, 200, { items });
}

// The main HTTP server; doesn't rely on Express. Again, this cuts down on the required dependencies.
// The GET request serves the initial frontend files, while the POST `/api/search` is responsible for the vectorSearch part of the demo. 
const server = http.createServer(async (request, response) => {
  try {
    if (!request.url) {
      sendProblem(response, 400, "Bad Request", "Missing request URL.");
      return;
    }

    const url = new URL(request.url, "http://127.0.0.1");

    if (request.method === "GET" || request.method === "HEAD") {
      if (url.pathname === DOCS_ROUTE_PREFIX) {
        sendRedirect(response, DOCS_ROUTE_PREFIX + "/");
        return;
      }

      await serveStatic(request, response, url.pathname);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/search") {
      await handleSearch(request, response);
      return;
    }

    sendProblem(response, 404, "Not Found", "Not found.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    sendProblem(response, 500, "Internal Server Error", message);
  }
});

// Validates configuration prior to opening the port. 
readRequiredConfig();

// Starts listening at "sever:port" for browser requests.
server.listen(PORT, () => {
  console.log("ORDS Park Search listening on http://localhost:" + PORT);
});
