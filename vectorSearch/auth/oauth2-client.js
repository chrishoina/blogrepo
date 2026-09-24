"use strict";

function createOrdsOauthClient(config) {
  const fetchImpl = config.fetchImpl || fetch;

  function hasBaseConfig() {
    return Boolean(config.baseEndpoint && config.modelName);
  }

  function isConfigured() {
    return Boolean(hasBaseConfig() && config.clientId && config.clientSecret);
  }

  function getTokenEndpoint() {
    return config.baseEndpoint ? config.baseEndpoint + "/oauth/token" : "";
  }

  async function fetchWithTimeout(url, options, timeoutMs = config.requestTimeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetchImpl(url, {
        ...options,
        signal: controller.signal
      });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timed out after " + Math.ceil(timeoutMs / 1000) + " seconds."
        );
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function getAccessToken() {
    const credentials = Buffer.from(config.clientId + ":" + config.clientSecret).toString(
      "base64"
    );
    const response = await fetchWithTimeout(getTokenEndpoint(), {
      method: "POST",
      headers: {
        Authorization: "Basic " + credentials,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const body = await response.json();

    if (!response.ok) {
      throw new Error(getProblemMessage(body));
    }

    if (!body || typeof body.access_token !== "string") {
      throw new Error("Access token not found in OAuth response.");
    }

    return body.access_token;
  }

  return {
    getAccessToken,
    getTokenEndpoint,
    hasBaseConfig,
    isConfigured
  };
}

function getProblemMessage(problem) {
  return problem?.detail || problem?.title || JSON.stringify(problem, null, 2);
}

module.exports = {
  createOrdsOauthClient
};
