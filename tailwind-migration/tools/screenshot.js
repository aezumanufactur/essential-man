#!/usr/bin/env node
/**
 * Screenshot tool for tailwind migration visual comparison.
 * Usage: node tailwind-migration/tools/screenshot.js [label]
 *   label: before | after | any custom name (default: latest)
 * Output:
 *   tailwind-migration/screenshots/[label].png
 *   tailwind-migration/screenshots/[label].errors.json
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

async function takeScreenshot(label) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const screenshotPath = path.join(SCREENSHOTS_DIR, `${label}.png`);
  const errorsPath = path.join(SCREENSHOTS_DIR, `${label}.errors.json`);

  const consoleMessages = [];
  const networkErrors = [];
  const pageErrors = [];

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    pageErrors.push({ message: err.message, stack: err.stack });
  });

  page.on('requestfailed', req => {
    networkErrors.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  try {
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 15000 });
  } catch {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  const errorReport = { consoleMessages, networkErrors, pageErrors };
  fs.writeFileSync(errorsPath, JSON.stringify(errorReport, null, 2));

  const totalErrors = consoleMessages.length + networkErrors.length + pageErrors.length;

  console.log(`Screenshot saved: ${screenshotPath}`);

  if (totalErrors === 0) {
    console.log('No errors detected.');
  } else {
    console.log(`\n⚠️  ${totalErrors} issue(s) detected — see ${errorsPath}`);
    if (pageErrors.length)      console.log(`  JS errors:      ${pageErrors.length}`);
    if (consoleMessages.length) console.log(`  Console errors: ${consoleMessages.length}`);
    if (networkErrors.length)   console.log(`  Network errors: ${networkErrors.length}`);
  }
}

const label = process.argv[2] || 'latest';
const view = process.argv[3] || 'test';
const basePath = process.argv[4] || '/pages/test';
const URL = `http://127.0.0.1:9292${basePath}?view=${view}`;
takeScreenshot(label).catch(err => { console.error(err); process.exit(1); });
