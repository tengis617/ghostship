import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

async function getBrowser() {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  return puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function captureScreenshot(url: string): Promise<Buffer> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    const screenshot = await page.screenshot({ type: "png", fullPage: false });
    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
}

export function parseVercelPreviewUrl(previewUrl: string): {
  previewUrl: string;
  productionUrl: string | null;
  pagePath: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(previewUrl);
  } catch {
    return { previewUrl, productionUrl: null, pagePath: "/" };
  }

  const pagePath = parsed.pathname || "/";
  const hostname = parsed.hostname;

  if (!hostname.endsWith(".vercel.app")) {
    return { previewUrl, productionUrl: null, pagePath };
  }

  const subdomain = hostname.replace(".vercel.app", "");

  // Pattern 1: {project}-git-{branch}.vercel.app
  const gitMatch = subdomain.match(/^(.+?)-git-.+$/);
  if (gitMatch) {
    const project = gitMatch[1];
    const productionUrl = `${parsed.protocol}//${project}.vercel.app${pagePath}`;
    return { previewUrl, productionUrl, pagePath };
  }

  // Pattern 2: {project}-{hash}-{team}.vercel.app
  const hashMatch = subdomain.match(/^(.+?)-[a-z0-9]+-[a-z0-9]+$/);
  if (hashMatch) {
    const project = hashMatch[1];
    const productionUrl = `${parsed.protocol}//${project}.vercel.app${pagePath}`;
    return { previewUrl, productionUrl, pagePath };
  }

  return { previewUrl, productionUrl: null, pagePath };
}
