import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const SRC = "public/images/logo.jpg";
const OUT = "public";

await mkdir(path.join(OUT, "images"), { recursive: true });

const meta = await sharp(SRC).metadata();
const { width, height } = meta;

// Center square crop dimensions (ghost is centered in 1408x768)
const squareSize = height; // 768
const left = Math.floor((width - squareSize) / 2);

// Base: cropped square PNG with transparency (black bg → transparent)
const squareCrop = sharp(SRC)
  .extract({ left, top: 0, width: squareSize, height: squareSize })
  .png();

const squareBuffer = await squareCrop.toBuffer();

// Helper: resize a square buffer
async function resizeSquare(size, outputPath, opts = {}) {
  await sharp(squareBuffer)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(outputPath);
  console.log(`  ${outputPath} (${size}x${size})`);
}

// Helper: resize keeping original aspect ratio
async function resizeRect(w, h, outputPath) {
  await sharp(SRC)
    .resize(w, h, { fit: "cover" })
    .png()
    .toFile(outputPath);
  console.log(`  ${outputPath} (${w}x${h})`);
}

console.log("Generating GhostShip assets...\n");

// --- Slack bot avatar (512x512) ---
await resizeSquare(512, path.join(OUT, "images/slack-avatar.png"));

// --- Favicons ---
await resizeSquare(16, path.join(OUT, "favicon-16x16.png"));
await resizeSquare(32, path.join(OUT, "favicon-32x32.png"));
await resizeSquare(48, path.join(OUT, "favicon-48x48.png"));

// Generate ICO (just use the 32x32 PNG as favicon.ico — browsers accept PNG)
await sharp(squareBuffer)
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
  .toFormat("png")
  .toFile(path.join(OUT, "favicon.ico"));
console.log(`  ${OUT}/favicon.ico (32x32 png-as-ico)`);

// --- Apple Touch Icon (180x180) ---
await resizeSquare(180, path.join(OUT, "apple-touch-icon.png"));

// --- PWA Icons ---
await resizeSquare(192, path.join(OUT, "images/icon-192.png"));
await resizeSquare(512, path.join(OUT, "images/icon-512.png"));

// --- Open Graph (1200x630 — keep original aspect, it's close) ---
await sharp(SRC)
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 90 })
  .toFile(path.join(OUT, "images/og-image.jpg"));
console.log(`  ${OUT}/images/og-image.jpg (1200x630)`);

// --- GitHub / social banner (1280x640) ---
await sharp(SRC)
  .resize(1280, 640, { fit: "cover" })
  .jpeg({ quality: 90 })
  .toFile(path.join(OUT, "images/social-banner.jpg"));
console.log(`  ${OUT}/images/social-banner.jpg (1280x640)`);

// --- Slack message thumbnail (smaller, 128x128) ---
await resizeSquare(128, path.join(OUT, "images/slack-thumb.png"));

// --- Square logo (high-res, 1024x1024) ---
await resizeSquare(1024, path.join(OUT, "images/logo-square.png"));

console.log("\nDone! All assets generated.");
