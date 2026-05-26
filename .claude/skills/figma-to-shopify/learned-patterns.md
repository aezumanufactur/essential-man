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

---

## Template JSON — Two-Column Layout via `_section-content` Width Settings

When the comp shows two side-by-side columns on desktop (stacking on mobile), use two `_section-content` blocks:
- **Static `section-content`** → left column
- **Dynamic block** → right column
- Set `enable_width_settings: true` on both

**Width calculation from Figma:**
1. Left column width (%) = position where right column starts / total content width × 100
   - e.g. right column starts at 845px in 1380px container → left = round(845/1380×100) = 61%
2. Right column width (%) = right element width / total content width × 100
   - e.g. body text is 535px wide → right = round(535/1380×100) = 39%
3. Left % + right % should equal 100 so they sit side-by-side; any leftover is absorbed as space between them

On mobile both blocks use `width_mobile: false` (full width) and stack naturally.

**Mobile stacking gap:** Set `margin_bottom_mobile` on the left `_section-content` to match the Figma gap between the two groups when stacked vertically. Read from the gap between heading and body in the mobile comp.

---

## Template JSON — Intra-Block Spacing

Gap values between elements within a `_section-content` block map to `margin_bottom_mobile/desktop` on the *earlier* block (not `margin_top` on the later one):

| Figma gap | Setting |
|-----------|---------|
| gap between label and heading | `margin_bottom_mobile/desktop` on the `_section-content__small-text` block |
| gap between heading and body | `margin_bottom_mobile/desktop` on the `_section-content__title` block |
| gap between body and CTA | `margin_bottom_mobile/desktop` on the body `_section-content__text` block |

Always read these values directly from the comp. On desktop they may differ from mobile (e.g. 70px mobile → 132px desktop).

---

## Template JSON — Background Color Override

The page has three color schemes with fixed text/bg color pairs. When a section's background in the comp doesn't match any scheme's default:
1. Pick the scheme whose **text color** matches the comp (e.g. scheme-1 = dark text)
2. Set `bg_color` to the exact hex from the comp to override just the background
3. Leave `color_scheme` set to the matching scheme — do not create a new scheme

Token map for bg_color: `#eeece5` = essential-white, `#1e1b22` = carbon, `#c4bfb3` = warm-sand, `#a3a6a7` = blue-grey, `#51482b` = dark-olive, `#514641` = dark-brown.

---

## Template JSON — Section Outer Spacing

Read `top_spacing_mobile/desktop` and `bottom_spacing_mobile/desktop` directly from the comp's outermost padding values. Never use schema defaults (100px). The Figma `py-[Xpx]` value maps directly to both top and bottom spacing when symmetric.

---

## Template JSON — Font Family in `_section-content__text` Blocks

The `font_family` options available in the block schema are project-specific (check the block's schema for the option list). The pattern to apply:

- **Non-heading display font used for body copy / tags / CTAs** → read the `font_family` option value from the block schema that corresponds to the font in the comp. Check `styling-tailwind.md` or `generation-rules.md` for the current project's font → option-value mapping.
- **Default theme body font** → `""` (empty string)
- **Heading blocks** (`_section-content__title`) → `font_family` always `""` — heading level is set via `header_style` (mapped from Figma named style), not font_family

Do not hardcode font names or custom-font-name-N values into this patterns file — look them up from the project's reference files each session.
