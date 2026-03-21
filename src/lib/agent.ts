import { captureScreenshot, parseVercelPreviewUrl } from "./screenshot";
import { evaluateAsPersona } from "./evaluate";
import { personas, type GhostshipReport, type PersonaResult } from "./personas";

function computeConfidence(results: PersonaResult[]): number {
  const total = results.length;
  const previewVotes = results.filter(
    (r) => r.preference === "preview"
  ).length;
  const productionVotes = total - previewVotes;
  const margin = Math.abs(previewVotes - productionVotes);

  // Margin component: 0-2 margin out of 5
  const marginScore = (margin / total) * 60;

  // Individual confidence component
  const confidenceMap = { high: 1, medium: 0.6, low: 0.3 };
  const avgConfidence =
    results.reduce((sum, r) => sum + confidenceMap[r.confidence], 0) / total;
  const confidenceScore = avgConfidence * 40;

  return Math.round(marginScore + confidenceScore);
}

function generateSummary(
  winner: GhostshipReport["winner"],
  results: PersonaResult[],
  previewVotes: number,
  productionVotes: number
): string {
  if (winner === "inconclusive") {
    return `Split decision (${productionVotes}-${previewVotes}). Personas disagreed — consider testing with real users before shipping.`;
  }

  const margin = `${Math.max(previewVotes, productionVotes)}-${Math.min(previewVotes, productionVotes)}`;
  const winnerLabel = winner === "preview" ? "Preview" : "Production";

  // Collect rationales from the majority side
  const majorityRationales = results
    .filter((r) => r.preference === winner)
    .map((r) => r.rationale);

  // Pick first dissenting opinion if any
  const dissenter = results.find((r) => r.preference !== winner);
  const dissent = dissenter
    ? ` ${dissenter.personaEmoji} ${dissenter.personaName} dissented: "${dissenter.rationale}"`
    : "";

  return `${winnerLabel} wins ${margin}. ${majorityRationales[0]}${dissent}`;
}

export async function runGhostship(
  previewUrl: string,
  productionUrl?: string
): Promise<GhostshipReport> {
  // 1. Parse/derive URLs
  const parsed = parseVercelPreviewUrl(previewUrl);
  const finalProductionUrl = productionUrl ?? parsed.productionUrl;

  if (!finalProductionUrl) {
    throw new Error(
      `Could not detect a production URL from "${previewUrl}". Pass an explicit productionUrl.`
    );
  }

  // 2. Capture both screenshots in parallel
  const [previewPng, productionPng] = await Promise.all([
    captureScreenshot(previewUrl),
    captureScreenshot(finalProductionUrl),
  ]);

  // 3. Run all persona evaluations in parallel
  const results = await Promise.all(
    personas.map((persona) =>
      evaluateAsPersona(persona, productionPng, previewPng)
    )
  );

  // 4. Aggregate
  const previewVotes = results.filter(
    (r) => r.preference === "preview"
  ).length;
  const productionVotes = results.length - previewVotes;

  const margin = Math.abs(previewVotes - productionVotes);
  const confidence = computeConfidence(results);

  let winner: GhostshipReport["winner"];
  if (margin >= 2) {
    winner = previewVotes > productionVotes ? "preview" : "production";
  } else if (margin === 1 && confidence >= 50) {
    winner = previewVotes > productionVotes ? "preview" : "production";
  } else {
    winner = "inconclusive";
  }

  const summary = generateSummary(
    winner,
    results,
    previewVotes,
    productionVotes
  );

  return {
    winner,
    confidence,
    preferenceSplit: { production: productionVotes, preview: previewVotes },
    personas: results,
    summary,
    previewUrl,
    productionUrl: finalProductionUrl,
  };
}
