# Track 7: Landing Page

## Parallel Execution Notice

**You are one of 4 agents running IN PARALLEL.** Other agents are simultaneously working on:
- Track 1: Types + Personas → `src/lib/personas.ts`
- Track 2: Screenshot Service → `src/lib/screenshot.ts`
- Track 3: Gemini Evaluation → `src/lib/evaluate.ts`

**DO NOT touch any files outside your ownership.** If you see files created by other agents, leave them alone.

---

## Before You Start

1. Read `PLAN.md` — understand the full project context and where your track fits
2. Read `PROBLEM_STATEMENT.md` — understand the product positioning ("Phantom users for every pull request", "Lighthouse for UX")
3. Read `progress.txt` — see what's done and what's pending for your track

---

## Your Task

**Modify:** `src/app/page.tsx` (REPLACE existing content entirely)

Build a minimal, beautiful landing page for GhostShip. This is NOT a full app UI — it's a single-section brand page with the logo and headline. The Slack bot is the primary product interface.

---

## Skills to Use

Read and follow guidance from these skills **BEFORE writing any code**:
- `.agents/skills/high-end-visual-design/SKILL.md` — **CRITICAL**: premium visual design rules
- `.agents/skills/design-taste-frontend/SKILL.md` — **CRITICAL**: UI/UX engineering, avoid LLM design biases
- `.agents/skills/web-design-guidelines/SKILL.md` — web interface best practices
- `.agents/skills/vercel-react-best-practices/SKILL.md` — Next.js/React patterns
- `.agents/skills/full-output-enforcement/SKILL.md` — follow output quality guidelines

---

## Existing Assets

The logo is at `public/images/logo-square.png`:
- Pirate ghost character (light cyan/ice blue on dark background)
- Winking ghost wearing a pirate hat with skull & crossbones
- Brand colors: dark background (#1a1a2e or near-black), ice blue ghost

Also available:
- `public/images/og-image.jpg` — social share image (same ghost, wider format)
- `public/favicon.ico`, `public/apple-touch-icon.png` — favicons (already set up)

---

## Page Requirements

### Single Section: Logo + Headline

**Layout:** Centered vertically and horizontally on the page. Full viewport height.

**Content (top to bottom):**
1. Logo image — `public/images/logo-square.png` — sized appropriately (not too large, maybe 120-160px)
2. Title: **"ghostship"** — lowercase, bold
3. Subtitle: **"Phantom users for every pull request."**
4. One-liner (smaller text): *"Every Vercel preview is already an A/B test. It just has zero users."*

**That's it.** No forms, no buttons, no navigation. Just the brand statement.

### Design Direction
- Dark background matching the logo aesthetic (#1a1a2e or neutral-950)
- Light text (white or light gray)
- The logo already has a dark background, so it should blend seamlessly
- Clean, minimal typography — let the logo and copy breathe
- Subtle polish only (maybe a soft glow behind the logo, nothing flashy)
- This should feel like a high-end product landing page, not a hackathon project
- Responsive (centered on both desktop and mobile)

### Technical
- `"use client"` directive is NOT needed — this can be a server component (it's static)
- Use `next/image` for the logo (Image component with proper alt text)
- No external UI libraries — just Tailwind utility classes
- Check `src/app/layout.tsx` for existing layout wrapper before adding body/html tags

---

## STRETCH GOAL (only if time permits, bury at bottom)

If we have time later, we may add a URL comparison form below the hero. Don't build it now — just make sure the page structure allows adding a section below the hero later. A simple `<main>` wrapper with the hero as the first child is enough.

---

## Verification

After modifying the file:
```bash
pnpm typecheck
```

Then confirm visually:
- `localhost:3000` shows the GhostShip landing page
- Logo renders, headline is readable
- Looks polished and intentional, not like a default template
- No console errors in browser

---

## After Completion

Update `progress.txt` — mark all Track 7 tasks as `[x]` with timestamps.

FILES YOU MAY MODIFY: `src/app/page.tsx` (REPLACE)
FILES YOU MAY NOT TOUCH: anything in src/lib/, src/app/api/, src/components/, or any other files
