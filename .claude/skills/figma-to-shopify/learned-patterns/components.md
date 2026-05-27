# Learned Patterns — Components

## Accordion Toggle — Rotating + Icon

Use a single `+` icon that rotates 45° on open rather than two separate SVGs with `x-if`:

```html
<div class="mfr-accordion__toggle flex items-center justify-center w-[26px] h-[26px] border border-current shrink-0 rounded-full bg-[var(--color-white)]">
  <svg
    width="11"
    height="11"
    aria-hidden="true"
    focusable="false"
    class="transition-transform duration-[400ms] ease-[cubic-bezier(0.5,0,0,1)]"
    :class="isOpen ? 'rotate-45' : 'rotate-0'">
    <use href="#icon-accordion-plus"/>
  </svg>
</div>
```

- `transition-transform duration-[400ms] ease-[cubic-bezier(0.5,0,0,1)]` = `$global-transition` in Tailwind form
- Toggle background is `bg-[var(--color-white)]` — do NOT change to `var(--section-bg)`; this is intentional
- Render `{%- render 'icon__accordion-plus' -%}` **once** at the top of the container block (`_accordions.liquid`, `_product_faqs.liquid`), not inside the accordion component itself
- The `icon__accordion-close` snippet is not needed with this approach
