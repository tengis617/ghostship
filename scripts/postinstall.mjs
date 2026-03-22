/**
 * Postinstall script for Vercel deployment.
 * Extracts @sparticuz/chromium binary into a tar file that gets uploaded
 * with the deployment. At runtime, @sparticuz/chromium-min downloads
 * this tar instead of fetching from a remote CDN.
 *
 * Based on: https://vercel.com/templates/next.js/puppeteer-on-vercel
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Only run during Vercel builds
if (!process.env.VERCEL) {
  console.log("[postinstall] Not on Vercel, skipping chromium pack.");
  process.exit(0);
}

try {
  // Resolve @sparticuz/chromium's installed location
  const chromiumPath = dirname(
    fileURLToPath(import.meta.resolve("@sparticuz/chromium"))
  );
  const binDir = join(chromiumPath, "bin");

  if (!existsSync(binDir)) {
    console.error("[postinstall] @sparticuz/chromium bin/ not found at", binDir);
    process.exit(1);
  }

  // Create public/ if it doesn't exist
  const publicDir = join(process.cwd(), "public");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const tarPath = join(publicDir, "chromium-pack.tar");
  console.log("[postinstall] Packing chromium binary from", binDir);
  execSync(`tar -cf "${tarPath}" -C "${binDir}" .`);
  console.log("[postinstall] Created", tarPath);
} catch (err) {
  console.error("[postinstall] Failed to pack chromium:", err.message);
  // Don't fail the build — screenshot will just not work on Vercel
  process.exit(0);
}
