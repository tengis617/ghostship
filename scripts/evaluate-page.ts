import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { captureScreenshot } from "../src/lib/screenshot";
import { evaluatePage } from "../src/lib/evaluate";
import { personas } from "../src/lib/personas";
import type { PageEvaluation } from "../src/lib/personas";

const url = process.argv[2];
if (!url) {
  console.error("Usage: npx tsx scripts/evaluate-page.ts <url>");
  process.exit(1);
}

async function main() {
  const start = performance.now();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👻 GhostShip Page Evaluation");
  console.log(`URL: ${url}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log();

  console.log("📸 Capturing screenshot...");
  const screenshot = await captureScreenshot(url);
  console.log(`Screenshot captured (${(screenshot.length / 1024).toFixed(0)}KB)`);
  console.log();

  console.log("🔍 Running 5 persona evaluations in parallel...");
  const results = await Promise.all(
    personas.map((persona) => evaluatePage(persona, screenshot, url))
  );

  for (const r of results) {
    printResult(r);
  }

  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Average score: ${avgScore.toFixed(1)}/10`);
  console.log(`Completed in ${elapsed}s`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

function printResult(r: PageEvaluation) {
  console.log(`${r.personaEmoji} ${r.personaName} (score: ${r.score}/10) — ${r.overallImpression}`);
  console.log(`First impression: "${r.firstImpression}"`);
  console.log(`Rationale: "${r.rationale}"`);
  console.log(`✅ Strengths: ${r.strengths.join("; ")}`);
  console.log(`❌ Weaknesses: ${r.weaknesses.join("; ")}`);
  console.log(`💡 Suggestions: ${r.suggestions.join("; ")}`);
  console.log();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
