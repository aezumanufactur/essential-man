---
name: Blocks
description: Theme block creation workflow, naming, BEM conventions, and schema requirements
type: project
---

# Blocks

## Creation Workflow

Inputs: `block name` and target section.

1. Create `blocks/_<section-name>__<block-name>.liquid`
2. Copy `scripts/components/alpine-script-boilerplate.js` structure if the block needs Alpine
3. Block **must include schema** with: `name`, `class`, `settings`, `blocks`, `presets`
   - No initial settings → `"settings": []`
   - No initial blocks → `"blocks": []`

## Naming

- File: `_<section-name>__<block-name>.liquid` (e.g. `_footer__menu.liquid`)
- Class (handleized block name): `"Image Text"` → `image-text`

## Schema `"class"` Field

- **BEM class names only** — no Tailwind utilities
- Shopify rejects `[` `]` characters and enforces a 200-character limit
- Block wrapper styles go in the section's SCSS file, not `tailwind.input.css`

## Markup Convention

Every block must have an outer + inner element:

```liquid
<div class="image-text">
  <div class="image-text__inner">
    ...
  </div>
</div>
```

Every child element inside a block must have a BEM class name — not just the outer/inner wrapper. This makes elements referenceable and targetable without relying on structural selectors:

```liquid
<div class="image-text">
  <div class="image-text__inner">
    <div class="image-text__media">...</div>
    <div class="image-text__content">
      <p class="image-text__title">...</p>
      <p class="image-text__text">...</p>
      <a class="image-text__button button primary">...</a>
    </div>
  </div>
</div>
```

## Styled Text — `<div>` Wrapper Pattern

Never put font, size, color, or spacing Tailwind classes directly on a `<p>` tag. Instead, wrap it in a `<div>` and move all styling classes to the wrapper. The `<p>` inside stays bare:

```liquid
{{/* Wrong */}}
<p class="my-block__title [font-family:var(--font-heading-h4)] text-[34px] font-[500] uppercase [color:var(--section-heading)]">Text</p>

{{/* Correct */}}
<div class="my-block__title [font-family:var(--font-heading-h4)] text-[34px] font-[500] uppercase [color:var(--section-heading)]"><p>Text</p></div>
```

This applies to any text element that carries Tailwind utility classes. The BEM class belongs on the `<div>`; the `<p>` is purely semantic.

## Schema Settings Grouping

Group settings under `"header"` inputs. All settings for a group follow until the next header:

```json
{
  "type": "header",
  "content": "Max Width Settings"
},
{
  "type": "range",
  "id": "max_width",
  ...
}
```

See `instructions/settings-groups/block-settings.md` for reusable optional groups (Aspect Ratio, Block Layout Controls).
