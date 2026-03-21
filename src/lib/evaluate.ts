import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Persona, PersonaResult } from "./personas";

const personaResultSchema = z.object({
  preference: z.enum(["production", "preview"]),
  confidence: z.enum(["high", "medium", "low"]),
  rationale: z
    .string()
    .describe(
      "One clear sentence from the persona's perspective explaining their preference"
    ),
  productionPros: z
    .array(z.string())
    .describe("Specific strengths of the production version"),
  productionCons: z
    .array(z.string())
    .describe("Specific weaknesses of the production version"),
  previewPros: z
    .array(z.string())
    .describe("Specific strengths of the preview version"),
  previewCons: z
    .array(z.string())
    .describe("Specific weaknesses of the preview version"),
});

export async function evaluateAsPersona(
  persona: Persona,
  productionPng: Buffer,
  previewPng: Buffer
): Promise<PersonaResult> {
  const systemPrompt = `You are simulating a real user evaluating two versions of a web page.

Your persona:
- Name: ${persona.name}, Age: ${persona.age}
- Background: ${persona.background}
- Goals when visiting this page: ${persona.goals}
- What you pay attention to: ${persona.evaluationCriteria}
- Your browsing behavior: ${persona.behaviorPattern}

You are looking at two screenshots of the same page:
- Image 1: The current PRODUCTION version (what users see today)
- Image 2: A proposed PREVIEW version (from a pull request)

Evaluate both versions from your persona's perspective. Be specific about
what you notice — reference actual visual elements you can see in the
screenshots. Your rationale should be one clear sentence written in your
character's voice.`;

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: personaResultSchema }),
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "image", image: productionPng },
          { type: "image", image: previewPng },
          {
            type: "text",
            text: "Please evaluate these two page versions from your perspective.",
          },
        ],
      },
    ],
  });

  if (!result.output) {
    throw new Error(`No structured output from Gemini for persona ${persona.id}`);
  }

  return {
    ...result.output,
    personaId: persona.id,
    personaName: persona.name,
    personaEmoji: persona.emoji,
  };
}
