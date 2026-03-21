# Track 12: Web CTA — Paste URL, Generate Personas, Run Analysis

## Context

The landing page currently has no interactive functionality. This track adds the "money shot" CTA:

1. User pastes any URL
2. GhostShip screenshots the page
3. Gemini analyzes the page and **generates custom personas** relevant to that specific page (not hardcoded)
4. Each generated persona evaluates the page
5. Results stream to the UI in real-time

This is more demo-worthy than the hardcoded 5 personas because it shows GhostShip adapts to any product/page.

**Example:** For a cooking recipe site, it might generate "Home Cook", "Professional Chef", "Food Blogger", "Dietary-Restricted User", "Mobile Commuter" — not "Budget Buyer" and "Executive".

---

## Before You Start

1. Read `PLAN.md` and `PROBLEM_STATEMENT.md`
2. Read `src/lib/evaluate.ts` — current evaluation approach
3. Read `src/lib/personas.ts` — Persona type definition
4. Read `src/app/page.tsx` — current landing page
5. Read AI SDK docs on streaming and structured output:
   - `.agents/skills/ai-sdk/SKILL.md`
   - `node_modules/ai/docs/` — search for `streamText`, `streamObject`, `useChat`
6. Read design skills:
   - `.agents/skills/high-end-visual-design/SKILL.md`
   - `.agents/skills/design-taste-frontend/SKILL.md`

---

## Architecture

### Two-Step Pipeline

**Step 1: Generate Personas (fast, ~3-5s)**
```
Screenshot → Gemini analyzes page → generates 5 relevant personas
```

**Step 2: Evaluate with Generated Personas (parallel, ~15-20s)**
```
For each generated persona (in parallel):
  Screenshot + persona → Gemini evaluates → PageEvaluation result
```

### Streaming UX
The user should see progress as it happens:
1. "Capturing screenshot..." → screenshot thumbnail appears
2. "Generating personas..." → persona names/emojis appear one by one
3. "Deploying phantom users..." → evaluation results stream in per persona

---

## Dependencies to Install

```bash
pnpm add @ai-sdk/react
```

This gives us `useChat` or `useObject` hooks for streaming from server to client.

---

## Files to Create/Modify

### 1. `src/lib/generate-personas.ts` (CREATE)

New function that generates personas tailored to a specific page:

```typescript
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import type { Persona } from "./personas";

const generatedPersonaSchema = z.object({
  personas: z.array(z.object({
    id: z.string(),
    name: z.string(),
    emoji: z.string(),
    age: z.number(),
    background: z.string(),
    goals: z.string(),
    evaluationCriteria: z.string(),
    behaviorPattern: z.string(),
  })).length(5),
});

export async function generatePersonasForPage(
  pagePng: Buffer,
  pageUrl?: string
): Promise<Persona[]>
```

System prompt:
```
You are an expert UX researcher. Given a screenshot of a web page, generate 5 diverse
user personas who would realistically visit this page. Each persona should represent
a different user segment with distinct goals, behaviors, and evaluation criteria.

Make the personas specific to this page's content and purpose — not generic.
For example, a cooking recipe site should have food-related personas, not
generic "budget buyer" or "executive" personas.

Include diversity in: age, technical literacy, goals, patience level, and device usage.
Each persona should have a single relevant emoji.
```

### 2. `src/app/api/evaluate/route.ts` (CREATE)

Server-side API route that handles the full pipeline:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { captureScreenshot } from "@/lib/screenshot";
import { generatePersonasForPage } from "@/lib/generate-personas";
import { evaluatePage } from "@/lib/evaluate";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // 1. Screenshot
  const png = await captureScreenshot(url);

  // 2. Generate personas
  const personas = await generatePersonasForPage(png, url);

  // 3. Evaluate with all personas in parallel
  const results = await Promise.all(
    personas.map(persona => evaluatePage(persona, png, url))
  );

  // 4. Return results
  return NextResponse.json({
    url,
    personas,
    evaluations: results,
    averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
  });
}
```

**Stretch:** Use streaming (SSE or streamObject) to stream results as each persona completes instead of waiting for all 5.

### 3. `src/app/page.tsx` (MODIFY)

Add a CTA section below the current hero. Keep the existing hero intact.

**New section:**
- Input field: "Paste any URL" with placeholder
- Submit button: "Deploy Phantom Users"
- Results area:
  - Screenshot thumbnail
  - Generated persona cards appearing as they're created
  - Evaluation results streaming in per persona
  - Average score

**State flow:**
```typescript
type Phase = "idle" | "screenshotting" | "generating-personas" | "evaluating" | "done";

const [phase, setPhase] = useState<Phase>("idle");
const [personas, setPersonas] = useState<Persona[]>([]);
const [results, setResults] = useState<PageEvaluation[]>([]);
```

**Loading states per phase:**
- `screenshotting`: "Capturing screenshot..." with spinner
- `generating-personas`: "Analyzing page... generating personas" with persona cards appearing
- `evaluating`: "Deploying 5 phantom users..." with results appearing one by one
- `done`: Full report with average score

### 4. `src/components/report-card.tsx` (CREATE)

Reusable report card for displaying single-page evaluation results:

```typescript
interface ReportCardProps {
  url: string;
  personas: Persona[];
  evaluations: PageEvaluation[];
  averageScore: number;
}
```

- Header: URL + average score badge
- Per-persona cards: emoji + name + score + impression + strengths/weaknesses
- Dark theme matching landing page

---

## Key Design Decisions

1. **Generated personas, not hardcoded** — the "wow" factor. AI creates personas specific to the page.
2. **Single-page evaluation** — uses `evaluatePage()` from Track 8 (already built), not A/B comparison.
3. **Streaming UX** — results appear as they complete, not all at once after 20s of nothing.
4. **CTA below hero** — keeps the existing hero section untouched, adds functionality below.

---

## Verification

```bash
# 1. API works
curl -X POST localhost:3000/api/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://stripe.com/pricing"}' | head -100
# Expected: JSON with generated personas + evaluations

# 2. Web UI works
# Open localhost:3000 → scroll to CTA → paste URL → click button
# Expected: personas generate, evaluations stream in, report card renders

# 3. Typecheck
pnpm typecheck
```

---

## After Completion

Update `progress.txt` — add Track 12 section and mark tasks `[x]` with timestamps.

FILES YOU MAY CREATE:
- `src/lib/generate-personas.ts`
- `src/app/api/evaluate/route.ts`
- `src/components/report-card.tsx`

FILES YOU MAY MODIFY:
- `src/app/page.tsx` (add CTA section below hero)

FILES YOU MAY NOT TOUCH: `src/lib/bot.tsx`, `src/lib/agent.ts`, `src/lib/adapters.ts`
