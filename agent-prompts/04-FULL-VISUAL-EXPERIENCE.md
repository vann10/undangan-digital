# 04 — FULL VISUAL EXPERIENCE

## Objective
Complete the ten-section visual experience and responsive layouts using the approved art direction and the implemented design/motion foundations.

## Active section sequence
Opening → Hero → Our Story → The Wedding → Venue → Gallery → RSVP → Wedding Wishes → Send Gifts → Closing.

## Read first
- `PROJECT-STATE.md`
- `docs/02-INFORMATION-ARCHITECTURE.md`
- `docs/04-SECTION-ART-DIRECTION.md`
- `docs/05-COLOR-SYSTEM.md`
- `docs/06-DESIGN-SYSTEM.md`
- `docs/08-CONTENT-AND-ASSET-REGISTER.md`
- All three reference images in `assets/references/`

## Tasks
1. Implement every section in the approved sequence, using shared layout and typography primitives.
2. Our Story: use the approved letter/editorial-correspondence direction. If final story copy is missing, use clearly labeled placeholders and do not invent biographical details.
3. The Wedding: include the invitation card and `UNTIL THE WEDDING` countdown in this section. Countdown must use a single configured event datetime with explicit timezone. Since event time/timezone are currently unconfirmed, do not invent values; implement a configurable, blocked/pending state or use an approved placeholder that is not presented as real.
4. Venue: use decorative engraved ornamentation and botanical framing without depicting or implying the artwork is the actual venue. Gandrung requires separate explicit approval. Use `VIEW LOCATION` only when a confirmed, valid map URL is available; otherwise use a clearly marked development placeholder and document the dependency.
5. Gallery: create a vertical editorial photo sequence, not a generic grid or autoplay carousel. Use approved photos or labeled placeholders.
6. RSVP: implement the visual section and semantic selection for only `Attending` / `Unable to Attend`; no extra fields.
7. Wedding Wishes: create a separate visual form and message-display area, independent from RSVP. Backend behavior is handled in Phase 05; do not imply persistence before it exists.
8. Send Gifts: include both bank details and shipping address, but never fabricate values. Use explicit placeholders until supplied.
9. Closing: use the monogram as the final signature; do not introduce a new decorative card system.
10. Use the reference images for visual direction, not as a substitute for actual responsive components. Add meaningful alt text and responsive cropping.
11. Preserve visual restraint, negative space, contrast and legibility. Ensure desktop is editorially recomposed rather than enlarged mobile.
12. Test responsive breakpoints and section order; record unavailable real assets and content.

## Deliverables
- All ten sections implemented and navigable.
- Placeholder/data dependency list.
- Responsive evidence where available.
- Updated asset register and `PROJECT-STATE.md`.

## Acceptance criteria
- Correct ten-section order.
- Countdown appears only in The Wedding, never Hero.
- Venue, Gallery, RSVP, Wishes, Gifts and Closing follow their documented art direction.
- No invented wedding facts or production assets.
- No horizontal overflow or critical overlaps at tested viewports.
- Stop at phase boundary.
