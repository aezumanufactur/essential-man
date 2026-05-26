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
- Fourth token (optional) = template JSON file path (e.g. `templates/page.the-standard.json`). If omitted, infer from section name or ask the user.

---

## Phase 0 — Isolate in Worktree

Before touching any files, ensure you are isolated from the user's main working copy:

- If your current working directory is already under `.claude/worktrees/`, you are already isolated — skip to Phase 1.
- Otherwise: run `git worktree add .claude/worktrees/qa-fix__<section-name> HEAD` and call `EnterWorktree` with that path.

Record the worktree path — all subsequent file reads and writes happen inside it.

---

## Phase 1 — Read Figma Comps

Call `mcp__figma-desktop__get_design_context` on both URLs **in parallel**.
Call `mcp__figma-desktop__get_screenshot` on both URLs **in parallel** (can run alongside get_design_context).

Extract and record from the design context:
- **Frame dimensions** — exact pixel width and height of each comp
- **Text content** — exact string values, including case (uppercase vs sentence case)
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
4. The template JSON file (fourth argument, or ask if not provided)

After reading, note the current state of each file so you know exactly what needs to change.

---

## Phase 4 — Screenshot the Live Site

### 4a. Find the correct section DOM ID

The section ID in the template JSON (e.g. `mfr_core_hero_banner_St4ndA`) is NOT the full DOM id. Shopify prepends a template context prefix. Run:

```bash
curl -s http://127.0.0.1:9292/<page-slug> | grep -o 'id="shopify-section-[^"]*"'
```

Find the entry containing your section name. The DOM id looks like:
`shopify-section-template--21831569670244__mfr_core_hero_banner_St4ndA`

Pass it to the screenshot tool **without** the `shopify-section-` prefix (just the part after that).

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

After both succeed, `Read` both output files from `.claude/tools/screenshot-section/screenshots/`.

**If the screenshot tool times out:** The Shopify dev server keeps a live-reload websocket open that prevents `networkidle`. Patch line ~53 of `.claude/tools/screenshot-section/screenshot.js`:
```js
// Change waitUntil: "networkidle" → waitUntil: "load"
await page.goto(url, { waitUntil: "load", timeout: 30000 });
```

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
| Wrong text content or case | Settings | Update `heading` in template JSON to exact string with correct case |
| Text not uppercase | Settings | Set `heading` value to `"ALL CAPS"` text directly |
| Wrong font family | Settings | `font_family` or `header_style` on the title block in template JSON |
| Wrong font size | Settings | `header_style` maps directly from Figma named style (see generation-rules.md) |
| Wrong line-height or tracking | Tailwind | `leading-[X]` / `tracking-[Xpx]` on the element in Liquid |
| Wrong padding / side inset | Settings | Block Layout Controls: `enable_padding_settings: true`, then `padding_left/right_*` |
| Wrong gap between elements | Settings | Block Layout Controls: `enable_margin_settings: true`, then `margin_bottom_*` |
| Section too tall or wrong height | Settings | `height_mobile`, `height_desktop`, `max_height_desktop` on the slide/hero block |
| Text at wrong x-position | Settings | Verify `enable_padding_settings: true` is set on `_section-content`; check padding values |
| Text at wrong y-position (vertical) | Settings | `vertical_alignment` on `_section-content` or slide block (`flex-end`, `center`, etc.) |
| Text alignment (left vs center) | Settings | `mobile_alignment`, `desktop_alignment`, or `text_alignment_mobile/desktop` |
| Wrong overlay gradient | Settings | `overlay_gradient` value on the slide block |
| Wrong text color | Settings | `text_color` on `_section-content` block |
| Wrong background color | Settings | `bg_color` on section; `background_color` on `_section-content` |
| Layout/flex issue not reachable via settings | Tailwind | Add/modify utility classes in the `.liquid` file |
| Schema-class-driven layout | SCSS | Target the BEM class from the block `"class"` field |

### Critical: `_section-content` Two-Level Enable Pattern

The Block Layout Controls use a parent-checkbox pattern. Child values have **zero effect** unless the parent is enabled first:

```json
"enable_padding_settings": true,   // ← MUST be true
"padding_x_desktop": true,         // ← MUST be true
"padding_left_desktop": 30         // ← only now does this apply
```

Same for `enable_margin_settings` + `margin_y_*`, and `enable_width_settings` + `width_*`. When text appears at the wrong position, always audit these enablement flags first.

---

## Phase 6 — Apply Fixes

Apply all fixes in settings → Tailwind → SCSS order.

**Settings fixes:** Edit only the affected keys in the template JSON. Do not rewrite the whole file.

**Tailwind fixes:** Edit the relevant `.liquid` file. Follow all rules from `styling-tailwind.md`:
- Correct breakpoint prefixes: `large:` not `lg:`, `medium:` not `md:`
- Font families via CSS variables: `[font-family:var(--font-heading-h3)]`
- No static heights: `h-[Xpx]` only if explicitly needed
- CommitMono Bold → always `var(--custom-font-name-2)`

**SCSS fixes:** Edit `styles/sections/<section-name>.scss`. Scope all rules under the section's BEM class. Only for schema class rules or third-party DOM.

---

## Phase 7 — Copy to Main and Verify

1. **Find main working dir:** `git worktree list | head -1 | awk '{print $1}'`

2. **Copy changed files** to main:
   ```bash
   cp <worktree>/<changed-file> <main-dir>/<changed-file>
   diff <worktree>/<changed-file> <main-dir>/<changed-file>
   ```

3. **Re-screenshot** the live site (repeat Phase 4 — the dev server hot-reloads on file changes).

4. **Compare** new screenshots against Figma comps. For each remaining difference:
   - Fixable → return to Phase 6, apply more fixes, repeat Phase 7
   - Requires real hero image to verify (gradient visibility etc.) → note as "needs image to verify"
   - Requires architectural change → flag for the user, do not attempt

5. **Iterate** until the section matches the comp or only image-dependent gaps remain.

---

## Phase 8 — Report

1. **Fixes applied** — each file changed, what changed, which layer (settings / Tailwind / SCSS)
2. **Before/after summary** — what visually improved
3. **Remaining gaps** — what's still different and why
4. **Next steps** — anything the user needs to do:
   - Set images in Shopify admin
   - Run `npm run build` if Tailwind classes were added/changed in any `.liquid` file
   - Any architectural issues flagged
