# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is GhostShip

GhostShip sends AI-powered "phantom users" (synthetic personas) to evaluate Vercel preview deployments before shipping. Each persona examines production vs preview screenshots using Gemini multimodal reasoning, reporting back with a preference, reasoning, and friction points in ~30 seconds. It's "Lighthouse for UX" — a pre-filter that kills obvious losers before committing real user traffic.

## Commands

```bash
pnpm install          # Install deps (pnpm 10.32.1)
pnpm dev              # Dev server with --inspect (localhost:3000)
pnpm build            # Production build
pnpm typecheck        # TypeScript strict checking (tsc --noEmit)
pnpm recording:list   # List recorded webhook sessions
pnpm recording:export # Export a recorded session as test fixture
```

No test runner is configured. Verification is done via `pnpm typecheck` and manual testing (curl, Slack mentions, browser).

## Architecture

**Stack:** Next.js 16 (App Router) · TypeScript 5.9 (strict) · Chat SDK 4.20.2 · Vercel AI SDK · Gemini 2.5 Flash (evaluation) · Claude 4.5 Sonnet (general AI chat) · Puppeteer Core + @sparticuz/chromium (screenshots) · Redis or in-memory state

**Path alias:** `@/*` → `src/*`

### Core flow

1. User mentions `@ghostship <preview-url>` in Slack (or POSTs to `/api/evaluate`)
2. Screenshot service captures production + preview pages via Puppeteer
3. 5 synthetic personas each evaluate both screenshots via Gemini `generateObject()` with Zod schemas
4. Orchestrator aggregates votes → winner, confidence, rationales
5. Report card posted to Slack thread (Chat SDK JSX) or returned as JSON

### Key source files

- `src/lib/bot.tsx` — Bot handlers using Chat SDK JSX (`/** @jsxImportSource chat */`). All event handlers (mentions, DMs, actions, modals, reactions) live here. Exports singleton `bot` instance.
- `src/lib/adapters.ts` — Multi-platform adapter factory. Creates adapters based on env vars. **Do not modify** unless adding a new platform.
- `src/lib/recorder.ts` — Webhook recording/replay system. **Do not modify.**
- `src/app/api/webhooks/[platform]/route.ts` — Single webhook router for all platforms. Uses `bot.webhooks[platform]` dispatch. **Do not modify.**
- `src/app/api/slack/install/` — Slack OAuth install + callback routes
- `src/app/api/discord/gateway/route.ts` — Discord gateway cron (runs every 9 min via `vercel.json`)
- `src/proxy.ts` — Preview branch proxy middleware
- `src/lib/persistent-listener.ts` — Discord persistent WebSocket listener pattern

### GhostShip pipeline files (to be created/modified)

- `src/lib/personas.ts` — Persona types + 5 persona definitions
- `src/lib/screenshot.ts` — Puppeteer wrapper (local Chrome in dev, @sparticuz/chromium on Vercel)
- `src/lib/evaluate.ts` — Gemini multimodal evaluation via `generateObject()`
- `src/lib/agent.ts` — Orchestrator: screenshots → parallel persona evals → aggregated report
- `src/app/api/evaluate/route.ts` — Web API endpoint for evaluation
- `src/components/report-card.tsx` — Report card React component

## Next.js 16 warning

This project runs Next.js 16 which has breaking changes from earlier versions. APIs, conventions, and file structure may differ from training data. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Key conventions

- Bot JSX uses `/** @jsxImportSource chat */` pragma — Chat SDK components (`Card`, `Section`, `Button`, etc.) not React DOM
- Adapters auto-detect from env vars — only create an adapter if its env vars are set
- `process.env.VERCEL` or `process.env.AWS_LAMBDA_FUNCTION_NAME` for environment detection (local Chrome vs @sparticuz/chromium)
- State persistence: Redis in production (`REDIS_URL`), in-memory in dev
- Use `Promise.all()` for parallel operations (screenshot capture, persona evaluations)
- Structured AI output via Vercel AI SDK `generateObject()` with Zod schemas
- Dark theme preferred (brand color `#1a1a2e`)

## Environment

Minimum: `BOT_USERNAME`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `GOOGLE_GENERATIVE_AI_API_KEY`. See `.env.example` for all supported platform vars. Secrets go in `.env.local` (gitignored).

## Dependency graph for implementation

```
Track 1: personas.ts  ──┐
Track 2: screenshot.ts ──┼─→ Track 4: agent.ts ──┬─→ Track 5: bot.tsx (modify)
Track 3: evaluate.ts  ──┘                        └─→ Track 6: api/evaluate/route.ts
Track 7: page.tsx + report-card.tsx (independent, can use mock data)
```

See `PLAN.md` for the full execution plan with verification steps.
