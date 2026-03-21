# GhostShip

**Phantom users for every pull request.**

> Every Vercel preview is already an A/B test. It just has zero users.

[ghostship.sh](https://www.ghostship.sh) | [Demo Video](#demo) | [Problem Statement](PROBLEM_STATEMENT.md)

---

## What is GhostShip?

AI coding tools made building features 10x faster. But learning whether a change is good for users still takes 2-4 weeks of A/B testing. GhostShip closes that gap.

It sends AI-generated "phantom users" to evaluate your pages in 30 seconds — not 3 weeks. Lighthouse for UX.

## Three Capabilities

### 1. Generate Personas on the Fly

Paste any URL. Gemini analyzes the page and generates 5 user personas specific to that page — not generic templates. A cooking site gets food personas. A B2B pricing page gets buyer personas.

### 2. Review a Page from Each Persona's Perspective

Each persona evaluates the page using Gemini's multimodal vision: first impressions, scores, strengths, weaknesses, and suggestions — all from their unique point of view.

### 3. Compare Pages Across Revisions via PR Reviews

When a developer opens a PR, `@ghostship` in Slack or GitHub compares the Vercel preview against production. Five personas vote, and you get a confidence-scored recommendation in 30 seconds.

```
@ghostship https://my-app-git-feature.vercel.app/pricing
```

```
👻 Ghostship Report: /pricing
Preview wins 4-1 · Confidence: 82%

🛍️ Budget-Conscious Buyer — Prefers Preview (high confidence)
   "The pricing tiers are much clearer. I can immediately see what I get at each level."

💻 Power User — Prefers Preview (high confidence)
   "The CTA stands out more. I don't have to hunt for the signup button."

💼 Executive — Prefers Production (medium confidence)
   "The new layout feels busier. I preferred the simpler presentation."

👀 First-Time Visitor — Prefers Preview (high confidence)
   "The comparison table makes it easy to decide."

♿ Accessibility User — Prefers Preview (high confidence)
   "Better contrast on the CTA button. The heading hierarchy is more logical."

Summary: Preview wins 4-1. Ship with confidence.
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | Gemini 2.5 Flash (multimodal vision + structured output) |
| AI SDK | Vercel AI SDK (`generateText`, `Output.object`, zod schemas) |
| Bot Framework | Vercel Chat SDK (Slack + GitHub adapters) |
| Screenshots | Puppeteer (`puppeteer-core` + `@sparticuz/chromium`) |
| Framework | Next.js 16 (App Router) |
| Deployment | Vercel |

## How It Works

```
URL mentioned in Slack/GitHub
  │
  ├── Screenshot both URLs (Puppeteer, parallel)
  │
  ├── 5 Persona Evaluations (Gemini, parallel)
  │   ├── Budget-Conscious Buyer
  │   ├── Power User / Developer
  │   ├── Non-Technical Executive
  │   ├── First-Time Visitor
  │   └── Accessibility-Focused User
  │
  ├── Aggregate: votes, confidence, summary
  │
  └── Post report card to Slack thread / GitHub PR comment
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── pricing/page.tsx                  # Demo pricing page
│   └── api/
│       └── webhooks/[platform]/route.ts  # Slack + GitHub webhook handler
├── lib/
│   ├── agent.ts                          # Orchestrator: runGhostship(), reviewPage(), runGhostshipForPR()
│   ├── bot.tsx                           # Chat SDK bot handlers
│   ├── evaluate.ts                       # Gemini multimodal evaluation (single-page + A/B)
│   ├── personas.ts                       # 5 persona definitions + types
│   ├── screenshot.ts                     # Puppeteer screenshot service
│   └── adapters.ts                       # Slack + GitHub adapter setup
└── scripts/
    └── evaluate-page.ts                  # CLI: evaluate any URL with all 5 personas
```

## Quick Start

```bash
pnpm install
cp .env.example .env.local
# Fill in: GEMINI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY,
#          SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET
pnpm dev
```

### Try the CLI

```bash
npx tsx scripts/evaluate-page.ts https://vercel.com
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key (from Google AI Studio) |
| `SLACK_BOT_TOKEN` | Slack bot token |
| `SLACK_SIGNING_SECRET` | Slack request verification |
| `GITHUB_WEBHOOK_SECRET` | GitHub webhook secret (for PR reviews) |
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_PRIVATE_KEY` | GitHub App private key |

## Dogfooding

GhostShip evaluates its own PRs. We created variant pricing pages and used GhostShip to compare them:

- [PR #1 — Outcome-focused copy variant](https://github.com/tengis617/ghostship/pull/1)
- [PR #2 — Comparison table layout variant](https://github.com/tengis617/ghostship/pull/2)

## Why This Matters

- **70-90% of A/B tests** show no statistically significant winner. Most wait time is wasted.
- **SimAB research** (2026) showed LLM-based simulation achieves 67% accuracy overall, 83% on high-confidence predictions — vs 50% (coin flip) for teams shipping without testing.
- GhostShip is a **pre-filter**, not a replacement for real A/B testing. It tells you which experiments are worth running.

---

Built for [Zero to Agent: Vercel x DeepMind Hackathon SF](https://cerebralvalley.ai/e/zero-to-agent-sf) (March 2026)
