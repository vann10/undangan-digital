# QA & Acceptance Criteria — Rizal & Dewi Digital Invitation

**Status:** Criteria defined; execution NOT TESTED unless a result is recorded  
**Purpose:** Define what must be checked before launch. This checklist is not evidence that checks have passed.

## 1. Visual consistency

- [ ] Locked palette and semantic tokens are used consistently.
- [ ] Cormorant Garamond and DM Sans are applied according to role.
- [ ] Script family remains unused or pending until selected.
- [ ] Botanical engraving is detailed but does not overwhelm composition.
- [ ] Whitespace and controlled asymmetry are preserved.
- [ ] Borders, shadows, radius, and texture remain restrained.
- [ ] Approved visible paper texture is perceptible without weakening text/control contrast, engraving clarity, focus visibility, or mobile performance.
- [ ] Photography remains natural and visually dominant in Gallery.
- [ ] No generic wedding-template, SaaS, scrapbook, or overly decorative drift.

## 2. Opening experience

- [ ] Editorial Cover is the initial composition.
- [ ] Monogram, couple names, botanical engraving, whitespace, and `BUKA UNDANGAN` have the intended hierarchy.
- [ ] CTA activates by pointer, touch, Enter, and Space as appropriate for a semantic button.
- [ ] CTA pressed/activation response is restrained and perceivable.
- [ ] Selected cover elements reveal or move in the intended sequence.
- [ ] Cover transitions to the separate Hero composition after activation.
- [ ] Hero transition does not require scrolling.
- [ ] Target transition duration (approximately 1.2–1.6 seconds) is checked in a real browser.
- [ ] Keyboard focus is visible and the CTA has an accessible name.
- [ ] Reduced-motion behavior shortens or removes motion without removing content or functionality.
- [ ] Normal scrolling works after the transition; no scroll trap remains.
- [ ] Mobile cover layout has no clipped content, CTA overlap, or horizontal overflow.

## 3. Section and responsive behavior

- [ ] All ten compositions/sections appear in the current approved order: Opening, Hero, Our Story, The Wedding, Venue, Gallery, RSVP, Wedding Wishes, Send Gifts, Closing.
- [ ] Hero contains no photography, countdown, RSVP CTA, or long-form copy.
- [ ] Countdown appears in The Wedding, not as a standalone section.
- [ ] Venue CTA reads `VIEW LOCATION` and opens a valid map URL.
- [ ] Gallery is a vertical editorial photo sequence, not a generic grid/autoplay carousel.
- [ ] Desktop is editorially re-composed rather than simply enlarged.
- [ ] Mobile, tablet, and desktop have no horizontal overflow, clipped text, or illustration overlap.
- [ ] Touch targets remain comfortable.

## 4. RSVP and backend

- [ ] Only `Attending` and `Unable to Attend` are accepted.
- [ ] No unapproved fields are displayed or submitted.
- [ ] Editorial selection indicator is visually clear.
- [ ] Underlying choice control has correct single-choice semantics.
- [ ] Selection/focus is keyboard accessible.
- [ ] Selection state is not communicated by color alone.
- [ ] Success is shown only after backend confirmation.
- [ ] Failure preserves the selected choice and gives clear retry behavior where appropriate.
- [ ] One invitation link is associated with one individual.
- [ ] First accepted response is final according to the locked policy.
- [ ] Invalid and duplicate submissions are handled safely.
- [ ] Private operator authentication is required for exports.
- [ ] Public clients cannot access unrestricted guest records or service-role secrets.

## 5. Accessibility and motion

- [ ] Normal text contrast is at least 4.5:1.
- [ ] Large text contrast is at least 3:1.
- [ ] Keyboard focus is visible.
- [ ] Semantic heading order and reading order are logical.
- [ ] Images have suitable alt text.
- [ ] Reduced motion does not hide information or functionality.
- [ ] RSVP feedback is understandable to assistive technology.
- [ ] No essential information is hidden exclusively behind animation.

## 6. Content and production data

- [ ] Confirmed wedding date displayed as 14 November 2026; event start/end time and timezone confirmed before timed features are released.
- [ ] Venue, full address, and map URL confirmed.
- [ ] Our Story copy and format approved.
- [ ] RSVP question/copy approved.
- [ ] Closing copy approved.
- [ ] Final monogram and decorative Venue artwork approved; Venue illustration does not imply it depicts the actual venue.
- [ ] Gallery photography and order approved.
- [ ] Script typeface decision documented if needed.

## 7. Evidence log

For every check, record date, environment/device, result, defect, and follow-up. Do not mark a check passed without evidence.

| Check group | Status | Evidence |
|---|---|---|
| Visual QA | NOT TESTED | Pending implementation/browser review |
| Responsive QA | NOT TESTED | Pending viewport testing |
| Accessibility QA | NOT TESTED | Pending keyboard/contrast/screen-reader checks |
| Opening motion QA | NOT TESTED | Pending browser review including reduced motion |
| RSVP/backend QA | NOT TESTED | Pending Supabase implementation and test cases |
| Deployment/security QA | NOT TESTED | Pending production configuration and access tests |

Catatan audit
Ada dua hal yang perlu diperhatikan.
1. Kriteria penerimaan sudah cukup luas, tetapi belum seluruhnya kuantitatif.
Sebagian besar kriteria sudah bisa digunakan sebagai checklist. Namun, beberapa hal—seperti kelancaran animasi, kenyamanan touch target, dan tidak adanya overlap—masih memerlukan definisi pengujian yang lebih spesifik saat implementasi. Kita tidak perlu menambahkan angka sembarang sebelum kebutuhan dan lingkungan pengujian ditentukan.
2. Data produksi merupakan bagian dari kesiapan rilis.
Dokumen ini benar karena tidak hanya memeriksa kode dan tampilan, tetapi juga mensyaratkan tanggal pernikahan, venue, cerita, foto, monogram, dan konten lainnya sudah disetujui sebelum undangan dianggap siap dirilis.
Satu catatan tambahan: tabel Evidence Log masih berupa status awal. Nanti, status NOT TESTED hanya boleh diubah setelah hasil pengujian benar-benar tersedia.

---

## 8. New feature acceptance criteria — NOT TESTED

### Wedding date and Save the Date
- [ ] Display the confirmed date as 14 November 2026 wherever the date belongs.
- [ ] Save the Date action opens Google Calendar with the approved event title and confirmed date.
- [ ] No start time, end time, duration, time zone, or venue is invented while those values remain pending.
- [ ] Once supplied, start/end/time-zone values are encoded correctly and verified in the generated Calendar URL.
- [ ] The link has an understandable label and keyboard-accessible behavior.

### Personalized guest list and greeting
- [ ] CSV/JSON import validates required fields and reports malformed/duplicate records.
- [ ] Greeting uses the formal `Yth. [nama]` format and the correct individual guest name.
- [ ] Names with punctuation, accents, and non-ASCII characters render correctly and safely.
- [ ] Invalid tokens do not reveal guest identity or data.
- [ ] Guest identity is validated server-side; a client-supplied name/ID is not trusted by itself.

### Rich organic motion
- [ ] At least the approved motion types required by the chosen art direction are represented where assets are assigned: wing flap, blooming, botanical sway, and/or line drawing.
- [ ] Motion is not limited to translating a static asset when the brief requires intrinsic movement.
- [ ] Animations have varied timing/phases and avoid mechanically synchronized loops.
- [ ] Motion does not obscure text, the CTA, RSVP controls, or event information.
- [ ] Asset size/loading and mobile performance are measured.
- [ ] Off-screen nonessential motion is paused/reduced where practical.
- [ ] `prefers-reduced-motion` preserves content and functionality while reducing nonessential motion.
- [ ] Asset sources/licences or generation provenance are recorded.

### Wedding Wishes
- [ ] Wishes is a distinct form and data flow, separate from RSVP.
- [ ] RSVP payload still contains only the two approved attendance choices and no message field.
- [ ] Message input is validated server-side and safely rendered as text.
- [ ] Submission success is shown only after backend persistence succeeds.
- [ ] Failure preserves the entered message where appropriate and gives clear retry feedback.
- [ ] Rate limiting/anti-spam behavior is tested.
- [ ] Publishing/moderation behavior matches the policy approved before release.
- [ ] Guest-visible messages do not expose unintended private information.

### Send Gifts
- [ ] Both bank transfer information and shipping address are supported.
- [ ] Only couple-approved real details appear; no sample account number/address reaches production.
- [ ] Copy actions copy the correct field and give accessible success/failure feedback.
- [ ] Mobile readability and text selection/copy behavior are verified.

### Updated release gate
- [ ] Wedding date is set to 14 November 2026; event hours remain pending until supplied.
- [ ] Guest list schema/import contract and individual invitation security are approved.
- [ ] Wishes persistence, validation, anti-spam, and moderation/publication policy are approved and implemented.
- [ ] Bank details and shipping address are supplied and approved.
- [ ] All new feature checks above have evidence logged. All remain NOT TESTED until implementation evidence exists.
