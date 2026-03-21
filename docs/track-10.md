# Track 10: GitHub Adapter Integration

## Context

Wire up the GitHub adapter so GhostShip can be triggered from PR comments. When someone comments `@ghostship` or `/ghostship` on a PR, the bot should:
1. Detect the Vercel preview URL from the PR (Vercel bot posts it as a comment/check)
2. Run the GhostShip pipeline
3. Post the report card as a PR comment

This makes GhostShip native to the developer workflow — no Slack context-switch needed.

---

## Before You Start

1. Read `PLAN.md` — understand the project context
2. Read `src/lib/bot.tsx` — understand the existing Slack handler pattern
3. Read `src/lib/adapters.ts` — GitHub adapter is already in the Adapters interface but needs env vars
4. Read `.agents/skills/chat-sdk/SKILL.md` — understand Chat SDK patterns for multi-platform bots

---

## Prerequisites

### GitHub App or PAT Setup
Need one of:
- **GitHub PAT** → set `GITHUB_TOKEN` + `GITHUB_WEBHOOK_SECRET` in `.env.local`
- **GitHub App** → set `GITHUB_APP_ID` + `GITHUB_PRIVATE_KEY` + `GITHUB_WEBHOOK_SECRET`

### GitHub Webhook Configuration
- Point webhook URL to `https://<app>.vercel.app/api/webhooks/github`
- Events to subscribe: `issue_comment`, `pull_request` (for PR comments)

---

## Implementation

### 1. Update bot.tsx to handle GitHub mentions

The existing `onNewMention` handler should already work across adapters (Chat SDK is multi-platform). But verify:
- GitHub PR comments come through as mentions when the bot is @mentioned
- The URL extraction regex works with GitHub comment formatting
- The report card Card JSX renders properly as a GitHub comment (markdown fallback)

### 2. Auto-detect Vercel Preview URL

When triggered from a PR comment, the bot could:
- Parse the PR for the Vercel bot's deployment comment (contains preview URL)
- Or accept the URL directly from the user's comment
- Fallback: user must provide the URL explicitly

### 3. Test Flow

1. Open a PR on the ghostship repo (e.g., pricing-v2 branch)
2. Vercel deploys preview
3. Comment on PR: `@ghostship` or `@ghostship https://preview-url.vercel.app/pricing`
4. Bot runs pipeline and posts report card as PR comment

---

## Verification

- Comment `@ghostship <url>` on a PR → report card appears as PR comment
- Report card is readable in GitHub's markdown rendering
- `pnpm typecheck` passes

---

## After Completion

Update `progress.txt` — add Track 10 section and mark tasks `[x]` with timestamps.

FILES YOU MAY MODIFY: `src/lib/bot.tsx` (if needed for GitHub-specific handling)
FILES YOU MAY NOT TOUCH: anything else
