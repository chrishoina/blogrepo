"use strict";

function createAuthService(config) {
  const authConfigEndpoint = config.authConfigEndpoint || "/api/auth/config";
  const healthEndpoint = config.healthEndpoint || "/healthcheck";

  function hasOrdsBaseConfig() {
    return config.oauth2Client.hasBaseConfig();
  }

  function hasOrdsOauthConfig() {
    return config.oauth2Client.isConfigured();
  }

  function getAvailableSearchAuthModes() {
    return hasOrdsOauthConfig() ? ["oauth2"] : [];
  }

  function getDefaultSearchAuthMode() {
    return getAvailableSearchAuthModes()[0] || "";
  }

  function getAuthConfiguration() {
    return {
      availableModes: getAvailableSearchAuthModes(),
      defaultMode: getDefaultSearchAuthMode(),
      oauth2: {
        configured: hasOrdsOauthConfig(),
        tokenEndpoint: config.oauth2Client.getTokenEndpoint()
      }
    };
  }

  function ensureSearchIsConfigured() {
    if (!hasOrdsOauthConfig()) {
      if (hasOrdsBaseConfig()) {
        throw new Error(
          "ORDS OAuth client credentials are missing. Set ORDS_CLIENT_ID and ORDS_CLIENT_SECRET."
        );
      }

      throw new Error(
        "ORDS search configuration is missing. Set ORDS_BASE_ENDPOINT, ORDS_MODEL_NAME, ORDS_CLIENT_ID, and ORDS_CLIENT_SECRET."
      );
    }
  }

  async function getSearchAccessToken() {
    ensureSearchIsConfigured();

    return {
      authMode: "oauth2",
      accessToken: await config.oauth2Client.getAccessToken()
    };
  }

  function buildPublicAuthConfiguration(request) {
    const authConfiguration = getAuthConfiguration();
    const origin = getRequestOrigin(request);

    return {
      availableModes: authConfiguration.availableModes,
      defaultMode: authConfiguration.defaultMode,
      endpoints: {
        authConfig: origin + authConfigEndpoint,
        health: origin + healthEndpoint,
        token: authConfiguration.oauth2.tokenEndpoint
      },
      oauth2: authConfiguration.oauth2
    };
  }

  // The health payload is returned by `/healthcheck`. Monitoring systems and
  // deployment probes use it to distinguish "process is up" from "service is
  // ready to perform ORDS-backed searches with OAuth client credentials."
  function buildHealthPayload() {
    const authConfiguration = getAuthConfiguration();

    return {
      defaultAuthMode: authConfiguration.defaultMode,
      ordsBaseConfigured: hasOrdsBaseConfig(),
      ordsOauthConfigured: hasOrdsOauthConfig(),
      ordsSearchConfigured: authConfiguration.availableModes.length > 0,
      searchAuthModes: authConfiguration.availableModes,
      service: "ords-vector-search-demo",
      status: "ok"
    };
  }

  return {
    buildHealthPayload,
    buildPublicAuthConfiguration,
    ensureSearchIsConfigured,
    getAuthConfiguration,
    getSearchAccessToken,
    hasOrdsBaseConfig,
    hasOrdsOauthConfig
  };
}

function getRequestOrigin(request) {
  const forwardedProto = request.headers["x-forwarded-proto"];
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = forwardedHost || request.headers.host || "localhost";
  const protocol =
    typeof forwardedProto === "string" && forwardedProto
      ? forwardedProto.split(",")[0].trim()
      : "http";

  return protocol + "://" + host;
}

module.exports = {
  createAuthService
};
