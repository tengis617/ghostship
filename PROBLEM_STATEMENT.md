# Problem Statement

## The Gap

AI has collapsed the **build** cycle from weeks to hours. But the **learn** cycle hasn't changed.

Teams can now ship a feature variant in an afternoon. But validating whether it actually
works? That still takes **2-4 weeks** of A/B testing to reach statistical significance.

    Before AI:  Build (2 weeks) → Test (2 weeks) → Learn → Repeat
    With AI:    Build (2 hours) → Test (2 weeks) → Learn → Repeat
                                   ^^^^^^^^^^^^
                                   THE NEW BOTTLENECK

The math hasn't changed. If you need 10,000 users per variant and your site gets 500 visits/day,
you're waiting 20 days — no matter how fast you built the feature.

## The Infrastructure Is Already There

Every Vercel preview deployment is already a test candidate. When a developer opens a PR,
Vercel spins up a full production replica at a unique URL within seconds. That preview is
live, functional, and identical to what users would see.

**It's an A/B test with zero participants.**

The infrastructure for building variants is solved (AI coding tools). The infrastructure for
deploying variants is solved (Vercel previews). The infrastructure for *evaluating* variants
before committing real user traffic does not exist.

## What Teams Do Instead

- **Ship without testing.** Most teams skip experimentation entirely. The wait isn't worth
  it for "obvious" improvements — but gut feel is wrong more often than teams admit.
- **Queue experiments they'll never run.** Experimentation backlogs grow faster than traffic
  can service them. Most hypotheses die unvalidated.
- **Wait and context-switch.** By the time an A/B test reaches significance, the team has
  moved on. The learning arrives too late to inform the next decision.

Industry data supports this: experimentation platforms consistently report that 70-90%
of A/B tests show no statistically significant winner. Most of that wait time is wasted
confirming a null result.

## Why Now

Three things converged to make this solvable:

1. **AI coding tools collapsed variant creation cost.** Building two versions of a feature
   is now as fast as describing the difference. The supply of testable hypotheses exploded.
2. **Vercel previews deploy variants instantly.** Every PR gets a production-grade deployment
   at a unique URL. The test environment exists automatically.
3. **Multimodal AI can reason about interfaces.** Gemini can look at a screenshot and evaluate
   it from a specific user's perspective — analyzing layout, hierarchy, clarity, and friction.
   This was not possible 12 months ago.

The only missing piece: connecting them.

## GhostShip: Three Capabilities

GhostShip does not replace A/B testing. It is a **pre-filter** — Lighthouse for UX.

It sends AI-powered "phantom users" powered by Gemini's multimodal reasoning to evaluate
your pages. Three core capabilities, each building on the last:

### 1. Generate Personas on the Fly

Paste any URL. GhostShip screenshots the page, analyzes its content and purpose, and
**generates 5 user personas specific to that page** — not generic templates.

A cooking recipe site gets: Home Cook, Professional Chef, Food Blogger, Dietary-Restricted
User, Mobile Commuter. A B2B SaaS pricing page gets: Budget-Conscious Buyer, Technical
Evaluator, Non-Technical Executive, First-Time Visitor, Accessibility-Focused User.

The personas adapt to the page. Every evaluation starts with the right audience.

### 2. Review a Page from Each Persona's Perspective

Each generated persona evaluates the page using Gemini's multimodal vision. They assess:
- **First impression** — what they notice in the first 3 seconds
- **Strengths and weaknesses** — specific visual elements, not generic feedback
- **Friction points** — where they'd get confused or leave
- **Score** — 1-10 rating from their perspective

Five diverse perspectives in 30 seconds. The output isn't "this page is good" — it's
"here's exactly what a budget-conscious buyer sees vs what a power user sees, and why
they disagree."

### 3. Compare Pages Across Revisions via PR Reviews

When a developer opens a PR, Vercel deploys a preview. GhostShip compares the preview
against production from each persona's perspective:

- **In Slack:** `@ghostship <preview-url>` → auto-detects production URL → report card
- **In GitHub:** `@ghostship` on a PR comment → finds Vercel preview → posts comparison as PR comment

Each persona votes: production or preview. The report card shows the split, the reasoning,
and a confidence-scored recommendation. A 5-0 vote with high confidence means "ship it."
A 3-2 split means "run a real A/B test on this one."

This is where the pre-filter earns its keep: of your 30 queued experiments, which ones
are worth burning real traffic on?

---

## What It Is

- A **UX pre-filter** — like Lighthouse for user experience
- A way to **kill obvious losers** before committing real traffic
- A tool for **rapid design iteration** — test 10 variants in 5 minutes
- A way to **triage the experiment backlog** — focus real A/B tests on close calls
- **Embedded in the developer workflow** — Slack, GitHub, or the web

## What It Is Not

- A replacement for real A/B testing with real users
- A way to measure behavioral metrics (conversion, retention, revenue)
- Statistically significant in the traditional sense

This is honest and deliberate. GhostShip answers: "Is this change likely better for users,
and why?" It does not answer: "Will this change increase revenue by 3.2%?"

## Why That's Still Valuable

Research validates this approach. The SimAB framework (March 2026) tested LLM-based
simulation against 47 real A/B experiments and achieved:
- **67% accuracy** overall in predicting the real-world winner
- **83% accuracy** on predictions the model flagged as high-confidence

For context: most teams shipping without testing are operating at ~50% accuracy (coin flip).
Even modest predictive power, delivered in 30 seconds and at zero cost, changes the calculus.

## Compared To Existing Options

| | Real A/B Test | UserTesting.com | GhostShip |
|---|---|---|---|
| Time | 2-4 weeks | 2-4 hours | 30 seconds |
| Cost per test | $0 (but traffic cost) | $50-200 | $0 |
| Frequency | Monthly | Occasional | Every PR |
| Measures behavior | Yes | Partially | No |
| Measures UX quality | Indirectly | Yes | Yes |
| Integrated in workflow | No | No | Yes (Slack, GitHub, Web) |
| Scales to every change | No | No | Yes |
| Personas adapt to page | N/A | Manual | Automatic |

## Who This Is For

- **Product teams with AI coding tools** who can now produce variants faster than they can validate them
- **Growth teams** whose experiment backlog outruns their traffic
- **Startups** where every week of learning delay burns runway
- **Any team using Vercel** who wants signal on their preview before they ship
- **Anyone with a URL** who wants to know how different users perceive their page
