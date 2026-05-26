---
name: qa-fix
description: Fix visual QA differences between a live Shopify section and its Figma comps. Use this whenever QA finds layout, typography, spacing, or color mismatches between the site and Figma designs. The skill reads both Figma comps, reads all project coding rules, diagnoses each issue at the correct fix layer (settings first → Tailwind classes → SCSS last resort), applies fixes iteratively, re-screenshots the live site, and keeps iterating until the section matches the comp on both mobile and desktop. Also use this proactively after running /screenshot-section and getting a QA report with findings to fix.
argument-hint: <mobile-figma-url> <desktop-figma-url> <section-name> [template-json-path]
---

You are fixing visual QA differences between a live Shopify section and its Figma comps. Follow every phase in order. Do not skip phases. Do not rely on memory for rules — always read the files explicitly.

Arguments provided: $ARGUMENTS

Parse $ARGUMENTS as: `<mobile-url> <desktop-url> <section-name> [template-json-path]`
- First token = mobile Figma node URL
- Second token = desktop Figma node URL
- Third token = section filename without extension (e.g. `mfr-core__hero-banner`)
- Fourth token (optional) = template JSON file path (e.g. `templates/page.the-standard.json`)

**Page slug inference:** If `template-json-path` is `templates/page.X.json`, the page slug is `pages/X` and the dev server URL is `http://127.0.0.1:9292/pages/X`. If no template path is provided, ask the user for the page slug once before Phase 4.

---

## Phase 0 — Isolate in Worktree

Before touching any files, ensure you are isolated from the user's main working copy:

- If your current working directory is already under `.claude/worktrees/`, you are already isolated — skip to Phase 1.
- Otherwise: run `git worktree add .claude/worktrees/qa-fix__<section-name> HEAD` and call `EnterWorktree` with that path.

Record the worktree path — all subsequent file reads and writes happen inside it.

---

## Phase 1 — Read Figma Comps

Call `mcp__figma-desktop__get_design_context` on both URLs **in parallel**.
Call `mcp__figma-desktop__get_screenshot` on both URLs **in parallel** (run alongside get_design_context).

Extract and record from the design context:
- **Frame dimensions** — exact pixel width and height of each comp
- **Text content** — exact string values, including case (uppercase vs sentence case). Note: if Figma shows "THE STANDARD" in all-caps, that is the expected output — record it exactly.
- **Typography** — family, size (px), weight, line-height, letter-spacing, text-transform for every text element. Use the named style metadata (e.g. `mobile/header/h3`, `desktop/tag/large`) for `header_style` mapping.
- **Spacing** — all gap, padding, margin values in px. Note which container they belong to.
- **Colors** — backgrounds, text, overlays, borders
- **Layout** — flex direction, alignment, element stacking order
- **Overlay gradients** — exact `linear-gradient()` strings if present

---

## Phase 2 — Read ALL Project Rules

Read every file below. Do not skip any. Do not proceed to Phase 3 until all reads are complete.

1. `.claude/instructions/sections.md`
2. `.claude/instructions/blocks.md`
3. `.claude/instructions/liquid-html.md`
4. `.claude/instructions/styles.md`
5. `.claude/instructions/figma-comp-rules.md`
6. `.claude/instructions/settings-groups/section-settings.md`
7. `.claude/instructions/settings-groups/block-settings.md`
8. `.claude/skills/figma-to-shopify/references/generation-rules.md`
9. `.claude/skills/figma-to-shopify/references/styling-tailwind.md`
10. `.claude/skills/figma-to-shopify/references/spacing-and-layout.md`

These rules govern every fix you make. If a file does not exist, stop and tell the user.

---

## Phase 3 — Read Current Files

Read the files you will be modifying:

1. `sections/<section-name>.liquid`
2. Every block file referenced by the section — check `{% render %}` calls and `content_for "block"` to find them (e.g. `blocks/_hero-section__slides.liquid`, `blocks/_section-content__title.liquid`)
3. `styles/sections/<section-name>.scss`
4. The template JSON file (fourth argument or inferred from page slug)

After reading, note the current state of each file so you know exactly what needs to change.

---

## Phase 4 — Screenshot the Live Site

### 4a. Find section DOM ID

Run:
```bash
curl -s http://127.0.0.1:9292/<page-slug> | grep -o 'id="shopify-section-[^"]*"'
```
Find the entry containing your section name. Pass the portion **after** `shopify-section-` to the screenshot tool.

### 4b. Run screenshots in parallel

```bash
node .claude/tools/screenshot-section/screenshot.js \
  --url "http://127.0.0.1:9292/<page-slug>" \
  --section-id "<dom-id-without-shopify-section-prefix>" \
  --width 430 \
  --out mobile-site.png

node .claude/tools/screenshot-section/screenshot.js \
  --url "http://127.0.0.1:9292/<page-slug>" \
  --section-id "<dom-id-without-shopify-section-prefix>" \
  --width 1440 \
  --out desktop-site.png
```

After both succeed, `Read` both from `.claude/tools/screenshot-section/screenshots/`.

**Timeout fix:** Patch line ~53 of `.claude/tools/screenshot-section/screenshot.js` if needed:
```js
await page.goto(url, { waitUntil: "load", timeout: 30000 });
```

**Invisible elements in screenshot:** If an element appears in the live browser but is invisible in the headless screenshot, it's a GSAP entrance animation that didn't complete. The screenshot tool waits 1200ms for animations — if that's not enough, this is animation-dependent behavior, not a code bug. Note it but do not attempt to "fix" it via CSS.

---

## Phase 5 — Diagnose and Plan Fixes

You now have Figma specs, live screenshots, and current file contents. For each visual difference, identify the root cause and the correct fix layer. **Always use the highest-priority layer that can reach the problem.**

### Fix Layer Priority (non-negotiable)

| Priority | Layer | What it covers |
|---|---|---|
| **1 — Settings** | Template JSON `settings` objects | Text content/case, font style, text/bg color, padding via Block Layout Controls, alignment, height, gradients |
| **2 — Tailwind classes** | Directly in `.liquid` files | Any visual/layout property not reachable via settings |
| **3 — SCSS** | `styles/sections/<section-name>.scss` | Schema `"class"` rules, third-party DOM, anything Tailwind cannot reach |

### Issue → Fix Layer Reference

| Issue | Fix Layer | Mechanism |
|---|---|---|
| Wrong text content or case | Settings | Update `heading` value in template JSON to exact Figma string |
| Text not uppercase | See diagnostic below | —  |
| Wrong font family | Settings | `font_family` or `header_style` on the title block |
| Wrong font size | Settings | `header_style` maps from Figma named style (see generation-rules.md) |
| Wrong line-height or letter-spacing | Tailwind | `leading-[X]` / `tracking-[Xpx]` on the element in Liquid |
| Wrong padding / side inset | Settings | Block Layout Controls: `enable_padding_settings: true`, then `padding_left/right_*` |
| Wrong gap between elements | Settings | Block Layout Controls: `enable_margin_settings: true`, then `margin_bottom_*` |
| Section too tall or wrong height | Settings | `height_mobile`, `height_desktop`, `max_height_desktop` on the slide/hero block |
| Text at wrong x-position | Settings | Verify `enable_padding_settings: true` + correct padding on `_section-content` |
| Text at wrong y-position | Settings | `vertical_alignment` on `_section-content` or slide block |
| Text alignment (left vs center) | Settings | `mobile_alignment`, `desktop_alignment`, or `text_alignment_mobile/desktop` |
| Wrong overlay gradient | Settings | `overlay_gradient` on the slide block |
| Wrong text color | Settings | `text_color` on `_section-content` block |
| Wrong background color | Settings | `bg_color` on section; `background_color` on `_section-content` |
| Layout/flex issue not reachable via settings | Tailwind | Add/modify utility classes in the `.liquid` file |
| Schema-class-driven layout | SCSS | Target the BEM class from the block `"class"` field |

### Text Case Diagnostic

When comp shows uppercase text but the live site shows sentence case, there are two possible causes with different fixes:

**Cause A — The heading value is entered as sentence case in template JSON, and `header_style` does NOT auto-apply uppercase.** Check: look at an existing section on the live site where heading text IS uppercase and check its template JSON `heading` value. If the JSON value is already uppercase → the `header_style` CSS applies it. If not → the JSON value must be uppercase itself.

**Cause B — The `header_style` value is wrong.** If the heading value in JSON is already uppercase but it's still rendering sentence case, the `header_style` class may not be applying the correct font at all. Cross-reference the `header_style` → CSS variable mapping in `generation-rules.md` and verify the right level is set.

In most cases for this project: **set the `heading` text in template JSON to ALL-CAPS directly** (matching the exact Figma comp string). This is the safest fix at the settings layer.

### Font Mismatch Diagnostic

When the rendered font looks wrong (e.g. monospaced instead of display font):

1. Note the `header_style` value on the block in template JSON (e.g. `"h5"`)
2. Check `generation-rules.md` `header_style` mapping table — confirm `h5` maps to the expected CSS variable
3. In the browser dev tools (or by reading the section Liquid), confirm the CSS class for that `header_style` uses `var(--font-heading-h5)` and not a different variable
4. CommitMono Bold always maps to `var(--custom-font-name-2)` — if you see monospaced text where Midnight Sans is expected, the `font_family` setting may be wrongly set to `"custom-font-name-2"` on that block

### Critical: `_section-content` Two-Level Enable Pattern

Child values have **zero effect** unless the parent is enabled:
```json
"enable_padding_settings": true,   // MUST be true
"padding_x_desktop": true,         // MUST be true
"padding_left_desktop": 30         // now applies
```
When text appears at wrong x/y position, always audit these enablement flags first.

---

## Phase 6 — Apply Fixes

Apply all fixes in settings → Tailwind → SCSS order.

**Settings:** Edit only affected keys in template JSON. Do not rewrite the whole file.

**Tailwind:** Edit the relevant `.liquid` file. Follow all rules from `styling-tailwind.md`:
- Correct breakpoint prefixes: `large:` not `lg:`
- Font families: `[font-family:var(--font-heading-h3)]`
- CommitMono Bold → always `var(--custom-font-name-2)`
- No static heights unless explicitly required

**SCSS:** Edit `styles/sections/<section-name>.scss`. Scope under section BEM class. Only for schema class rules or third-party DOM.

---

## Phase 7 — Copy to Main and Verify

1. **Find main working dir:** `git worktree list | head -1 | awk '{print $1}'`
2. **Copy changed files:** `cp <worktree>/<file> <main>/<file>` for each changed file
3. **Re-screenshot:** Repeat Phase 4 (dev server hot-reloads on file change)
4. **Compare** new screenshots against Figma comps
   - Still fixable → return to Phase 6, apply more fixes, repeat Phase 7
   - Needs real image → note as "needs image to verify"
   - Needs architectural change → flag for user, do not attempt
5. **Iterate** until matched or only image-dependent gaps remain

---

## Phase 8 — Report

1. **Fixes applied** — each file, what changed, which layer (settings / Tailwind / SCSS)
2. **Before/after summary** — what visually improved
3. **Remaining gaps** — what's still different and why (image-dependent, architectural, animation)
4. **Next steps** — images to set in admin, `npm run build` if Tailwind classes changed, etc.
