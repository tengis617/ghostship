# Track 4: Orchestrator

## Before You Start

1. Read `PLAN.md` — understand the full project context and dependency graph
2. Read `PROBLEM_STATEMENT.md` — understand the "synthetic pre-filtering" approach
3. Read `progress.txt` — see what's done (Batch 1 complete) and what's pending

---

## Your Task

**Create:** `src/lib/agent.ts`

This is the orchestrator that wires together the 3 Batch 1 modules (personas, screenshots, evaluation) into a single `runGhostship()` pipeline.

---

## Skills to Use

Read and follow guidance from these skills before writing code:
- `.agents/skills/ai-sdk/SKILL.md` — Vercel AI SDK patterns
- `.agents/skills/full-output-enforcement/SKILL.md` — output quality guidelines

---

## Dependencies (already built in Batch 1)

### `src/lib/personas.ts` — Types + Personas
```typescript
export interface Persona { id, name, emoji, age, background, goals, evaluationCriteria, behaviorPattern }
export interface PersonaResult { personaId, personaName, personaEmoji, preference, confidence, rationale, productionPros, productionCons, previewPros, previewCons }
export interface GhostshipReport { winner, confidence, preferenceSplit, personas, summary, previewUrl, productionUrl }
export const personas: Persona[] // 5 personas
```

### `src/lib/screenshot.ts` — Screenshot Service
```typescript
export async function captureScreenshot(url: string): Promise<Buffer>
export function parseVercelPreviewUrl(previewUrl: string): { previewUrl: string; productionUrl: string | null; pagePath: string }
```

### `src/lib/evaluate.ts` — Gemini Evaluation
```typescript
export async function evaluateAsPersona(persona: Persona, productionPng: Buffer, previewPng: Buffer): Promise<PersonaResult>
```

---

## Function to Implement

### `runGhostship(previewUrl: string, productionUrl?: string): Promise<GhostshipReport>`

Steps:

1. **Parse/derive URLs:**
   - Call `parseVercelPreviewUrl(previewUrl)` to get `{ productionUrl, pagePath }`
   - If the caller passed an explicit `productionUrl`, use that instead of the auto-detected one
   - If no production URL (auto-detect failed and none provided), throw a clear error

2. **Capture both screenshots in parallel:**
   ```typescript
   const [previewPng, productionPng] = await Promise.all([
     captureScreenshot(previewUrl),
     captureScreenshot(finalProductionUrl),
   ]);
   ```

3. **Run 5 persona evaluations in parallel:**
   ```typescript
   const results = await Promise.all(
     personas.map(persona => evaluateAsPersona(persona, productionPng, previewPng))
   );
   ```

4. **Aggregate results:**
   - Count votes: how many prefer "production" vs "preview"
   - Determine winner:
     - If 4-1 or 5-0 split → clear winner
     - If 3-2 split → winner but lower confidence
     - Could also be "inconclusive" if 3-2 with mixed confidence levels
   - Compute confidence score (0-100):
     - Base on vote margin + individual persona confidence levels
     - 5-0 with all "high" confidence → 95-100
     - 3-2 with mixed confidence → 40-60
   - Generate a summary string (2-3 sentences):
     - Which variant won and by what margin
     - Key themes from the persona rationales
     - Any notable dissenting opinions

5. **Return GhostshipReport:**
   ```typescript
   {
     winner,
     confidence,
     preferenceSplit: { production: productionVotes, preview: previewVotes },
     personas: results,
     summary,
     previewUrl,
     productionUrl: finalProductionUrl,
   }
   ```

---

## Verification

After creating the file, run this end-to-end test:
```bash
npx tsx -e "
import { runGhostship } from './src/lib/agent';
async function test() {
  console.log('Starting GhostShip pipeline...');
  const start = Date.now();
  const report = await runGhostship('https://vercel.com', 'https://vercel.com');
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('Completed in', elapsed, 'seconds');
  console.log(JSON.stringify(report, null, 2));
}
test().catch(console.error);
"
```

Expected:
- Completes in <60 seconds (ideally <45s)
- Prints valid GhostshipReport JSON with 5 persona results
- Has a winner, confidence score, preference split, and summary

Also run: `pnpm typecheck`

---

## After Completion

Update `progress.txt` — mark all Track 4 tasks as `[x]` with timestamps.

FILES YOU MAY CREATE: `src/lib/agent.ts` (only this file)
FILES YOU MAY NOT TOUCH: anything else
