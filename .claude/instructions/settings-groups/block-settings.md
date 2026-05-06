---
name: Block Settings Groups
description: Optional reusable schema settings groups for blocks — Aspect Ratio and Block Layout Controls
type: project
---

# Block Settings Groups

Optional settings groups for blocks. Add only when requested.

---

## Aspect Ratio Settings

Two selects (mobile/desktop) with presets + Custom option. When `custom` is selected, a text input appears via `visible_if`.

```json
{
  "type": "header",
  "content": "Aspect Ratio Settings"
},
{
  "type": "select",
  "id": "aspect_ratio_mobile",
  "label": "Aspect Ratio - Mobile",
  "options": [
    { "value": "9/16", "label": "9:16 (Portrait)" },
    { "value": "3/4", "label": "3:4" },
    { "value": "2/3", "label": "2:3" },
    { "value": "1/1", "label": "1:1 (Square)" },
    { "value": "4/3", "label": "4:3" },
    { "value": "16/9", "label": "16:9 (Landscape)" },
    { "value": "custom", "label": "Custom" }
  ],
  "default": "9/16"
},
{
  "type": "text",
  "id": "aspect_ratio_mobile_custom",
  "label": "Custom Aspect Ratio - Mobile",
  "info": "Format: width/height e.g. 378/520",
  "visible_if": "{{ block.settings.aspect_ratio_mobile == 'custom' }}"
},
{
  "type": "select",
  "id": "aspect_ratio_desktop",
  "label": "Aspect Ratio - Desktop",
  "options": [
    { "value": "9/16", "label": "9:16 (Portrait)" },
    { "value": "1/1", "label": "1:1 (Square)" },
    { "value": "4/3", "label": "4:3" },
    { "value": "3/2", "label": "3:2" },
    { "value": "16/9", "label": "16:9 (Landscape)" },
    { "value": "21/9", "label": "21:9 (Ultrawide)" },
    { "value": "custom", "label": "Custom" }
  ],
  "default": "16/9"
},
{
  "type": "text",
  "id": "aspect_ratio_desktop_custom",
  "label": "Custom Aspect Ratio - Desktop",
  "info": "Format: width/height e.g. 1320/691",
  "visible_if": "{{ block.settings.aspect_ratio_desktop == 'custom' }}"
}
```

Resolve in Liquid before applying:

```liquid
{%- assign ar_mobile = block.settings.aspect_ratio_mobile_custom | default: block.settings.aspect_ratio_mobile -%}
{%- assign ar_desktop = block.settings.aspect_ratio_desktop_custom | default: block.settings.aspect_ratio_desktop -%}
```

---

## Column Block Settings

Settings exclusive to column blocks (`_[section]__column.liquid`). Include all three groups in every column block, in this order.

### Inner Container Settings

Controls `max-width` on the `__inner` div (not the outer block wrapper). Skipped when value is 0.

CSS (inside `<style>`, targeting the section-specific inner class):

```liquid
{%- if block.settings.inner_max_width_mobile != 0 and block.settings.inner_max_width_mobile != blank -%}
  @media (max-width: 1023px) {
    #shopify-block-{{ block.id }} .[section]__column__inner {
      max-width: {{ block.settings.inner_max_width_mobile }}px;
    }
  }
{%- endif -%}
{%- if block.settings.inner_max_width_desktop != 0 and block.settings.inner_max_width_desktop != blank -%}
  @media (min-width: 1024px) {
    #shopify-block-{{ block.id }} .[section]__column__inner {
      max-width: {{ block.settings.inner_max_width_desktop }}px;
    }
  }
{%- endif -%}
```

Schema:

```json
{
  "type": "header",
  "content": "Inner Container Settings"
},
{
  "type": "number",
  "id": "inner_max_width_mobile",
  "label": "Inner Max Width - Mobile",
  "default": 0,
  "info": "in pixels. Leave at 0 for no max width."
},
{
  "type": "number",
  "id": "inner_max_width_desktop",
  "label": "Inner Max Width - Desktop",
  "default": 0,
  "info": "in pixels. Leave at 0 for no max width."
}
```

### Order Settings

Controls CSS `order` on the outer block element per breakpoint. Skipped when value is 0.

CSS (inside `<style>`, targeting `#shopify-block-{{ block.id }}`):

```liquid
{%- if block.settings.order_mobile != 0 and block.settings.order_mobile != blank -%}
  @media (max-width: 1023px) {
    #shopify-block-{{ block.id }} { order: {{ block.settings.order_mobile }}; }
  }
{%- endif -%}
{%- if block.settings.order_desktop != 0 and block.settings.order_desktop != blank -%}
  @media (min-width: 1024px) {
    #shopify-block-{{ block.id }} { order: {{ block.settings.order_desktop }}; }
  }
{%- endif -%}
```

Schema:

```json
{
  "type": "header",
  "content": "Order Settings"
},
{
  "type": "number",
  "id": "order_mobile",
  "label": "Order - Mobile",
  "default": 0,
  "info": "CSS flex order. Lower numbers appear first."
},
{
  "type": "number",
  "id": "order_desktop",
  "label": "Order - Desktop",
  "default": 0,
  "info": "CSS flex order. Lower numbers appear first."
}
```

---

## Block Layout Controls

Provides per-block width, padding, and margin controls (mobile + desktop).

In block markup:

```liquid
{%- render "settings__block-layout-controls" -%}
```

Append to block schema settings (the full settings list lives in `snippets/settings__block-layout-controls.liquid` — read that file for the exact JSON to copy).

Controls include:
- Width (mobile/desktop): value + unit (px, %, vw, custom calc)
- Padding (mobile/desktop): X/Y axes, individual sides
- Margin (mobile/desktop): X/Y axes, individual sides
