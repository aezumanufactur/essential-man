# Learned Patterns — Spacing & Layout

- Never add `h-[]` or `min-h-[]` on wrappers or content elements. Use `aspect-[W/H]` for media containers.
- Never add static Tailwind padding or margin classes directly on blocks. Use Block Layout Controls settings in template JSON instead.
- Never add horizontal padding (`padding_x`) directly to blocks. Use the section `container_width` setting for horizontal spacing.
- `position: relative` on a schema `"class"` element must go in the section SCSS file, not Tailwind — Shopify injects the class on the block wrapper and Tailwind can't target it.
- Block Layout Controls two-level enable: `enable_padding_settings: true` must be set before any `padding_*` child values have effect. Same for `enable_margin_settings` and `enable_width_settings`.
