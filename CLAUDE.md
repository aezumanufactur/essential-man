# Manufactur Theme v4 — AI Instructions

## Tech Stack

- **Shopify** theme (custom, not Dawn-based)
- **Tailwind CSS v4** — primary styling (migration 100% complete)
- **SCSS** — exceptions only (schema classes, third-party DOM)
- **Alpine.js** — interactivity
- **GSAP** — animations
- **Gulp** — JS/SCSS build pipeline

## Instruction Files

@.claude/instructions/sections.md
@.claude/instructions/blocks.md
@.claude/instructions/liquid-html.md
@.claude/instructions/styles.md
@.claude/instructions/scripts.md
@.claude/instructions/figma-comp-rules.md
@.claude/instructions/settings-groups/section-settings.md
@.claude/instructions/settings-groups/block-settings.md

| File | Covers | **Read when** |
|------|--------|---------------|
| sections.md | Section creation, naming, SCSS scaffold, section groups | Creating, copying, or renaming any `sections/*.liquid` file; asked about section structure, section groups, or the `.bak` template |
| blocks.md | Block creation, naming, BEM, schema requirements | Creating or editing any `blocks/*.liquid` file; adding schema `type`/`name`/`presets`; asked about block naming or BEM conventions |
| liquid-html.md | Liquid/HTML patterns, render calls, Alpine in Liquid | Writing Liquid tags, `render` calls, `content_for`, trim markers `{%- -%}`, or wiring Alpine `x-data`/`x-bind` in a `.liquid` file |
| styles.md | Tailwind-first, breakpoints, SCSS exceptions, build | Adding or changing any CSS — Tailwind classes, SCSS files, breakpoints, or build commands |
| scripts.md | JS conventions, Alpine components, build pipeline | Creating or editing any JS file in `scripts/`; adding a new Alpine component; touching the Gulp/build pipeline |
| figma-comp-rules.md | Rules for translating Figma comps — images, typography, widths, heights | Implementing any Figma comp (images, aspect ratios, typography, widths) — **mandatory before writing markup from a comp** |
| settings-groups/section-settings.md | Reusable section schema groups (spacing, alignment, bg, etc.) | Adding settings to a section schema — spacing, alignment, background, color scheme, container width, etc. |
| settings-groups/block-settings.md | Reusable block schema groups (aspect ratio, layout controls) | Adding settings to a block schema — aspect ratio, layout controls, font settings |

For Tailwind migration context: `tailwind-migration/CLAUDE.md`

## Global Rules

- 2-space indentation everywhere
- Keep existing style in the file you're editing — don't reformat unrelated lines
- Blank lines between logical blocks
- Schema arrays: each object on its own lines, never `},{`
- BEM class names throughout
