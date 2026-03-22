import { ToolLoopAgent, tool } from "ai";
import type { StreamChunk } from "chat";
import { z } from "zod";
import { getAgentModel } from "./ai-models";
import { captureScreenshot, parseVercelPreviewUrl } from "./screenshot";
import { evaluateAsPersona, evaluatePage } from "./evaluate";
import { analyzePageAndGeneratePersonas } from "./generate-personas";
import {
  type GhostshipReport,
  type PageEvaluation,
  type Persona,
  type PersonaResult,
} from "./personas";

export interface PrContext {
  owner: string;
  repo: string;
  prNumber: number;
}

// Thread-like object that supports posting streaming plan blocks
export interface StreamableThread {
  id: string;
  post(message: AsyncIterable<string | StreamChunk>): Promise<unknown>;
}

// ── Confidence & recommendations ──────────────────────────────────────

function computeConfidence(
  majority: number,
  results: PersonaResult[]
): number {
  const BASE: Record<number, number> = { 5: 92, 4: 72, 3: 42 };
  const base = BASE[majority] ?? 30;

  const confidenceMap = { high: 1, medium: 0.6, low: 0.3 };
  const avg =
    results.reduce((sum, r) => sum + confidenceMap[r.confidence], 0) /
    results.length;
  const adjustment = (avg - 0.6) * 25;

  return Math.round(Math.max(15, Math.min(99, base + adjustment)));
}

function getRecommendation(
  winner: GhostshipReport["winner"],
  confidence: number
): string {
  if (winner === "inconclusive") {
    return "🧪 A/B test recommended — personas are evenly split";
  }
  if (winner === "preview") {
    if (confidence >= 70) return "🚢 Ship it — this PR is the clear winner";
    if (confidence >= 50) return "🧪 Consider A/B testing before shipping";
    return "🧪 Run an A/B test — too close to call";
  }
  if (confidence >= 70)
    return "🚫 Don't ship — current version is strongly preferred";
  if (confidence >= 50)
    return "🔄 Iterate on the changes before shipping";
  return "🧪 Run an A/B test — results are mixed";
}

function buildReport(
  results: PersonaResult[],
  previewUrl: string,
  productionUrl: string
): GhostshipReport {
  const previewVotes = results.filter(
    (r) => r.preference === "preview"
  ).length;
  const productionVotes = results.length - previewVotes;
  const majority = Math.max(previewVotes, productionVotes);
  const confidence = computeConfidence(majority, results);

  let winner: GhostshipReport["winner"];
  if (previewVotes === productionVotes) {
    winner = "inconclusive";
  } else {
    winner = previewVotes > productionVotes ? "preview" : "production";
  }

  const recommendation = getRecommendation(winner, confidence);

  const winnerLabel = winner === "preview" ? "This PR" : "Current version";
  const dissenter = results.find((r) => r.preference !== winner);
  let summary: string;
  if (winner === "inconclusive") {
    summary = `Split decision (${productionVotes}–${previewVotes}). Personas disagreed — consider A/B testing with real users.`;
  } else {
    const majorityRationale = results.find(
      (r) => r.preference === winner
    )?.rationale;
    const dissentNote = dissenter
      ? ` ${dissenter.personaEmoji} ${dissenter.personaName} dissented: "${dissenter.rationale}"`
      : "";
    summary = `${winnerLabel} preferred ${majority}–${results.length - majority}. ${majorityRationale}${dissentNote}`;
  }

  return {
    winner,
    confidence,
    recommendation,
    preferenceSplit: { production: productionVotes, preview: previewVotes },
    personas: results,
    summary,
    previewUrl,
    productionUrl,
  };
}

// ── Single-page review ────────────────────────────────────────────────

function generatePageSummary(
  evaluations: PageEvaluation[],
  avgScore: number
): string {
  const impressions = evaluations.map((e) => e.overallImpression);
  const positiveCount = impressions.filter((i) => i === "positive").length;
  const negativeCount = impressions.filter((i) => i === "negative").length;

  const verdict =
    positiveCount >= 4
      ? "Strong positive reception"
      : positiveCount >= 3
        ? "Generally positive"
        : negativeCount >= 3
          ? "Significant concerns"
          : "Mixed reception";

  const topPersona = evaluations.reduce((best, e) =>
    Math.abs(e.score - avgScore) > Math.abs(best.score - avgScore) ? e : best
  );

  return `${verdict} (avg ${avgScore.toFixed(1)}/10). ${topPersona.personaEmoji} ${topPersona.personaName}: "${topPersona.rationale}"`;
}

// ── GitHub API ────────────────────────────────────────────────────────

function createGitHubAppJWT(): string | null {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!appId || !privateKey) return null;

  const { createSign } = require("crypto") as typeof import("crypto");
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ iss: appId, iat: now - 60, exp: now + 600 })
  ).toString("base64url");
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${payload}`)
    .sign(privateKey, "base64url");
  return `${header}.${payload}.${signature}`;
}

let cachedInstallationToken: { token: string; expiresAt: number } | null = null;

async function getInstallationToken(): Promise<string | null> {
  if (
    cachedInstallationToken &&
    cachedInstallationToken.expiresAt > Date.now() + 300_000
  ) {
    return cachedInstallationToken.token;
  }

  const installationId = process.env.GITHUB_INSTALLATION_ID;
  const jwt = createGitHubAppJWT();
  if (!jwt || !installationId) return null;

  const res = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${jwt}`,
        "User-Agent": "ghostship-bot",
      },
    }
  );
  if (!res.ok) {
    console.error(
      "Failed to get installation token:",
      res.status,
      await res.text()
    );
    return null;
  }

  const data = (await res.json()) as { token: string; expires_at: string };
  cachedInstallationToken = {
    token: data.token,
    expiresAt: new Date(data.expires_at).getTime(),
  };
  return data.token;
}

async function githubFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ghostship-bot",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  } else {
    const installationToken = await getInstallationToken();
    if (installationToken) {
      headers.Authorization = `token ${installationToken}`;
    }
  }

  return fetch(`https://api.github.com${path}`, { headers });
}

// ── Plan block streaming ──────────────────────────────────────────────

// Race all promises to completion, yielding task updates as each finishes
async function* streamEvaluationProgress<T>(
  entries: Array<{ persona: Persona; promise: Promise<T> }>,
  formatOutput: (persona: Persona, result: T) => string,
  planTitle: string
): AsyncGenerator<StreamChunk> {
  yield { type: "plan_update" as const, title: planTitle };

  // All tasks start as in_progress
  for (const { persona } of entries) {
    yield {
      type: "task_update" as const,
      id: persona.id,
      title: `${persona.emoji} ${persona.name}`,
      status: "in_progress" as const,
    };
  }

  // Race to completion — yield updates as each finishes
  const indexed = entries.map(({ persona, promise }, i) =>
    promise.then(
      (result) => ({ i, persona, result, error: null as unknown }),
      (err) => ({ i, persona, result: null as T, error: err })
    )
  );
  const remaining = new Set(entries.map((_, i) => i));

  while (remaining.size > 0) {
    const settled = await Promise.race(
      [...remaining].map((i) => indexed[i])
    );
    remaining.delete(settled.i);

    if (settled.error) {
      yield {
        type: "task_update" as const,
        id: settled.persona.id,
        title: `${settled.persona.emoji} ${settled.persona.name}`,
        status: "error" as const,
        output: "Evaluation failed",
      };
    } else {
      yield {
        type: "task_update" as const,
        id: settled.persona.id,
        title: `${settled.persona.emoji} ${settled.persona.name}`,
        status: "complete" as const,
        output: formatOutput(settled.persona, settled.result),
      };
    }
  }
}

// Post a plan block to the thread as a side-effect (if the adapter supports streaming)
async function streamPlanBlock<T>(
  thread: StreamableThread | undefined,
  entries: Array<{ persona: Persona; promise: Promise<T> }>,
  formatOutput: (persona: Persona, result: T) => string,
  planTitle: string
): Promise<void> {
  if (!thread) {
    return;
  }

  const generator = streamEvaluationProgress(entries, formatOutput, planTitle);
  await thread.post(generator);
}

// ── Agent factory ─────────────────────────────────────────────────────

const VERCEL_REGEX =
  /https:\/\/[^\s)"<>]+?\.vercel\.app(?:\/[^\s)"<>]*)?/i;

const AGENT_INSTRUCTIONS = `You are GhostShip 👻 — an AI orchestrator that evaluates web pages using 5 page-specific synthetic personas.

CRITICAL RULES:
- When the user provides ANY URL or mentions a PR, you MUST use your tools. NEVER simulate, fake, or manually write an evaluation.
- You are NOT a UX reviewer yourself. You are an orchestrator that calls tools to run real evaluations. Your tools do the actual work.
- If a tool fails, report the error. Do NOT fall back to writing a manual review.

Your tools:
• compare_pages — A/B test two URLs with 5 page-specific AI personas (requires preview_url AND production_url)
• review_page — single page UX review with 5 page-specific AI personas (requires url)
• get_pr_changed_files — get files changed in a GitHub PR
• find_vercel_preview_url — find Vercel preview URL from PR comments
• derive_production_url — deterministically convert a Vercel preview URL into its production URL

Workflows:
1. User gives a Vercel preview URL → call derive_production_url, then call compare_pages
2. User gives a GitHub PR URL (github.com/owner/repo/pull/N) → extract owner/repo/N, call get_pr_changed_files + find_vercel_preview_url in parallel, then compare_pages with the right page path
3. User gives a non-Vercel URL → call review_page
4. User on a GitHub PR thread with no URL → use PR context hint, call get_pr_changed_files + find_vercel_preview_url
5. User asks a question without URLs → chat normally (this is the ONLY case where you don't use tools)

Mapping Next.js source files to page routes:
  src/app/page.tsx → /
  src/app/pricing/page.tsx → /pricing

After a tool returns evaluation results, present them clearly with the verdict, recommendation, and each persona's take. Use markdown formatting.
Keep non-evaluation responses concise.`;

/**
 * Create a per-request GhostShip agent with the thread bound for plan block streaming.
 * The thread is passed via experimental_context so tools can post plan blocks as side effects.
 */
export function createGhostshipAgent(thread?: StreamableThread) {
  return new ToolLoopAgent({
    model: getAgentModel(),
    instructions: AGENT_INSTRUCTIONS,
    experimental_context: { thread },
    tools: {
      get_pr_changed_files: tool({
        description:
          "Get files changed in a GitHub PR with filenames, status, and truncated diff.",
        inputSchema: z.object({
          owner: z.string().describe("GitHub repo owner"),
          repo: z.string().describe("GitHub repo name"),
          pr_number: z.number().describe("PR number"),
        }),
        execute: async ({ owner, repo, pr_number }) => {
          const res = await githubFetch(
            `/repos/${owner}/${repo}/pulls/${pr_number}/files`
          );
          if (!res.ok)
            return { error: `GitHub API ${res.status}: ${await res.text()}` };
          const files = (await res.json()) as Array<{
            filename: string;
            status: string;
            changes: number;
            patch?: string;
          }>;
          return files.map((f) => ({
            filename: f.filename,
            status: f.status,
            changes: f.changes,
            patch: f.patch?.slice(0, 500),
          }));
        },
      }),

      find_vercel_preview_url: tool({
        description:
          "Scan a GitHub PR's comments to find the Vercel preview deployment URL.",
        inputSchema: z.object({
          owner: z.string().describe("GitHub repo owner"),
          repo: z.string().describe("GitHub repo name"),
          pr_number: z.number().describe("PR number"),
        }),
        execute: async ({ owner, repo, pr_number }) => {
          const res = await githubFetch(
            `/repos/${owner}/${repo}/issues/${pr_number}/comments`
          );
          if (!res.ok)
            return { url: null, error: `GitHub API ${res.status}` };
          const comments = (await res.json()) as Array<{
            body?: string;
            user?: { login: string };
          }>;
          for (const c of comments) {
            if (c.user?.login === "vercel[bot]") {
              const match = c.body?.match(VERCEL_REGEX);
              if (match) return { url: match[0], source: "vercel[bot]" };
            }
          }
          for (const c of comments) {
            const match = c.body?.match(VERCEL_REGEX);
            if (match) return { url: match[0], source: c.user?.login };
          }
          return { url: null, source: null };
        },
      }),

      derive_production_url: tool({
        description:
          "Deterministically derive the production URL for a Vercel preview URL.",
        inputSchema: z.object({
          preview_url: z
            .string()
            .url()
            .describe("Full Vercel preview URL to convert"),
        }),
        execute: async ({ preview_url }) => {
          const derived = parseVercelPreviewUrl(preview_url);
          if (!derived.productionUrl) {
            return {
              previewUrl: preview_url,
              productionUrl: null,
              pagePath: derived.pagePath,
              error:
                "Could not derive a production URL from that preview deployment",
            };
          }

          return derived;
        },
      }),

      compare_pages: tool({
        description:
          "Screenshot two versions of a page (e.g. preview vs production) and run 5 persona evaluations comparing them. Shows live progress. Expensive (~30s).",
        inputSchema: z.object({
          preview_url: z
            .string()
            .url()
            .describe(
              "Full URL of the new/preview version, e.g. https://proj-git-feat.vercel.app/pricing"
            ),
          production_url: z
            .string()
            .url()
            .describe(
              "Full URL of the current/production version, e.g. https://proj.vercel.app/pricing"
            ),
        }),
        execute: async ({ preview_url, production_url }, options) => {
          const ctx = options?.experimental_context as
            | { thread?: StreamableThread }
            | undefined;

          // Capture screenshots in parallel
          const [previewPng, productionPng] = await Promise.all([
            captureScreenshot(preview_url),
            captureScreenshot(production_url),
          ]);

          const analysis = await analyzePageAndGeneratePersonas(
            previewPng,
            preview_url
          );
          const generatedPersonas = analysis.personas;

          // Start all persona evaluations (promises created but not awaited)
          const promises = generatedPersonas.map((p) =>
            evaluateAsPersona(p, productionPng, previewPng)
          );
          const entries = generatedPersonas.map((p, i) => ({
            persona: p,
            promise: promises[i],
          }));

          // Stream plan block as a side-effect (blocks until all evaluations complete)
          await streamPlanBlock(
            ctx?.thread,
            entries,
            (_p, r: PersonaResult) =>
              `Prefers ${r.preference === "preview" ? "This PR" : "Current"} (${r.confidence})`,
            "👻 Persona Evaluations"
          );

          // Collect results, tolerating individual persona failures
          const settled = await Promise.allSettled(promises);
          const results = settled
            .filter(
              (s): s is PromiseFulfilledResult<PersonaResult> =>
                s.status === "fulfilled"
            )
            .map((s) => s.value);

          if (results.length === 0) {
            return { error: "All persona evaluations failed" };
          }

          const report = buildReport(results, preview_url, production_url);

          return {
            pageType: analysis.pageType,
            audience: analysis.description,
            verdict: `${report.winner === "preview" ? "This PR" : report.winner === "production" ? "Current version" : "Inconclusive"} wins ${Math.max(report.preferenceSplit.preview, report.preferenceSplit.production)}–${Math.min(report.preferenceSplit.preview, report.preferenceSplit.production)}`,
            confidence: `${report.confidence}%`,
            recommendation: report.recommendation,
            personas: results.map((r) => ({
              name: `${r.personaEmoji} ${r.personaName}`,
              prefers: r.preference === "preview" ? "This PR" : "Current",
              confidence: r.confidence,
              rationale: r.rationale,
            })),
            summary: report.summary,
          };
        },
      }),

      review_page: tool({
        description:
          "Screenshot a single page and run 5 persona UX evaluations. Shows live progress. Expensive (~30s).",
        inputSchema: z.object({
          url: z.string().url().describe("Full URL of the page to review"),
        }),
        execute: async ({ url }, options) => {
          const ctx = options?.experimental_context as
            | { thread?: StreamableThread }
            | undefined;

          const png = await captureScreenshot(url);
          const analysis = await analyzePageAndGeneratePersonas(png, url);
          const generatedPersonas = analysis.personas;

          // Start all persona evaluations
          const promises = generatedPersonas.map((p) => evaluatePage(p, png, url));
          const entries = generatedPersonas.map((p, i) => ({
            persona: p,
            promise: promises[i],
          }));

          // Stream plan block as a side-effect
          await streamPlanBlock(
            ctx?.thread,
            entries,
            (_p, e: PageEvaluation) =>
              `${e.score}/10 — ${e.overallImpression}`,
            "👻 Page Review"
          );

          // Collect results, tolerating individual persona failures
          const settled = await Promise.allSettled(promises);
          const evaluations = settled
            .filter(
              (s): s is PromiseFulfilledResult<PageEvaluation> =>
                s.status === "fulfilled"
            )
            .map((s) => s.value);

          if (evaluations.length === 0) {
            return { error: "All persona evaluations failed" };
          }
          const averageScore =
            evaluations.reduce((sum, e) => sum + e.score, 0) /
            evaluations.length;
          const summary = generatePageSummary(evaluations, averageScore);

          return {
            url,
            pageType: analysis.pageType,
            audience: analysis.description,
            averageScore: `${averageScore.toFixed(1)}/10`,
            summary,
            personas: evaluations.map((e) => ({
              name: `${e.personaEmoji} ${e.personaName}`,
              score: `${e.score}/10`,
              impression: e.overallImpression,
              firstImpression: e.firstImpression,
              rationale: e.rationale,
              strengths: e.strengths,
              weaknesses: e.weaknesses,
            })),
          };
        },
      }),
    },
  });
}

export { buildReport };
