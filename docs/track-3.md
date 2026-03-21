# Track 3: Gemini Multimodal Evaluation

## Parallel Execution Notice

**You are one of 4 agents running IN PARALLEL.** Other agents are simultaneously working on:
- Track 1: Types + Personas → `src/lib/personas.ts`
- Track 2: Screenshot Service → `src/lib/screenshot.ts`
- Track 7: Web UI Shell → `src/app/page.tsx`, `src/components/report-card.tsx`

**DO NOT touch any files outside your ownership.** If you see files created by other agents, leave them alone.

**DEPENDENCY NOTE:** You import types from `src/lib/personas.ts` (Track 1). The type definitions are provided below so you can work in parallel. If Track 1 finishes first and the types differ slightly, you may need minor adjustments — but the contract below is agreed upon.

---

## Before You Start

1. Read `PLAN.md` — understand the full project context, dependency graph, and where your track fits
2. Read `PROBLEM_STATEMENT.md` — understand the "synthetic pre-filtering" approach and what the evaluation is trying to achieve
3. Read `progress.txt` — see what's done and what's pending for your track
4. Read `.agents/skills/ai-sdk/SKILL.md` — **CRITICAL**: follow Vercel AI SDK patterns for structured output with generateObject()

---

## Your Task

**Create:** `src/lib/evaluate.ts`

This module takes a persona definition and two PNG screenshots (production + preview), calls Gemini's multimodal API, and returns a structured evaluation from that persona's perspective.

---

## Skills to Use

Read and follow guidance from these skills before writing code:
- `.agents/skills/ai-sdk/SKILL.md` — **CRITICAL**: Vercel AI SDK patterns for `generateObject()`, structured output, image handling
- `.agents/skills/full-output-enforcement/SKILL.md` — follow output quality guidelines

---

## Dependencies (already installed)

- `ai` (Vercel AI SDK) — for `generateObject()`
- `@ai-sdk/google` — Gemini provider
- `zod` — schema definition for structured output

**Verified working model:** `gemini-2.5-flash` (gemini-2.0-flash is DEPRECATED, do not use it)

**Env var:** `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env.local` (Vercel AI SDK auto-reads it)

---

## Types (from src/lib/personas.ts)

```typescript
interface Persona {
  id: string;
  name: string;
  emoji: string;
  age: number;
  background: string;
  goals: string;
  evaluationCriteria: string;
  behaviorPattern: string;
}

interface PersonaResult {
  personaId: string;
  personaName: string;
  personaEmoji: string;
  preference: "production" | "preview";
  confidence: "high" | "medium" | "low";
  rationale: string;
  productionPros: string[];
  productionCons: string[];
  previewPros: string[];
  previewCons: string[];
}
```

---

## Function to Implement

### `evaluateAsPersona(persona: Persona, productionPng: Buffer, previewPng: Buffer): Promise<PersonaResult>`

Implementation steps:

1. **Imports:**
   ```typescript
   import { google } from "@ai-sdk/google";
   import { generateObject } from "ai";
   import { z } from "zod";
   import type { Persona, PersonaResult } from "./personas";
   ```

2. **Define zod schema** for the Gemini structured output:
   ```typescript
   const personaResultSchema = z.object({
     preference: z.enum(["production", "preview"]),
     confidence: z.enum(["high", "medium", "low"]),
     rationale: z.string().describe("One clear sentence from the persona's perspective explaining their preference"),
     productionPros: z.array(z.string()).describe("Specific strengths of the production version"),
     productionCons: z.array(z.string()).describe("Specific weaknesses of the production version"),
     previewPros: z.array(z.string()).describe("Specific strengths of the preview version"),
     previewCons: z.array(z.string()).describe("Specific weaknesses of the preview version"),
   });
   ```

3. **Build system prompt** injecting persona details:
   ```
   You are simulating a real user evaluating two versions of a web page.

   Your persona:
   - Name: {name}, Age: {age}
   - Background: {background}
   - Goals when visiting this page: {goals}
   - What you pay attention to: {evaluationCriteria}
   - Your browsing behavior: {behaviorPattern}

   You are looking at two screenshots of the same page:
   - Image 1: The current PRODUCTION version (what users see today)
   - Image 2: A proposed PREVIEW version (from a pull request)

   Evaluate both versions from your persona's perspective. Be specific about
   what you notice — reference actual visual elements you can see in the
   screenshots. Your rationale should be one clear sentence written in your
   character's voice.
   ```

4. **Call generateObject():**
   - `model: google("gemini-2.5-flash")`
   - `schema: personaResultSchema`
   - `messages` array with:
     - System message with the persona prompt
     - User message with content array containing both images:
       ```typescript
       { type: "image", image: productionPng }
       ```
       and
       ```typescript
       { type: "image", image: previewPng }
       ```
       and a text part: "Please evaluate these two page versions from your perspective."

5. **Return** the result merged with persona metadata:
   ```typescript
   return {
     ...result.object,
     personaId: persona.id,
     personaName: persona.name,
     personaEmoji: persona.emoji,
   };
   ```

---

## Verification

After creating the file:
```bash
pnpm typecheck
```
Expected: no errors related to evaluate.ts

(Full runtime test with real screenshots will happen in Batch 2 when the orchestrator is built)

---

## After Completion

Update `progress.txt` — mark all Track 3 tasks as `[x]` with timestamps.
