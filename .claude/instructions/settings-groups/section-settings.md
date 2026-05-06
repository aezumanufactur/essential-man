---
name: Section Settings Groups
description: Reusable schema settings groups for sections — copy the JSON blocks you need
type: project
---

# Section Settings Groups

These are the standard settings groups shared across sections. Copy the groups you need into the section's `"settings": []` array.

---

## Section Settings

```json
{
  "type": "header",
  "content": "Section Settings"
},
{
  "type": "select",
  "id": "container_width",
  "label": "Width",
  "options": [
    { "value": "full", "label": "Full" },
    { "value": "", "label": "Contain" }
  ],
  "default": "full"
},
{
  "type": "range",
  "id": "max_width",
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "rem",
  "label": "Max Content Width",
  "default": 0
},
{
  "type": "select",
  "id": "grid_gutter",
  "label": "Section Margin",
  "options": [
    { "value": "", "label": "No Margin" },
    { "value": "grid-gutter-mobile", "label": "On Mobile" },
    { "value": "grid-gutter-desktop", "label": "On Desktop" },
    { "value": "grid-gutter-mobile grid-gutter-desktop", "label": "On Both" }
  ]
}
```

---

## Alignment Settings

Requires `snippets/section__settings-styles.liquid` rendered in the section.

```json
{
  "type": "header",
  "content": "Alignment Settings"
},
{
  "type": "select",
  "id": "mobile_alignment",
  "label": "Content Alignment - Mobile",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
},
{
  "type": "select",
  "id": "desktop_alignment",
  "label": "Content Alignment - Desktop",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
}
```

---

## Color Scheme Settings

```json
{
  "type": "header",
  "content": "Color Schemes Settings"
},
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "Color Scheme",
  "default": "scheme_1",
  "info": "This will be the color scheme of the header initially."
}
```

---

## Mobile Section Spacing

```json
{
  "type": "header",
  "content": "Mobile Section Spacing"
},
{
  "type": "number",
  "id": "top_spacing_mobile",
  "label": "Top Spacing",
  "default": 100,
  "info": "in pixels. This will use 100px as default value if left empty"
},
{
  "type": "number",
  "id": "bottom_spacing_mobile",
  "label": "Bottom Spacing",
  "default": 100,
  "info": "in pixels. This will use 100px as default value if left empty"
}
```

---

## Desktop Section Spacing

```json
{
  "type": "header",
  "content": "Desktop Section Spacing"
},
{
  "type": "number",
  "id": "top_spacing_desktop",
  "label": "Top Spacing",
  "default": 100,
  "info": "in pixels. This will use 100px as default value if left empty"
},
{
  "type": "number",
  "id": "bottom_spacing_desktop",
  "label": "Bottom Spacing",
  "default": 100,
  "info": "in pixels. This will use 100px as default value if left empty"
}
```

---

## Background

```json
{
  "type": "header",
  "content": "Background"
},
{
  "type": "color_background",
  "id": "bg_color",
  "label": "Background Color/Gradient"
},
{
  "type": "image_picker",
  "id": "bg_image_mobile",
  "label": "Background Image - Mobile"
},
{
  "type": "image_picker",
  "id": "bg_image",
  "label": "Background Image - Desktop"
}
```

---

## Divider Settings

```json
{
  "type": "header",
  "content": "Divider Settings"
},
{
  "type": "select",
  "id": "section_divider_top",
  "label": "Section Divider - Top",
  "options": [
    { "value": "", "label": "None" },
    { "value": "line", "label": "Line" },
    { "value": "rounded", "label": "Rounded" },
    { "value": "scale", "label": "Scale" }
  ],
  "default": ""
},
{
  "type": "select",
  "id": "section_divider_bottom",
  "label": "Section Divider - Bottom",
  "options": [
    { "value": "", "label": "None" },
    { "value": "line", "label": "Line" },
    { "value": "rounded", "label": "Rounded" }
  ],
  "default": ""
}
```

---

## Attribute Settings

```json
{
  "type": "header",
  "content": "Attribute Settings"
},
{
  "type": "text",
  "id": "custom_class",
  "label": "Custom class"
},
{
  "type": "text",
  "id": "custom_id",
  "label": "Custom ID"
}
```
