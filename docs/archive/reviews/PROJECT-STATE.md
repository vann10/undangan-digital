> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# PROJECT STATE — Rizal & Dewi Digital Invitation

## Backend checkpoint — 2026-10-20

User memilih Google Sheets + Apps Script sebagai penyimpanan utama, tautan pribadi per tamu, RSVP pertama final, dan ucapan langsung tampil. Kode backend kini mempunyai tab `Guests`/`RSVP`/`Wishes`, validasi token pribadi di server, generator tautan CSV/JSON, revokasi/reissue, serta formulir RSVP dan ucapan terpisah. Implementasi lokal masih perlu dihubungkan ke Sheet dan Apps Script nyata; jangan anggap integrasi live selesai. Detail: `docs/architecture/BACKEND-GOOGLE-SHEETS.md`.

Daftar privat `data/private/daftar_nama.json` memuat 193 nama valid tanpa duplikat. `guests.csv` dan `links.csv` telah dibuat di folder yang diabaikan Git; 193 pasangan token/hash cocok. `links.csv` masih berupa URL relatif karena domain belum ditentukan. Jangan membagikannya sebelum `finalize-links` dan uji live.

Koneksi Apps Script/Sheet nyata telah diverifikasi secara baca saja pada 2026-10-20: tiga tautan sampel mengembalikan identitas tepat, token salah dan payload tulis tidak valid ditolak, dan daftar ucapan dapat dibaca. Tamu uji ID 194 disiapkan di `data/private/test-guest.csv` untuk pengujian penulisan terpisah. Domain final tetap belum ada.

Uji tulis live kemudian PASS pada tamu sintetis ID 194: RSVP tersimpan, respons berbeda kedua ditolak, ucapan tersimpan dan terbaca publik, pengulangan Wish ID tidak menggandakan baris. Baris ID 194 di `Guests` dan `RSVP`, serta satu baris ID 194 di `Wishes`, adalah data uji yang perlu dibersihkan sebelum tautan dibagikan. Pengujian Vercel dan domain final tetap PENDING.

**Last updated:** 2026-10-20
**Current phase:** Backend implementation; live Google Sheets connection pending owner setup
**Overall status:** Local backend mocks, build, and scoped browser checks PASS; live integration and broader production QA NOT TESTED.

## Current objective
Latest approved scope execution: reverted the last three added upper botanical layers, then added a continuous static vine border on all four sides and a generated cloud/tree/bird engraving upper background. Corner flowers and butterflies retain motion; date remains absent from Opening, guest greeting remains transparent. Evidence: `FULL-FRAME-REVIEW.md`, `artifacts/full-frame/`. Await review; no new phase authorized.

Latest correction: Opening botanicals now originate from four border corners; standalone right sprig removed, upper corners filled with medium sprays. Guest greeting has no background; Opening date removed (Hero date unchanged). Evidence: `BORDER-COVER-REVIEW.md` and `artifacts/border-cover/`. Await review.

Current Opening revision: nature engraving background, denser botanical framing, two articulated butterflies. Wind cycles 3.8–5s and wing flaps 0.9s; infinite with pause and reduced motion. Evidence and generation provenance: `NATURE-COVER-REVIEW.md`. Await visual/motion review; no next-phase authorization implied.

Latest revision (19 October 2026): invitation copy, illustrated Opening background and extra decorative assets; eight continuous CSS animations with pause/resume and reduced-motion override. Hero date overlay removed and flowers extend beyond right frame while bottom remains clipped. Current evidence: `OPENING-MOTION-REVIEW.md` / `artifacts/opening-motion/`. The earlier four-second GIF behavior is superseded by explicit user request for infinite code-driven motion.

Current layout decision: one shared mobile composition. On screens wider than 760 px, a fixed decorative botanical panel fills the left and the 430 px invitation column sits at the far right; on mobile, only the full-width invitation is shown. Evidence: `MOBILE-SHELL-REVIEW.md` and `artifacts/mobile-shell/`. Previous desktop compositions are superseded by this explicit user instruction.

Latest user revision: exact supplied SVG monogram installed; guest placeholder above CTA; derived sprig GIF with static reduced-motion fallback. Current evidence: `MOBILE-REFINEMENT-REVIEW.md`. Only mobile screenshots are to be captured from now on. No guest identity integration has been added.

Review the implemented Opening and Hero and the generated engraving candidates. User explicitly approved Phase 02 implementation and subsequently requested an illustration overhaul. Stop here; no Phase 03 without new approval.

## Completed
- [x] Repository and documentation audit (findings in `PHASE-01-AUDIT-REPORT.md`)
- [x] Phase 01 review decisions recorded and Phase 02 prototype plan prepared (documentation only)
- [x] Creative Opening + Hero prototype (awaiting visual review)
- [ ] Reusable morph motion system
- [ ] Ten-section visual experience
- [ ] Backend and integrations
- [ ] Integration and QA
- [ ] Final handoff

## Confirmed decisions
- Couple: Rizal & Dewi
- Wedding date: 14 November 2026
- Direction: Luxury High-Fashion Wedding Editorial
- Principle: Intricate Details, Restrained Composition
- Stack: Next.js + TypeScript; Supabase for RSVP
- Main transition language: morph transitions for most meaningful transitions, with suitable alternatives where needed
- Sections: Opening, Hero, Our Story, The Wedding, Venue, Gallery, RSVP, Wedding Wishes, Send Gifts, Closing
- Guest access: sequential invitation route plus a separate secret, unpredictable token; server validation required for personalized data and RSVP
- Paper texture: visible but restrained material quality; exact prototype treatment awaits review
- Venue art: decorative only, never a depiction or claim about the actual venue; Gandrung motif requires separate approval

## Active work
Opening and Hero are implemented in Next.js/TypeScript. The user-requested engraving revision replaces the original SVG botanical study with generated transparent review artwork. Local fonts, paper texture, keyboard focus, direct CTA transition and reduced motion are present. No backend, migrations, additional sections or deployment have been implemented. Phase 01 reports remain historical snapshots.

## Tests actually run
| Test | Command/environment | Result | Evidence/notes |
|---|---|---|---|
| Build | npm run build | PASS | Next production build completed locally, 2026-10-19 |
| Type check | Next build TypeScript stage | PASS | Completed without errors |
| Lint | NOT RUN | NOT TESTED | |
| Unit/integration tests | NOT RUN | NOT TESTED | |
| Browser visual QA | npm run test:prototype; screenshot inspection | PASS | artifacts/art-direction; Chrome 155, five viewports |
| Contrast | python scripts/verify-contrast.py | PASS | artifacts/art-direction/contrast-results.json |
| Cross-browser / real device / screen reader | NOT RUN | NOT TESTED | No claim of production accessibility certification |

## Pending user inputs
See `MANUAL-INPUT-CHECKLIST.md`. Do not fabricate missing values.

## Conflicts and blockers
- The previous texture and Venue-purpose conflicts are resolved by explicit user decisions in `PHASE-01-REVIEW-RESOLUTION.md`; no unresolved material source conflict is currently identified.
- Token format, generation, storage, delivery, revocation and reissue remain PENDING before backend implementation. Bare sequential paths are insufficient authorization.
- Final monogram, botanical production assets, Venue ornament subject, event hours/timezone, actual venue, and other personal content remain PENDING. No Gandrung reference or production artwork is verified in the workspace.

## Next action
Await review of `ART-DIRECTION-REVIEW.md` and actual screenshots. No Phase 03 or unrelated implementation without new approval. New illustrations are review candidates; production artwork approval remains pending.


## Prompt pack revision — 2026-10-18
- Revised Master Controller and all seven phase prompts are in `agent-prompts/`.
- Legacy functional prompt is classified as supplementary at `docs/archive/specifications/reference/LEGACY-FUNCTIONAL-REFERENCE.md`.
- Three visual reference images are included under `assets/references/`.
- Historical checkpoint: Phase 01 discovery/reconciliation and its review resolution were documented on 2026-10-18. The subsequent user approval authorized Phase 02; current implementation status above supersedes the old approval wait.
- Important pending inputs: exact event start/end time and timezone; venue/address/map URL; approved story/closing copy; final photos/monogram; bank and gift-delivery details; Wedding Wishes publication/moderation policy; hosting/repository access.

## Latest checkpoint — 2026-10-19, Opening lock / Hero morph
Opening visual composition is user-approved and locked; see docs/OPENING-ART-DIRECTION-LOCK.md. Exact user monogram selected. User uploaded the Hero portrait; prior statements that no photo is available are superseded for this Hero only. New Hero hierarchy: portrait, names, date. Current work is the authorized Phase 02 revision; no Phase 03, backend or deployment. Verification and remaining limitations: HERO-MORPH-REVIEW.md. Earlier test tables describe earlier revisions only.
## Latest checkpoint — 2026-10-19, complete invitation implementation

The user subsequently authorized completion of the full invitation and changed the deployment target from GitHub Pages to **Vercel**. The earlier phase stop, Supabase plan, and morph transition notes above are historical. The current Opening-to-Hero effect is the user-approved paper reveal, and the two floral Page 2 backgrounds remain intact.

The site now contains Opening, Hero, Mempelai, countdown, event information, venue, RSVP, live-polled wishes, gifts, and closing. The RSVP API route proxies server-to-server to Google Apps Script, which writes one row per submission to Google Sheets. Source and setup instructions are in `integrations/google-apps-script/Code.gs` and `README.md`. Calendar and Maps links activate only when official time, timezone, and venue details are supplied. Google Sheets, Apps Script, and Vercel are **not yet connected or deployed**; credentials and pending event details require owner input.

Local verification: `npm run typecheck` PASS, `npm run build` PASS, `npm run test:google` PASS with mocked Sheet and date/Calendar checks, `npm run test:browser` PASS at 320, 390, and 430 px including mocked RSVP, unavailable-integration state, no horizontal overflow, and a WCAG 2 A/AA + WCAG 2.1 A/AA automated audit on mobile. The earlier Opening/Hero regression script also passed at three mobile viewports, reduced motion, and desktop panel geometry. Real Google Sheet, Vercel deployment, physical devices, Safari/Firefox, and screen reader have not yet been verified.

## Visual revision — 2026-10-19

The user confirmed the event starts at **09.00 WIB** on 14 November 2026. Opening botanical overlays, vine frame, and cloud canopy were restored. The Hero has separate left and right reference-style woody tree branch assets emerging from its upper corners in the topmost layer, each animated with smooth vertical motion. The `botanical-spray-review` decoration was removed from the Hero–Mempelai boundary; the page transition garland remains. The small "RIZAL & DEWI" label above "Mempelai" was removed. Separate floating branches animate within Page 2; portrait-frame ornaments remain static. The `ornament-review` asset is no longer rendered anywhere. A fixed bottom-right play/stop control plays the locally hosted CC BY 4.0 track "Reverie" by Scott Buckley, with attribution in the closing section.

## Follow-up — 2026-10-19

The countdown now uses individually rolling odometer digits on first view and on digit changes, with reduced-motion support. The existing floral garland divider also separates Mempelai and Countdown. A Gallery using the three supplied photographs follows RSVP and precedes Wedding Wishes. Music attempts autoplay on load, retries synchronously when the guest opens the invitation, and keeps the fixed Play/Stop control. Browser autoplay restrictions can delay sound until user interaction. Production build, TypeScript check, and browser checks at 320/390/430 px passed; the browser check includes mocked RSVP, audio control, odometer motion, and an automated WCAG audit.

The countdown intro now uses a separate overlay of randomized two-digit values updated every 10 ms for about 2.8 seconds. The actual unpadded value stays underneath and becomes visible when the overlay disappears, eliminating transient leading zeros. Normal subsequent digit changes retain the shorter odometer roll.

The user later requested distinct backgrounds for each invitation page and a realistic architectural line-art Venue backdrop. Section backgrounds now have separate gradients and restrained artwork treatments while retaining the established ivory/emerald/gold palette. Venue uses `public/artwork/venue-architectural-blueprint.svg`, a transparent, stroke-only conceptual building drawing without solid fill. It does not claim to depict the still-unconfirmed real venue. TypeScript, production build, and browser checks at 320/390/430 px passed; the browser check verifies distinct section backgrounds and the Venue asset.

