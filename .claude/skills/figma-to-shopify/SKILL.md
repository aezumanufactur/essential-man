---
name: figma-to-shopify
description: Read Figma comps (mobile + desktop) and generate Shopify theme section/block/SCSS/template files following all project conventions.
argument-hint: <mobile-figma-url> <desktop-figma-url> [section-name]
---

You are implementing a Shopify theme component from Figma comps. Follow every phase below in order. Do not skip phases. Do not rely on memory for rules — always read the files explicitly.

Arguments provided: $ARGUMENTS

Parse $ARGUMENTS as: `<mobile-url> <desktop-url> [section-name]`
- First token = mobile Figma node URL
- Second token = desktop Figma node URL
- Third token (optional) = target section filename (e.g. `mfr-core__customer-testimonials`)

---

## Phase 0 — Isolate in Worktree

**This step is MANDATORY and must NEVER be skipped — even if you are already inside another worktree. Every skill run gets its own brand-new worktree. No exceptions.**

Before touching any files, create a brand-new worktree branched from the **current local HEAD** (not origin/main):

1. Derive a branch name from the section name argument (e.g. `figma/mfr-core__hero`) or use `figma/new-section` if no section name was provided yet.
2. Run: `git worktree add .claude/worktrees/<branch-name> HEAD`
   - This starts the worktree from the current local branch state, including any local commits not yet pushed.
   - **Always create a NEW worktree with a new branch name. Never reuse an existing worktree.** Reusing causes the branch to be missing the user's uncommitted changes, which overwrites their in-progress work.
3. Call `EnterWorktree` with `path: ".claude/worktrees/<branch-name>"` to switch the session into it.
4. Record the worktree path — all subsequent file reads and writes happen inside it.
5. Do not proceed to Phase 1 until `EnterWorktree` succeeds.

---

## Phase 1 — Read Figma Comps

Call `mcp__figma-desktop__get_design_context` on both the mobile and desktop URLs.
Call `mcp__figma-desktop__get_screenshot` on both URLs for visual reference.

Extract and note:
- Overall layout structure (flex direction, grid, carousel, etc.)
- All spacing values (gaps, paddings, margins) in px
- All font sizes, weights, line-heights, letter-spacings
- Colors (background, text, border, overlay)
- Media aspect ratios (width:height)
- Component hierarchy (section → wrapper → card → media/content/footer, etc.)
- Interactive elements (buttons, links, icons)
- Conditional elements (shown only when content exists)

---

## Phase 2 — Read ALL Project Rules

**You must call `Read` on every file listed below. Do not skip any. Do not proceed to Phase 3 until all reads are complete.**

Read these project instruction files:
1. `.claude/instructions/sections.md`
2. `.claude/instructions/blocks.md`
3. `.claude/instructions/liquid-html.md`
4. `.claude/instructions/styles.md`
5. `.claude/instructions/figma-comp-rules.md`
6. `.claude/instructions/settings-groups/section-settings.md`
7. `.claude/instructions/settings-groups/block-settings.md`

Read these skill reference files:
8. `.claude/skills/figma-to-shopify/references/generation-rules.md`
9. `.claude/skills/figma-to-shopify/references/styling-tailwind.md` (if Tailwind project)
   OR `.claude/skills/figma-to-shopify/references/styling-scss-foundation.md` (if SCSS+Foundation)
10. `.claude/skills/figma-to-shopify/references/spacing-and-layout.md`

Also read:
11. `templates/index.json` (or `templates/page.test.json` if it exists) — note existing section ID format, image/video URIs, product handles for placeholders

All rules from these files govern everything you generate. If a file does not exist, stop and tell the user.

---

## Phase 3 — Determine Scope & Read Template

**If the section file does not exist yet, you MUST:**

1. Call `Read` on `sections/custom-section-template--with-theme-blocks.bak` — this is the canonical starting point for all new sections. Do not write the section file from scratch.
2. Use that file's content as the base, replacing:
   - `mfr-core__custom-section` → `<filename>`
   - `Custom Section` → `<section name>`

**Then check:**
- Does `styles/sections/<section-name>.scss` exist? If not, create it using the SCSS scaffold from sections.md (which you read in Phase 2).
- Does `blocks/_<section-name>__<block-name>.liquid` exist for each needed block? If not, create it.
- Does the section schema already list the needed block types?

---

## Phase 4 — Generate Files

You have already read all the rules in Phase 2. Apply them now — do not invent patterns from memory.

### 4a. Section File — `sections/<section-name>.liquid`

- Base it on the `.bak` template read in Phase 3
- Apply all rules from sections.md, liquid-html.md, styles.md, figma-comp-rules.md

### 4b. Block File(s) — `blocks/_<section-name>__<block-name>.liquid`

- Apply all rules from blocks.md, liquid-html.md, styles.md, figma-comp-rules.md, generation-rules.md, styling-tailwind.md

### 4c. SCSS — `styles/sections/<section-name>.scss`

- Apply scaffold and rules from sections.md and styling-tailwind.md (or styling-scss-foundation.md)

### 4d. Template JSON

Add a new section entry to the template JSON file read in Phase 2:

- Section ID format: `snake_case_XXXXXX` where XXXXXX = 6 random alphanumeric chars
- Block IDs: same format
- Static blocks: add `"static": true`, exclude from `block_order`
- Dynamic blocks: include in `block_order`, no `"static"` key
- Reuse existing image/video/product URIs from the file for placeholders
- Add 2–4 sample blocks with realistic content matching the comp

---

## Phase 5 — Verify & Report

After all files are written, report:

1. **Files created/modified** — list each with the action taken
2. **Settings needing real values** — image/video/product pickers that need Shopify admin data
3. **Unmapped comp values** — any font, color, or spacing that couldn't be mapped to a project token
4. **Next steps** — what the user should do to see it live

---

## Merging to Main (when user asks)

When the user asks to merge the worktree into main, do exactly this — nothing more:

1. Commit any uncommitted files in the worktree
2. From the main repo root: `git merge <worktree-branch> --no-ff -m "Merge <branch>: <description>"`
3. If there are conflicts on `templates/index.json` only (common): manually resolve by ensuring the new section entry exists in the `sections` object and the section ID is in the `order` array
4. Do NOT stash, do NOT pop stash, do NOT touch any other files. The user's other working changes are intentional — leave them alone.
