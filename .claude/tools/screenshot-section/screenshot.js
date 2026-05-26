#!/usr/bin/env node
/**
 * screenshot.js — capture a specific section from a local Shopify dev server
 *
 * Called automatically by the screenshot-section skill. Never needs to be
 * invoked manually — the skill constructs and runs this command for you.
 *
 * Usage (skill-generated):
 *   node .claude/tools/screenshot-section/screenshot.js \
 *     --url <page-url> --section-id <id> --width <px> --out <filename>
 *
 * Flags:
 *   --url         Full page URL  (e.g. http://127.0.0.1:9292/pages/the-standard)
 *   --section-id  Shopify section id attr or any CSS selector (#foo, .bar)
 *                 Bare words without # or . are treated as element ids.
 *   --width       Viewport width in px  (430 for mobile, 1440 for desktop)
 *   --out         Output filename — saved in screenshots/ next to this script
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const url = get("--url");
const sectionId = get("--section-id");
const width = parseInt(get("--width") || "1440", 10);
const outName = get("--out") || `screenshot-${Date.now()}.png`;

if (!url) {
  console.error("Error: --url is required");
  process.exit(1);
}

const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
const outPath = path.join(screenshotsDir, outName);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`→ ${url} @ ${width}px`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  // Allow GSAP / Alpine entrance animations to finish
  await page.waitForTimeout(1200);

  if (!sectionId) {
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved (full-page): ${outPath}`);
  } else {
    const selector = /^[#.]/.test(sectionId) ? sectionId : `#${sectionId}`;
    const el = page.locator(selector).first();

    try {
      await el.waitFor({ timeout: 8000 });
    } catch {
      console.error(`Element not found: ${selector}`);
      await browser.close();
      process.exit(1);
    }

    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: outPath });
    console.log(`Saved (section): ${outPath}`);
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
