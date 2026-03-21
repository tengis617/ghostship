import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { PageEvaluation } from "./personas";

const synthesisSchema = z.object({
  averageScore: z
    .number()
    .describe("Average score across all persona evaluations"),
  summary: z
    .string()
    .describe(
      "3-5 sentence synthesis of all persona evaluations, highlighting consensus and disagreements"
    ),
  topStrengths: z
    .array(z.string())
    .describe("Top 3 strengths that multiple personas agreed on"),
  topWeaknesses: z
    .array(z.string())
    .describe("Top 3 weaknesses that multiple personas identified"),
  recommendation: z
    .string()
    .describe("One-sentence actionable recommendation for the page owner"),
});

export type Synthesis = z.infer<typeof synthesisSchema>;

export async function synthesizeEvaluations(
  pageDescription: string,
  evaluations: PageEvaluation[],
  pageUrl?: string
): Promise<Synthesis> {
  const evaluationSummaries = evaluations
    .map(
      (e) =>
        `${e.personaEmoji} ${e.personaName} (${e.score}/10): ${e.rationale}\n  Strengths: ${e.strengths.join(", ")}\n  Weaknesses: ${e.weaknesses.join(", ")}`
    )
    .join("\n\n");

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: synthesisSchema }),
    messages: [
      {
        role: "system",
        content: `You are a UX research lead synthesizing findings from 5 different user personas who evaluated a web page. Provide a balanced, actionable synthesis that highlights where personas agree and disagree. Be specific and concrete.`,
      },
      {
        role: "user",
        content: `Page: ${pageUrl || "Unknown URL"}
Description: ${pageDescription}

Persona Evaluations:
${evaluationSummaries}

Synthesize these evaluations into an overall assessment with top strengths, top weaknesses, and a clear recommendation.`,
      },
    ],
  });

  if (!result.output) {
    throw new Error("Failed to synthesize evaluations");
  }

  return result.output;
}
