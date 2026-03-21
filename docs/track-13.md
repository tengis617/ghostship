# Track 13: Single-URL Page Review in Orchestrator + Bot

## Context

The orchestrator (`agent.ts`) currently only supports A/B comparison (two URLs). The single-page evaluation (`evaluatePage()`) exists in `evaluate.ts` and works via the CLI script, but it's not wired into the orchestrator or the Slack/GitHub bot.

This track adds:
1. A `reviewPage(url)` function to `agent.ts` that screenshots a URL and runs all 5 personas via `evaluatePage()`
2. A new return type `PageReviewReport` that aggregates single-page evaluations
3. Bot handler logic to detect 1 URL vs 2 URLs vs PR context and route accordingly

### After this track, the bot supports three modes:

| Trigger | Mode | Function |
|---------|------|----------|
| `@ghostship https://example.com` | **Page review** (1 URL) | `reviewPage()` |
| `@ghostship https://preview.vercel.app https://prod.vercel.app` | **A/B compare** (2 URLs) | `runGhostship()` |
| `@ghostship` on a GitHub PR (no URL) | **PR review** (auto-detect) | `runGhostshipForPR()` |

---

## Before You Start

1. Read `src/lib/agent.ts` — understand `runGhostship()` and `runGhostshipForPR()`
2. Read `src/lib/evaluate.ts` — understand `evaluatePage()` (single-page, already built)
3. Read `src/lib/personas.ts` — understand `PageEvaluation` type
4. Read `src/lib/bot.tsx` — understand current mention handler and `formatReportCard()`
5. Read `scripts/evaluate-page.ts` — see how single-page evaluation is already used in CLI
6. Read `.agents/skills/ai-sdk/SKILL.md`
7. Read `.agents/skills/chat-sdk/SKILL.md`

---

## Files to Modify

### 1. `src/lib/personas.ts` — Add `PageReviewReport` type

```typescript
export interface PageReviewReport {
  url: string;
  evaluations: PageEvaluation[];
  averageScore: number;
  summary: string;
}
```

### 2. `src/lib/agent.ts` — Add `reviewPage()` function

```typescript
import { evaluatePage } from "./evaluate";
import type { PageReviewReport } from "./personas";

export async function reviewPage(url: string): Promise<PageReviewReport> {
  // 1. Screenshot the URL
  const png = await captureScreenshot(url);

  // 2. Run all 5 personas in parallel via evaluatePage()
  const evaluations = await Promise.all(
    personas.map(persona => evaluatePage(persona, png, url))
  );

  // 3. Compute average score
  const averageScore = evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length;

  // 4. Generate summary
  //    - Average score
  //    - Most common impression (positive/neutral/negative)
  //    - Key strengths mentioned by multiple personas
  //    - Key weaknesses mentioned by multiple personas
  const summary = generatePageSummary(evaluations, averageScore);

  return { url, evaluations, averageScore, summary };
}

function generatePageSummary(evaluations: PageEvaluation[], avgScore: number): string {
  const impressions = evaluations.map(e => e.overallImpression);
  const positiveCount = impressions.filter(i => i === "positive").length;
  const negativeCount = impressions.filter(i => i === "negative").length;

  const verdict = positiveCount >= 4 ? "Strong positive reception"
    : positiveCount >= 3 ? "Generally positive"
    : negativeCount >= 3 ? "Significant concerns"
    : "Mixed reception";

  // Pick a standout rationale
  const topPersona = evaluations.reduce((best, e) =>
    Math.abs(e.score - avgScore) > Math.abs(best.score - avgScore) ? e : best
  );

  return `${verdict} (avg ${avgScore.toFixed(1)}/10). ${topPersona.personaEmoji} ${topPersona.personaName}: "${topPersona.rationale}"`;
}
```

### 3. `src/lib/bot.tsx` — Update mention handler for 3 modes

Current handler detects a URL and calls `runGhostship()`. Update to:

```typescript
bot.onNewMention(async (thread, message) => {
  await thread.subscribe();

  const urls = message.text.match(/https?:\/\/[^\s>]+/gi) || [];

  if (urls.length === 0) {
    // No URL — check if GitHub PR context
    const prContext = parseGitHubThreadId(thread.id);
    if (prContext) {
      // PR review mode
      await thread.startTyping("Boarding your PR... analyzing changed pages");
      const report = await runGhostshipForPR(prContext);
      await thread.post(formatReportCard(report));
      return;
    }
    // No URL, no PR context — show help
    await thread.post(helpCard());
    return;
  }

  if (urls.length === 1) {
    // Single URL — page review mode
    const url = urls[0];

    // Check if it's a Vercel preview URL (auto-detect production for comparison)
    const parsed = parseVercelPreviewUrl(url);
    if (parsed.productionUrl) {
      // It's a Vercel preview — do A/B comparison
      await thread.startTyping("Boarding your preview... deploying 5 phantom users");
      const report = await runGhostship(url, parsed.productionUrl);
      await thread.post(formatReportCard(report));
    } else {
      // Not a Vercel preview — do single page review
      await thread.startTyping("Reviewing page... deploying 5 phantom users");
      const review = await reviewPage(url);
      await thread.post(formatPageReview(review));
    }
    return;
  }

  if (urls.length >= 2) {
    // Two URLs — explicit A/B comparison
    await thread.startTyping("Comparing pages... deploying 5 phantom users");
    const report = await runGhostship(urls[0], urls[1]);
    await thread.post(formatReportCard(report));
    return;
  }
});
```

### 4. `src/lib/bot.tsx` — Add `formatPageReview()` function

New Card format for single-page reviews (different from comparison report card):

```tsx
function formatPageReview(review: PageReviewReport) {
  return (
    <Card title={`👻 GhostShip Page Review`}>
      <Text>**{review.url}** · Average: {review.averageScore.toFixed(1)}/10</Text>
      <Divider />
      {review.evaluations.map((eval, i) => (
        <Section key={i}>
          <Text>
            {eval.personaEmoji} **{eval.personaName}** — {eval.score}/10 ({eval.overallImpression})
            _{eval.firstImpression}_
            {eval.rationale}
          </Text>
        </Section>
      ))}
      <Divider />
      <Section>
        <Text>**Summary:** {review.summary}</Text>
      </Section>
    </Card>
  );
}
```

---

## Routing Logic Summary

```
@ghostship (no URL)
  ├── GitHub PR thread? → runGhostshipForPR() → comparison report card
  └── Otherwise → show help message

@ghostship <1 URL>
  ├── Vercel preview URL? → runGhostship(preview, auto-detected prod) → comparison report card
  └── Any other URL → reviewPage(url) → single page review card

@ghostship <2 URLs>
  └── runGhostship(url1, url2) → comparison report card
```

---

## Verification

### Single page review via Slack:
```
@ghostship https://stripe.com/pricing
```
Expected: page review card with 5 persona scores, strengths/weaknesses, average score

### A/B comparison (Vercel preview):
```
@ghostship https://ghostship-git-pricing-v2-tengis-io.vercel.app/pricing
```
Expected: comparison report card (auto-detects production URL)

### Explicit two-URL comparison:
```
@ghostship https://stripe.com/pricing https://vercel.com/pricing
```
Expected: comparison report card

### CLI verification:
```bash
npx tsx scripts/evaluate-page.ts https://stripe.com/pricing
```
Expected: still works as before

### Typecheck:
```bash
pnpm typecheck
```

---

## After Completion

Update `progress.txt` — add Track 13 section and mark tasks `[x]` with timestamps.

FILES YOU MAY CREATE: none
FILES YOU MAY MODIFY:
- `src/lib/personas.ts` (add PageReviewReport type)
- `src/lib/agent.ts` (add reviewPage function)
- `src/lib/bot.tsx` (update mention handler routing, add formatPageReview)
