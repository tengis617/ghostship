import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Persona } from "./personas";

export interface PageAnalysis {
  description: string;
  pageType: string;
  personas: Persona[];
}

const pageAnalysisSchema = z.object({
  description: z
    .string()
    .describe(
      "2-3 sentence description of what this page is, who it serves, and its primary purpose"
    ),
  pageType: z
    .string()
    .describe(
      "Brief categorization, e.g. 'SaaS pricing page', 'Recipe blog', 'Developer documentation'"
    ),
  personas: z
    .array(
      z.object({
        id: z.string().describe("URL-safe kebab-case identifier"),
        name: z.string().describe("Short persona name, e.g. 'Home Cook'"),
        emoji: z.string().describe("Single relevant emoji"),
        age: z.number().describe("Realistic age for this persona"),
        background: z
          .string()
          .describe("2-3 sentence background relevant to this page"),
        goals: z.string().describe("What they want from this specific page"),
        evaluationCriteria: z
          .string()
          .describe("What they pay attention to when browsing"),
        behaviorPattern: z
          .string()
          .describe("How they browse and interact with pages like this"),
      })
    )
    .length(5),
});

export async function analyzePageAndGeneratePersonas(
  pagePng: Buffer,
  pageUrl?: string
): Promise<PageAnalysis> {
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: pageAnalysisSchema }),
    messages: [
      {
        role: "system",
        content: `You are an expert UX researcher. Given a screenshot of a web page:

1. Describe what the page is and who it serves (2-3 sentences).
2. Categorize the page type.
3. Generate 5 diverse user personas who would realistically visit this page.

Make the personas specific to this page's content and purpose — not generic.
For example, a cooking recipe site should have food-related personas, not
generic "budget buyer" or "executive" personas.

Include diversity in: age, technical literacy, goals, patience level, and device usage.
Each persona should have a single relevant emoji.`,
      },
      {
        role: "user",
        content: [
          { type: "image", image: pagePng },
          {
            type: "text",
            text: pageUrl
              ? `Analyze this page (${pageUrl}) and generate a description and 5 diverse personas.`
              : "Analyze this page and generate a description and 5 diverse personas.",
          },
        ],
      },
    ],
  });

  if (!result.output) {
    throw new Error("Failed to analyze page with Gemini");
  }

  return result.output;
}
