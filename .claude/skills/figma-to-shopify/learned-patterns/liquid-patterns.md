# Learned Patterns — Liquid Patterns

- Use `{%- ... -%}` trim markers on all top-level Liquid tags to prevent whitespace with empty blocks.
- Never loop `section.blocks` to find a specific block type. Use `content_for "block"` for static blocks.
