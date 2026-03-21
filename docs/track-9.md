# Track 9: Demo Pricing Page + Variant PRs (Dogfooding)

## Context

GhostShip needs to test itself. We'll create a pricing page on `main` (the production baseline), then open 2 PRs with variant designs. Vercel auto-deploys preview URLs for each PR. We then use @ghostship in Slack (or GitHub PR comments) to evaluate the variants — dogfooding the product with its own repo.

This serves triple duty:
1. **E2E testing** the full pipeline with real Vercel preview URLs
2. **Demo material** — "watch GhostShip evaluate a PR on its own repo"
3. **Persona quality validation** — do the personas give meaningfully different feedback on pricing page variants?

---

## Before You Start

1. Read `PLAN.md` — understand the project context
2. Read `PROBLEM_STATEMENT.md` — understand what personas should notice
3. Read `src/app/page.tsx` — understand the existing landing page design language (dark theme, font-mono accents, ghost aesthetic)
4. Read the design skills before writing any page:
   - `.agents/skills/high-end-visual-design/SKILL.md`
   - `.agents/skills/design-taste-frontend/SKILL.md`
   - `.agents/skills/web-design-guidelines/SKILL.md`

---

## Part A: Pricing Page on Main (Production Baseline)

**Create:** `src/app/pricing/page.tsx`

A simple 3-tier SaaS pricing page that matches the GhostShip brand. This is the "production" version that variants will be compared against.

### Design Requirements
- Dark theme consistent with the landing page (bg-[#0A0A0A], same color palette)
- Font-mono accents for labels, sans-serif for body text
- Clean, minimal — no clutter
- Responsive (mobile + desktop)
- Link back to home (`/`)

### Content: 3 Pricing Tiers

**Free**
- Price: $0/mo
- 10 phantom evaluations/month
- 3 personas per evaluation
- Community support
- CTA: "Get Started"

**Pro**
- Price: $49/mo (highlight this as recommended)
- Unlimited evaluations
- All 5 personas
- Custom persona creation
- Slack + GitHub integration
- Priority support
- CTA: "Start Free Trial"

**Enterprise**
- Price: "Custom"
- Everything in Pro
- Custom persona panels (20+ personas)
- SSO & SAML
- SLA & dedicated support
- API access
- CTA: "Contact Sales"

### Layout
- Centered 3-column grid (stacks on mobile)
- Pro tier visually highlighted (border accent, "Most Popular" badge)
- Feature comparison below the cards (optional, if it doesn't clutter)

### Navigation
- Small "ghostship" wordmark or logo at top-left linking to `/`
- Keep it minimal — this is a pricing page, not a full app

---

## Part B: Create 2 Variant Branches with PRs

After the pricing page is on `main` and deployed to Vercel, create two branches with meaningfully different variants:

### Branch: `pricing-v2` (Variant 1 — Layout Change)
- Switch from 3-column cards to a **comparison table** layout
- Same tiers, same features, different presentation
- Add annual vs monthly toggle
- More compact, information-dense design
- The change should be visually obvious in a screenshot

### Branch: `pricing-v3` (Variant 2 — Copy & CTA Change)
- Keep the 3-column card layout
- Change the copy approach: lead with outcomes instead of features
  - Free: "Try it yourself" → "See what your users think"
  - Pro: "Start Free Trial" → "Ship with confidence"
  - Enterprise: "Contact Sales" → "Scale your experimentation"
- Change the recommended tier highlight from Pro to Enterprise
- Add social proof (fake testimonial quotes below the cards)
- More emotional, persuasive design vs the clinical baseline

### PR Creation
For each branch:
1. `git checkout -b pricing-v2` (or `pricing-v3`)
2. Modify `src/app/pricing/page.tsx` with the variant
3. Commit and push
4. Create PR via `gh pr create`
5. Wait for Vercel to deploy the preview
6. Note the preview URL

---

## Verification

### Part A
- `localhost:3000/pricing` shows the 3-tier pricing page
- Design matches the landing page aesthetic
- Responsive on mobile
- `pnpm typecheck` passes

### Part B
- 2 PRs open on GitHub
- Each PR has a Vercel preview deployment
- Preview URLs are accessible
- Visual difference is obvious between baseline and each variant

### E2E Test
Once the Slack bot is working:
```
@ghostship https://ghostship-git-pricing-v2-{team}.vercel.app/pricing
```
→ Report card comparing pricing-v2 preview against production pricing page

---

## After Completion

Update `progress.txt` — add Track 9 section and mark tasks `[x]` with timestamps.

FILES YOU MAY CREATE:
- `src/app/pricing/page.tsx`

FILES YOU MAY MODIFY (on variant branches only):
- `src/app/pricing/page.tsx` (different changes per branch)

FILES YOU MAY NOT TOUCH: anything else on main
