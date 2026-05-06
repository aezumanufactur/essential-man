---
name: Styles
description: Tailwind-first styling approach, custom breakpoints, SCSS exceptions, and build pipeline
type: project
---

# Styles

## Tailwind is Primary

All layout, spacing, and visual styling goes via Tailwind utility classes directly in Liquid files. The Tailwind migration is 100% complete.

**Build:** `tailwind.input.css` → `assets/mfr-styles.css`
- Dev: `npm run watch:tw` (or `npm run dev`)
- Build: `npm run build`
- Loaded via: `snippets/style-tags.liquid`

## SCSS — Exceptions Only

Use SCSS only for:
- Schema `"class"` field rules (Shopify injects these; no Tailwind allowed there)
- Third-party generated DOM (flickity, klaviyo, lottie, okendo, lozad, gsap)
- Styles that structurally cannot use Tailwind classes

SCSS files live in:
- `styles/sections/` — per-section
- `styles/components/` — shared components
- `styles/plugins/` — third-party app styles (scoped by owner class)

SCSS conventions:
- 2-space indentation, nested selectors
- `@import` (not `@use`)
- Pixel values via `rem-calc(15)` — no spaces inside
- Breakpoints via `@include breakpoint(large up)`

## Custom Tailwind Breakpoints

Never use `sm:`, `md:`, `lg:`, `xl:`, `2xl:`. Use only:

| Prefix | Breakpoint |
|--------|-----------|
| *(none)* | Mobile (default) |
| `medium:` | 640px |
| `large:` | 1024px |
| `xlarge:` | 1200px |
| `xxlarge:` | 1440px |

## Arbitrary Values

```liquid
[color:var(--section-heading)]
[justify-content:var(--justify-content-mobile)]
large:[text-align:var(--text-align-desktop)]
h-[calc(100%_+_60px)]
```

Use underscores for spaces inside `calc()`.

## Do Not

- Do not add styles to `tailwind.input.css` beyond infrastructure (import, theme tokens, source paths)
- Do not use `@layer components` for migrated styles
- Do not put Tailwind classes in schema `"class"` fields
