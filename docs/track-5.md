# Track 5: Bot Logic (Slack Integration)

## Before You Start

1. Read `PLAN.md` — understand the full project context
2. Read `PROBLEM_STATEMENT.md` — understand what GhostShip does and the pitch
3. Read `progress.txt` — see what's done and what's pending
4. Read `src/lib/bot.tsx` — understand the existing Chat SDK bot structure
5. Read `src/lib/agent.ts` — understand the `runGhostship()` function you'll be calling

---

## Your Task

**Modify:** `src/lib/bot.tsx`

Replace the example `onNewMention` handler with GhostShip logic: when someone @mentions the bot with a URL, run the GhostShip pipeline and post a report card to the Slack thread.

---

## Skills to Use

Read and follow guidance from these skills before writing code:
- `.agents/skills/chat-sdk/SKILL.md` — **CRITICAL**: Chat SDK patterns for bot handlers, Cards, posting messages
- `.agents/skills/ai-sdk/SKILL.md` — Vercel AI SDK patterns
- `.agents/skills/full-output-enforcement/SKILL.md` — output quality guidelines

---

## Existing Bot Structure

The bot is already wired up in `src/lib/bot.tsx`:
- Uses `/** @jsxImportSource chat */` for JSX cards
- `Chat` instance created with adapters and state
- `bot.onNewMention()` currently shows a welcome card with example buttons
- Has lots of example action handlers (hello, info, feedback, etc.)
- Slack webhook at `/api/webhooks/slack` already routes events to this bot

Available Chat SDK JSX components (already imported):
```typescript
Card, Section, Text, Fields, Field, Divider, Actions, Button, Table, emoji
```

---

## What to Change

### 1. Add imports at the top
```typescript
import { runGhostship } from "./agent";
import type { GhostshipReport, PersonaResult } from "./personas";
```

### 2. Add URL detection regex
```typescript
const URL_REGEX = /https?:\/\/[^\s>]+/i;
```

### 3. Replace `bot.onNewMention` handler

The new handler should:

**When @ghostship is mentioned with a URL:**
1. Extract the URL from the message text using URL_REGEX
2. Post a loading message to the thread: "🚢 Boarding your preview... deploying 5 phantom users"
3. Call `runGhostship(url)` (wrapped in try/catch)
4. Format the report as a Chat SDK Card (see format below)
5. Post the report card to the thread
6. If an error occurs, post a friendly error message

**When @ghostship is mentioned without a URL:**
1. Post a help card explaining usage: "@ghostship <vercel-preview-url>"

**Keep the AI mode mention check** — if message contains "AI", use the existing AI agent flow. Check for URLs first, then AI mode.

### 4. Report Card Format (Chat SDK JSX)

```tsx
<Card title={`👻 Ghostship Report: ${pagePath}`}>
  <Text>
    **{winner === "inconclusive" ? "Inconclusive" : `${winnerLabel} wins ${majorityCount}-${minorityCount}`}** · Confidence: {confidence}%
  </Text>
  <Divider />
  {/* For each persona result: */}
  <Section>
    <Text>
      {result.personaEmoji} **{result.personaName}**
      Prefers: **{result.preference}** ({result.confidence} confidence)
      _{result.rationale}_
    </Text>
  </Section>
  <Divider />
  <Section>
    <Text>**Summary:** {report.summary}</Text>
  </Section>
</Card>
```

Adapt this to work with the Chat SDK JSX patterns. Use `emoji` constants where appropriate. Each persona should be its own `<Section>` or `<Text>` block.

### 5. Keep or remove example handlers

Keep the example handlers if they don't interfere (they respond to button actions, not mentions). If they cause noise, remove them. Use your judgment — the priority is a clean GhostShip experience.

---

## Error Handling

- If `runGhostship()` throws, catch and post: "⚠️ Something went wrong: {error.message}"
- If URL extraction fails, treat as "no URL" and show help message
- The loading message should give users confidence something is happening (the pipeline takes ~30-45 seconds)

---

## Verification

### Test via Slack (primary):
1. In Slack, send: `@ghostship https://vercel.com`
2. Expected: loading message appears → ~30-45s later → report card with 5 personas

### Test help message:
1. In Slack, send: `@ghostship` (no URL)
2. Expected: help message explaining usage

### Test error handling:
1. In Slack, send: `@ghostship https://invalid-url-that-will-fail.xyz`
2. Expected: error message, not a crash

Also run: `pnpm typecheck`

---

## After Completion

Update `progress.txt` — mark all Track 5 tasks as `[x]` with timestamps.

FILES YOU MAY MODIFY: `src/lib/bot.tsx` (only this file)
FILES YOU MAY NOT TOUCH: anything else
