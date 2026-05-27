# Learned Patterns — Typography

- CommitMono Bold (body copy, descriptions, tags, attribution text) → always `var(--custom-font-name-2)`, never `var(--font-body)`. This is the single most common font mapping error.
- Always use CSS variable for font family — `var(--font-heading-hN)` for headings, `var(--font-body)` for body. Never hardcode font family names.
- Pick heading level from the Figma named style (e.g. `mobile/header/h2` → `var(--font-heading-h2)`), not by eyeballing pixel size.
