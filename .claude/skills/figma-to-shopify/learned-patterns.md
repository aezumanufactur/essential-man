# Learned Patterns

Rules extracted from past sessions. During Phase 4 generation, read every file whose description is relevant to what you're building. When in doubt, read it — skipping a file is riskier than reading it.

- [Typography](learned-patterns/typography.md)
  How to map Figma font styles to CSS variables and Tailwind classes. Read this any time you are setting font-family, font-size, font-weight, line-height, letter-spacing, or text-transform on any element — especially body copy, labels, and headings. Covers which CSS variable maps to which visual role (e.g. CommitMono Bold vs theme heading fonts), and how to pick the correct heading level from the Figma named style rather than guessing from pixel size.

- [Colors & Borders](learned-patterns/colors-borders.md)
  How to apply colors and borders so they stay adaptive across color schemes. Read this any time you are setting border color, text color, background color, or overlay color on any element. Covers why borders must use `currentColor` and when to force explicit color overrides in template JSON for sections that sit on dark images.

- [Spacing & Layout](learned-patterns/spacing-layout.md)
  How to handle widths, heights, padding, and margin in blocks and sections. Read this any time you are sizing an element, adding padding/margin to a block, or working with multi-column layouts. Covers the no-fixed-height rule, Block Layout Controls two-level enable pattern, and why horizontal padding belongs on the section not the block.

- [Schema](learned-patterns/schema.md)
  Rules for writing correct Liquid block schema JSON. Read this any time you are writing or editing a block's `{% schema %}` — especially the `"class"` field, `"blocks"` array, `"settings"` array order, and preset definitions. Covers BEM-only class names, full filename block types, dynamic vs static preset `"id"` rules, and where conditional dimension overrides belong.

- [Template JSON](learned-patterns/template-json.md)
  How to construct valid, correctly-valued template JSON entries. Read this any time you are writing or editing a `templates/*.json` file — section IDs, block IDs, column width settings, intra-block spacing values, background color overrides, section outer spacing, and font family settings. Covers the `__` ID restriction, width calculation formula, and which spacing setting maps to which Figma gap value.

- [Liquid Patterns](learned-patterns/liquid-patterns.md)
  Low-level Liquid coding patterns that apply to every file. Read this for any Liquid file you write or edit. Covers trim marker usage and the rule against looping `section.blocks` to find a block type.

- [Components](learned-patterns/components.md)
  Implementation details for specific reusable components (accordion, icon patterns, etc.). Read this any time you are generating or editing a component that has an entry here — check the file to see what's covered. Currently covers: accordion toggle (rotating + icon, transition, symbol placement).
