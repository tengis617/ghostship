import { createGitHubAdapter, type GitHubAdapter } from "@chat-adapter/github";
import { createSlackAdapter, type SlackAdapter } from "@chat-adapter/slack";
import { ConsoleLogger } from "chat";
import { recorder, withRecording } from "./recorder";

const logger = new ConsoleLogger("info");

export interface Adapters {
  github?: GitHubAdapter;
  slack?: SlackAdapter;
}

const SLACK_METHODS = [
  "postMessage",
  "editMessage",
  "deleteMessage",
  "addReaction",
  "removeReaction",
  "startTyping",
  "stream",
  "openDM",
  "fetchMessages",
];
const GITHUB_METHODS = [
  "postMessage",
  "editMessage",
  "deleteMessage",
  "addReaction",
  "removeReaction",
  "fetchMessages",
];

function isValidSlackEncryptionKey(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  return /^[a-f0-9]{64}$/i.test(value) || value.length === 44;
}

/**
 * Build type-safe adapters based on available environment variables.
 * Only Slack and GitHub adapters are enabled for GhostShip.
 */
export function buildAdapters(): Adapters {
  recorder.startFetchRecording();

  const adapters: Adapters = {};

  // Slack adapter - env vars: SLACK_SIGNING_SECRET + (SLACK_BOT_TOKEN or SLACK_CLIENT_ID/SECRET)
  if (process.env.SLACK_SIGNING_SECRET) {
    const encryptionKey = isValidSlackEncryptionKey(
      process.env.SLACK_ENCRYPTION_KEY
    )
      ? process.env.SLACK_ENCRYPTION_KEY
      : undefined;
    const invalidEncryptionKey =
      process.env.SLACK_ENCRYPTION_KEY && !encryptionKey
        ? process.env.SLACK_ENCRYPTION_KEY
        : undefined;

    if (invalidEncryptionKey) {
      console.warn(
        "[chat] Ignoring invalid SLACK_ENCRYPTION_KEY; expected 64-char hex or 44-char base64"
      );
    }

    try {
      if (invalidEncryptionKey) {
        delete process.env.SLACK_ENCRYPTION_KEY;
      }

      adapters.slack = withRecording(
        createSlackAdapter({
          userName: "ghostship",
          logger: logger.child("slack"),
          signingSecret: process.env.SLACK_SIGNING_SECRET,
          botToken: process.env.SLACK_BOT_TOKEN,
          clientId: process.env.SLACK_CLIENT_ID,
          clientSecret: process.env.SLACK_CLIENT_SECRET,
          encryptionKey,
        }),
        "slack",
        SLACK_METHODS
      );
    } catch (err) {
      console.warn(
        "[chat] Failed to create slack adapter:",
        err instanceof Error ? err.message : err
      );
    } finally {
      if (invalidEncryptionKey) {
        process.env.SLACK_ENCRYPTION_KEY = invalidEncryptionKey;
      }
    }
  }

  // GitHub adapter - env vars: GITHUB_WEBHOOK_SECRET + (GITHUB_TOKEN or GITHUB_APP_ID/PRIVATE_KEY)
  if (process.env.GITHUB_WEBHOOK_SECRET) {
    try {
      adapters.github = withRecording(
        createGitHubAdapter({
          logger: logger.child("github"),
          userName: "ghostship",
        }),
        "github",
        GITHUB_METHODS
      );
    } catch {
      console.warn(
        "[chat] Failed to create github adapter (check GITHUB_TOKEN or GITHUB_APP_ID/PRIVATE_KEY)"
      );
    }
  }

  return adapters;
}
