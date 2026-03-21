# Track 2: Screenshot Service

## Parallel Execution Notice

**You are one of 4 agents running IN PARALLEL.** Other agents are simultaneously working on:
- Track 1: Types + Personas → `src/lib/personas.ts`
- Track 3: Gemini Evaluation → `src/lib/evaluate.ts`
- Track 7: Web UI Shell → `src/app/page.tsx`, `src/components/report-card.tsx`

**DO NOT touch any files outside your ownership.** If you see files created by other agents, leave them alone.

---

## Before You Start

1. Read `PLAN.md` — understand the full project context, dependency graph, and where your track fits
2. Read `PROBLEM_STATEMENT.md` — understand why screenshots matter (visual comparison of Vercel previews)
3. Read `progress.txt` — see what's done and what's pending for your track

---

## Your Task

**Create:** `src/lib/screenshot.ts`

This module captures screenshots of URLs using headless Chrome (Puppeteer) and parses Vercel preview URL patterns. It must work in both local dev and Vercel serverless environments.

---

## Skills to Use

Read and follow guidance from these skills before writing code:
- `.agents/skills/vercel-react-best-practices/SKILL.md` — for Vercel serverless patterns
- `.agents/skills/full-output-enforcement/SKILL.md` — follow output quality guidelines

---

## Dependencies (already installed)

- `puppeteer-core` — headless Chrome control
- `@sparticuz/chromium` — Chromium binary for serverless environments

---

## Functions to Implement

### 1. `captureScreenshot(url: string): Promise<Buffer>`

```typescript
// Environment detection:
// - Vercel/Lambda: use @sparticuz/chromium for executable path + args
// - Local dev: use Chrome at /Applications/Google Chrome.app/Contents/MacOS/Google Chrome

// Chromium setup for Vercel:
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

async function getBrowser() {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  return puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}
```

Requirements:
- Viewport: 1280x800
- Navigate with `waitUntil: 'networkidle2'`, timeout 15000ms
- Take PNG screenshot of viewport (not full page)
- **ALWAYS close browser in a `finally` block** to prevent resource leaks
- Return PNG Buffer

### 2. `parseVercelPreviewUrl(previewUrl: string): { previewUrl: string; productionUrl: string | null; pagePath: string }`

Parse Vercel preview URL patterns to derive the production URL:

| Input Pattern | Production URL |
|---|---|
| `https://{project}-git-{branch}.vercel.app/path` | `https://{project}.vercel.app/path` |
| `https://{project}-{hash}-{team}.vercel.app/path` | `https://{project}.vercel.app/path` |
| `https://example.com/path` (non-Vercel) | `null` |

- Always preserve the page path (e.g., `/pricing`)
- Always return the original `previewUrl`
- Return `pagePath` extracted from the URL (e.g., `/pricing` or `/` if root)

---

## Verification

After creating the file, run this test:
```bash
npx tsx -e "
import { captureScreenshot, parseVercelPreviewUrl } from './src/lib/screenshot';
async function test() {
  // Test screenshot
  const buf = await captureScreenshot('https://vercel.com');
  require('fs').writeFileSync('/tmp/ghostship-verify-screenshot.png', buf);
  console.log('Screenshot size:', buf.length, 'bytes');

  // Test URL parsing
  const r1 = parseVercelPreviewUrl('https://my-app-git-new-cta.vercel.app/pricing');
  console.log('Parse test 1:', JSON.stringify(r1));

  const r2 = parseVercelPreviewUrl('https://my-app-abc123-myteam.vercel.app/about');
  console.log('Parse test 2:', JSON.stringify(r2));

  const r3 = parseVercelPreviewUrl('https://example.com/page');
  console.log('Parse test 3 (non-Vercel):', JSON.stringify(r3));
}
test().catch(console.error);
"
```

Expected:
- Screenshot size > 10000 bytes
- Parse test 1: `productionUrl = "https://my-app.vercel.app/pricing"`, `pagePath = "/pricing"`
- Parse test 2: `productionUrl = "https://my-app.vercel.app/about"`, `pagePath = "/about"`
- Parse test 3: `productionUrl = null`

---

## After Completion

Update `progress.txt` — mark all Track 2 tasks as `[x]` with timestamps.
