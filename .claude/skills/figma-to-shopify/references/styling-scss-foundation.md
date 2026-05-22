# Styling Rules — SCSS + Foundation Projects

Apply these in addition to `generation-rules.md` when the project uses SCSS + Foundation (no Tailwind).

---

## General

- All layout, spacing, and visual styling goes in the section's SCSS file
- No utility classes in Liquid files — classes go in SCSS
- Check CLAUDE.md or existing sections for the project's SCSS variable and mixin conventions

---

## Spacing & Sizing

- No static heights unless the user explicitly requests it
- Media aspect ratios: use `padding-bottom` percentage trick or `aspect-ratio` CSS property — match comp values
- Vertical spacing: `margin-bottom` preferred over `margin-top` for spacing between siblings
- Use `rem-calc()` for pixel values if the project uses Foundation's rem-calc mixin (check existing SCSS files)

---

## Breakpoints

- Use Foundation's `@include breakpoint()` mixin — check CLAUDE.md or existing SCSS for the project's named breakpoints
- Never hardcode `@media` queries directly — always use the project's established breakpoint pattern

---

## Buttons

- Use the project's established button classes — check existing sections for the pattern (commonly `.button`, `.btn`, etc.)
- Never recreate button styling inline

---

## Fonts

- Use the project's established font variables or mixins — check `_variables.scss` or CLAUDE.md
- Size + weight: match the comp values explicitly

---

## Colors

- Use SCSS variables for all colors — check `_variables.scss` or CLAUDE.md for the token names
- Only use hardcoded values when the color is truly fixed (decorative, not themed)

---

## SCSS File Structure

- Section styles → `styles/sections/<section-name>.scss`
- Block styles → nested inside the section SCSS under the block's BEM class
- Do NOT put block styles in a separate blocks.scss file
- Use `@import` (not `@use`) — check existing files to confirm the project's import style
- Nested selectors following BEM: `.block-name { &__element { } &--modifier { } }`
