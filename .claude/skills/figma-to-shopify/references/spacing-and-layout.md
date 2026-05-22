# Spacing & Layout — How the System Works

Spacing in this theme flows through 5 distinct layers. Each layer handles one job — never apply the same spacing through two layers at once.

---

## The 5 Layers

### 1. Section outer spacing
**Where:** `top_spacing_mobile`, `top_spacing_desktop`, `bottom_spacing_mobile`, `bottom_spacing_desktop` in section settings (template JSON).

**What it does:** Breathing room above/below the entire section content area.

**How to set it:** Read the outermost padding values directly from the Figma comp. Never use schema defaults (100px). Bottom spacing is 0 for full-bleed or edge-to-edge sections.

---

### 2. `_section-content` padding
**Where:** Block Layout Controls on the `_section-content` block in template JSON — `enable_padding_settings`, `padding_x_mobile/desktop`, `padding_y_mobile/desktop`.

**What it does:** Horizontal inset (standard 20px mobile / 30px desktop) and optional gap below the content block before cards or a carousel.

**How to set it:** Always apply horizontal padding unless the section is already inside a grid-container that handles its own padding (banner slides). Apply vertical bottom padding when the comp shows a gap between the heading area and the first card/carousel row.

---

### 3. `_section-content` margin-bottom
**Where:** Block Layout Controls on the `_section-content` block — `enable_margin_settings`, `margin_bottom_mobile/desktop`.

**What it does:** Additional spacing between the section-content block and whatever structural element follows it (card grid, carousel).

**How to set it:** Read the gap value between the heading area and the card/carousel from Figma. Use margin (not padding) for this gap.

---

### 4. Block Layout Controls padding
**Where:** Block Layout Controls on a container block (e.g. a card grid wrapper block or a carousel block) in template JSON.

**What it does:** Internal padding on that specific container — for example, internal p-15/p-30 breathing room inside a card grid wrapper.

**How to set it:** Read internal padding values from the comp for that container block.

---

### 5. Hardcoded Tailwind in block Liquid
**Where:** Tailwind utility classes written directly in the block's `.liquid` file.

**What it does:** Fixed structural spacing baked into the block itself — for example, card internal padding, product card gap between image and details.

**When to use it:** Only for spacing that is intrinsic to the component's design and should never change per-instance (e.g. a card's internal layout). For anything that should be configurable per section, use layers 1–4 instead.

---

## The Core Rule

**Never double-apply spacing across layers.** Each layer handles exactly one job:

- Section outer spacing → layer 1 only
- Inset and gap below heading → layers 2–3 on `_section-content`
- Container internal padding → layer 4 on the container block
- Fixed component internals → layer 5 in Liquid

If you're tempted to add `pt-[55px]` on the `_section-content` because the section's `top_spacing` is already 55, stop — that's double-applying layer 1 through layer 2.

**Never add static Tailwind padding or margin classes directly on blocks.** Block Layout Controls exist for this. Configure them in template JSON — don't hardcode `p-[]` or `m-[]` on block elements in Liquid.

---

## Banner Carousel Height

Banner sections control height through block settings, not Tailwind:

```json
"height_value_mobile": 100,
"height_unit_mobile": "svh"
```

Always use `svh` (safe viewport height) for mobile banners — this is fixed, not read from Figma.

For desktop, read the frame height in px from the Figma comp:
```json
"height_value_desktop": 780,
"height_unit_desktop": "px"
```
