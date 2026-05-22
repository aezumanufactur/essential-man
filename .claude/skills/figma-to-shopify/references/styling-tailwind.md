# Styling Rules — Tailwind CSS Projects

Apply these in addition to `generation-rules.md` when the project uses Tailwind.

---

## Utilities

- All layout, spacing, and visual styling via Tailwind utility classes directly in Liquid files
- Check CLAUDE.md for the project's custom breakpoint names — do not assume defaults
  - Common pattern for this setup: `medium:` `large:` `xlarge:` `xxlarge:` (never `sm:` `md:` `lg:` `xl:` `2xl:`)
- Arbitrary values: `[color:var(--token)]`, `[font-family:var(--font-heading-h5)]`
- No styles in `tailwind.input.css` — Tailwind goes in Liquid files directly

---

## Spacing

- No static heights — NEVER use `h-[Xpx]` or `min-h-[Xpx]` unless the user explicitly requests it
- Media aspect ratios: use `aspect-[W/H]` from the comp (e.g. `aspect-[300/525]`) — never height
- Vertical spacing: `py-[Xpx]` for padding, `mb-[Xpx]` preferred over `mt-[Xpx]`
- Never add static padding/margin Tailwind classes on blocks — use Block Layout Controls settings in template JSON

---

## Buttons

- ALWAYS use `.button .primary`, `.button .secondary`, or `.button .tertiary`
- NEVER recreate button styling with custom Tailwind utilities
- Compact ghost button (≤34px tall in the comp): `button tertiary shrink-0 !min-h-[34px] !py-[11px] !px-[20px] !text-[13px]`

---

## Fonts

Font family always via CSS variables — never hardcode font names.

| Figma font | CSS variable | Use for |
|---|---|---|
| Midnight Sans Regular | `var(--font-heading-h1)` – `var(--font-heading-h6)` | Headings — pick level from comp named style |
| Midnight Sans Medium/Bold | `var(--font-heading-h4)` / `var(--font-heading-h5)` etc. | Sub-headings, card titles, labels |
| CommitMono Bold | `var(--custom-font-name-2)` | Body copy, descriptions, tags, attribution text |
| CommitMono Regular | `var(--font-body)` | Default body text |

**CommitMono Bold is always `var(--custom-font-name-2)` — never `var(--font-body)`.** This is the most common font mapping error.

Pick heading level by the Figma named style (e.g. `mobile/header/h2` → `var(--font-heading-h2)`), not by eyeballing the font size.

- Size: explicit `text-[Xpx]` matching comp value
- Weight: `font-[500]`, `font-[700]`, etc. matching comp value

---

## Colors

- On color-scheme-driven sections: use `[color:var(--section-heading)]` for text, `bg-[var(--section-bg)]` for backgrounds
- On banner/overlay sections where content sits on a dark image: force `text_color: "#eeece5"` on the `_section-content` block — the scheme does not adapt automatically
- For fixed sub-element backgrounds that aren't themed (e.g. testimonial card footer strip): use the literal hex, e.g. `bg-[#d5d1c8]`
- Border colors: always `border-[color:var(--section-heading)]` or `border-current` — never hardcoded hex

---

## Images — `object-fit`

- Product images on a plain or transparent background → `object-contain`
- Lifestyle / full-bleed editorial photos → `object-cover`
- The comp always shows which via the image framing — never mix them up

---

## SCSS (exceptions only)

- `p` tag margin reset — use scoped SCSS, NEVER `!important`:
  ```scss
  .block-bem-class {
    p { margin-bottom: 0; }
  }
  ```
  Specificity (0-1-1) beats theme.css bare element (0-0-1)
- **Flickity page dot customization** → always SCSS (Flickity injects its own DOM, Tailwind can't reach it)
- **Schema `"class"` layout rules** (e.g. `flex: 1 0 0`, `max-height`) → SCSS targeting that class
- **Third-party marquee/carousel layout** → SCSS
- Do NOT put layout/spacing/visual styles in SCSS — those go in Tailwind in the Liquid file
- Section SCSS → `styles/sections/<section>.scss` only — not blocks.scss, not inline
