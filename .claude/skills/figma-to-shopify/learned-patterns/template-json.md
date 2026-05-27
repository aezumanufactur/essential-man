# Learned Patterns — Template JSON

## Section ID Must Not Contain `__`

Shopify rejects section IDs that contain double underscores (`__`). Use only single underscores when constructing section and block IDs in template JSON:

- **Wrong:** `mfr_core__accordion_faq001`
- **Correct:** `accordion_section_faq001`

This applies to all IDs in the `"sections"` object and `"order"` array. Derive IDs from descriptive words separated by single underscores, not from the section's filename (which uses `__`).

---

## Two-Column Layout via Width Settings

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

## Intra-Block Spacing

Gap values between elements within a `_section-content` block map to `margin_bottom_mobile/desktop` on the *earlier* block (not `margin_top` on the later one):

| Figma gap | Setting |
|-----------|---------|
| gap between label and heading | `margin_bottom_mobile/desktop` on the `_section-content__small-text` block |
| gap between heading and body | `margin_bottom_mobile/desktop` on the `_section-content__title` block |
| gap between body and CTA | `margin_bottom_mobile/desktop` on the body `_section-content__text` block |

Always read these values directly from the comp. On desktop they may differ from mobile (e.g. 70px mobile → 132px desktop).

---

## Background Color Override

The page has three color schemes with fixed text/bg color pairs. When a section's background in the comp doesn't match any scheme's default:
1. Pick the scheme whose **text color** matches the comp (e.g. scheme-1 = dark text)
2. Set `bg_color` to the exact hex from the comp to override just the background
3. Leave `color_scheme` set to the matching scheme — do not create a new scheme

Token map for bg_color: `#eeece5` = essential-white, `#1e1b22` = carbon, `#c4bfb3` = warm-sand, `#a3a6a7` = blue-grey, `#51482b` = dark-olive, `#514641` = dark-brown.

---

## Section Outer Spacing

Read `top_spacing_mobile/desktop` and `bottom_spacing_mobile/desktop` directly from the comp's outermost padding values. Never use schema defaults (100px). The Figma `py-[Xpx]` value maps directly to both top and bottom spacing when symmetric.

---

## Font Family in `_section-content__text` Blocks

The `font_family` options available in the block schema are project-specific (check the block's schema for the option list). The pattern to apply:

- **Non-heading display font used for body copy / tags / CTAs** → read the `font_family` option value from the block schema that corresponds to the font in the comp. Check `styling-tailwind.md` or `generation-rules.md` for the current project's font → option-value mapping.
- **Default theme body font** → `""` (empty string)
- **Heading blocks** (`_section-content__title`) → `font_family` always `""` — heading level is set via `header_style` (mapped from Figma named style), not font_family

Do not hardcode font names or custom-font-name-N values into this patterns file — look them up from the project's reference files each session.
