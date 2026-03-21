/**
 * Generate wind-blown sprite frames of the GhostShip logo for hero animation.
 *
 * Uses the original logo as a style reference and generates frames where
 * only the bottom scalloped edge varies — like a ghost floating in the wind.
 * The hat, face, and body stay identical. Frames loop smoothly at equal intervals.
 *
 * Usage:
 *   pnpm tsx scripts/generate-logo-sprites.ts
 *   pnpm tsx scripts/generate-logo-sprites.ts --frame 3
 *   pnpm tsx scripts/generate-logo-sprites.ts --force
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const REFERENCE_IMAGE = join(process.cwd(), "public/images/logo-square.png");
const OUTPUT_DIR = join(process.cwd(), "public/images/logo-sprites");

// 4 frames forming a seamless loop. VERY subtle — only the bottom scallop
// curves change by a tiny amount. The difference between frames should be
// barely noticeable in a still image but create a gentle ripple when looped.
const frames: Record<string, { description: string; detail: string }> = {
  "wind-01": {
    description: "Neutral — scallops as in reference",
    detail:
      "The bottom edge has exactly 3 scalloped bumps, symmetrical and evenly spaced, exactly as shown in the reference image. This is the base frame. Copy the reference as precisely as possible.",
  },
  "wind-02": {
    description: "Scallops shifted 1-2 pixels to the right",
    detail:
      "Almost identical to the reference. The ONLY difference: the 3 bottom scallop curves are shifted very slightly (1-2 pixels) to the right. The middle bump peak moves just barely right of center. The change should be almost imperceptible when viewed alone.",
  },
  "wind-03": {
    description: "Scallops shifted 1-2 pixels to the left",
    detail:
      "Almost identical to the reference. The ONLY difference: the 3 bottom scallop curves are shifted very slightly (1-2 pixels) to the left. The middle bump peak moves just barely left of center. The change should be almost imperceptible when viewed alone.",
  },
  "wind-04": {
    description: "Scallops slightly deeper/taller curves",
    detail:
      "Almost identical to the reference. The ONLY difference: the 3 bottom scallop bumps curve down just slightly more — maybe 1-2 pixels deeper than the reference. The scallop valleys between bumps are marginally more pronounced. Barely noticeable.",
  },
};

const basePrompt = `Recreate this ghost pirate character as EXACTLY as possible. This is a sprite animation frame — it must be virtually indistinguishable from the reference.

COPY EVERYTHING EXACTLY:
- Flat vector sticker art style with thick dark outline — SAME line weight
- Pure black background (#000000)
- Sticker-style pale outline/border — SAME thickness and color
- Pale ice-blue ghost body (#D4F5F5) — EXACT same shade
- Dark navy pirate tricorn hat (#1a1a3e) with white skull-and-crossbones — EXACT same color, shape, size, position
- Face: one round black dot eye on the left, one winking curved-line eye on the right, small curved smirk — EXACT same positions and sizes
- White highlight/shine streak on the left side — SAME position and size
- Body shape from hat to scallops — IDENTICAL silhouette
- Same centering, same scale, same composition
- NO text, NO labels
- Square format

DO NOT change the hat color, body color, outline color, face, or anything above the bottom edge.

THE ONLY CHANGE — and it must be EXTREMELY SUBTLE (1-2 pixels of difference):`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _colorNote = "Hat must be dark navy #1a1a3e — NOT lighter, NOT bluer";

async function generateFrame(
  frameId: string,
  referenceBuffer: Buffer
): Promise<Buffer | null> {
  const frame = frames[frameId];
  if (!frame) {
    console.error(`  No frame config for: ${frameId}`);
    return null;
  }

  const prompt = `${basePrompt}
- ${frame.description}
- ${frame.detail}

Generate the ghost character. Everything above the bottom edge must be identical to the reference. Only the bottom scalloped waves differ.`;

  console.log(`  Generating: ${frameId} — ${frame.description}`);

  try {
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

    const assistantMessages = result.response.messages.filter(
      (m) => m.role === "assistant"
    );

    for (const msg of assistantMessages) {
      if (!Array.isArray(msg.content)) continue;

      for (const part of msg.content) {
        if (typeof part !== "object" || part === null) continue;

        if ("type" in part && part.type === "file" && "data" in part) {
          const data = part.data as string;
          return Buffer.from(data, "base64");
        }

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

    // Fallback: check top-level files array
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

    console.error(`  No image found in response for: ${frameId}`);
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
    console.error(`  Error generating ${frameId}:`, err);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const singleFrame = args.includes("--frame")
    ? args[args.indexOf("--frame") + 1]
    : null;
  const force = args.includes("--force");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!existsSync(REFERENCE_IMAGE)) {
    console.error(`Reference image not found: ${REFERENCE_IMAGE}`);
    process.exit(1);
  }
  const referenceBuffer = readFileSync(REFERENCE_IMAGE);
  console.log(`Loaded reference: ${REFERENCE_IMAGE}`);

  const frameIds = singleFrame
    ? Object.keys(frames).filter((id) => id.includes(singleFrame))
    : Object.keys(frames);

  if (frameIds.length === 0) {
    console.error(`No matching frames for: ${singleFrame}`);
    console.error(`Available: ${Object.keys(frames).join(", ")}`);
    process.exit(1);
  }

  console.log(`\nGenerating ${frameIds.length} wind sprite frame(s)...\n`);

  const results: { id: string; success: boolean }[] = [];

  for (const frameId of frameIds) {
    const outputPath = join(OUTPUT_DIR, `${frameId}.png`);

    if (existsSync(outputPath) && !force) {
      console.log(`  Skipping ${frameId} (exists, use --force to regenerate)`);
      results.push({ id: frameId, success: true });
      continue;
    }

    const imageBuffer = await generateFrame(frameId, referenceBuffer);

    if (imageBuffer) {
      writeFileSync(outputPath, imageBuffer);
      console.log(
        `  Saved: ${outputPath} (${(imageBuffer.length / 1024).toFixed(0)}KB)`
      );
      results.push({ id: frameId, success: true });
    } else {
      console.log(`  Failed: ${frameId}`);
      results.push({ id: frameId, success: false });
    }

    if (frameIds.length > 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n--- Summary ---");
  const succeeded = results.filter((r) => r.success).length;
  console.log(`${succeeded}/${results.length} frames generated`);
  console.log(`Output: ${OUTPUT_DIR}/`);
  console.log("\nDone!");
}

main().catch(console.error);
