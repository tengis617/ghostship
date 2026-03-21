# Track 11: Interactive Persona Agents (Advanced / Stretch)

## Context

Current GhostShip personas evaluate a **static screenshot**. This track upgrades each persona into a **browsing agent** that can navigate the page, click elements, scroll, fill forms, and take screenshots along the way — providing behavioral feedback, not just visual feedback.

This transforms GhostShip from "AI focus group looking at mockups" to "AI users actually using your product."

### Why This Matters
- Static screenshot evaluation catches visual/UX issues
- Interactive evaluation catches **behavioral issues**: broken flows, confusing navigation, dead-end pages, form friction
- The hackathon theme is "agents that browse, reason, and act" — this is exactly that
- Demo impact: watching an AI persona navigate a page in real-time is far more compelling than a JSON report

### Tools

- **agent-browser** (https://github.com/vercel-labs/agent-browser) — headless browser agent that can navigate, click, type, screenshot. Designed for AI agent use.
- **bash-tool** (https://github.com/vercel-labs/bash-tool) — lets AI agents execute shell commands. Could be used for running browser automation scripts.

---

## Before You Start

1. Read `PLAN.md` and `PROBLEM_STATEMENT.md`
2. Read current `src/lib/evaluate.ts` — understand the static evaluation approach
3. Read `src/lib/personas.ts` — understand persona structure
4. Research agent-browser API: https://github.com/vercel-labs/agent-browser
5. Read `.agents/skills/agent-browser/SKILL.md` — browser automation patterns
6. Read `.agents/skills/ai-sdk/SKILL.md` — Vercel AI SDK tool calling patterns

---

## Architecture

### Current Flow (Static)
```
URL → Screenshot → Gemini evaluates screenshot → JSON result
```

### New Flow (Interactive)
```
URL → Agent-browser session per persona → Persona navigates as Gemini agent →
  Takes screenshots at key moments → Gemini reasons about what it sees →
  Produces behavioral evaluation with evidence screenshots
```

### Key Design Decision: Agent-per-Persona

Each persona becomes a Gemini agent with:
- **System prompt**: persona background, goals, behavior pattern (same as today)
- **Tools**: browser navigation (click, scroll, type, screenshot, read page text)
- **Goal**: "Visit this page and try to accomplish your goal. Document what you experience."

The agent loop:
1. Navigate to URL
2. Take initial screenshot, assess first impression
3. Attempt to accomplish persona goal (e.g., "find pricing", "sign up", "compare plans")
4. Take screenshots at decision points
5. Report: what worked, what didn't, where they got stuck, how long it took

---

## New Types

Add to `src/lib/personas.ts`:

```typescript
export interface BrowserAction {
  action: string;          // "click", "scroll", "type", "navigate", "screenshot"
  target?: string;         // what was interacted with
  reasoning: string;       // why the persona took this action
  screenshotUrl?: string;  // screenshot at this point (base64 or path)
}

export interface InteractiveEvaluation {
  personaId: string;
  personaName: string;
  personaEmoji: string;
  goalCompleted: boolean;
  timeSpentSeconds: number;
  actionsCount: number;
  firstImpression: string;
  journey: BrowserAction[];     // ordered list of actions taken
  frustrationPoints: string[];  // where they got stuck or confused
  positiveExperiences: string[];
  overallScore: number;         // 1-10
  summary: string;              // 2-3 sentence assessment
}
```

---

## Implementation Approach

### Option A: agent-browser as a Tool (Recommended)

Use Vercel AI SDK's tool calling with agent-browser as the browser interface:

```typescript
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
// agent-browser provides browser control

const browserTools = {
  navigate: tool({
    description: "Navigate to a URL",
    parameters: z.object({ url: z.string() }),
    execute: async ({ url }) => { /* agent-browser navigate */ },
  }),
  click: tool({
    description: "Click an element on the page",
    parameters: z.object({ selector: z.string().describe("CSS selector or text description") }),
    execute: async ({ selector }) => { /* agent-browser click */ },
  }),
  screenshot: tool({
    description: "Take a screenshot of the current page",
    parameters: z.object({}),
    execute: async () => { /* agent-browser screenshot, return base64 */ },
  }),
  readPage: tool({
    description: "Read the text content of the current page",
    parameters: z.object({}),
    execute: async () => { /* agent-browser get page text */ },
  }),
  scroll: tool({
    description: "Scroll the page",
    parameters: z.object({ direction: z.enum(["up", "down"]), amount: z.number() }),
    execute: async ({ direction, amount }) => { /* agent-browser scroll */ },
  }),
  type: tool({
    description: "Type text into a form field",
    parameters: z.object({ selector: z.string(), text: z.string() }),
    execute: async ({ selector, text }) => { /* agent-browser type */ },
  }),
};

// Each persona runs as a tool-calling agent loop
const result = await generateText({
  model: google("gemini-2.5-flash"),
  system: personaSystemPrompt,
  prompt: `Visit ${url} and try to accomplish your goal: "${persona.goals}".
           Navigate the page as your persona would. Take screenshots at key moments.
           Stop after 60 seconds or when you've completed your goal.`,
  tools: browserTools,
  maxSteps: 15,  // limit agent loops
});
```

### Option B: agent-browser CLI via bash-tool

Use bash-tool to execute agent-browser commands:

```typescript
import { bashTool } from "@anthropic-ai/bash-tool";

// Agent can run: npx agent-browser navigate <url>
// Agent can run: npx agent-browser click <selector>
// Agent can run: npx agent-browser screenshot
```

This is simpler but less integrated.

---

## New File

### `src/lib/evaluate-interactive.ts`

```typescript
export async function evaluateInteractively(
  persona: Persona,
  url: string,
  maxSteps?: number
): Promise<InteractiveEvaluation>
```

- Starts an agent-browser session
- Configures Gemini as a tool-calling agent with browser tools
- Persona system prompt shapes browsing behavior
- Captures journey (actions + screenshots)
- Returns structured InteractiveEvaluation

### `scripts/evaluate-interactive.ts`

CLI test script:
```bash
npx tsx scripts/evaluate-interactive.ts https://vercel.com/pricing
```

Outputs each persona's journey with action-by-action narration.

---

## Integration with Existing Pipeline

Add a mode flag to `runGhostship()`:

```typescript
type EvaluationMode = "screenshot" | "interactive";

export async function runGhostship(
  previewUrl: string,
  productionUrl?: string,
  mode: EvaluationMode = "screenshot"
): Promise<GhostshipReport>
```

- `screenshot` mode: current behavior (fast, ~30s)
- `interactive` mode: agent-browser personas (slower, ~2-5min, much richer)

Slack command could support: `@ghostship https://url.com --deep` for interactive mode.

---

## Verification

```bash
# Test single persona interactive evaluation
npx tsx scripts/evaluate-interactive.ts https://vercel.com/pricing

# Expected:
# - Persona navigates the page (visible in output)
# - Takes 5-15 actions (navigate, click, scroll, screenshot)
# - Produces InteractiveEvaluation with journey log
# - Each persona has a different journey based on their goals
# - Completes in < 2 minutes per persona
```

---

## Risk & Complexity

| Factor | Assessment |
|--------|-----------|
| agent-browser maturity | New library, may have rough edges |
| Gemini tool calling reliability | Generally good with 2.5-flash |
| Latency | ~1-2 min per persona vs ~4s for screenshot mode |
| Vercel serverless timeout | Default 60s may be too short — may need pro plan or run locally |
| Demo impact | Extremely high — watching AI personas browse is compelling |

---

## After Completion

Update `progress.txt` — add Track 11 section and mark tasks `[x]` with timestamps.

FILES YOU MAY CREATE:
- `src/lib/evaluate-interactive.ts`
- `scripts/evaluate-interactive.ts`

FILES YOU MAY MODIFY:
- `src/lib/personas.ts` (add InteractiveEvaluation types)
- `src/lib/agent.ts` (add mode flag)
- `src/lib/bot.tsx` (add --deep flag support)
