# Learned Patterns — Schema

- Dynamic preset blocks must NOT have `"id"` in the schema preset. Only static blocks get `"id"`.
- Schema `"class"` field: BEM class names only — no Tailwind utilities, no `[` `]` characters. Max 200 chars.
- Block type in schema must match the full filename minus `.liquid` (e.g. `_mfr-core__hero-banner__slide` not `slide`).
- Block Layout Controls (width/padding/margin settings) must always be the **last group** in a block's `"settings"` array — after all block-specific settings.
- Min-height (and similar dimension overrides) on schema `"class"` elements: use a conditional scoped `<style>` tag with `#shopify-block-{{ block.id }}` — skip rendering when value is `0` or blank. Use `number` type with `default: 0` and `info: "in pixels. Leave at 0 for no min height."`.
