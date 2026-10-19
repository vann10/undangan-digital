# Opening lock and Hero morph — 19 October 2026

## Delivered
- Opening retained and locked in `docs/OPENING-ART-DIRECTION-LOCK.md`.
- Hero follows the same paper, cloud atmosphere, engraving and typography without a perimeter border. Hierarchy: portrait in arch frame, names, confirmed date.
- Uploaded `assets/Seon-ho Youn-jung.jpg` copied unchanged to `public/artwork/couple-user-upload.jpg` (63,704 bytes). Neutral alternative text; pictured identities and production rights not independently verified.
- Native shared-element morph connects monogram/portrait and names (approximately 950ms). Reduced motion bypasses animation; unsupported browsers use fade fallback.
- Changed: app/page.tsx, app/globals.css, scripts/verify-prototype.mjs, docs/04-SECTION-ART-DIRECTION.md, docs/DECISION-LOG.md, PROJECT-STATE.md, and new locked recipe. No extra sections, backend or deployment.

## Verification
Evidence: `artifacts/hero-morph/browser-results.json`; Chrome 155.0.8059.80. Commands through RTK: npm run build and npm run test:prototype.

| Criterion | Status | Evidence |
|---|---|---|
| Production build / TypeScript | PASS | Next build completed with static routes |
| Photo, names, date hierarchy | PASS | Bounding-box assertions at 320, 390, 430px; screenshots inspected at 320/390 |
| No horizontal overflow / direct Hero reveal | PASS | Three mobile viewport assertions, scrollY zero |
| Morph visual | PASS | mobile-morph.png intermediate frame and final Hero inspected |
| Photo crop / floral overflow | PASS | Both faces visible; sprig extends beyond portrait, does not obscure names/date at inspected sizes |
| Keyboard and visible focus | PASS | Enter/Space, solid 2px outline, focus transferred to Hero heading |
| Reduced motion / pause control | PASS | Zero reduced-motion animations; 13 Opening loops pause/resume |
| Image loads, alternatives, fonts, runtime | PASS | Automated assertions; zero page errors |
| Desktop shared mobile geometry | PASS | 768/1440 tested without desktop screenshots |
| New rendered contrast sampling | NOT TESTED | Historical contrast results not reused as a new verification; palette retained |
| Safari, Firefox, physical devices, screen reader | NOT TESTED | Chrome emulation only |
| Unsupported View Transition fallback | NOT TESTED | Fallback not separately exercised in this pass |

## Screenshots
All in `artifacts/hero-morph/`: mobile-cover.png, mobile-hero.png, small-mobile-hero.png, mobile-wide-hero.png, mobile-morph.png, keyboard-focus.png.

Local cold load measured around 3.23MB, including the large exact supplied monogram. Timings are local diagnostics, not mobile-network guarantees. Guest name remains a placeholder. Await review; no Phase 03 without approval.
