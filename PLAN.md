# GhostShip — Execution Plan

**Phantom users for every pull request.**

---

## Current State (as of ~10:30 AM)

Phase 0 is DONE. The scaffold is far more complete than originally planned:

- **Next.js app** running with Chat SDK fully wired
- **Slack adapter** configured and connected (bot token + signing secret in .env.local)
- **Slack app** created with manifest (app_mention events, interactivity enabled)
- **Gemini API key** obtained
- **ngrok tunnel** active for local Slack webhook delivery
- **Bot logic** in `src/lib/bot.tsx` — currently the Chat SDK example app, needs to be replaced with GhostShip logic
- **Webhook route** at `src/app/api/webhooks/[platform]/route.ts` — already handles Slack events

### What's NOT done yet
- Screenshot service (using local Puppeteer via `puppeteer-core` + `@sparticuz/chromium` — no external API needed)
- GhostShip core pipeline (personas, evaluation, orchestrator)
- GhostShip-specific bot handlers in bot.tsx
- Landing page (page.tsx is still the example page — needs logo + headline)
- PROBLEM_STATEMENT.md rewrite (drafted, needs to be applied)

---

## Parallelization Strategy

### Key Insight
The pipeline has a clear dependency graph. Several tracks can run simultaneously if each agent owns specific files and produces verifiable output.

### Dependency Graph
```
Track 1: Types + Personas ─────────────────────────────┐
  (src/lib/personas.ts)                                 │
                                                        ├─→ Track 4: Orchestrator
Track 2: Screenshot Service ────────────────────────────┤   (src/lib/agent.ts)
  (src/lib/screenshot.ts)                               │       │
                                                        │       ├─→ Track 5: Bot Logic
Track 3: Gemini Evaluation ─────────────────────────────┘       │   (src/lib/bot.tsx)
  (src/lib/evaluate.ts)                                         │
                                                                ├─→ Track 6: Web API Route
Track 7: Landing Page ──────────────────────────────────────────┘   (src/app/api/evaluate/)
  (src/app/page.tsx)
```

### Parallel Batch 1 (can all run simultaneously)

| Track | Files | Owner | Verification |
|-------|-------|-------|-------------|
| **1: Types + Personas** | `src/lib/personas.ts` | Agent A | `pnpm typecheck` passes |
| **2: Screenshot Service** | `src/lib/screenshot.ts` | Agent B | Test script saves PNG to `/tmp/test-screenshot.png` via local Puppeteer, file exists and is >10KB |
| **3: Gemini Evaluation** | `src/lib/evaluate.ts` | Agent C | Test script prints valid JSON matching PersonaResult schema to stdout |
| **7: Landing Page** | `src/app/page.tsx` | Agent D | Page renders at localhost:3000 with logo + headline |

**Pre-requisite for Batch 1:** Agree on shared types in `src/lib/personas.ts` first (5 min), then all tracks can diverge.

### Sequential Batch 2 (after Batch 1 completes)

| Track | Files | Depends On | Verification |
|-------|-------|-----------|-------------|
| **4: Orchestrator** | `src/lib/agent.ts` | Tracks 1, 2, 3 | Test script runs full pipeline with 2 real URLs, prints GhostshipReport JSON, completes in <45s |
| **5: Bot Logic** | `src/lib/bot.tsx` | Track 4 | @ghostship in Slack with a URL → loading message → report card posted to thread |
| **6: Web API Route** | `src/app/api/evaluate/route.ts` | Track 4 | `curl -X POST localhost:3000/api/evaluate -d '{"previewUrl":"..."}' ` returns valid JSON |

### Sequential Batch 3 (polish)

| Track | Files | Verification |
|-------|-------|-------------|
| **Error handling** | All files | Invalid URL → graceful error in Slack |
| **(Stretch) Web UI compare** | `src/app/page.tsx`, `src/app/api/evaluate/route.ts`, `src/components/report-card.tsx` | Paste 2 URLs → see report card (only if time permits) |
| **Deploy** | Vercel | Production URL works, Slack events point to prod |

---

## File Ownership Map

Files that will be **created** (don't exist yet):
```
src/lib/personas.ts          # Track 1 — types + 5 persona definitions
src/lib/screenshot.ts         # Track 2 — Puppeteer screenshot service (puppeteer-core + @sparticuz/chromium)
src/lib/evaluate.ts           # Track 3 — Gemini multimodal evaluation
src/lib/agent.ts              # Track 4 — orchestrator
src/app/api/evaluate/route.ts # Track 6 — web API endpoint (stretch goal)
```

Files that will be **modified**:
```
src/lib/bot.tsx               # Track 5 — replace example handlers with GhostShip
src/app/page.tsx              # Track 7 — replace example page with landing page (logo + headline)
PROBLEM_STATEMENT.md          # Content — already drafted
```

Files that should NOT be touched:
```
src/lib/adapters.ts           # Working adapter setup, leave as-is
src/lib/recorder.ts           # Recording system, leave as-is
src/app/api/webhooks/         # Webhook routing, already works
.env.local                    # Keys already configured
```

---

## Verification Checklist (Proof of Work)

Each verification step produces concrete, inspectable output.

### Batch 1 Verification
```bash
# Track 1: Types compile
pnpm typecheck 2>&1 | tail -5
# Expected: no errors related to personas.ts

# Track 2: Screenshot works
node -e "require('./src/lib/screenshot').captureScreenshot('https://vercel.com').then(b => require('fs').writeFileSync('/tmp/test.png', b))"
ls -la /tmp/test.png
# Expected: PNG file > 10KB

# Track 3: Gemini evaluation works
node -e "..." # test script that evaluates one persona with 2 test images
# Expected: valid JSON printed to stdout

# Track 7: Landing page renders
curl -s localhost:3000 | head -20
# Expected: HTML with ghostship logo + headline
```

### Batch 2 Verification
```bash
# Track 4: Full pipeline
node -e "require('./src/lib/agent').runGhostship('https://vercel.com', 'https://vercel.com').then(r => console.log(JSON.stringify(r, null, 2)))"
# Expected: GhostshipReport JSON with 5 personas, winner, confidence

# Track 5: Slack bot
# Manual: @ghostship https://vercel.com in Slack
# Expected: loading message → report card in thread

# Track 6: Web API
curl -X POST localhost:3000/api/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"previewUrl":"https://vercel.com","productionUrl":"https://vercel.com"}'
# Expected: JSON response with GhostshipReport
```

### Batch 3 Verification
```bash
# Deploy works
vercel deploy --prod
# Expected: production URL accessible

# Slack on prod
# Manual: @ghostship in Slack → report card appears

# Web on prod
# Manual: open production URL → paste URLs → see report
```

---

## Tech Stack (Confirmed)

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js (App Router) | Installed, running |
| Chat SDK | `chat` + `@chat-adapter/slack` v4.20.2 | Installed, Slack connected |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/google` | `ai` installed, **need to install @ai-sdk/google + zod** |
| Screenshots | `puppeteer-core` + `@sparticuz/chromium` | **Need to install** — no external API key, self-contained |
| State | `@chat-adapter/state-memory` | Installed |
| Deploy | Vercel | Account ready |

---

## Risk Mitigation (Updated)

| Risk | Trigger | Fallback |
|------|---------|----------|
| Puppeteer crashes on Vercel | Chromium binary too large or runtime error | Fall back to user-uploaded screenshots on web UI, or use a free screenshot API (ScreenshotOne free tier) |
| Gemini rate limited | 429 errors | Reduce to 3 personas, add exponential backoff |
| Chat SDK issues | Unexpected behavior | Bot logic is just JS functions — can fall back to raw Slack API calls |
| Pipeline too slow (>60s) | Gemini calls stack up | Fire all 5 persona calls truly in parallel with `Promise.all`, reduce persona count |
| Web compare UI takes too long | Time crunch | Ship with landing page only, Slack bot is the primary demo |

---

## Pitch

**One-liner:** "Every Vercel preview is already an A/B test. It just has zero users."

**Tagline:** "Lighthouse for UX."

**Demo script (60s):**
1. "AI made shipping 10x faster. But knowing if a change is good still takes weeks."
2. "GhostShip sends phantom users to your Vercel preview before you ship."
3. *@ghostship in Slack with preview URL*
4. *Report card streams in — 5 personas vote*
5. "30 seconds. Not 3 weeks."
6. "Every Vercel preview is already an A/B test. It just had zero users. Until now."
