> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Content & Asset Register — Rizal & Dewi

**Status:** Living register; do not fabricate missing inputs  
**Purpose:** Track real wedding data, copy, and visual assets required before release.

## 1. Content register

| Item | Current status | Notes |
|---|---|---|
| Couple names | DEFINED | Rizal & Dewi |
| Wedding date | DEFINED | 14 November 2026; supplied in project conversation |
| Wedding time | PENDING | Do not infer |
| Venue name | PENDING | Do not infer |
| Full venue address | PENDING | Do not infer |
| Map URL | PENDING | Must be validated before `VIEW LOCATION` is wired |
| Our Story copy | PENDING | Actual narrative not supplied |
| Our Story format | PENDING | Do not assume timeline/chapters/chronology |
| RSVP question/copy | PENDING | Only response choices are locked |
| RSVP choices | LOCKED | `Attending`; `Unable to Attend` |
| Closing statement | PENDING | Do not invent as final copy |
| Monogram | ASSET PENDING | Final artwork not supplied |
| Decorative Venue artwork | ASSET PENDING | Engraved ornament only; must not claim to depict the actual venue; Gandrung motif needs separate approval |
| Gallery photographs | ASSET PENDING | Actual images and sequence not supplied |
| Script typeface | PENDING | Family not selected |

## 2. Visual asset direction

### Opening — Editorial Cover
- Editorial Cover artwork/layout centered on monogram, couple names, botanical engraving, whitespace, and CTA `BUKA UNDANGAN`.
- Final couple monogram artwork/source file and responsive exports.
- Botanical SVG line-art using the approved engraving style and palette.
- Supporting cover assets only where they improve the composition without adding clutter.
- Separate Hero artwork/supporting assets, if required by the final Hero implementation.

### Venue
- Architectural engraving is the primary subject.
- Botanical details remain secondary.
- Venue artwork is decorative ornamentation only, not a depiction of the actual venue. Its subject and asset remain pending. Do not claim a building, stage, statue, landmark, or Gandrung reference is approved or present without verifying the asset and decision; Gandrung motifs require explicit approval.

### Gallery
- Use real couple/wedding photographs supplied or approved by the user.
- Preserve natural photographic character; integrate through crop, framing, and whitespace rather than uniform tinting.
- Determine final sequence only after assets are available.

### Monogram
- Refined intertwined serif/ornamental monogram.
- Reuse selectively across Opening, invitation, dividers, RSVP, Closing, and favicon where appropriate.
- Avoid overuse.

## 3. Asset consistency checklist

- [ ] Botanical assets use fine engraving-like line work.
- [ ] Color use respects the locked palette.
- [ ] Assets retain negative space and do not obscure essential content.
- [ ] Venue art is identified as decorative and cannot be mistaken for the actual venue; any Gandrung motif has explicit approval and verified source/provenance.
- [ ] Gallery uses approved real photography.
- [ ] Image crops and alt text are defined.
- [ ] Asset dimensions/performance are checked for mobile.
- [ ] Final monogram has an approved source file and export format.

## 4. Content completion gate

The date is confirmed as 14 November 2026. Do not treat the invitation as production-ready until event start/end time and timezone, verified venue/location, story copy, RSVP question/copy, closing copy, final photography, and required monogram/decorative Venue assets have been supplied or explicitly marked not applicable.

Catatan audit
Ada dua hal yang perlu dipertahankan:
1. Jangan membuat data pernikahan atau konten personal berdasarkan asumsi. Dokumen dengan tepat membedakan data yang sudah diketahui dari informasi yang masih menunggu konfirmasi.
2. Aset visual harus berasal dari referensi yang disetujui. Khusus ilustrasi venue, jangan menggambar bangunan spesifik seolah-olah itu venue sebenarnya sebelum referensinya tersedia.

---

## 5. Approved new content and asset requirements

| Item | Current status | Notes |
|---|---|---|
| Formal guest greeting | LOCKED direction | Use `Yth. [nama]`; surrounding sentence can be composed flexibly |
| Guest list source | PENDING | CSV or JSON; field contract and import/validation flow still need definition |
| Wedding date | DEFINED | 14 November 2026 |
| Wedding start/end time and time zone | PENDING | Required for a fully specified timed Google Calendar event; do not infer |
| Google Calendar action | REQUIRED | Prefilled event link using confirmed data; time values remain pending |
| Organic animated assets | REQUIRED | Birds, butterflies, blooming flowers, swaying botanicals, line-draw motion as composition requires; asset selection/source not yet complete |
| Wedding Wishes form/copy | REQUIRED / COPY PENDING | Separate from RSVP; message length, publication and moderation policy pending |
| Wedding Wishes persistence | REQUIRED | Backend implementation and storage schema pending |
| Bank transfer details | PENDING | Need approved bank, account holder, account number, and display format |
| Gift-shipping address | PENDING | Need approved address and public-display confirmation |

### Organic asset requirements
- Prefer transparent, optimized assets that can be layered over Warm Ivory without a rectangular background.
- Use intrinsic animation when appropriate (wing flap, petal opening, sway, line drawing), not only positional movement.
- Record source/licence or generation provenance for every external/generated production asset.
- Define reduced-motion behavior, alt/decorative treatment, dimensions, format, file size, and loading strategy.
- Do not depict or imply any venue illustration is the real venue; keep verified venue name, address, and map URL independent from decorative art.

### Guest data requirements
- Confirm the CSV/JSON field contract before import. Do not assume file headers or unique-key strategy.
- Validate names and duplicate records, safely encode output, and connect each person to their individual invitation identity.
- Do not commit private guest lists or secrets to public source control.

### Content completion gate update
#### 2026-10-19 illustration revision inventory
- `assets/source-artwork/botanical-ascending-review.png`: generated portrait botanical master, 1024×1536; lower-left Cover and Hero panel.
- `assets/source-artwork/botanical-spray-review.png`: generated floral spray master, 1536×1024; upper-right Cover.
- `assets/source-artwork/ornament-review.png`: generated engraved flourish master, 2172×724; Cover divider.
- WebP derivatives, alpha, dimensions, loading behavior, provenance and exact generation prompts: `docs/archive/reviews/ASSET-INVENTORY.md`.
- All are REVIEW CANDIDATES, not approved production artwork. Existing monogram remains a labeled placeholder. No generated building, landscape, person, venue representation, bird or butterfly is used.
- Six supplied reference paths are style references (three visually duplicated pairs), not final artwork or factual copy sources. Missing production content remains pending as below.

The date itself is confirmed as 14 November 2026. Production readiness still requires event start/end time and time zone, venue/address/map URL, approved guest list and import contract, story/copy, RSVP wording, bank details, shipping address, wishes moderation/publication policy, approved visual assets, and final browser/backend QA.
