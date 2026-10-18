# Design System — Rizal & Dewi

**Status:** Locked baseline with implementation validation pending  
**Direction:** Luxury High-Fashion Wedding Editorial  
**Core principle:** Intricate Details, Restrained Composition

## 1. Typography

| Role | Typeface | Use |
|---|---|---|
| Display | Cormorant Garamond | Couple names, major headings, date centerpiece, invitation typography |
| Supporting / functional | DM Sans | Body, labels, metadata, location, links, controls, hints |
| Editorial statement | Cormorant Garamond Italic | Selected short statements |
| Script accent | Family not selected | Optional sparse personal accent only; PENDING |

Do not use script for essential information or long copy. Do not make every heading equally dramatic.

### Provisional type scale

These are working baselines to validate in actual layouts.

| Role | Mobile | Desktop |
|---|---:|---:|
| Couple names | 52–64px | 80–104px |
| Section headings | 36–44px | 48–64px |
| Editorial statement | 30–36px | 38–48px |
| Date centerpiece | 64–80px | 88–112px |
| Secondary heading | 24–28px | 28–36px |
| Script accent | 26–34px | 32–44px |
| Body large | 17px | 18px |
| Body medium | 16px | 16–18px |
| Body small | 14–15px | 14–15px |
| Labels | 10–12px | 10–12px |
| Actions | 13–14px | 13–14px |

## 2. Spacing

### Base scale

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `space-8` | 64px |
| `space-9` | 96px |
| `space-10` | 128px |

### Semantic baselines

| Role | Mobile | Desktop |
|---|---:|---:|
| Section inline padding | 24px | 64–96px |
| Section block padding | 64–80px | 96–128px |
| Content gap | 24–32px | 32–48px |
| Editorial gap | 32–48px | 48–64px |
| Section rhythm | 64–80px | 96–128px |
| Card padding | 24px | 32–48px |
| Text-group gap | 12–16px | 12–16px |

Use spacing to create editorial pacing, not mechanically.

## 3. Layout and responsive system

### Container baselines

- `layout-page-max`: 1280px
- `layout-content-max`: 1120px
- `layout-reading-max`: 640px
- `layout-card-max`: 560px
- `layout-venue-max`: 1120px

### Grid baselines

| Breakpoint | Columns | Side padding | Gutter |
|---|---:|---:|---:|
| Mobile: 0–767px | 4 | 24px | 16px |
| Tablet: 768–1023px | 8 | 40px | 24px |
| Desktop: 1024px+ | 12 | 64–96px | 24–32px |

These are design-system baselines, not proof of tested responsive behavior.

### Responsive principle

Mobile-first. Desktop is an editorial re-composition, not a scaled-up mobile layout.

- Mobile: one primary flow, readable hierarchy, controlled illustration density, comfortable touch targets.
- Tablet: adapt spacing and composition without forcing full desktop layout.
- Desktop: controlled asymmetry, deliberate negative space, multiple editorial areas where appropriate.
- Prevent horizontal overflow, clipped text, and overlaps.
- Avoid fixed heights used only to force symmetry.

## 4. Surfaces, borders, radius, elevation

### Surface direction: Textured Clean Paper

- Warm Ivory is the default canvas.
- White distinguishes stationery surfaces where useful.
- Visible paper texture is an explicit user-approved material quality on the Warm Ivory system; it must remain controlled, editorial, and free of distressed or cluttered vintage effects.
- Texture intensity, grain scale, and placement are design proposals to validate in the Opening/Hero prototype, not locked numeric tokens.
- Keep botanical line detail, Cormorant Garamond display text, DM Sans functional text, Emerald Blue actions, whitespace, and focus indicators legible over textured areas. Check contrast and mobile asset/performance behavior on rendered layouts.

### Border tokens

| Token | Value |
|---|---|
| `border.hairline` | `1px solid #E6E0D7` |
| `border.paper` | `1px solid #D8D0C2` |
| `border.accent` | `1px solid #174A4A` |
| `border.ornament` | `1px solid #B79A68` |
| `border.focus` | `2px solid #174A4A` |

`border.ornament` is decorative only; do not use it in place of a functional boundary requiring stronger contrast.

### Radius

- `radius.none`: `0`
- `radius.subtle`: `2px`
- `radius.control`: `2–4px`
- `radius.circular`: `50%`, only for circular objects when required by an approved component

### Elevation

- `elevation.none`: `none`
- `elevation.paper`: `0 2px 8px rgba(57, 53, 52, 0.04)`
- `elevation.object`: `0 6px 20px rgba(57, 53, 52, 0.06)`

Shadows are optional; prefer composition and fine borders. Avoid heavy shadows, glassmorphism, and large-radius UI cards.

## 5. Illustration and imagery

### Botanical art

Complex botanical engraving / fine line-art: fine strokes, visible veins, organic curves, intertwined stems, intricate flowers, refined negative space.

- Deep Sage and Emerald Blue: primary structure.
- Muted Sage: secondary layers.
- Champagne: restrained highlight only.
- Controlled asymmetry; avoid symmetrical floral frames.
- Do not obscure essential text.

### Stationery vocabulary

Editorial cover, invitation card, letter, postcard, itinerary card, RSVP reply card, photograph, venue illustration, and monogram. These should feel tactile and premium without becoming scrapbook-like or generic UI panels.

## 6. Component and interaction patterns

### Editorial text link

Use DM Sans, uppercase where specified, subtle underline/rule, restrained hover state, comfortable target. `VIEW LOCATION` remains a text action, not a large filled button.

### RSVP selection

Two options only: `Attending`, `Unable to Attend`.

Visual style: editorial text options with a subtle visible line/marker or typographic treatment for selection; no conventional radio-button appearance. Underlying control must retain appropriate semantic single-choice behavior and accessible selected state. Provide keyboard navigation, visible focus, and an indicator that does not depend on color alone. Do not add fields.

### Success/error

Success only after backend confirmation. Keep acknowledgement quiet. If submission fails, preserve the selected choice and allow retry; do not display success prematurely.

## 7. Motion system

Core principle: **Editorial motion, not UI motion.**

Motion may suggest paper unfolding, cards entering a composition, photographs being placed, typography revealing, botanical line-art drawing, and subtle parallax.

Historical timing guidance:
- Micro-interaction: 200–400ms.
- Element reveal: 600–900ms.
- Major transition: 900–1400ms.
- Opening Cover → Hero transition target: approximately 1.2–1.6s.

Opening-specific timing and sequence are governed by `03-OPENING-EXPERIENCE.md`. The Opening uses CTA-triggered Editorial Cover motion. Treat all timings as baselines to validate, not guaranteed performance.

Avoid bounce, elastic easing, spinning, flashy particles, excessive zoom, heavy 3D, and scroll hijacking. Honor reduced-motion settings; preserve content and functionality.

## 8. Accessibility baseline

- Text contrast: normal ≥4.5:1; large ≥3:1.
- Visible keyboard focus.
- All interactive controls keyboard-operable.
- State must not rely on color alone.
- Use semantic links and controls.
- Logical heading/content order.
- Images need appropriate alt text.
- Reduced motion must not hide content or remove functionality.
- RSVP success feedback must be accessible to assistive technology.
- Touch targets must be comfortable.
- No horizontal overflow or clipped text.

## 9. Status

Typography family choices, palette, responsive strategy, and component direction are defined/locked as noted. Type sizes, grid, motion timings, and shadows require layout/browser validation. This document is a specification, not evidence that visual QA has been performed.

Catatan audit
Ada dua hal yang perlu diperhatikan sebelum dokumen ini dinyatakan final.
1. Durasi animasi: Design System mencantumkan beberapa rentang waktu umum, sedangkan Opening memiliki target khusus sekitar 1,2–1,6 detik. Ini bukan konflik karena file 06 secara eksplisit menyerahkan aturan Opening kepada 03-OPENING-EXPERIENCE.md.
2. Validasi visual belum dilakukan: ukuran font, kontras warna pada komponen aktual, layout responsif, dan performa animasi masih perlu diuji saat implementasi.

---

## 10. Approved motion extension — rich organic motion, controlled

The motion preference is LOCKED as **rich organic motion yang terkontrol**. This expands motion beyond simple reveal/translation while preserving the system principle “Editorial motion, not UI motion.”

Permitted asset-level behaviors include:
- butterfly wing-flap cycles paired with gentle, non-linear flight paths;
- birds with visible wing-flap cycles and restrained travel paths;
- flower petals opening in staged sequences;
- leaves, stems, and botanical elements swaying with varied phases as if moved by a light breeze;
- SVG engraving strokes drawing on;
- subtle editorial reveal and limited parallax where it remains comfortable.

Implementation guidance:
- Prefer SVG/CSS for lightweight vector motion; use Lottie/Rive or optimized transparent animation assets when they materially improve motion quality.
- Do not use an animated asset format by default if it is larger, less controllable, or less performant than a vector/CSS alternative.
- Animate assets intrinsically where appropriate; do not simulate all movement with whole-image translation.
- Avoid synchronized loops, excessive simultaneous motion, particles, bounce, spinning, heavy 3D, scroll hijacking, and motion behind text that harms readability.
- Pause or reduce off-screen decorative motion where practical; optimize asset dimensions and loading.
- Respect `prefers-reduced-motion`: remove or simplify nonessential motion while preserving content, states, and functionality.
- Validate on real mobile devices and record evidence before marking QA passed.

## 11. New component requirements

- **Personalized greeting:** formal `Yth. [nama]`; data comes from a validated individual guest record sourced from CSV/JSON. Escape guest-supplied content before rendering.
- **Save the Date:** semantic link to a Google Calendar event prefilled with the confirmed date. Date is 14 November 2026; start/end times remain PENDING. Never invent a duration.
- **Wedding Wishes:** separate form and guestbook display, not fields inside RSVP. Use accessible status announcements, input validation, safe rendering, and a defined spam/moderation approach.
- **Send Gifts:** legible account/address details and copy actions with accessible feedback. Real account and address values are PENDING.

These are requirements for implementation, not evidence of implemented components or completed QA.
