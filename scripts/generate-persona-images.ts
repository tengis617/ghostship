/**
 * Generate unique ghost persona images using Gemini's image generation.
 *
 * Uses the original logo as a style reference and generates a distinct
 * ghost character for each persona.
 *
 * Usage:
 *   pnpm tsx scripts/generate-persona-images.ts
 *   pnpm tsx scripts/generate-persona-images.ts --persona budget-buyer
 *   pnpm tsx scripts/generate-persona-images.ts --force
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const REFERENCE_IMAGE = join(process.cwd(), "public/images/logo-square.png");
const OUTPUT_DIR = join(process.cwd(), "public/images/personas");

// Persona visual descriptions — what makes each ghost unique
const personaVisuals: Record<
  string,
  { accessory: string; expression: string; color: string; detail: string }
> = {
  "budget-buyer": {
    accessory: "a small magnifying glass held up to one eye",
    expression: "squinting skeptically, one eyebrow raised",
    color: "#F5D4E6 (soft pink)",
    detail:
      "tiny dollar signs or coins floating near the ghost, scrutinizing something carefully",
  },
  "power-user": {
    accessory:
      "small rectangular glasses (developer glasses) and a tiny laptop",
    expression: "focused and slightly impatient, determined look",
    color: "#E0D4F5 (soft purple)",
    detail:
      "small angle brackets < /> or terminal cursor blinking near the ghost, typing on a tiny laptop",
  },
  executive: {
    accessory: "a small necktie and a tiny briefcase",
    expression: "confident and decisive, slight smile",
    color: "#F5EED4 (soft gold/yellow)",
    detail:
      "looks polished and professional, standing upright and composed",
  },
  "first-timer": {
    accessory: "a small telescope or binoculars held up to eyes",
    expression: "wide-eyed and curious, looking around with wonder",
    color: "#D4F5F5 (ice blue, same as the original)",
    detail:
      "small question marks or sparkles floating around, exploring and discovering",
  },
  accessibility: {
    accessory: "round thick-framed glasses and a small white cane",
    expression: "thoughtful and attentive, caring look",
    color: "#D4F5D8 (soft green)",
    detail:
      "has a gentle, careful posture, perhaps with a small accessibility icon (a11y) nearby",
  },
};

const basePrompt = `Using this ghost pirate character as a style reference, generate a NEW ghost character variation.

CRITICAL STYLE RULES — match the reference exactly:
- Same flat vector sticker art style with thick dark outline
- Same rounded ghost body shape with scalloped wavy bottom (3 bumps)
- Same dark background (pure black #000000)
- Same sticker-style white outline/border effect
- Simple, minimal — emoji-level detail, NOT photorealistic
- NO text, NO words, NO labels in the image
- Centered composition, square format
- The ghost should NOT wear the pirate hat (that's only for the captain/logo)

WHAT TO CHANGE for this specific persona:`;

async function generatePersonaImage(
  personaId: string,
  referenceBuffer: Buffer
): Promise<Buffer | null> {
  const visual = personaVisuals[personaId];
  if (!visual) {
    console.error(`  No visual config for persona: ${personaId}`);
    return null;
  }

  const prompt = `${basePrompt}
- Ghost body color: ${visual.color}
- Accessory: ${visual.accessory}
- Expression: ${visual.expression}
- Extra detail: ${visual.detail}

Generate a single ghost character. Keep it simple and cute like the reference. Square image, dark background, flat vector sticker style.`;

  console.log(`  Generating image for: ${personaId}...`);

  try {
    // Use generateText with IMAGE response modality for image-to-image
    // generation with Gemini. This lets us pass the reference image as
    // input and get a generated image back.
    const result = await generateText({
      model: google("gemini-3.1-flash-image-preview"),
      providerOptions: {
        google: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: referenceBuffer,
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    // The generated image comes back as a file part in the response.
    // Check all response message content parts for file/image data.
    const assistantMessages = result.response.messages.filter(
      (m) => m.role === "assistant"
    );

    for (const msg of assistantMessages) {
      if (!Array.isArray(msg.content)) continue;

      for (const part of msg.content) {
        if (typeof part !== "object" || part === null) continue;

        // File part with base64 data (Gemini image output format)
        if ("type" in part && part.type === "file" && "data" in part) {
          const data = part.data as string;
          return Buffer.from(data, "base64");
        }

        // Some SDK versions use 'image' type
        if ("image" in part) {
          const img = part.image;
          if (typeof img === "string") {
            return Buffer.from(img, "base64");
          }
          if (img instanceof Uint8Array) {
            return Buffer.from(img);
          }
        }
      }
    }

    // Fallback: check top-level files array (some SDK versions)
    const raw = result as unknown as Record<string, unknown>;
    if (raw.files && Array.isArray(raw.files)) {
      for (const file of raw.files) {
        if (file && typeof file === "object" && "base64" in file) {
          return Buffer.from(
            (file as { base64: string }).base64,
            "base64"
          );
        }
        if (file instanceof Uint8Array) {
          return Buffer.from(file);
        }
      }
    }

    // Debug: log what we got back
    console.error(`  No image found in response for: ${personaId}`);
    for (const msg of assistantMessages) {
      if (Array.isArray(msg.content)) {
        const types = msg.content.map((c) =>
          typeof c === "object" && c !== null && "type" in c
            ? (c as { type: string }).type
            : typeof c
        );
        console.error(`  Response content types:`, types);
      }
    }
    return null;
  } catch (err) {
    console.error(`  Error generating image for ${personaId}:`, err);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const singlePersona = args.includes("--persona")
    ? args[args.indexOf("--persona") + 1]
    : null;

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load reference image
  if (!existsSync(REFERENCE_IMAGE)) {
    console.error(`Reference image not found: ${REFERENCE_IMAGE}`);
    process.exit(1);
  }
  const referenceBuffer = readFileSync(REFERENCE_IMAGE);
  console.log(`Loaded reference image: ${REFERENCE_IMAGE}`);

  // Determine which personas to generate
  const personaIds = singlePersona
    ? [singlePersona]
    : Object.keys(personaVisuals);

  console.log(`\nGenerating images for ${personaIds.length} persona(s)...\n`);

  for (const personaId of personaIds) {
    const outputPath = join(OUTPUT_DIR, `${personaId}.png`);

    // Skip if already exists (use --force to regenerate)
    if (existsSync(outputPath) && !args.includes("--force")) {
      console.log(
        `  Skipping ${personaId} (already exists, use --force to regenerate)`
      );
      continue;
    }

    const imageBuffer = await generatePersonaImage(personaId, referenceBuffer);

    if (imageBuffer) {
      writeFileSync(outputPath, imageBuffer);
      console.log(
        `  Saved: ${outputPath} (${(imageBuffer.length / 1024).toFixed(0)}KB)`
      );
    } else {
      console.log(`  Failed: ${personaId} — no image generated`);
    }

    // Small delay between requests to avoid rate limits
    if (personaIds.length > 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
