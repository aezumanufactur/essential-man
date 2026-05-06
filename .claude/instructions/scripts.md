---
name: Scripts
description: JavaScript conventions, Alpine component patterns, and build pipeline
type: project
---

# Scripts

## Conventions

- 2-space indentation, semicolons, trailing commas in objects/arrays
- Double quotes for strings

## Alpine Components

New components live in `scripts/components/`. File and `x-data` name use `MFR` + PascalCase (e.g. `MFRDropdownMenu`).

Create by copying `scripts/components/alpine-script-boilerplate.js` and replacing `MFRComponentName`:

```js
if (!window._mfrAlpineRegistered) window._mfrAlpineRegistered = {};
if (!window._mfrAlpineRegistered["MFRComponentName"]) {
  window._mfrAlpineRegistered["MFRComponentName"] = true;
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRComponentName", () => ({
      // ...
    }));
  });
}
```

To load a component in a section/block/snippet:

```liquid
{%- render "script__section", file: "MFRComponentName.js" -%}
```

## Alpine Global Stores

Live in `scripts/theme/`. Use `Alpine.store("name", { ... })`.

## Build Pipeline

- JS is compiled and minified by Gulp → `assets/`
- Dev: `npm run watch:gulp` (or `npm run dev`)
- Build: `npm run build`
