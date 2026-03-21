# Track 8: Single-Page Evaluation Script (Persona Testing)

## Context

Before running full A/B comparisons, we need to validate that our personas produce useful, differentiated feedback. This track adds:
1. A single-page evaluation function in `evaluate.ts` (no comparison, just assess one page)
2. A new type `PageEvaluation` for single-page results
3. A CLI test script to evaluate any URL with all 5 personas

This lets us iterate on persona quality quickly: run the script, read the output, tune the prompts.

---

## Before You Start

1. Read `PLAN.md` — understand the project context
2. Read `PROBLEM_STATEMENT.md` — understand what persona feedback should look like
3. Read `progress.txt` — see current status
4. Read `src/lib/evaluate.ts` — understand the existing A/B evaluation function
5. Read `src/lib/personas.ts` — understand persona structure and types

---

## Skills to Use

- `.agents/skills/ai-sdk/SKILL.md` — Vercel AI SDK patterns for `generateText` + structured output
- `.agents/skills/full-output-enforcement/SKILL.md` — output quality

---

## Files to Create/Modify

### 1. Add `PageEvaluation` type to `src/lib/personas.ts`

```typescript
export interface PageEvaluation {
  personaId: string;
  personaName: string;
  personaEmoji: string;
  overallImpression: "positive" | "neutral" | "negative";
  score: number; // 1-10
  firstImpression: string; // What they notice in the first 3 seconds
  rationale: string; // 2-3 sentence assessment in their voice
  strengths: string[]; // What works well for this persona
  weaknesses: string[]; // What doesn't work / friction points
  suggestions: string[]; // What they'd change
}
```

### 2. Add `evaluatePage()` function to `src/lib/evaluate.ts`

```typescript
export async function evaluatePage(
  persona: Persona,
  pagePng: Buffer,
  pageUrl?: string
): Promise<PageEvaluation>
```

Implementation:
- Define a zod schema matching `PageEvaluation` (minus the persona metadata fields)
- System prompt should be different from the A/B version — this is a standalone UX audit:

```
You are simulating a real user visiting a web page for the first time.

Your persona:
- Name: {name}, Age: {age}
- Background: {background}
- Goals when visiting this page: {goals}
- What you pay attention to: {evaluationCriteria}
- Your browsing behavior: {behaviorPattern}

You are looking at a screenshot of a web page.
{pageUrl ? `The page URL is: ${pageUrl}` : ""}

Evaluate this page from your persona's perspective as if you just landed on it.
Be specific — reference actual visual elements you can see. Write your rationale
as 2-3 sentences in your character's authentic voice. Your first impression should
capture what you notice in the very first 3 seconds of viewing the page.
```

- Use `google("gemini-2.5-flash")` with structured output
- Return result merged with persona metadata fields

### 3. Create test script `scripts/evaluate-page.ts`

Usage:
```bash
npx tsx scripts/evaluate-page.ts <url>
npx tsx scripts/evaluate-page.ts https://vercel.com
npx tsx scripts/evaluate-page.ts https://stripe.com/pricing
```

The script should:
1. Accept a URL as a CLI argument (required)
2. Load env vars from `.env.local` using dotenv
3. Screenshot the URL using `captureScreenshot()`
4. Run all 5 personas in parallel using `evaluatePage()`
5. Print formatted results to stdout:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GhostShip Page Evaluation
URL: https://vercel.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛍️ Budget-Conscious Buyer (score: 7/10) — positive
First impression: "The pricing link is visible but..."
Rationale: "..."
✅ Strengths: ...
❌ Weaknesses: ...
💡 Suggestions: ...

💻 Power User / Developer (score: 9/10) — positive
...

(repeat for all 5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Average score: 7.4/10
Completed in 12.3s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

6. Print timing information (how long the whole evaluation took)
7. Exit cleanly

---

## Verification

```bash
# Test with a well-known page
npx tsx scripts/evaluate-page.ts https://vercel.com

# Expected:
# - Screenshot captured
# - All 5 personas return results
# - Each persona has differentiated feedback (not generic)
# - Completes in < 60s
# - Scores and impressions vary across personas (not all identical)
```

Key quality check: **the 5 personas should give meaningfully different feedback.** If they all say the same thing, the personas need tuning.

---

## After Completion

Update `progress.txt` — add a Track 8 section and mark tasks `[x]` with timestamps.

FILES YOU MAY CREATE:
- `scripts/evaluate-page.ts`

FILES YOU MAY MODIFY:
- `src/lib/personas.ts` (add PageEvaluation type)
- `src/lib/evaluate.ts` (add evaluatePage function)

FILES YOU MAY NOT TOUCH: anything else
