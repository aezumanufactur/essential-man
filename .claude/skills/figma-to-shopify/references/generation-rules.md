# Figma-to-Shopify Generation Rules

Rules refined through QA testing. Apply all of these when generating files in Phase 4.

---

## Block Markup

- Every block needs an outer element + inner element, both with BEM class names
- Every child element inside must also have a BEM class name — not just the wrapper
- Pattern: `<block-name>` → `<block-name>__inner` → `<block-name>__media`, `<block-name>__content`, `<block-name>__footer`, etc.

---

## Buttons

- Never recreate button styling with custom utility classes or inline styles
- Always use the project's established button classes — check CLAUDE.md or existing sections for the pattern
- Pick variant by visual weight: primary = filled/prominent, secondary = outlined, tertiary = ghost
- Compact ghost button (≤34px tall in the comp): `button tertiary shrink-0 !min-h-[34px] !py-[11px] !px-[20px] !text-[13px]` — the `!important` overrides fight the default button min-height

---

## Fonts

- Family: always use CSS variables — `var(--font-heading-hN)` for headings, `var(--font-body)` for default body
- CommitMono Bold (body copy, descriptions, tags, attribution text) → always `var(--custom-font-name-2)` — NEVER `var(--font-body)`. This is the most common font mapping error.
- CommitMono Regular → `var(--font-body)`
- Midnight Sans Regular/Medium/Bold → `var(--font-heading-hN)`, where N comes from the Figma named style (see `header_style` mapping below)
- Size + weight: always match the comp values explicitly

---

## Colors

- On color-scheme-driven sections: use `[color:var(--section-heading)]` for text, `bg-[var(--section-bg)]` for backgrounds
- On banner/overlay sections where `_section-content` sits on a dark image: force `text_color: "#eeece5"` on the block — the color scheme does NOT adapt automatically
- For fixed sub-element backgrounds that aren't themed (e.g. testimonial card footer strip): use literal hex, e.g. `bg-[#d5d1c8]`
- Border colors: always `border-[color:var(--section-heading)]` or `border-current` — never a hardcoded hex

---

## Liquid Patterns

- Use `{%- ... -%}` trim markers on all top-level tags
- Render calls: each parameter on its own line
- Wrap optional content in `{%- if setting != blank -%}` blocks
- Star ratings: clamp with `| times: 1`, then if/endif guard for min/max

---

## Schema

- `"class"` field: BEM class names only — no utility classes, no `[` `]`, max 200 chars
- Settings grouped under `"header"` inputs
- Required fields: `name`, `class`, `settings`, `blocks`, `presets`
- For unpopulatable settings (product, image, video): still add schema entries — values set in template JSON

---

## `_section-content` Block Configuration

The `_section-content` block appears in almost every section. Configure it in template JSON — don't leave it at defaults. The two-level enable pattern is critical: a parent checkbox (`enable_padding_settings`, `enable_margin_settings`, `enable_width_settings`) MUST be set to `true` before any child values have any effect.

### Horizontal inset (padding)

Standard grid inset for most sections:
```json
"enable_padding_settings": true,
"padding_x_mobile": true,
"padding_left_mobile": 20,
"padding_right_mobile": 20,
"padding_x_desktop": true,
"padding_left_desktop": 30,
"padding_right_desktop": 30
```
Skip this when the section is already inside a grid-container that handles its own padding (e.g. banner image slides, banner sections).

### Vertical bottom padding

Set `padding_y_mobile/desktop: true` when the comp shows spacing below the `_section-content` block before the next element (e.g. a gap before a card grid or carousel). Read the px value from Figma.

### Margin-bottom (gap before cards/carousel)

When there's a gap in the comp between the heading area and what follows:
```json
"enable_margin_settings": true,
"margin_y_mobile": true,
"margin_bottom_mobile": 20,
"margin_y_desktop": true,
"margin_bottom_desktop": 20
```

### Width (narrow heading column)

When the comp shows a heading column narrower than its container:
```json
"enable_width_settings": true,
"width_mobile": "80%",
"width_desktop": "50%"
```
Calculate: `round(element_width / parent_width × 100)%`. Use `max_width_desktop` (px) when the comp shows a hard cap rather than a percentage.

### Text color on dark backgrounds

When `_section-content` sits on top of a dark image or video, force:
```json
"text_color": "#eeece5"
```
The color scheme does not adapt automatically in this context.

### `use_grid_container_max_width`

Set `"use_grid_container_max_width": false` when the parent slide or wrapper already handles its own container padding (banner image slides). Otherwise `true`.

---

## Template JSON: Section Settings

### `bg_color`

There are always 3 color schemes: (1) dark text + light bg, (2) light text + dark bg, (3) light text + transparent bg. When a section's background in the comp doesn't match a scheme's default, pick the scheme whose text colors match, then set `bg_color` to the exact hex from the comp to override just the background.

Token map: `#eeece5` = essential-white, `#1e1b22` = carbon, `#c4bfb3` = warm-sand, `#51482b` = dark-olive, `#d5d1c8` = soft-stone.

### Spacing

Always read `top_spacing_mobile/desktop` and `bottom_spacing_mobile/desktop` from the Figma comp's outermost padding values. Never use the schema defaults (100px). Bottom spacing is 0 for full-bleed or edge-to-edge sections.

### Section dividers

Set `"section_divider_top": "line"` or `"section_divider_bottom": "line"` when the comp shows a visible horizontal rule (border) between this section and the adjacent one.

### `container_width`

Use `"full"` when any element in the section hits the edge of the viewport (e.g. product grid cards bleed to edge, testimonials carousel extends edge-to-edge). Use `""` (contain) when all elements have margins/padding away from the edge — nothing touches the viewport boundary.

---

## Template JSON: Static vs Dynamic Blocks

- **Static blocks** — add `"static": true` + `"id": "<slug>"` in both the template JSON block entry AND the section/block schema presets. The id slug must match between the two.
- **Dynamic blocks** — no `"static"` or `"id"` in presets. They appear in `block_order` only.
- **Never add `"id"` to dynamic preset blocks** — Shopify rejects it.
- Static block IDs in template JSON are the same slug declared in the schema preset (e.g. `"id": "section-content"` maps to `"section-content": { ... }` as the key in the `blocks` object).

---

## `header_style` Mapping from Figma Named Styles

The Figma comp uses named text styles. Map them directly to `header_style` — do not guess from font size alone.

| Figma style name | `header_style` value | Size mobile / desktop | Weight |
|---|---|---|---|
| `mobile/header/h1` | `"h1"` | 60px / 90px | 400 |
| `mobile/header/h2` | `"h2"` | 34px / 46px | 500 |
| `mobile/header/h4` | `"h4"` | 20px / 26px | 500 |

Read the style name from `get_design_context` output (appears in styles metadata).

Also: bold label/tag text below a heading (e.g. "SINGLE PRODUCTS (02)") maps to a `_section-content__text` block with `font_family: "custom-font-name-1"` and `text_style: "bold"` — **not** a second title block.

---

## Hard Rules (Never Violate)

- BEM class on every element — not just outer/inner wrapper
- No custom button styling — always use the project's `.button` class pattern
- No utility classes in schema `"class"` field
- `mb-` / `margin-bottom` preferred over `mt-` / `margin-top` for spacing between sibling elements
- Never add static Tailwind padding or margin classes directly on blocks — Block Layout Controls settings exist for this; use those in template JSON instead
