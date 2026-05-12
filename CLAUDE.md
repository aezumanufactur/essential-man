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

| File | Covers |
|------|--------|
| sections.md | Section creation, naming, SCSS scaffold, section groups |
| blocks.md | Block creation, naming, BEM, schema requirements |
| liquid-html.md | Liquid/HTML patterns, render calls, Alpine in Liquid |
| styles.md | Tailwind-first, breakpoints, SCSS exceptions, build |
| scripts.md | JS conventions, Alpine components, build pipeline |
| figma-comp-rules.md | Rules for translating Figma comps — images, typography, widths, heights |
| settings-groups/section-settings.md | Reusable section schema groups (spacing, alignment, bg, etc.) |
| settings-groups/block-settings.md | Reusable block schema groups (aspect ratio, layout controls) |

For Tailwind migration context: `tailwind-migration/CLAUDE.md`

## Global Rules

- 2-space indentation everywhere
- Keep existing style in the file you're editing — don't reformat unrelated lines
- Blank lines between logical blocks
- Schema arrays: each object on its own lines, never `},{`
- BEM class names throughout
