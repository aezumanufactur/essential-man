# Learned Patterns — Colors & Borders

- Borders always use `currentColor` or `border-[color:var(--section-heading)]` — never a hardcoded hex value. This ensures they adapt to color scheme changes.
- Banner/overlay sections where `_section-content` sits on a dark image: force `"text_color": "#eeece5"` on the block in template JSON. The color scheme does not auto-adapt in this context.
