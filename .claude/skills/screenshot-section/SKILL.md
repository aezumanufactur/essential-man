---
name: screenshot-section
description: QA a Shopify theme section against Figma comps — takes 4 screenshots (mobile + desktop × site + Figma) and reports visual differences in spacing, typography, colors, and layout.
argument-hint: <mobile-figma-url> <desktop-figma-url> <section-name> [page-slug]
---

You are performing a visual QA comparison between a live Shopify section and its Figma comps.

Arguments provided: $ARGUMENTS

## Argument Parsing

Detect format by the first token:

**Figma-first format** (preferred — first token starts with `https://www.figma.com`):
- `mobile-figma-url` — first token
- `desktop-figma-url` — second token
- `section-name` — third token (e.g. `mfr_core_hero_banner_St4ndA` or section filename like `mfr-core__hero-banner`)
- `page-slug` — fourth token (optional, e.g. `pages/the-standard`). If omitted, ask the user: "What page slug should I screenshot? (e.g. `pages/the-standard`)"

**Legacy format** (first token is a localhost URL):
- `page-url` — first token (e.g. `http://127.0.0.1:9292/pages/the-standard`)
- `section-id` — second token (Shopify DOM id fragment or CSS selector)
- `mobile-figma-url` — third token
- `desktop-figma-url` — fourth token

---

## Phase 1 — Read Figma Design Context

Call `mcp__figma-desktop__get_design_context` on both the mobile and desktop Figma URLs **in parallel**.
Call `mcp__figma-desktop__get_screenshot` on both URLs **in parallel** (run alongside get_design_context).

From the responses, extract and note:
- **Frame width** for each (mobile is typically 430, desktop is typically 1440 — use the actual value from the comp)
- **Spacing** — all padding, margin, and gap values in px
- **Typography** — font family, size, weight, line-height, letter-spacing, text-transform for every text element
- **Colors** — background colors, text colors, border colors, overlay colors
- **Layout** — flex direction, column counts, alignment, element ordering
- **Borders / dividers** — presence, thickness, style, color

---

## Phase 2 — Discover Section DOM ID and Page URL

### Page URL
- If `page-slug` was provided (e.g. `pages/the-standard`): page URL = `http://127.0.0.1:9292/<page-slug>`
- If legacy format: use the `page-url` token directly
- If not provided and cannot be inferred: ask the user once before proceeding

### Section DOM ID
Shopify generates a full DOM id that includes a theme context prefix. Do not guess it — discover it:

```bash
curl -s http://127.0.0.1:9292/<page-slug> | grep -o 'id="shopify-section-[^"]*"'
```

Find the entry containing your `section-name` or `section-id` token. Example output:
```
id="shopify-section-template--21831569670244__mfr_core_hero_banner_St4ndA"
```

Pass the portion **after** `shopify-section-` to the screenshot tool (e.g. `template--21831569670244__mfr_core_hero_banner_St4ndA`).

---

## Phase 3 — Screenshot the Live Site

Using the frame widths extracted in Phase 1, run both commands **in parallel** via Bash:

```bash
node .claude/tools/screenshot-section/screenshot.js \
  --url <page-url> \
  --section-id <discovered-dom-id> \
  --width <mobile-frame-width> \
  --out mobile-site.png
```

```bash
node .claude/tools/screenshot-section/screenshot.js \
  --url <page-url> \
  --section-id <discovered-dom-id> \
  --width <desktop-frame-width> \
  --out desktop-site.png
```

After both succeed, `Read` both output files:
- `.claude/tools/screenshot-section/screenshots/mobile-site.png`
- `.claude/tools/screenshot-section/screenshots/desktop-site.png`

**If the tool times out:** The Shopify dev server keeps a live-reload websocket open that prevents `networkidle`. Patch line ~53 of `.claude/tools/screenshot-section/screenshot.js`:
```js
// Change:
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
// To:
await page.goto(url, { waitUntil: "load", timeout: 30000 });
```

**If "Element not found":** The DOM ID discovery in Phase 2 returned the wrong entry — re-run the curl command and look for a closer match to the section name.

---

## Phase 4 — QA Diff Report

You now have 4 visual references:
- **Figma mobile** (Phase 1)
- **Figma desktop** (Phase 1)
- **Site mobile** (Phase 3)
- **Site desktop** (Phase 3)

Compare them and produce a structured report. **Ignore all image content** — placeholder images vs real images are expected and not a finding.

**Note on invisible elements:** If an element is visible in the browser but invisible in the screenshot, it's likely a GSAP entrance animation that didn't complete in headless mode. Note it as "animation-dependent — visible in live browser, not a code bug" rather than a layout issue.

Use the exact format below:

---

### QA Report — [Section Name or ID]

#### Spacing
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Typography
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Colors
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Layout
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Borders & Dividers
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Missing / Extra Elements
- `[mobile]` / `[desktop]` / `[both]` — description of difference

#### Priority Summary
**Critical** (affects layout or readability):
- list items

**Minor** (cosmetic, small value differences):
- list items

---

Be specific about values where visible (e.g. "gap appears ~24px on site vs ~40px in comp"). If a category has no differences, write "None found."
