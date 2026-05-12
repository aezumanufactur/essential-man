# Figma Comp → Code Rules

These rules apply to ALL Figma comp implementations, no exceptions.

---

## 1. Images — Always Use an Aspect-Ratio Wrapper

When the comp contains an image:

**Wrapper element:**
```html
<div class="[block]__image-wrap aspect-[W/H] w-full overflow-hidden">
```
- Read `W` and `H` from the image container dimensions in the comp
- `w-full` always
- Never use `h-[]` or `min-h-[]` on the wrapper

**Image inside (via render or direct `<img>`):**
```liquid
{%- render "component__lazyload-image",
  image: ...,
  width: ...,
  class: "w-full min-h-full block object-cover" -%}
```
- `object-cover` for cropped fill; `object-contain` only if the comp shows letterboxing
- `min-h-full` on the image is intentional — it fills the aspect-ratio-driven wrapper

**Placeholder (no image):** `<div class="w-full h-full ...">` is fine inside the wrapper — the wrapper's height is defined by `aspect-ratio`, not a fixed pixel value.

---

## 2. Typography — Read Every Value from the Comp

Always apply ALL of these from the comp. Never leave a property unset or inherited.

| Figma property | Tailwind class |
|---|---|
| font-family | `[font-family:var(--font-heading-hN)]` — map to the matching CSS variable |
| font-size | `text-[Xpx]` |
| font-weight | `font-[N]` |
| line-height | `leading-[X]` (unitless) or `leading-[Xpx]` |
| letter-spacing | `tracking-[Xpx]` — omit only if exactly 0 |
| text-transform | `uppercase` / `lowercase` / `capitalize` / `normal-case` |

The `get_design_context` tool returns style metadata. Read it every time.

---

## 3. Partial-Width Text Elements — Use Percentage

When a text or content element in the comp is narrower than its parent:

1. Note the element's pixel width from the comp
2. Note the parent container's pixel width from the comp
3. Calculate: `round(element_width / parent_width × 100)`%
4. Apply as `w-[XX%]`

Never set `w-[Xpx]` on text/content elements — use percentage so it scales.

---

## 4. No Fixed Heights (reinforced)

- Never add `h-[]` or `min-h-[]` to any wrapper or content element unless explicitly asked
- Exception: `min-h-full` on images inside aspect-ratio wrappers (rule 1)
- Exception: `h-full` on placeholder divs inside aspect-ratio wrappers (rule 1)
