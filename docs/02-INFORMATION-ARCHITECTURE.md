# Information Architecture & Content Model — Rizal & Dewi

**Status:** Direction locked; some content pending  
**Sequence:** Opening → Hero → Our Story → The Wedding → Venue → Gallery → RSVP → Wedding Wishes → Send Gifts → Closing

## Global experience principles

- Mobile-first and fully responsive.
- Desktop is an editorial re-composition, not a scaled-up mobile layout.
- Preserve the established visual hierarchy, color system, typography, and illustration style.
- Content examples are not final wedding data unless explicitly identified as confirmed.

## 01 — Opening

**Purpose:** Ceremonially introduce and activate the digital invitation.

**Visual object:** Editorial Cover focused on the couple monogram, couple names, complex botanical engraving/fine line-art, generous whitespace, and the CTA `BUKA UNDANGAN`.

**Interaction flow:**
1. Editorial Cover appears as the initial composition.
2. Guest activates `BUKA UNDANGAN` by pointer or keyboard.
3. Selected cover elements move or reveal in a restrained, deliberate sequence.
4. The cover transitions away.
5. The separate Hero composition becomes visible.
6. Normal page scrolling continues.

Opening and Hero are two separate compositions. The Hero must appear after CTA activation and must not require scrolling to trigger the transition. Detailed motion and accessibility requirements live in `03-OPENING-EXPERIENCE.md`.

**Status:** LOCKED — Editorial Cover is the approved Opening concept.

## 02 — Hero

**Purpose:** Establish the couple's wedding identity after the Opening transition.

**Content:** `THE WEDDING`, `RIZAL & DEWI`, actual date, actual location.

**Visual object:** A separate editorial Hero composition revealed after the Opening CTA is activated.

**Composition:** centered and legible on mobile; controlled asymmetry and generous negative space on desktop.

**Explicit exclusions:** no photography, countdown, RSVP CTA, or long-form copy.

**Relationship to Opening:** Hero remains hidden as the active composition until the guest activates `BUKA UNDANGAN`; the transition is triggered by the CTA, not by scrolling.

**Status:** LOCKED; wedding date is DEFINED as 14 November 2026. Exact time and location remain PENDING.

## 03 — Our Story

**Purpose:** Present Rizal & Dewi's relationship narrative.

**Visual object:** Personal letter/editorial correspondence.

**Composition:** vertical and readable on mobile; asymmetric editorial spread on desktop. Photography may punctuate the narrative.

Do not assume a timeline, chronology, or chapter structure before actual story copy and format are provided.

**Status:** visual direction locked; copy and narrative format PENDING.

## 04 — The Wedding

**Purpose:** Present the formal event details.

**Main invitation card:** date, time, venue, location.  
**Secondary detail card:** countdown.

**Date treatment:** editorial typographic centerpiece, with the date number prominent. Confirmed wedding date: 14 November 2026. Any other example dates in historical planning material remain illustrative, not production data.

**Information hierarchy:** date → venue → time → location.

**Countdown:** integrated in this section, not standalone. Exact label: `UNTIL THE WEDDING`. Cormorant Garamond for numbers; DM Sans for labels/units. No progress bar or digital-clock styling.

**Status:** direction locked; date DEFINED as 14 November 2026; time/venue/location PENDING.

## 05 — Venue

**Purpose:** Introduce the venue and make its location accessible.

**Visual object:** Decorative engraved illustration/plate. It is ornamentation, not a factual depiction of the wedding venue. Any building, stage, statue, or landmark must not be presented as the actual venue. Gandrung motifs require separate explicit approval.

**Mobile order:** `VENUE` → decorative engraving → venue name → location → `VIEW LOCATION`.

`VIEW LOCATION` is an editorial text action with a subtle underline/rule and a touch-friendly target, not a large filled button.

**Status:** decorative-only illustration direction locked; illustration subject and venue name, address, and map URL PENDING independently. Missing venue details do not block Opening/Hero prototyping.

## 06 — Gallery

**Purpose:** Create a visual memory sequence and an emotional pause before RSVP.

**Visual object:** Printed editorial photographs.

**Behavior:** vertical editorial photo sequence. Use varied image scale and controlled offsets; do not use a generic gallery grid, autoplay carousel, or required horizontal-scroll interaction.

**Motion:** subtle image reveal, gentle movement, optional restrained parallax.

**Status:** behavior locked; photo selection/order PENDING.

## 07 — RSVP

**Purpose:** Collect the guest's attendance response.

**Visual object:** Refined reply card.

**Approved options only:**
- `Attending`
- `Unable to Attend`

No guest count, dietary preference, free-form message, or additional fields are approved in the RSVP form. Wedding Wishes is a separate form and must not be implemented as an RSVP field.

**Presentation:** editorial text options with a subtle visible selection indicator. Avoid the conventional radio-button appearance, while retaining semantic single-choice interaction, keyboard operation, visible focus, and a state indicator that does not rely on color alone.

**Status:** two-option model and visual direction LOCKED; final question/copy PENDING. Submission/data rules are in `07-TECHNICAL-ARCHITECTURE.md`.

## Content and asset status summary

### PENDING
- Event start/end time and timezone; the wedding date is confirmed as 14 November 2026.
- Actual venue, full address, and valid map URL.
- Actual Our Story copy and narrative format.
- Final Gallery photos and sequence.
- Final couple monogram asset.
- Closing statement/copy.
- Final RSVP question/copy.
- Script typeface family, if a script accent is retained.

Never infer or fabricate these values.

Catatan audit
Ada tiga hal yang perlu dijaga ketika dokumen implementasi diperiksa nanti:
1. Opening: dokumen ini sudah menentukan urutan interaksi, tetapi detail animasi tambahan tetap harus mengikuti 03-OPENING-EXPERIENCE.md dan preferensi reduced motion.
2. Venue: tautan VIEW LOCATION harus mengarah ke URL peta yang valid setelah alamat venue dikonfirmasi.
3. RSVP: dokumen ini menentukan tampilan dan pilihan, sedangkan aturan penyimpanan, autentikasi, serta pengiriman respons harus konsisten dengan dokumen arsitektur teknis.
Ketiganya merupakan pemeriksaan lanjutan, bukan alasan untuk menolak dokumen ini.

---

## Global personalization and motion additions

### Personalized guest greeting

- Use the formal salutation `Yth. [nama]` with the individual guest name sourced from an approved CSV or JSON list.
- The surrounding sentence and language pattern may be composed flexibly, but the formal salutation preference is fixed.
- Personal invitation identity must be validated securely; do not trust a client-supplied name or guest ID by itself.
- Do not expose another guest's information through invalid or manipulated invitation links.

### Rich organic motion

Use layered but controlled motion across relevant sections: botanical sway, wing-flap cycles, flowers opening, SVG line drawing, and natural flight paths. Motion should animate the asset itself when the concept calls for it, not rely only on moving a static image from one position to another. Keep essential information readable, avoid simultaneous motion overload, and honor `prefers-reduced-motion`.

## 08 — Wedding Wishes

**Placement:** after RSVP and before Send Gifts.

**Purpose:** collect personal messages separately from attendance responses and show approved/submitted messages in a guest-visible wishes area.

**Functional requirements:** a distinct message form; server-side validation; persistent storage; safe rendering of user-submitted content; spam/rate limiting and a moderation/publishing policy; accessible success and failure states. Exact message length limits, moderation workflow, and whether messages publish immediately remain PENDING technical/product decisions. Do not add a message field to RSVP.

## 09 — Send Gifts

**Placement:** after Wedding Wishes and before Closing.

**Content:** bank name, account holder and account number for each approved account, plus gift-shipping address. Show only actual information supplied and approved by the couple. Add copy-to-clipboard affordances for appropriate account/address fields, with accessible confirmation and error feedback.

**Status:** feature requirement LOCKED; bank and address content PENDING.

## 10 — Closing

**Purpose:** End the experience with a quiet, recognizable signature.

**Visual object:** Couple monogram as final signature.

Centered and restrained on mobile; monogram with deliberate negative space on desktop. Do not introduce a new decorative card system.

**Status:** direction locked; closing copy and final monogram asset PENDING.

## Save the Date — The Wedding

Provide a `SAVE THE DATE` action that opens a prefilled Google Calendar event for 14 November 2026. The wedding date is DEFINED; exact start time, end time, time zone and venue/location remain PENDING. Do not invent times or silently define a duration. The implementation must handle the missing-time state clearly and update the link when confirmed details are supplied.
