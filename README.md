# Ghostship

A full-featured Chat SDK app based on the upstream Next.js example. It is set up as a standalone app with published npm packages instead of monorepo `workspace:*` dependencies.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Redis (for state persistence)
- At least one platform configured (see [Environment variables](#environment-variables))

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example environment file and fill in your platform credentials:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
pnpm dev
```

The app runs at `http://localhost:3000`. Platform webhooks should point to `/api/webhooks/{platform}` (e.g. `/api/webhooks/slack`).

> For local development with real webhooks, use a tunneling tool like [ngrok](https://ngrok.com) or [`localtunnel`](https://github.com/localtunnel/localtunnel).

## What it demonstrates

- **Event handlers** — mentions, thread subscriptions, pattern matching, reactions
- **AI mode** — `@mention AI` to enable streaming LLM responses via the Vercel AI SDK
- **Cards** — interactive JSX-based cards with buttons, dropdowns, and fields
- **Modals** — form dialogs with text inputs, validation, and private metadata
- **Actions** — button clicks and dropdown selections with response handlers
- **Slash commands** — platform-specific command handling
- **Ephemeral messages** — user-only visible messages with DM fallback
- **DMs** — programmatic direct message initiation
- **File uploads** — attachment detection and display
- **Multi-platform** — same bot logic across all six platforms

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── webhooks/[platform]/route.ts   # Main webhook entry point
│   │   ├── slack/install/                  # Slack OAuth flow
│   │   └── discord/gateway/route.ts        # Discord gateway cron
│   ├── settings/page.tsx                   # Preview branch config UI
│   └── page.tsx                            # Home page
├── lib/
│   ├── bot.tsx                             # Bot logic and handlers
│   ├── adapters.ts                         # Adapter initialization
│   └── recorder.ts                         # Webhook recording system
└── middleware.ts                            # Preview branch proxy
```

## Environment variables

Copy `.env.example` for the full list. At minimum, set `BOT_USERNAME` and credentials for one platform:

| Variable | Description |
|----------|-------------|
| `BOT_USERNAME` | Bot display name |
| `SLACK_BOT_TOKEN` | Slack bot token (single-workspace mode) |
| `SLACK_SIGNING_SECRET` | Slack request verification |
| `TEAMS_APP_ID` | Teams app ID |
| `TEAMS_APP_PASSWORD` | Teams app password |
| `GOOGLE_CHAT_CREDENTIALS` | Google Chat service account JSON |
| `DISCORD_BOT_TOKEN` | Discord bot token |
| `DISCORD_PUBLIC_KEY` | Discord interaction verification key |
| `GITHUB_TOKEN` | GitHub PAT or App credentials |
| `LINEAR_API_KEY` | Linear API key |
| `REDIS_URL` | Redis connection string |
| `SETTINGS_ADMIN_USERNAME` | Basic auth username for `/settings` and settings API |
| `SETTINGS_ADMIN_PASSWORD` | Basic auth password for `/settings` and settings API |
| `APP_URL` | Canonical app URL used for metadata |
| `PREVIEW_BRANCH_ALLOWED_HOSTS` | Comma-separated allowlist for preview proxy targets |

See the [Chat SDK docs](https://chat-sdk.dev/docs) for full platform setup guides.

## Recording and replay

The app includes a recording system for capturing production webhook interactions and converting them into replay tests.

```bash
# Enable recording in your environment
RECORDING_ENABLED=true

# List recorded sessions
pnpm recording:list

# Export a session
pnpm recording:export <session-id>
```

See `packages/integration-tests/fixtures/replay/README.md` for the full workflow.

## Preview branch testing

Test PRs with real webhook traffic by proxying requests from production to a preview deployment:

1. Deploy a preview branch to Vercel
2. Go to `/settings` on the production deployment
3. Authenticate with your settings admin credentials
4. Enter the preview branch URL and save

All webhook requests are proxied until the URL is cleared.
