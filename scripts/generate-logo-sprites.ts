/**
 * Generate subtle sprite variations of the GhostShip logo for hero animation.
 *
 * Uses the original logo as a style reference and generates frames with
 * small differences (eye state, tilt, glow) that cycle for a living feel.
 *
 * Usage:
 *   pnpm tsx scripts/generate-logo-sprites.ts
 *   pnpm tsx scripts/generate-logo-sprites.ts --frame 2
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

// Each frame describes a subtle variation from the base logo
const frames: Record<
  string,
  { description: string; detail: string }
> = {
  "frame-01-idle": {
    description: "Base pose — identical to the reference, eyes open normally",
    detail:
      "The ghost looks straight ahead with its normal expression: one round dot eye (left) and one winking curved-line eye (right). Relaxed, neutral pose. This is the resting state.",
  },
  "frame-02-blink": {
    description: "Both eyes closed in a blink",
    detail:
      "Both eyes are closed — shown as two short curved lines (like the winking eye shape but on both sides). The mouth/smirk stays the same. Everything else identical to the reference. A momentary blink.",
  },
  "frame-03-glance-left": {
    description: "Eyes shifted slightly to the left",
    detail:
      "The round dot eye (left) is positioned slightly more to the left within the face. The winking eye stays the same. The ghost body and hat are identical — only the pupil position changes subtly. Looking to the left.",
  },
  "frame-04-glance-right": {
    description: "Eyes shifted slightly to the right",
    detail:
      "The round dot eye (left) is positioned slightly more to the right within the face. The winking eye opens slightly into a small dot too, looking right. Very subtle shift. Body and hat identical.",
  },
  "frame-05-happy": {
    description: "Slightly happier expression — both eyes open, bigger smile",
    detail:
      "Both eyes are open as round dots (no wink). The smirk curves upward a bit more into a small happy smile. The ghost appears slightly pleased. Body and hat remain identical.",
  },
  "frame-06-squint": {
    description: "Slightly squinting, mischievous look",
    detail:
      "The round dot eye becomes slightly smaller/squinted. The winking eye stays as a curved line but tilts slightly more mischievous. The smirk becomes a bit wider. A scheming, playful expression.",
  },
};

const basePrompt = `Using this ghost pirate character as THE EXACT style reference, generate a near-identical copy with ONE subtle change.

CRITICAL — match the reference EXACTLY on these:
- Same flat vector sticker art style with thick dark outline
- Same rounded ghost body shape with scalloped wavy bottom (3 bumps)
- Same dark background (pure black #000000)
- Same sticker-style white outline/border effect
- Same pale ice-blue body color (#D4F5F5)
- Same dark navy pirate tricorn hat with skull-and-crossbones emblem
- Same white highlight/shine streak on the left side of the body
- Same size, same centering, same composition
- Simple, minimal — emoji-level detail, NOT photorealistic
- NO text, NO words, NO labels
- Square format

The ONLY thing that changes is the facial expression. Keep the change VERY SUBTLE — this frame will be part of an animation cycle and needs to look nearly identical to the reference.

SPECIFIC CHANGE FOR THIS FRAME:`;

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
- Frame: ${frame.description}
- Detail: ${frame.detail}

Generate the ghost character. It must look almost identical to the reference — only the eyes/mouth differ slightly. Same hat, same body, same style, same background.`;

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

    // Extract image from response (same approach as persona script)
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

  // Determine which frames to generate
  const frameIds = singleFrame
    ? Object.keys(frames).filter((id) => id.includes(singleFrame))
    : Object.keys(frames);

  if (frameIds.length === 0) {
    console.error(`No matching frames for: ${singleFrame}`);
    console.error(`Available: ${Object.keys(frames).join(", ")}`);
    process.exit(1);
  }

  console.log(`\nGenerating ${frameIds.length} sprite frame(s)...\n`);

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

    // Delay between requests to avoid rate limits
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
