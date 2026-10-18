# Opening Experience Specification — Rizal & Dewi

**Status:** LOCKED — art direction approved  
**Core principle:** Ceremonial interaction, invisible interface  
**Experience:** Editorial Cover → CTA activation → sequential editorial reveal → separate Hero composition

## 1. Concept

The Opening is a premium editorial cover that ceremonially introduces the digital wedding invitation. It is a distinct composition, separate from the Hero.

**Locked object:** an Editorial Cover built around the couple monogram, couple names, complex botanical engraving/fine line-art, generous whitespace, and the primary CTA `BUKA UNDANGAN`.


## 2. Interaction sequence

`EDITORIAL COVER — INITIAL STATE`
→ guest activates `BUKA UNDANGAN` by pointer or keyboard
→ CTA gives a restrained pressed/activation response
→ cover elements reveal or move in a deliberate sequence
→ the cover composition transitions away
→ the separate Hero composition becomes visible
→ normal page scrolling continues

The Opening and Hero are two separate compositions. The Hero must appear as the result of activating the CTA; scrolling must not be required to reveal it.

## 3. Visual hierarchy

### Editorial Cover — initial state
1. Couple monogram
2. Couple names: `RIZAL & DEWI`
3. Complex botanical engraving / fine line-art
4. Generous negative space and precise editorial framing
5. Primary CTA: `BUKA UNDANGAN`
6. Supporting micro-copy only if approved and needed

The initial cover should feel composed and intriguing without exposing all wedding information or competing with the CTA.

### Activation and transition state
1. CTA activation feedback
2. Sequential movement/reveal of selected cover elements
3. Restrained transition of the cover composition
4. Clear reveal of the separate Hero composition

Names and essential information must remain legible, and the animation must not delay access unnecessarily.

## 4. Material and composition

- Background: Warm Ivory `#FAF7F1`.
- Editorial cover: clean digital stationery with a restrained border or fine rule only where composition benefits.
- Surface treatment: refined Warm Ivory with visible but restrained paper texture as an approved material quality. Keep typography, CTA, and botanical engraving legible; avoid distressed grain, clutter, or heavy shadow. Texture intensity, grain scale, and placement remain prototype proposals.
- Whitespace: generous and intentional.
- Mobile: keep all primary elements and the CTA comfortably within the viewport, with responsive spacing and no clipping.
- Desktop: re-compose with controlled asymmetry and deliberate negative space rather than enlarging the mobile layout.
- The Hero is a separate composition with its own clear visual hierarchy.

Avoid heavy or distressed grain, strong noise, vignette, large gradients, floating particles, background clutter, and decorative objects that compete with the names or CTA. Preserve mobile loading performance and text/control contrast over textured areas.

## 5. Illustration

Complex botanical engraving / fine line-art: fine strokes, detailed leaves and veins, organic curves, intertwined stems, intricate flowers, and refined negative space.

Botanical art is an editorial framing element, not a generic floral background. Use controlled asymmetry and preserve text legibility.

- Primary botanical: Deep Sage `#596957` and selective Emerald Blue `#174A4A`.
- Secondary botanical: Muted Sage `#899783`, lighter visual weight.
- Champagne `#B79A68` only as a restrained ornamental highlight.

## 6. Motion direction and approved enrichment

Motion must feel like an editorial cover being activated and its composition deliberately transitioning—not like a physical object being opened.

Approved motion layers:
1. A restrained pressed/activation response on `BUKA UNDANGAN`.
2. Staggered movement or reveal of selected cover elements.
3. Subtle botanical line-art reveal/draw-on where performance permits.
4. A controlled cover exit or transition.
5. A clear, natural handoff to the separate Hero composition.

These are permitted directions, not a requirement to animate every element. Keep the sequence legible, short, and restrained. Avoid effects that obscure names, the CTA, or essential information.

The initial target for the complete CTA-triggered transition is approximately **1.2–1.6 seconds**, subject to browser validation. Do not extend it into a long intro without explicit approval.

### Motion anti-patterns
- Particle systems or explosions.
- Bounce, elastic easing, spinning.
- Complex or heavy 3D.
- Scroll hijacking or scroll lock after completion.
- Long animations that hide essential content.
- Decorative motion that competes with names or invitation information.

## 7. Accessibility and input behavior

- The `BUKA UNDANGAN` CTA must be operable by pointer and keyboard.
- Use a semantic interactive element with an accessible name.
- Use a semantic button with an accessible name and provide a visible keyboard focus state.
- Ensure adequate touch target.
- Do not make essential information available only after an animation.
- The Opening must not permanently trap or lock scrolling.
- Keep the functional states clear even when motion is reduced.

### Reduced motion

Respect `prefers-reduced-motion: reduce`:
- Reduce or remove staggered movement and prolonged botanical drawing.
- Replace complex cover transitions with a short opacity transition or immediate state change.
- Use short opacity transitions or an immediate state transition.
- Preserve the same content, final state, and functionality.

## 8. Performance and validation

Avoid heavy background video, large unoptimized images, multiple oversized botanical assets, heavy 3D rendering, and excessive animation libraries.

Required browser checks before release:
- pointer and keyboard activation,
- focus visibility,
- mobile viewport composition,
- no clipped text or horizontal overflow,
- reduced-motion behavior,
- no essential information hidden,
- final transition to Hero and normal scrolling,
- perceived duration and motion smoothness.

**Status:** Editorial Cover art direction LOCKED; implementation and browser QA NOT TESTED until evidenced.

Catatan audit
Aturan implementasi yang harus dipertahankan:
1. Tidak semua lapisan animasi wajib digunakan sekaligus. Editorial Cover, CTA, dan Hero terpisah adalah konsep aktif.
2. Statusnya masih spesifikasi desain, bukan bukti implementasi. Durasi, kelancaran animasi, tampilan mobile, keyboard, dan reduced motion harus diuji di browser sebelum dinyatakan lolos.
