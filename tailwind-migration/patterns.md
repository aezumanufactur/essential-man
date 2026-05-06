# Tailwind Migration Patterns

Open this only when the short `CLAUDE.md` rules are not enough.

## Common Class Mappings

| Legacy class | Tailwind baseline |
|--------------|-------------------|
| `grid-x` | `flex flex-row flex-wrap` |
| `cell small-12` / `cell large-12` | `w-full min-w-0` |
| `section-spacer` | `relative z-[3] pt-[var(--top-spacing-mobile)] pb-[var(--bottom-spacing-mobile)] large:pt-[var(--top-spacing-desktop)] large:pb-[var(--bottom-spacing-desktop)]` |
| `grid-container` | `relative z-[1] mx-auto px-5 large:max-w-[90rem] large:px-[3.75rem] xxlarge:max-w-[100rem]` |
| `grid-container full` | `relative z-[1] px-5` |
| `alignment-helper` | `flex flex-wrap [justify-content:var(--justify-content-mobile)] [text-align:var(--text-align-mobile)] large:[justify-content:var(--justify-content-desktop)] large:[text-align:var(--text-align-desktop)]` |
| `section-content` | `relative z-[2] flex flex-wrap [align-items:inherit] [justify-content:inherit] gap-x-[1.875rem] mb-[5rem] last:mb-0 large:mb-[5.625rem] large:gap-x-[3.75rem] empty:hidden` |

`rem-calc()` uses a 16px base:

| SCSS | rem |
|------|-----|
| `rem-calc(15)` | `0.9375rem` |
| `rem-calc(20)` | `1.25rem` |
| `rem-calc(30)` | `1.875rem` |
| `rem-calc(45)` | `2.8125rem` |
| `rem-calc(60)` | `3.75rem` |
| `rem-calc(80)` | `5rem` |
| `rem-calc(90)` | `5.625rem` |
| `rem-calc(450)` | `28.125rem` |

## Richtext And Dynamic HTML

For `{{ block.settings.text }}` or other richtext output, style children from the wrapper:

```liquid
<div class="wrapped-text__content [&>*]:text-[1.125rem] [&>*]:leading-[1.333em] [&>*:not(:last-child)]:mb-[1em] [&_strong]:[color:var(--section-heading)]">
  {{- block.settings.text -}}
</div>
```

Use `[color:var(--...)]`, not `text-[var(--...)]`, for CSS variable colors.

## Unmigrated Child Snippets

If a parent renders a snippet whose children cannot be edited in the current pass, use parent arbitrary variants:

```liquid
<div class="image-banner absolute left-0 top-0 h-full w-full [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
```

## Pseudo-Elements

Prefer real conditional elements over `::before` or `::after` overlays:

```liquid
{%- if block.settings.enable_overlay -%}
  <div
    class="image-banner__overlay absolute left-0 top-0 z-[1] h-full w-full [background:var(--overlay-mobile)] large:[background:var(--overlay-desktop)]"
    style="--overlay-mobile: {{ block.settings.overlay_mobile }}; --overlay-desktop: {{ block.settings.overlay_desktop }};"
  ></div>
{%- endif -%}
```

## Dynamic Shopify Settings

Use inline `style` or scoped `<style>` only for values that come from Shopify settings:

```liquid
<section
  class="mfr-section"
  style="--section-bg: {{ section.settings.background_color }}; --section-heading: {{ section.settings.heading_color }};"
>
```

Static values belong in Tailwind classes, not style tags.

## Schema Class Fields

Schema `"class"` values must stay BEM-only:

```json
{ "type": "_section-content", "name": "Content", "class": "section-content__inner" }
```

Do not put Tailwind utilities or arbitrary values there.

## Generated DOM And Plugins

When Tailwind cannot be applied to generated DOM, use `styles/plugins/*.scss`.

Examples:

```scss
.mfr-product__top {
  [data-oke-container] {
    ...
  }
}

.mfr-core__hero-section {
  .hero-section__carousel-inner.flickity-enabled {
    ...
  }
}
```

Keep plugin rules scoped by the owning section/component class.

## Test Templates

| File | URL | Purpose |
|------|-----|---------|
| `templates/page.test.json` | `/pages/test?view=test` | active comparison work |
| `templates/page.all-core-sections.json` | `/pages/test?view=all-core-sections` | permanent completed-section review page |

For comparisons, old and new entries must have identical settings and blocks. Only the section `type` should differ.

## Screenshot Helper

```bash
npm run screenshot before test
npm run screenshot after test
```

Output:

- `tailwind-migration/screenshots/[label].png`
- `tailwind-migration/screenshots/[label].errors.json`

## Token-Saving Rules

- Trust `migrated-files.md`; do not re-read already migrated block/snippet files.
- Use `progress.md` SCSS shortcuts before broad searches.
- Batch related SCSS wrapper additions.
- Do not re-read files just to confirm edits; failed edits report errors.
