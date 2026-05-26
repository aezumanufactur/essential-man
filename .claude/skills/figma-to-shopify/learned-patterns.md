# Learned Patterns

Rules extracted from past sessions. Apply all of these during Phase 4 generation.

---

## Typography

- CommitMono Bold (body copy, descriptions, tags, attribution text) → always `var(--custom-font-name-2)`, never `var(--font-body)`. This is the single most common font mapping error.
- Always use CSS variable for font family — `var(--font-heading-hN)` for headings, `var(--font-body)` for body. Never hardcode font family names.
- Pick heading level from the Figma named style (e.g. `mobile/header/h2` → `var(--font-heading-h2)`), not by eyeballing pixel size.

---

## Colors & Borders

- Borders always use `currentColor` or `border-[color:var(--section-heading)]` — never a hardcoded hex value. This ensures they adapt to color scheme changes.
- Banner/overlay sections where `_section-content` sits on a dark image: force `"text_color": "#eeece5"` on the block in template JSON. The color scheme does not auto-adapt in this context.

---

## Spacing & Layout

- Never add `h-[]` or `min-h-[]` on wrappers or content elements. Use `aspect-[W/H]` for media containers.
- Never add static Tailwind padding or margin classes directly on blocks. Use Block Layout Controls settings in template JSON instead.
- Never add horizontal padding (`padding_x`) directly to blocks. Use the section `container_width` setting for horizontal spacing.
- `position: relative` on a schema `"class"` element must go in the section SCSS file, not Tailwind — Shopify injects the class on the block wrapper and Tailwind can't target it.
- Block Layout Controls two-level enable: `enable_padding_settings: true` must be set before any `padding_*` child values have effect. Same for `enable_margin_settings` and `enable_width_settings`.

---

## Schema & Template JSON

- Dynamic preset blocks must NOT have `"id"` in the schema preset. Only static blocks get `"id"`.
- Schema `"class"` field: BEM class names only — no Tailwind utilities, no `[` `]` characters. Max 200 chars.
- Block type in schema must match the full filename minus `.liquid` (e.g. `_mfr-core__hero-banner__slide` not `slide`).
- Block Layout Controls (width/padding/margin settings) must always be the **last group** in a block's `"settings"` array — after all block-specific settings.
- Min-height (and similar dimension overrides) on schema `"class"` elements: use a conditional scoped `<style>` tag with `#shopify-block-{{ block.id }}` — skip rendering when value is `0` or blank. Use `number` type with `default: 0` and `info: "in pixels. Leave at 0 for no min height."`.

---

## Liquid Patterns

- Use `{%- ... -%}` trim markers on all top-level Liquid tags to prevent whitespace with empty blocks.
- Never loop `section.blocks` to find a specific block type. Use `content_for "block"` for static blocks.
