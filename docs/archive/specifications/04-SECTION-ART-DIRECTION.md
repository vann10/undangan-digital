> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Section Art Direction — Rizal & Dewi

**Status:** LOCKED baseline; content/assets remain pending where noted  
**Creative direction:** Luxury High-Fashion Wedding Editorial  
**Principle:** Intricate Details, Restrained Composition

## Global art direction

The website should feel like premium wedding stationery brought to life digitally. Visual richness comes from illustration, typography, paper materiality, photography, and stationery vocabulary; the layout remains restrained through whitespace, controlled asymmetry, selective color, minimal UI, and deliberate pacing.

## 01 — Opening: Editorial Cover

**Locked implementation, 19 October 2026:** see `OPENING-ART-DIRECTION-LOCK.md` for the approved full-frame composition, asset recipe and reuse rules.

**Primary composition:** refined editorial cover with a deliberate, typography-led layout.

**Visual focus:** couple monogram, `RIZAL & DEWI`, complex botanical engraving/fine line-art, generous whitespace, and the CTA `BUKA UNDANGAN`.

**Interaction:** CTA activation triggers a restrained, sequential reveal/movement of selected cover elements, followed by a transition to the separate Hero composition.

**Motion:** editorial movement with clear hierarchy and no unnecessary delay; see `03-OPENING-EXPERIENCE.md`.

**Avoid:** complex physical simulation, particles, bounce, shatter, heavy 3D, generic floral backgrounds, and decoration that competes with the CTA.

## 02 — Hero: Opened Editorial Invitation

**Primary object:** framed couple portrait, following the locked Opening print language without a perimeter botanical border.  
**Content hierarchy:** framed photo → `Rizal & Dewi` → `14 November 2026`.  
**Mobile:** centered hierarchy; one restrained floral accent at the portrait.  
**Desktop:** same mobile composition in the right-hand panel; separate static artwork on the left.  
**Photography:** user-uploaded `assets/Seon-ho Youn-jung.jpg`, natural color, neutral descriptive alternative text.  
**Decision history:** the user instruction of 19 October 2026 supersedes the earlier no-photography, location-led editorial-spread specification.  
**Explicit exclusions:** no countdown, RSVP CTA, or long-form copy.  
**Avoid:** generic hero banner, full-screen wedding photo, conventional UI card, large gradient, excessive floral background.

## 03 — Our Story: Editorial Letter Spread

**Primary object:** personal letter.  
**Secondary elements:** printed photograph, editorial typography, botanical framing.  
**Desktop:** letter and photograph can occupy opposite sides in a controlled asymmetrical composition.  
**Mobile order:** section label → letter → narrative → photograph → supporting visual elements.  
**Letter treatment:** Warm Ivory, thin border, very subtle texture, very soft shadow, minimal radius, generous whitespace.  
**Avoid:** torn edges, stains, aged-paper treatment, fake handwriting, postage motifs, vintage scrapbook style.  
**Content:** actual story and narrative format remain pending; do not assume timeline or chapters.

## 04 — The Wedding: Hybrid Editorial Stationery

**Primary objects:** main invitation card + secondary countdown detail card.  
**Main card:** date, time, venue, location.  
**Secondary card:** countdown with label `UNTIL THE WEDDING`.  
**Hierarchy:** date → venue → time → location.  
**Date:** number is the typographic centerpiece; illustrative historical dates are not production data.  
**Mobile:** vertical, centered, restrained layering.  
**Desktop:** asymmetric two-object editorial spread.  
**Motion:** main invitation enters; date establishes; supporting information settles; countdown appears; botanical details settle.  
**Avoid:** progress bars, digital-clock styling, rolling numbers, bounce.

## 05 — Venue: Decorative Engraved Plate

**Primary object:** detailed decorative engraving; subject selection remains pending.  
**Relationship:** the artwork provides atmosphere and must not depict or claim to depict the actual wedding venue. Botanical framing may support the composition. A building, stage, statue, landmark, or Gandrung motif may be explored only as decoration; Gandrung requires explicit approval before adoption.  
**Mobile order:** `VENUE` → decorative engraving → venue name → location → `VIEW LOCATION`.  
**Desktop:** larger architectural artwork, controlled asymmetry, generous negative space.  
**CTA:** editorial text action in DM Sans uppercase with subtle underline/rule; touch-friendly target, not a large UI button.  
**Actual venue/location:** pending and presented as independently verified factual text/link, not inferred from artwork.

## 06 — Gallery: Curated Printed Photo Sequence

**Primary object:** actual couple/wedding photography presented as editorial prints.  
**Mobile:** vertical scrolling, large/small image rhythm, controlled horizontal offset, whitespace, predictable scrolling.  
**Desktop:** asymmetric composition, varied image scales, editorial spread.  
**Motion:** subtle opacity reveal, slight translation, optional restrained parallax.  
**Avoid:** autoplay carousel, required horizontal-scroll interaction, excessive zoom, flashy transitions, decoration that competes with photographs.  
**Photos and order:** pending.

## 07 — RSVP: Editorial Reply Card

**Primary object:** refined reply card.  
**Approved responses only:** `Attending`, `Unable to Attend`.  
**Visual selection:** editorial text options with a subtle line/marker or typographic treatment that clearly identifies the selected state. No conventional radio-button appearance, pill, checkbox, or large CTA treatment.  
**Accessibility:** use appropriate semantic single-choice controls; keyboard operation, visible focus, accessible selected state, and non-color-only state indication are required. The underlying semantics do not need to look like native radio buttons.  
**Motion:** typography and response options reveal subtly; selected state changes are restrained.  
**Avoid:** additional form fields, oversized controls, flashy success animation, or a visual state that depends only on color.

## Shared implementation constraints

- Keep visual language consistent across all sections.
- Warm Ivory remains dominant; Emerald Blue is selective.
- Botanical art must not obscure essential text.
- Photography remains natural; do not tint every photo to match the palette.
- Use whitespace rather than adding decoration to fill empty areas.
- Validate all compositions on mobile, tablet, and desktop.

Catatan audit
Ada tiga aturan penting yang harus dipertahankan:
- Jangan mengisi ruang kosong dengan dekorasi tambahan. Whitespace merupakan bagian dari desain.
- Jangan menyamakan semua foto dengan tint warna palet. Foto harus tetap terlihat natural.
- Jangan mengorbankan keterbacaan demi ilustrasi. Botanical line-art harus menjadi elemen pendukung, bukan menutupi teks penting.

---

## Approved art-direction extension — organic motion and new sections

### Rich organic motion

The approved motion direction is **rich organic motion, controlled by composition**. Relevant assets may animate intrinsically: butterfly wings flap, birds flap while following a natural path, flowers bloom, leaves and stems sway as if in a breeze, and botanical line-art draws on. Layer motion at different phases and speeds to avoid mechanical synchronization. Use appropriate transparent assets (for example SVG/CSS, Lottie/Rive, or optimized animated WebP/GIF where justified) based on the asset and performance requirements.

This expands the amount and variety of permitted motion but does not authorize particle effects, bounce/elastic easing, heavy 3D, scroll hijacking, or decoration that obscures essential content. Reduce or remove nonessential motion when `prefers-reduced-motion` is enabled.

### Illustrated backgrounds

Illustrated backgrounds may be used in Opening, Hero, Venue, and other sections where they strengthen the editorial composition. Venue illustration is decorative only; never depict or imply an unconfirmed or confirmed building, stage, statue, or landmark is the actual venue. Preserve whitespace and text contrast.

### 08 — Wedding Wishes

Treat as a refined guestbook/editorial correspondence section. Separate from RSVP; use a distinct form and a restrained display of submitted messages. Do not publish unmoderated content until a publishing policy is chosen.

### 09 — Send Gifts

Use clean digital stationery to present confirmed bank details and a confirmed shipping address. Prioritize legibility and easy copying over ornament. Actual values remain pending; never use example account numbers or addresses as production data.

### 10 — Closing: Monogram as Final Signature

**Primary object:** couple monogram.  
**Mobile:** centered and restrained.  
**Desktop:** signature with deliberate negative space.  
**Botanical:** peripheral and subtle only if needed.  
**Avoid:** new decorative card system or a competing closing object.  
**Closing statement and final monogram asset:** pending.

### Personalized greeting

Use the formal `Yth. [nama]` salutation with the name supplied by the validated guest record. Keep the surrounding typography editorial and readable; do not let animation delay access to the greeting.
