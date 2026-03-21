const SETTINGS_REALM = "GhostShip Settings";

function getCredentials() {
  const username = process.env.SETTINGS_ADMIN_USERNAME;
  const password = process.env.SETTINGS_ADMIN_PASSWORD;

  if (!username && !password) {
    return null;
  }

  if (!username || !password) {
    throw new Error(
      "Both SETTINGS_ADMIN_USERNAME and SETTINGS_ADMIN_PASSWORD must be configured together"
    );
  }

  return { username, password };
}

export function isSettingsAuthEnabled(): boolean {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return getCredentials() !== null;
}

export function getSettingsAuthError(): string | null {
  try {
    if (!isSettingsAuthEnabled()) {
      return null;
    }

    if (!getCredentials()) {
      return "Settings admin credentials are not configured";
    }

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Settings auth is misconfigured";
  }
}

export function isAuthorizedSettingsRequest(requestHeaders: Headers): boolean {
  if (!isSettingsAuthEnabled()) {
    return true;
  }

  const credentials = getCredentials();
  if (!credentials) {
    return false;
  }

  const authorization = requestHeaders.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString(
      "utf8"
    );
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return (
      username === credentials.username && password === credentials.password
    );
  } catch {
    return false;
  }
}

export function createSettingsAuthChallengeResponse(status = 401): Response {
  const error = getSettingsAuthError();

  return new Response(error ?? "Authentication required", {
    status: error ? 503 : status,
    headers: {
      "WWW-Authenticate": `Basic realm="${SETTINGS_REALM}"`,
      "Cache-Control": "no-store",
    },
  });
}
