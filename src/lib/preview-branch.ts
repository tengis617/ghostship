import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "";
const PREVIEW_BRANCH_KEY = "chat-sdk:cache:preview-branch-url";

let redisClient: ReturnType<typeof createClient> | null = null;
let redisConnectPromise: Promise<void> | null = null;

function getLocalStorePath() {
  return path.join(process.cwd(), ".next", "cache", "preview-branch-url.txt");
}

function getAllowedHosts() {
  const configured = process.env.PREVIEW_BRANCH_ALLOWED_HOSTS;
  if (!configured) {
    return [".vercel.app"];
  }

  return configured
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function hostnameMatchesRule(hostname: string, rule: string) {
  return rule.startsWith(".")
    ? hostname === rule.slice(1) || hostname.endsWith(rule)
    : hostname === rule;
}

function isAllowedHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase();

  if (
    process.env.NODE_ENV !== "production" &&
    (normalizedHostname === "localhost" || normalizedHostname === "127.0.0.1")
  ) {
    return true;
  }

  return getAllowedHosts().some((rule) =>
    hostnameMatchesRule(normalizedHostname, rule)
  );
}

export function validatePreviewBranchUrl(input: string) {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid URL");
  }

  const isLocalDevHost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const isSecureProtocol = url.protocol === "https:";
  const isLocalDevProtocol =
    process.env.NODE_ENV !== "production" &&
    isLocalDevHost &&
    url.protocol === "http:";

  if (!isSecureProtocol && !isLocalDevProtocol) {
    throw new Error("Preview branch URL must use HTTPS");
  }

  if (!isAllowedHostname(url.hostname)) {
    throw new Error(
      "Preview branch URL host is not allowed. Configure PREVIEW_BRANCH_ALLOWED_HOSTS if needed."
    );
  }

  url.pathname = "";
  url.search = "";
  url.hash = "";

  return url.toString();
}

export function sanitizeStoredPreviewBranchUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return validatePreviewBranchUrl(value);
  } catch {
    return null;
  }
}

async function getRedisClient() {
  if (!REDIS_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("REDIS_URL is not configured");
    }

    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on("error", (error) => {
      console.error("[preview-branch] Redis client error:", error);
    });
  }

  if (!redisClient.isOpen) {
    if (!redisConnectPromise) {
      redisConnectPromise = redisClient.connect().then(() => {});
    }

    await redisConnectPromise;
  }

  return redisClient;
}

export async function getPreviewBranchUrl() {
  const client = await getRedisClient();
  const value = client ? await client.get(PREVIEW_BRANCH_KEY) : await readLocalValue();

  return sanitizeStoredPreviewBranchUrl(value ?? null);
}

export async function setPreviewBranchUrl(url: string | null) {
  const client = await getRedisClient();
  const normalizedUrl = url ? validatePreviewBranchUrl(url) : null;

  if (client) {
    if (normalizedUrl) {
      await client.set(PREVIEW_BRANCH_KEY, normalizedUrl);
    } else {
      await client.del(PREVIEW_BRANCH_KEY);
    }
  } else {
    await writeLocalValue(normalizedUrl);
  }

  return normalizedUrl;
}

export function isPreviewBranchPersistentStorageEnabled() {
  return Boolean(REDIS_URL);
}

async function readLocalValue() {
  try {
    return await readFile(getLocalStorePath(), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeLocalValue(value: string | null) {
  const storePath = getLocalStorePath();

  if (!value) {
    await rm(storePath, { force: true });
    return;
  }

  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, value, "utf8");
}
