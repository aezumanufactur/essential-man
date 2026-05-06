# Tailwind Migration Guide

> Read `tailwind-migration/progress.md` first. Open `tailwind-migration/patterns.md` only for edge-case examples.

## Mission
Migrate Liquid files (`sections/`, `blocks/`, `snippets/`) to Tailwind. SCSS files are cleanup targets, not migration targets.

## Rules
- Keep the main BEM/identity class on every element; add Tailwind beside it.
- Replace styling classes with Tailwind utilities directly on the element.
- Do not change schema keys, block types, settings, Liquid logic, or JS hooks unless required for styling output.
- Do not put Tailwind classes in schema `"class"` fields — Shopify rejects `[`/`]` and enforces length limits.
- Do not add styles to `tailwind.input.css` or use `@layer components` for migrated styles.
- Do not create Alpine plugin SCSS. Alpine is excluded.

## Build
- Input: `tailwind.input.css` → Output: `assets/mfr-styles.css`
- Loaded by: `snippets/style-tags.liquid`
- Verify: `npm run build`
- Dev: `http://127.0.0.1:9292`
- `tailwind.input.css` must contain only Tailwind infrastructure: import, theme/breakpoints, source paths.

## Workflow
1. Pick a `⏳ Pending` target from `progress.md`.
2. Mark it `🔄 In Progress` before editing.
3. Map the bundle: section Liquid, rendered snippets, schema block types, SCSS refs from `progress.md`.
4. Migrate in order: section → blocks → snippets.
5. Move styling for generated third-party DOM into `styles/plugins/*.scss`, scoped by owner class.
6. Remove uneccessary styling on section, blocks, snippets scss file after migration. Those scss file should only be for styling that can't be applied via tailwind such as schema classes and elements that is dynamically being appended by 3rd paty javascript (example: flickity and klaviyo).
6. Run `npm run build`.
7. Mark completed Liquid files `✅ Done` in `progress.md` and update summary counts.

## Tailwind Syntax
Breakpoints — custom only (never `sm:`, `md:`, `lg:`, `xl:`, `2xl:`):
- no prefix: mobile
- `medium:` = 640px
- `large:` = 1024px
- `xlarge:` = 1440px
- `xxlarge:` = 1600px

Arbitrary values:
```liquid
[color:var(--section-heading)]
[justify-content:var(--justify-content-mobile)]
[align-items:inherit]
large:[text-align:var(--text-align-desktop)]
h-[calc(100%_+_60px)]
```
Use underscores for spaces inside `calc()`.

## Non-Tailwind SCSS
Use SCSS only for elements that cannot receive Tailwind directly:
- Shopify block wrappers → section SCSS if alive, else `styles/core/blocks.scss`
- Third-party/generated DOM → `styles/plugins/*.scss` (`flickity`, `gsap`, `klaviyo`, `lottie`, `lozad`, `okendo`, `shopify-app-blocks`, `shopify-option-selectors`)
- Dynamic Shopify setting values → inline `style` or section-scoped `<style>`
