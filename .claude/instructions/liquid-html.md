---
name: Liquid & HTML
description: Liquid and HTML conventions including trim markers, render calls, and Alpine patterns
type: project
---

# Liquid & HTML

## Trim Markers

Use `{%- ... -%}` on all top-level Liquid tags (`if`, `for`, `schema`, etc.) to prevent whitespace when blocks render empty — this enables safe `:empty` CSS.

```liquid
{%- if section.settings.title != blank -%}
  <h2>{{ section.settings.title }}</h2>
{%- endif -%}
```

## Render Calls

Each parameter on its own line:

```liquid
{%- render "component__lazyload-image",
  image: block.settings.image,
  width: 240,
  alt: alt -%}
```

## Long Attributes

Break HTML attributes onto multiple lines when long. Keep alignment similar to nearby markup.

## Liquid Filter Chains

Line-break and align under the variable:

```liquid
{%- assign image_url = block.settings.image
  | image_url: width: 1200
  | replace: 'http://', 'https://' -%}
```

## Alpine in Liquid

- Use single quotes for JS payloads: `x-data='{ open: false }'`
- Use `@` shorthand for events: `@click='open = !open'`
- Empty scope is valid: `x-data`
- Store access: `$store.<name>` in templates, `Alpine.store("name")` in scripts
