# GhostShip — Demo Script

**Target:** 2-3 minute video for hackathon submission
**Product:** Phantom users for every pull request
**Live site:** https://www.ghostship.sh

---

## Pre-Demo Setup (do before recording)

### Windows to have open
1. **Slack** — workspace with #ghostship channel, bot added
2. **GitHub** — PR #2 (pricing-v2) open: https://github.com/tengis617/ghostship/pull/2
3. **Browser** — https://www.ghostship.sh (landing page)
4. **Browser tab** — https://www.ghostship.sh/pricing (production pricing page)

### Pre-flight checks
- [ ] Slack bot is responding (test with a quick @ghostship)
- [ ] Vercel preview URLs are live for both PRs
- [ ] Screen recording tool ready (QuickTime, Loom, or OBS)
- [ ] Resolution: 1920x1080 or 1280x720
- [ ] Close notifications, menubar clutter, unrelated tabs
- [ ] Dark mode on everything for visual consistency

---

## Script

### Act 1: The Problem (30 seconds)

**[Talking / Voiceover]**

> "AI coding tools let you ship features in hours. But knowing if a change
> is actually good for users? That still takes weeks of A/B testing.
>
> You can build 10 variants in a day. But you can only test one at a time,
> and each test takes 2-4 weeks to reach statistical significance.
>
> The bottleneck isn't building anymore. It's learning."

**[On screen]** Show the landing page at ghostship.sh — the "experiment backlog"
section with 7 queued experiments vs GhostShip's instant pre-filtering.

---

### Act 2: The Solution — Three Capabilities (15 seconds)

**[Talking]**

> "GhostShip sends phantom users — AI-generated personas — to evaluate your
> pages before real users ever see them. Three ways to use it."

**[On screen]** Quick flash of the landing page hero: logo + "Phantom users for
every pull request."

---

### Act 3: Capability 1 — Page Review (45 seconds)

**[Talking]**

> "First: paste any URL and get instant UX feedback from 5 diverse perspectives."

**[On screen — Slack]**

Type in Slack:
```
@ghostship https://www.ghostship.sh/pricing
```

Wait for the response (~30 seconds). While waiting:

> "GhostShip screenshots the page, then 5 AI personas — each with different
> backgrounds, goals, and browsing behaviors — evaluate it from their
> perspective."

**[Show the report card appearing]** Point out:
- Different personas give different scores
- Specific feedback referencing actual visual elements
- Not generic — the accessibility persona notices contrast, the executive
  notices whether the value prop is clear in 10 seconds

---

### Act 4: Capability 2 — PR Comparison (45 seconds)

**[Talking]**

> "Second: compare a PR against production. Every Vercel preview is already
> an A/B test — it just has zero users. Until now."

**[On screen — GitHub]**

Show PR #2 (pricing-v2). Comment on the PR:
```
@ghostship
```

> "GhostShip automatically finds the Vercel preview URL, detects the changed
> pages, screenshots both versions, and runs a side-by-side comparison."

Wait for the report card to appear as a PR comment (~30-45 seconds).

**[Show the PR comment report card]** Point out:
- Winner + confidence score
- Per-persona vote split
- Dissenting opinion (e.g., one persona prefers the old version)
- Actionable recommendation

**[Talking]**

> "4 out of 5 personas prefer the new layout. One flagged that the comparison
> table is harder to scan on mobile. That's the kind of signal you'd normally
> wait 3 weeks to get."

---

### Act 5: The Bigger Picture (15 seconds)

**[On screen]** Show the landing page "experiment backlog" section — the
before/after comparison.

**[Talking]**

> "GhostShip doesn't replace A/B testing. It's a pre-filter. Of your 30
> queued experiments, it tells you which ones to ship, which to kill, and
> which are worth burning real traffic on.
>
> 30 seconds. Not 3 weeks. Lighthouse for UX."

---

### Act 6: Close (10 seconds)

**[On screen]** Landing page hero with logo.

**[Talking]**

> "GhostShip. Built with Gemini and Vercel Chat SDK.
> Every Vercel preview is already an A/B test.
> It just had zero users. Until now."

---

## Timing Summary

| Act | Content | Duration |
|-----|---------|----------|
| 1 | The Problem | 30s |
| 2 | Solution intro | 15s |
| 3 | Page Review (Slack demo) | 45s |
| 4 | PR Comparison (GitHub demo) | 45s |
| 5 | Bigger picture | 15s |
| 6 | Close | 10s |
| **Total** | | **~2:40** |

---

## Recording Tips

- **Don't speed up the wait.** The 30-second evaluation time is part of the
  story — it's fast compared to 3 weeks. Let it run in real-time or do a
  tasteful cut.
- **Pre-run once** before recording to warm up caches and make sure everything
  works. Puppeteer cold starts can be slow on the first call.
- **Zoom in** on the report card when it appears — the per-persona detail is
  the payoff.
- **Keep the voiceover confident but conversational.** You're showing a working
  product, not pitching a slide deck.
- **End on the landing page.** The ghost pirate logo is memorable.

## Backup Plan

If the live bot is slow or fails during recording:
- Pre-record a successful Slack interaction and splice it in
- Use `scripts/evaluate-page.ts` CLI output as B-roll
- Screenshot a completed report card and narrate over it

---

## Key Lines to Hit

- "AI made building 10x faster. Learning is still slow."
- "Every Vercel preview is already an A/B test. It just has zero users."
- "30 seconds. Not 3 weeks."
- "Lighthouse for UX."
