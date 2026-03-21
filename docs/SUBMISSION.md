# Hackathon Submission — Zero to Agent: Vercel x DeepMind

## Team Name
ghostship

## Team Members
tengis

## Project Description
GhostShip sends AI-generated "phantom users" to evaluate your web pages before real users ever see them. Three core capabilities:

1. **Generate personas on the fly** — Paste any URL. Gemini analyzes the page and generates 5 user personas specific to that page's content and audience — not generic templates.

2. **Review a page from each persona's perspective** — Each persona evaluates the page using Gemini's multimodal vision, providing scores, first impressions, strengths, weaknesses, and suggestions from their unique point of view.

3. **Compare pages across revisions via PR reviews** — When a developer opens a PR, @ghostship in Slack or GitHub compares the Vercel preview against production. Five personas vote, and you get a confidence-scored recommendation in 30 seconds instead of waiting 2-4 weeks for a real A/B test.

The problem: AI coding tools made building features 10x faster, but learning whether a change is good for users still takes weeks of A/B testing. Every Vercel preview deployment is already an A/B test candidate — it just has zero users. GhostShip fills that gap.

Built with Gemini multimodal (via Vercel AI SDK), Vercel Chat SDK for multi-platform bot delivery (Slack + GitHub), and Puppeteer for automated screenshotting. Deployed on Vercel.

## Public GitHub Repository
https://github.com/tengis617/ghostship

## Demo Video
(TODO: add URL after recording)

## Partner Technologies Used
Google, Vercel

## Did you try out the technology from Vercel? If so, what was your experience
We built the entire project on Vercel's stack. Vercel Chat SDK was the backbone — it let us build one bot that works across Slack and GitHub from a single codebase. The adapter pattern is clean: write your handler once, deploy to any platform. We used the Slack adapter for real-time @ghostship mentions and the GitHub adapter for PR comment reviews. The Vercel AI SDK made structured output with Gemini straightforward — generateText with Output.object and zod schemas gave us typed, parseable persona evaluations with no flaky text parsing. Deployment on Vercel was seamless, and preview deployments are literally part of our product story: every Vercel preview is an A/B test candidate that GhostShip evaluates.

## Did you try out the technology from Google? If so, what was your experience
Gemini 2.5 Flash is the engine behind every GhostShip evaluation. We use its multimodal capabilities to send page screenshots alongside persona system prompts and get structured JSON evaluations back. The model handles the core task — "look at this screenshot as a specific type of user and tell me what you think" — remarkably well. Different personas genuinely give different feedback: the accessibility persona flags contrast issues while the executive persona focuses on whether the value prop is clear in 10 seconds. We used structured output via the Vercel AI SDK's generateText with zod schemas, and Gemini returned valid structured JSON consistently. Speed was solid — 5 parallel persona evaluations complete in about 20 seconds.

## Do you have any feedback for the organizers (Cerebral Valley)
Great event. The Vercel + DeepMind combination was a natural pairing — Vercel's deployment infrastructure gave us preview URLs to evaluate, and Gemini's multimodal reasoning gave us the ability to actually understand what's on those pages. Would love to see more hackathons focused on agents that solve workflow problems, not just chatbot wrappers.
