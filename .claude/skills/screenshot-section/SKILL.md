---
name: screenshot-section
description: QA a Shopify theme section against Figma comps — takes 4 screenshots (mobile + desktop × site + Figma) and reports visual differences in spacing, typography, colors, and layout.
argument-hint: <page-url> <section-id> <mobile-figma-url> <desktop-figma-url>
---

You are performing a visual QA comparison between a live Shopify section and its Figma comps.

Arguments provided: $ARGUMENTS

Parse $ARGUMENTS as:
- `page-url` — first token (e.g. `http://127.0.0.1:9292/pages/the-standard`)
- `section-id` — second token (Shopify section element id, e.g. `shopify-section-mfr_core__hero_banner_jRfmBn`, or a CSS selector like `#my-id`)
- `mobile-figma-url` — third token (Figma node URL for the mobile comp)
- `desktop-figma-url` — fourth token (Figma node URL for the desktop comp)

---

## Phase 1 — Read Figma Design Context

Call `mcp__figma-desktop__get_design_context` on both the mobile and desktop Figma URLs **in parallel**.

From the responses, extract and note:
- **Frame width** for each (mobile is typically 430, desktop is typically 1440 — use the actual value from the comp)
- **Spacing** — all padding, margin, and gap values in px
- **Typography** — font family, size, weight, line-height, letter-spacing, text-transform for every text element
- **Colors** — background colors, text colors, border colors, overlay colors
- **Layout** — flex direction, column counts, alignment, element ordering
- **Borders / dividers** — presence, thickness, style, color

---

## Phase 2 — Screenshot Figma Comps

Call `mcp__figma-desktop__get_screenshot` on both the mobile and desktop Figma URLs **in parallel**.

Keep both screenshots in context for visual reference in Phase 4.

---

## Phase 3 — Screenshot the Live Site

Using the frame widths extracted in Phase 1, run both commands **in parallel** via Bash:

```bash
node .claude/tools/screenshot-section/screenshot.js \
  --url <page-url> \
  --section-id <section-id> \
  --width <mobile-frame-width> \
  --out mobile-site.png
```

```bash
node .claude/tools/screenshot-section/screenshot.js \
  --url <page-url> \
  --section-id <section-id> \
  --width <desktop-frame-width> \
  --out desktop-site.png
```

After both commands succeed, read both output files so you can see them:

```
Read: .claude/tools/screenshot-section/screenshots/mobile-site.png
Read: .claude/tools/screenshot-section/screenshots/desktop-site.png
```

If the script fails with "Element not found", ask the user to provide the correct section element id (visible in the browser's dev tools or in the page HTML as `id="shopify-section-..."`).

---

## Phase 4 — QA Diff Report

You now have 4 visual references:
- **Figma mobile** (Phase 2)
- **Figma desktop** (Phase 2)
- **Site mobile** (Phase 3)
- **Site desktop** (Phase 3)

Compare them and produce a structured report. **Ignore all image content** — placeholder images vs real images are expected and not a finding.

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
