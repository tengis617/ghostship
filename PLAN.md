# GhostShip — Execution Plan

**Phantom users for every pull request.**

## Context

Building a Slack bot + web UI for the Vercel x DeepMind hackathon (submission 5PM today). GhostShip sends AI-powered "phantom users" to evaluate Vercel preview deployments vs production, giving teams directional A/B test signal in 30 seconds instead of 2-4 weeks.

**Constraints:** Solo, 7 hours, no accounts/keys set up yet.
**Stack:** Next.js + Vercel AI SDK + Gemini + Vercel Chat SDK (Slack adapter) + ScreenshotOne.
**Build order:** Core pipeline → Web UI (validates pipeline) → Slack bot (same pipeline, different interface).

---

## Phase 0: Account Setup & Scaffold (10:00 - 10:45)

### 0a. Accounts & API Keys (~20 min, do in parallel)
1. **Google AI Studio** → Gemini API key
2. **ScreenshotOne** → sign up, get API key (free tier: 100 screenshots)
3. **Slack** → create Slack App
   - Bot Token Scopes: `app_mentions:read`, `chat:write`, `files:write`
   - Enable Event Subscriptions (URL set after deploy)
   - Install to workspace → grab `SLACK_BOT_TOKEN` + `SLACK_SIGNING_SECRET`
4. **Vercel** → confirm account ready

### 0b. Scaffold Next.js App (~25 min)
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false
npm install ai @ai-sdk/google zod
```

**File structure:**
```
ghostship/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Web UI: paste URLs → see report
│   └── api/
│       ├── evaluate/
│       │   └── route.ts            # POST: runs GhostShip pipeline
│       └── slack/
│           └── route.ts            # Slack event handler (Phase 3)
├── lib/
│   ├── agent.ts                    # Core orchestration
│   ├── personas.ts                 # 5 persona definitions
│   ├── screenshot.ts               # ScreenshotOne client
│   └── evaluate.ts                 # Gemini multimodal evaluation
├── components/
│   └── report-card.tsx             # Reusable report card UI
├── .env.local                      # API keys (gitignored)
└── .gitignore
```

---

## Phase 1: Core Pipeline (10:45 - 12:15)

### 1a. Screenshot service — `lib/screenshot.ts`
- `captureScreenshot(url: string): Promise<Buffer>` → calls ScreenshotOne API
- Viewport 1280x800, full_page=false, format=png
- URL parsing: `{project}-git-{branch}.vercel.app` → `{project}.vercel.app`
- Fallback: accept explicit production URL

### 1b. Personas — `lib/personas.ts`
5 personas as typed objects:
1. Budget-Conscious Buyer — reads fine print, compares tiers
2. Power User / Developer — scans fast, wants clear CTA
3. Non-Technical Executive — 10 seconds or bounce, needs simplicity
4. First-Time Visitor — no brand context, comparing alternatives
5. Accessibility-Focused User — contrast, hierarchy, readability

### 1c. Gemini evaluation — `lib/evaluate.ts`
- `evaluateAsPersona(persona, productionPng, previewPng): Promise<PersonaResult>`
- Vercel AI SDK `generateObject()` with `@ai-sdk/google`
- Zod schema: preference, confidence, rationale, pros/cons per variant

### 1d. Agent orchestrator — `lib/agent.ts`
- `runGhostship(previewUrl, productionUrl?): Promise<GhostshipReport>`
- Parse URLs → screenshot both (parallel) → 5 persona evals (parallel) → aggregate

---

## Phase 2: Web UI (12:15 - 1:15)

### 2a. API route — `app/api/evaluate/route.ts`
- POST `{ previewUrl, productionUrl? }` → runs pipeline → returns JSON

### 2b. Web interface — `app/page.tsx` + `components/report-card.tsx`
- Input form: preview URL + optional production URL
- "Deploy Phantom Users" button
- Streaming results as personas complete
- Report card: winner, confidence, per-persona breakdown, summary
- Dark theme, polished design

---

## Phase 3: Slack Bot (1:15 - 2:30)

### 3a. Install Chat SDK
```bash
npm install @vercel/chat-sdk @chat-adapter/slack
```

### 3b. Slack handler — `app/api/slack/route.ts`
- URL verification + `app_mention` events
- Parse URL → post loading message → run pipeline → post Block Kit report card

### 3c. Deploy & wire up
- Deploy to Vercel with env vars
- Set Slack Event Subscription URL → verify events flow

---

## Phase 4: Polish & Demo Prep (2:30 - 4:00)

- Error handling (graceful failures, partial results, timeouts)
- Demo project: Vercel site with a PR that changes something visually obvious
- Landing page polish: hero section, explanation, "Add to Slack"

---

## Phase 5: Submit (4:00 - 5:00)

- Production deploy + end-to-end test
- Screen-record demo flow (backup)
- README.md
- Submit

---

## Risk Mitigation

| Risk | Fallback |
|------|----------|
| Account setup slow | Skip ScreenshotOne, use user-uploaded screenshots |
| Screenshot API flaky | Pre-capture PNGs, hardcode for demo |
| Gemini rate limited | Reduce to 3 personas, add backoff |
| Chat SDK Slack issues | Direct Slack API (`chat.postMessage`) |
| Everything broken by 2:30 | Web UI only, skip Slack |

---

## Pitch

**One-liner:** "Every Vercel preview is already an A/B test. It just has zero users."

**Tagline:** "Lighthouse for UX."

**Why now:** AI coding tools collapsed variant creation cost. Vercel previews deploy them instantly. Gemini multimodal can evaluate screenshots. The only missing piece was connecting them.

**Demo script (60s):**
1. "AI made shipping 10x faster. But knowing if a change is good still takes weeks."
2. "GhostShip sends phantom users to your Vercel preview before you ship."
3. *@ghostship in Slack with preview URL*
4. *Report card streams in — 5 personas vote*
5. "30 seconds. Not 3 weeks."
6. "Every Vercel preview is already an A/B test. It just had zero users. Until now."
