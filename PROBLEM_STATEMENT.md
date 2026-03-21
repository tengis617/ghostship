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

## The Approach: Synthetic Pre-Filtering

GhostShip does not replace A/B testing. It is a **pre-filter**.

It sends AI-powered "phantom users" — diverse synthetic personas powered by Gemini's
multimodal reasoning — to evaluate your Vercel preview against production. Each persona
examines both versions from their specific perspective and reports back with a preference,
reasoning, and friction points.

This gives teams **directional signal in 30 seconds** on questions like:
- "Is this new layout clearer or more confusing?"
- "Does this copy change improve perceived value?"
- "Which design do different user segments prefer, and why?"

### What It Is

- A **UX pre-filter** — like Lighthouse for user experience
- A way to **kill obvious losers** before committing real traffic
- A tool for **rapid design iteration** — test 10 variants in 5 minutes
- A way to **triage the experiment backlog** — focus real A/B tests on close calls

### What It Is Not

- A replacement for real A/B testing with real users
- A way to measure behavioral metrics (conversion, retention, revenue)
- Statistically significant in the traditional sense

This is honest and deliberate. GhostShip answers: "Is this change likely better for users,
and why?" It does not answer: "Will this change increase revenue by 3.2%?"

### Why That's Still Valuable

Research validates this approach. The SimAB framework (March 2026) tested LLM-based
simulation against 47 real A/B experiments and achieved:
- **67% accuracy** overall in predicting the real-world winner
- **83% accuracy** on predictions the model flagged as high-confidence

For context: most teams shipping without testing are operating at ~50% accuracy (coin flip).
Even modest predictive power, delivered in 30 seconds and at zero cost, changes the calculus.

### Compared To Existing Options

| | Real A/B Test | UserTesting.com | GhostShip |
|---|---|---|---|
| Time | 2-4 weeks | 2-4 hours | 30 seconds |
| Cost per test | $0 (but traffic cost) | $50-200 | $0 |
| Frequency | Monthly | Occasional | Every PR |
| Measures behavior | Yes | Partially | No |
| Measures UX quality | Indirectly | Yes | Yes |
| Integrated in workflow | No | No | Yes (Slack, PR) |
| Scales to every change | No | No | Yes |

## Who This Is For

- **Product teams with AI coding tools** who can now produce variants faster than they can validate them
- **Growth teams** whose experiment backlog outruns their traffic
- **Startups** where every week of learning delay burns runway
- **Any team using Vercel** who wants signal on their preview before they ship
