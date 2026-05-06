# Standardized Section Settings

## Section Settings

| Setting | Type | Options / Notes |
|---|---|---|
| Width | select | Full \| Contain |
| Max Content Width | range | 0–100rem |
| Section Margin | select | No Margin \| On Mobile \| On Desktop \| On Both |
| Header Overlap `NEW` | checkbox | Lets the header sit on top of this section — default: false |

## Alignment Settings

| Setting | Type | Options / Notes |
|---|---|---|
| Content Alignment - Mobile | select | Left \| Center \| Right — default: Center |
| Content Alignment - Desktop | select | Left \| Center \| Right — default: Center |

## Color Scheme Settings

| Setting | Type | Options / Notes |
|---|---|---|
| Color Scheme | color_scheme | default: Scheme 1 |

## Mobile Section Spacing

| Setting | Type | Options / Notes |
|---|---|---|
| Top Spacing | number | in pixels — default: 100 |
| Bottom Spacing | number | in pixels — default: 100 |

## Desktop Section Spacing

| Setting | Type | Options / Notes |
|---|---|---|
| Top Spacing | number | in pixels — default: 100 |
| Bottom Spacing | number | in pixels — default: 100 |

## Background

| Setting | Type | Options / Notes |
|---|---|---|
| Background Color/Gradient - Mobile `NEW` | color_background | |
| Background Color/Gradient - Desktop `NEW` | color_background | |
| Background Image - Mobile | image_picker | |
| Background Image - Desktop | image_picker | |

## Divider Settings

| Setting | Type | Options / Notes |
|---|---|---|
| Section Divider - Top | select | None \| Line \| Rounded \| Scale |
| Section Divider - Bottom | select | None \| Line \| Rounded |

## Attribute Settings

| Setting | Type | Options / Notes |
|---|---|---|
| Custom Class | text | |
| Custom ID | text | |

---

# Standardized Block Settings

## Block Layout Controls

Implemented via `snippets/settings__block-layout-controls.liquid`. Add to a block with `{%- render "settings__block-layout-controls" -%}`.

### Width

| Setting | Type | Options / Notes |
|---|---|---|
| Enable Width | checkbox | Toggles width controls |
| Width - Mobile | text/select | Value + unit (px, %, vw, custom) |
| Max Width - Mobile | text/select | Value + unit (px, %, vw, custom) |
| Width - Desktop | text/select | Value + unit (px, %, vw, custom) |
| Max Width - Desktop | text/select | Value + unit (px, %, vw, custom) |

### Padding

| Setting | Type | Options / Notes |
|---|---|---|
| Enable Padding | checkbox | Toggles padding controls |
| Padding X - Mobile | checkbox | Enables left/right padding on mobile |
| Padding Left - Mobile | number | in px |
| Padding Right - Mobile | number | in px |
| Padding Y - Mobile | checkbox | Enables top/bottom padding on mobile |
| Padding Top - Mobile | number | in px |
| Padding Bottom - Mobile | number | in px |
| Padding X - Desktop | checkbox | Enables left/right padding on desktop |
| Padding Left - Desktop | number | in px |
| Padding Right - Desktop | number | in px |
| Padding Y - Desktop | checkbox | Enables top/bottom padding on desktop |
| Padding Top - Desktop | number | in px |
| Padding Bottom - Desktop | number | in px |

### Margin

| Setting | Type | Options / Notes |
|---|---|---|
| Enable Margin | checkbox | Toggles margin controls |
| Margin X - Mobile | checkbox | Enables left/right margin on mobile |
| Margin Left - Mobile | number | in px |
| Margin Right - Mobile | number | in px |
| Margin Y - Mobile | checkbox | Enables top/bottom margin on mobile |
| Margin Top - Mobile | number | in px |
| Margin Bottom - Mobile | number | in px |
| Margin X - Desktop | checkbox | Enables left/right margin on desktop |
| Margin Left - Desktop | number | in px |
| Margin Right - Desktop | number | in px |
| Margin Y - Desktop | checkbox | Enables top/bottom margin on desktop |
| Margin Top - Desktop | number | in px |
| Margin Bottom - Desktop | number | in px |

---

# Global Blocks

> List of globally reusable blocks.

## Section Blocks

- `_section-content`

  **Alignment Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Content Alignment - Mobile | select | Use Section Settings \| Left \| Center \| Right — default: Use Section Settings |
  | Content Alignment - Desktop | select | Use Section Settings \| Left \| Center \| Right — default: Use Section Settings |
  | Vertical Alignment | select | Top \| Center \| Bottom — default: Top |

  **Background / Color Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Text Color | color | |
  | Background Color | color | |
  | Enable Animated Circle Background | checkbox | default: false |

  **Border Radius Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Border Radius - Mobile | number | in px — default: 0 |
  | Border Radius - Desktop | number | in px — default: 0 |

  **Block Layout Controls** — see [Standardized Block Settings](#block-layout-controls)

  **Blocks**

  - `_section-content__title`
  - `_section-content__text`
  - `_section-content__small-text`
  - `_section-content__button`
  - `_section-content__icon`
  - `_section-content__icon-text-item`
  - `_section-content__icon-text-wrapper`
  - `_section-content__liquid-html`
  - `_section-content__divider`
  - `_section-content__spacer`

## Image Block

- `_image` `NEW`

  **Image Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Image - Mobile | image_picker | |
  | Image - Desktop | image_picker | |

  **Object Fit Settings** `NEW`

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Object Fit - Mobile | select | Fill \| Contain \| Cover \| None — default: Cover |
  | Object Fit - Desktop | select | Fill \| Contain \| Cover \| None — default: Cover |

  **Aspect Ratio Settings** `NEW`

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Aspect Ratio - Mobile | select | 9:16 (Portrait) \| 3:4 \| 2:3 \| 1:1 (Square) \| 4:3 \| 16:9 (Landscape) \| Custom |
  | Custom Aspect Ratio - Mobile | text | Visible when Mobile is "Custom" — format: `width/height` e.g. `398/474` |
  | Aspect Ratio - Desktop | select | 9:16 (Portrait) \| 1:1 (Square) \| 4:3 \| 3:2 \| 16:9 (Landscape) \| 21:9 (Ultrawide) \| Custom |
  | Custom Aspect Ratio - Desktop | text | Visible when Desktop is "Custom" — format: `width/height` e.g. `1320/691` |

  **Block Layout Controls** — see [Standardized Block Settings](#block-layout-controls)

## Video Block

- `_video-with-controls`

  **Video Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Video Title | text | |
  | Video File | video | |
  | Poster Image | image_picker | |
  | Autoplay? | checkbox | default: true |
  | Loop? | checkbox | default: true |
  | Show Controls? | checkbox | default: false |
  | Muted? | checkbox | default: true |

  **Actions Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Show Play Button | checkbox | default: true |
  | Show Speaker Button | checkbox | default: true |

  **Aspect Ratio Settings** `NEW`

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Aspect Ratio - Mobile | select | 9:16 (Portrait) \| 3:4 \| 2:3 \| 1:1 (Square) \| 4:3 \| 16:9 (Landscape) \| Custom |
  | Custom Aspect Ratio - Mobile | text | Visible when Mobile is "Custom" — format: `width/height` e.g. `378/520` |
  | Aspect Ratio - Desktop | select | 9:16 (Portrait) \| 1:1 (Square) \| 4:3 \| 3:2 \| 16:9 (Landscape) \| 21:9 (Ultrawide) \| Custom |
  | Custom Aspect Ratio - Desktop | text | Visible when Desktop is "Custom" — format: `width/height` e.g. `1320/696` |

  **Block Layout Controls** — see [Standardized Block Settings](#block-layout-controls)

## Column

> Not a single block file. This defines the standardized settings to use whenever a column block is implemented in a section (e.g. `_image-video-text__column`).

  **Order Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Order - Mobile | number | Controls CSS `order` — use to reorder columns on mobile without changing HTML |
  | Order - Desktop | number | Controls CSS `order` — use to reorder columns on desktop without changing HTML |

  **Horizontal Alignment Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Horizontal Alignment - Mobile | select | Left \| Center \| Right — default: Left |
  | Horizontal Alignment - Desktop | select | Left \| Center \| Right — default: Left |

  **Vertical Alignment Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Vertical Alignment - Mobile | select | Top \| Center \| Bottom — default: Top |
  | Vertical Alignment - Desktop | select | Top \| Center \| Bottom — default: Top |

  **Inner Container Width Settings**

  | Setting | Type | Options / Notes |
  |---|---|---|
  | Width - Mobile | select | Auto \| Custom — default: Auto |
  | Width Custom - Mobile | text | Visible when "Custom" — supports `calc()`, px, %, vw |
  | Width - Desktop | select | Auto \| Custom — default: Auto |
  | Width Custom - Desktop | text | Visible when "Custom" — supports `calc()`, px, %, vw |

  **Block Layout Controls** — see [Standardized Block Settings](#block-layout-controls)

---

# Theme Settings

> Defined in `config/settings_schema.json`. These are the global theme settings available in the Shopify Theme Editor.

## General

| Setting | Type | Options / Notes |
|---|---|---|
| Background Color | color | default: #FFFFFF |
| Overlay Color | color | default: #470073 |
| Global Border Width | number | in px — default: 2 |
| Global Border Radius | range | 0–40px — default: 2 |
| Enable Entrance Animations | checkbox | |

## Content

| Setting | Type | Options / Notes |
|---|---|---|
| External Scripts (Header) | liquid | e.g. Marker.io widget |
| External Scripts | liquid | e.g. Marker.io widget |

## Colors

| Setting | Type | Options / Notes |
|---|---|---|
| White | color | default: #FFFFFF |
| Offwhite | color | default: #f5f5f5 |
| Black | color | default: #000000 |
| Brand Color | color | default: #000000 |
| Accent Color 1 | color | default: #F1C217 |
| Accent Color 2 | color | default: #F58C24 |
| Accent Color 3 | color | default: #349E47 |
| Accent Color 4 | color | default: #52C1B6 |
| Main Text Color | color | default: #000000 |

## Themes

| Setting | Type | Options / Notes |
|---|---|---|
| Light Text | color | Dark text for light themes — default: #010101 |
| Dark Text | color | Light text for dark themes — default: #FFFFFF |
| Custom Color | color | default: #BF946B |

**Color Schemes** (`color_scheme_group`)

Each scheme defines:

| Setting | Type |
|---|---|
| Small Text Color | color |
| Heading Color | color |
| Text Color | color |
| Text Color (Gradient) | color_background |
| Background | color |
| Gradient | color_background |
| Primary Button BG | color |
| Primary Button BG (Gradient) | color_background |
| Primary Button Text | color |
| Primary Button Border | color |
| Primary Button BG - Hover | color |
| Primary Button BG (Gradient) - Hover | color_background |
| Primary Button Text - Hover | color |
| Primary Button Border - Hover | color |
| Secondary Button BG | color |
| Secondary Button BG (Gradient) | color_background |
| Secondary Button Text | color |
| Secondary Button Border | color |
| Secondary Button BG - Hover | color |
| Secondary Button BG (Gradient) - Hover | color_background |
| Secondary Button Text - Hover | color |
| Secondary Button Border - Hover | color |
| Tertiary Button BG | color |
| Tertiary Button BG (Gradient) | color_background |
| Tertiary Button Text | color |
| Tertiary Button Border | color |
| Tertiary Button BG - Hover | color |
| Tertiary Button BG (Gradient) - Hover | color_background |
| Tertiary Button Text - Hover | color |
| Tertiary Button Border - Hover | color |
| Icons | color |
| Links | color |
| Links - Hover | color |

## Fonts

4 custom font slots (Font 1–4), each with:

| Setting | Type | Notes |
|---|---|---|
| URL for custom font | textarea | Upload in Settings > Files |
| Name for custom font | text | |
| Font weight | textarea | e.g. 100, 400, 700 |

## Body Typography

| Setting | Type | Options / Notes |
|---|---|---|
| Body Font | font_picker | default: Helvetica |
| Custom Font Name | text | |
| Small - Mobile | range | 6–30px — default: 11 |
| Regular - Mobile | range | 10–40px — default: 13 |
| Large - Mobile | range | 10–50px — default: 19 |
| xLarge - Mobile | range | 10–50px — default: 23 |
| xSmall - Desktop | range | 6–30px — default: 9 |
| Small - Desktop | range | 6–30px — default: 11 |
| Regular - Desktop | range | 10–40px — default: 13 |
| Large - Desktop | range | 10–50px — default: 19 |
| xLarge - Desktop | range | 10–50px — default: 23 |
| Line Height | range | 10–50px — default: 16 |
| Letter Spacing | number | in px — default: 0 |
| Font Weight | select | 100–900 — default: 400 |

## Title Typography

Each heading level (H1–H6) and Small Title has:

| Setting | Type | Options / Notes |
|---|---|---|
| Font Family | font_picker | |
| Custom Font Family | text | Overrides font picker |
| Font Case | select | Default \| Uppercase \| Lowercase \| Capitalize |
| Font Weight | select | Use Font Family Setting \| 100–900 |
| Font Size - Mobile | range | in px |
| Line Height - Mobile | range | in px |
| Letter Spacing - Mobile | number | in px |
| Font Size - Desktop | range | in px |
| Line Height - Desktop | range | in px |
| Letter Spacing - Desktop | number | in px |

> H1 also has XLarge size variants for mobile and desktop. Small Title has a single font size for mobile and desktop (no line height).

## Header

**Height Settings**

| Setting | Type | Options / Notes |
|---|---|---|
| Header Height | range | 30–100px — default: 80 |
| Header Sticky Height | range | 30–100px — default: 60 |
| Header Height - Mobile | range | 30–100px — default: 80 |
| Header Sticky Height - Mobile | range | 30–100px — default: 60 |

**Typography Settings**

| Setting | Type | Options / Notes |
|---|---|---|
| Font Family | font_picker | |
| Custom Font Family | text | |
| Make Uppercase | checkbox | default: false |
| Font Weight | select | 100–900 — default: 400 |
| Font Size - Mobile | range | 10–100px — default: 16 |
| Line Height - Mobile | range | 10–100px — default: 16 |
| Letterspacing - Mobile | number | in px |
| Font Size - Desktop | range | 10–100px — default: 18 |
| Line Height - Desktop | range | 10–100px — default: 18 |
| Letterspacing - Desktop | number | in px |

**Announcement Bar**

| Setting | Type | Options / Notes |
|---|---|---|
| Enable Marquee? | checkbox | default: true |
| Show on home page only | checkbox | default: true |
| Direction | select | Left To Right \| Right To Left |
| Animation Duration (seconds) | number | default: 10 |
| Animation Duration - Mobile (seconds) | number | default: 10 |
| Infinite | checkbox | default: true |

## Footer

> Same Typography Settings fields as Header (Font Family, Custom Font Family, Make Uppercase, Font Weight, Font Size / Line Height / Letterspacing for mobile + desktop).

## Offcanvas

**Layout Settings**

| Setting | Type | Options / Notes |
|---|---|---|
| Offset - Mobile | range | 0–80px — default: 20 |
| Offset - Desktop | range | 0–80px — default: 0 |
| Border Radius - Mobile | range | 0–80px — default: 20 |
| Border Radius - Desktop | range | 0–80px — default: 0 |

**Typography Settings** — same fields as Header Typography

**Colors Settings**

| Setting | Type | Options / Notes |
|---|---|---|
| Background Color | color | default: #383838 |
| Text Color | color | default: #787777 |

## Buttons

**Typography Settings** — same fields as Header Typography

**Border Settings**

| Setting | Type | Options / Notes |
|---|---|---|
| Border Width | number | in px — default: 1 |
| Button Border Radius | number | in px — default: 2 |

## Banner Heights

| Setting | Type | Options / Notes |
|---|---|---|
| Small | text | supports rem, px, vh — default: 30rem |
| Medium | text | supports rem, px, vh — default: 50rem |
| Large | text | supports rem, px, vh — default: 100vh |

## Social Media

| Setting | Type |
|---|---|
| Facebook | text |
| Instagram | text |
| Threads | text |
| LinkedIn | text |
| Pinterest | text |
| Snapchat | text |
| TikTok | text |
| Twitter/X | text |
| YouTube | text |
| Vimeo | text |

## Favicon

| Setting | Type |
|---|---|
| Favicon | image_picker |

## Currency Format

| Setting | Type | Options / Notes |
|---|---|---|
| Show currency codes | checkbox | default: true |

## Cart

| Setting | Type | Options / Notes |
|---|---|---|
| Enable cart notes | checkbox | default: true |
