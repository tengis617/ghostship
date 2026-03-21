# Track 1: Types + Personas

## Parallel Execution Notice

**You are one of 4 agents running IN PARALLEL.** Other agents are simultaneously working on:
- Track 2: Screenshot Service → `src/lib/screenshot.ts`
- Track 3: Gemini Evaluation → `src/lib/evaluate.ts`
- Track 7: Web UI Shell → `src/app/page.tsx`, `src/components/report-card.tsx`

**DO NOT touch any files outside your ownership.** If you see files created by other agents, leave them alone.

---

## Before You Start

1. Read `PLAN.md` — understand the full project context, dependency graph, and where your track fits
2. Read `PROBLEM_STATEMENT.md` — understand the problem you're solving (this informs persona design)
3. Read `progress.txt` — see what's done and what's pending for your track

---

## Your Task

**Create:** `src/lib/personas.ts`

This file defines ALL shared types for the GhostShip project and the 5 synthetic user personas. Every other module in the project imports types from this file.

---

## Skills to Use

Read and follow guidance from these skills before writing code:
- `.agents/skills/ai-sdk/SKILL.md` — for Vercel AI SDK patterns (structured output types)
- `.agents/skills/full-output-enforcement/SKILL.md` — follow output quality guidelines

---

## Types to Define

```typescript
export interface Persona {
  id: string;
  name: string;
  emoji: string;
  age: number;
  background: string;
  goals: string;
  evaluationCriteria: string;
  behaviorPattern: string;
}

export interface PersonaResult {
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

export interface GhostshipReport {
  winner: "production" | "preview" | "inconclusive";
  confidence: number; // 0-100
  preferenceSplit: { production: number; preview: number };
  personas: PersonaResult[];
  summary: string;
  previewUrl: string;
  productionUrl: string;
}
```

---

## Personas to Define

Export as `export const personas: Persona[]`

Each persona's `goals`, `evaluationCriteria`, and `behaviorPattern` fields should be 2-3 rich sentences. These get injected directly into Gemini system prompts, so make them detailed and specific.

### 1. Budget-Conscious Buyer
- **id:** `"budget-buyer"`, **emoji:** `"🛍️"`, **age:** 34
- Mid-30s, compares pricing across competitors, cost-sensitive, reads every line of pricing pages
- Evaluates for: pricing clarity, value perception, hidden costs, trust signals
- Behavior: scrolls slowly, reads fine print, compares tiers methodically

### 2. Power User / Developer
- **id:** `"power-user"`, **emoji:** `"💻"`, **age:** 28
- Late-20s software engineer, technically literate, impatient, values efficiency
- Evaluates for: information density, CTA clarity, page load perception, no-nonsense layout
- Behavior: scans quickly, looks for the action button, annoyed by marketing fluff

### 3. Non-Technical Executive
- **id:** `"executive"`, **emoji:** `"💼"`, **age:** 52
- 50s, C-suite, evaluating tools for their team, limited time, delegates details
- Evaluates for: professional appearance, clarity of value proposition, trustworthiness, simplicity
- Behavior: spends <10 seconds, needs to "get it" immediately or bounces

### 4. First-Time Visitor
- **id:** `"first-timer"`, **emoji:** `"👀"`, **age:** 25
- Landed from a Google search, no brand awareness, comparing 3-4 options in tabs
- Evaluates for: first impression, ease of understanding, differentiation, onboarding friction
- Behavior: quick scan, looking for reasons to stay or leave

### 5. Accessibility-Focused User
- **id:** `"accessibility"`, **emoji:** `"♿"`, **age:** 40
- Uses screen magnification, sensitive to contrast, heading structure, keyboard nav cues
- Evaluates for: visual hierarchy, contrast ratios, logical heading order, CTA discoverability, text readability
- Behavior: relies on clear structure, struggles with cluttered layouts

---

## Verification

After creating the file:
```bash
pnpm typecheck
```
Expected: no errors related to personas.ts

---

## After Completion

Update `progress.txt` — mark all Track 1 tasks as `[x]` with timestamps.
