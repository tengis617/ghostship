# Track 7: Web UI Shell

## Parallel Execution Notice

**You are one of 4 agents running IN PARALLEL.** Other agents are simultaneously working on:
- Track 1: Types + Personas → `src/lib/personas.ts`
- Track 2: Screenshot Service → `src/lib/screenshot.ts`
- Track 3: Gemini Evaluation → `src/lib/evaluate.ts`

**DO NOT touch any files outside your ownership.** If you see files created by other agents, leave them alone.

---

## Before You Start

1. Read `PLAN.md` — understand the full project context, dependency graph, and where your track fits
2. Read `PROBLEM_STATEMENT.md` — understand the product positioning ("Phantom users for every pull request", "Lighthouse for UX")
3. Read `progress.txt` — see what's done and what's pending for your track

---

## Your Task

**Modify:** `src/app/page.tsx` (REPLACE existing content entirely)
**Create:** `src/components/report-card.tsx`

Build the web interface for GhostShip — a landing page with URL input form and a report card component that displays evaluation results.

---

## Skills to Use

Read and follow guidance from these skills **BEFORE writing any code**:
- `.agents/skills/high-end-visual-design/SKILL.md` — **CRITICAL**: follow these rules for premium visual design. This is a Vercel hackathon — design quality is a judging criterion.
- `.agents/skills/design-taste-frontend/SKILL.md` — **CRITICAL**: UI/UX engineering guidelines, avoid common LLM design biases
- `.agents/skills/web-design-guidelines/SKILL.md` — web interface best practices
- `.agents/skills/vercel-react-best-practices/SKILL.md` — Next.js/React patterns
- `.agents/skills/full-output-enforcement/SKILL.md` — follow output quality guidelines

---

## Types (for the report card)

Define these locally in your components (do NOT import from src/lib/ — that file is being created by another agent):

```typescript
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

interface GhostshipReport {
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

## File 1: `src/app/page.tsx` (REPLACE existing)

Requirements:
- `"use client"` directive at top
- **Dark theme** — bg-neutral-950 or similar dark background, light text
- Must include `src/app/layout.tsx` — check if it already has a layout. If so, only replace page.tsx content.

### Hero Section
- Title: **"ghostship"** (lowercase, bold, large)
- Subtitle: **"Phantom users for every pull request."**
- One-liner: *"Every Vercel preview is already an A/B test. It just has zero users."*

### Input Form
- **Preview URL** field (required) — placeholder: `"https://my-app-git-feature.vercel.app/pricing"`
- **Production URL** field (optional) — placeholder: `"https://my-app.vercel.app/pricing (auto-detected if empty)"`
- **"Deploy Phantom Users"** submit button — styled, prominent, with ghost/ship aesthetic

### State Management
```typescript
const [previewUrl, setPreviewUrl] = useState("");
const [productionUrl, setProductionUrl] = useState("");
const [loading, setLoading] = useState(false);
const [report, setReport] = useState<GhostshipReport | null>(null);
const [error, setError] = useState<string | null>(null);
```

### Submit Handler
- POST to `/api/evaluate` with `{ previewUrl, productionUrl: productionUrl || undefined }`
- While loading: show animated loading state ("Boarding your preview... deploying 5 phantom users")
- On success: render `<ReportCard report={result} />`
- On error: show error message

### Design Notes
- Clean, polished — this is a **Vercel hackathon**, design quality is a judging criterion
- Responsive (desktop + mobile)
- No external UI libraries — just Tailwind utility classes
- Ghost/phantom aesthetic: dark backgrounds, subtle glows, clean monospace-accented typography

---

## File 2: `src/components/report-card.tsx`

Requirements:
- `"use client"` directive
- Props: `{ report: GhostshipReport }`

### Layout

**Header Bar:**
- Winner announcement: "Preview wins 4-1" or "Production wins 3-2" or "Inconclusive"
- Confidence percentage badge (color-coded: green high, yellow medium, red low)
- Vote split visualization

**Persona Cards (grid or stacked list):**
Each card shows:
- Persona emoji + name (e.g., "🛍️ Budget-Conscious Buyer")
- Preference badge — "Prefers Preview" (green) or "Prefers Production" (amber)
- Confidence level indicator
- Rationale text in italic quote style
- Pros/cons (can be collapsed or shown inline)

**Summary Section:**
- `report.summary` text
- URLs compared (preview vs production)

### Design Notes
- Dark theme consistent with page.tsx
- The report card is the **demo money shot** — make it visually striking
- Color scheme:
  - Green/emerald for "preview wins"
  - Amber/orange for "production wins"
  - Gray for "inconclusive"
- Subtle animations or transitions welcome (fade-in on load)

---

## Verification

After creating both files:
```bash
pnpm typecheck
```

Then confirm visually:
- `localhost:3000` shows the GhostShip page with dark theme and input form
- No console errors in browser

---

## After Completion

Update `progress.txt` — mark all Track 7 tasks as `[x]` with timestamps.
