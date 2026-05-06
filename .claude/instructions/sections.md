---
name: Sections
description: Section creation workflow, naming conventions, SCSS scaffold, and section groups
type: project
---

# Sections

## Creation Workflow

Inputs: `filename` and a human-readable `section name`.

1. Copy `sections/custom-section-template--with-theme-blocks.bak` → `sections/<filename>.liquid`
2. In that file replace:
   - `mfr-core__custom-section` → `<filename>`
   - `Custom Section` → `<section name>`
3. Create `styles/sections/<filename>.scss` (see SCSS Scaffold below)

## SCSS Scaffold

```scss
@import "../variables";
@import "../tools/util/util";
@import "../tools/mixins";

.<filename> {
  .<sub-filename> {
  }
}
```

`<sub-filename>` = portion after `__` (e.g. `mfr-core__accordion-section` → `accordion-section`).

Add `@import "../site-specifics";` only when the section needs project-specific variables.

SCSS is for **exceptions only** — schema `"class"` rules and third-party generated DOM. All layout/spacing/visual styling goes via Tailwind in the Liquid file.

## Naming Conventions

| Prefix | Use |
|--------|-----|
| `mfr-core__<name>` | Core, reusable sections |
| `mfr-<project-initials>__<name>` | Project-specific (e.g. `mfr-pn__hero`) |
| `mfr-<template>__<name>` | Template-bound (product, collection, article, blog, search, metaobjects) |
| `header`, `footer`, `offcanvas`, `modals` | Part-specific — section group exclusive |

## Section Groups

Current groups: `header`, `footer`, `offcanvas` (`custom.offcanvas`), `modals` (`custom.modals`).

Sections that should NOT appear in these groups use:
```json
"disabled_on": {
  "groups": ["header", "footer", "custom.offcanvas", "custom.modals"]
}
```
