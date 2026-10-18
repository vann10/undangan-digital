# Phase 02 Prototype Plan — Editorial Cover and Hero

**Status:** Proposed for user review; not approved for implementation.  
**Boundary:** Opening and separate Hero visual prototype only. No RSVP/backend, guest-link implementation, later sections, migrations, deployment, or production-asset claims.

## 1. Objectives and source constraints

Translate the approved Luxury High-Fashion Wedding Editorial direction into two distinct, responsive first-screen compositions. Preserve the principle **Intricate Details, Restrained Composition**: richness comes from fine engraving, typography, material quality, asymmetric framing, and whitespace. Use the locked palette and typography roles from `docs/05-COLOR-SYSTEM.md` and `docs/06-DESIGN-SYSTEM.md`; follow the CTA and accessibility rules in `docs/03-OPENING-EXPERIENCE.md`. Reference PNGs guide art direction but are not full-page backgrounds, approved production assets, or wedding facts.

## 2. Proposed compositions — approval requested

### Editorial Cover

- **Primary hierarchy:** monogram area → `RIZAL & DEWI` → carefully framed fine botanical engraving → generous Warm Ivory space → `BUKA UNDANGAN`. Do not add venue, countdown, photography, lengthy copy, or a fake envelope interaction.
- **Mobile proposal:** centered type and CTA in a comfortable single-viewport flow; botanical detail enters from edges without covering text or the button. Keep the CTA visible at common small phone heights and avoid horizontal overflow.
- **Desktop proposal:** controlled asymmetry, with a text/monogram axis offset from botanical framing; maintain a deliberate empty field rather than scaling the mobile arrangement.
- **Asset status:** no final monogram or approved botanical production art was found in `assets/final/`. Reserve a visibly labeled prototype monogram/artwork area. Any exploration asset is marked **PROTOTYPE PLACEHOLDER** in the preview and asset notes.

### Separate Hero

- **Primary hierarchy:** `THE WEDDING` → `RIZAL & DEWI` → confirmed `14 NOVEMBER 2026` → location marked **PENDING — VENUE NOT CONFIRMED** until verified. Do not invent a city or venue.
- **Visual distinction:** an opened editorial invitation composition with a different arrangement of rules, typography, botanical framing, and negative space from the Cover. Warm Ivory stays dominant; a selected White stationery surface may support hierarchy.
- **Exclusions:** no production photo, countdown, RSVP CTA, long-form copy, or script typeface.
- **Transition contract:** Hero appears directly as the result of `BUKA UNDANGAN`; the guest does not scroll to discover it. Normal scrolling is available afterward.

## 3. Visible paper texture proposal — approval requested

The **presence** of visible paper texture is user-approved. The following treatment is a **design proposal**, not a locked token:

| Variable | Proposed starting point | Review criterion |
|---|---|---|
| Intensity | Low contrast, roughly 3–5% local luminance variation over Warm Ivory; visible at normal zoom in open areas. | Reads as fine stationery, never dirty/noisy; names, body text, CTA and focus remain clear. |
| Grain scale | Fine, non-directional grain with features roughly 2–4 CSS px at normal density; no large speckles or repeating motif. | Perceptible on desktop and phone without moiré, banding, or distracting texture behind glyphs. |
| Placement | Apply primarily to Warm Ivory Cover/Hero fields; reduce or omit directly beneath dense small text and interactive states; keep White surfaces cleaner. | Negative space remains calm; Emerald Blue stays a selective accent and botanical line detail remains distinct. |
| Delivery | Evaluate a small optimized texture asset or restrained CSS treatment during implementation. | No meaningful mobile loading cost or visible tiling/layout instability. |

Typography and functional contrast must be checked **after** texture is rendered, not inferred from flat palette values. Champagne stays ornamental and is not used for small functional text.

## 4. Interaction storyboard and states — approval requested

1. **Initial Cover:** all essential names and CTA are legible immediately; decorative entrance, if used, does not delay access.
2. **Focus/hover/pressed:** semantic `BUKA UNDANGAN` button has a visible focus indicator and restrained pointer/pressed response. State is not communicated by color alone.
3. **Activation:** selected cover elements shift or reveal in an intentional sequence; botanical drawing is optional if it performs well; the Cover exits cleanly.
4. **Handoff:** separate Hero settles into view without a manual scroll or residual scroll lock; focus moves or remains in a logical accessible position.
5. **Reduced motion:** replace the elaborate sequence with an immediate or short opacity handoff, preserving the same Hero content and keyboard path.

Target approximately **1.2–1.6 seconds** for the complete CTA-to-Hero sequence, subject to real-browser validation (`docs/03-OPENING-EXPERIENCE.md` §6). Morphing may be tested where visual continuity is clear; fades or other restrained transitions are acceptable when morphing harms clarity or performance. No particles, bounce, heavy 3D, or scroll hijacking.

## 5. Responsive and accessibility requirements

- **Mobile first:** deliberate single-column hierarchy, touch-friendly button, preserved whitespace, no clipped title or botanical overlap. Desktop is a recomposition with controlled asymmetry.
- **Proposed review widths:** small phone around 320px, common phone around 390px, tablet around 768px, and desktop around 1440px; adjust based on actual browser/device findings.
- **Input:** button works with pointer, touch, Enter, and Space; visible focus; accessible name; no focus trap.
- **Motion:** `prefers-reduced-motion` yields equivalent content and function; no essential information is animation-only.
- **Reading/contrast:** logical heading order and reading sequence; normal text target ≥4.5:1, large text ≥3:1 on the rendered textured surface; decorative engravings do not obscure text.
- **Performance:** optimize artwork and texture for mobile; do not use screenshots as page backgrounds or ship unapproved heavy animation assets.

## 6. Placeholder and asset handling

The date and couple names are confirmed. Event hours, venue/location, final monogram, and final botanical production assets are pending. Display development placeholders with explicit labels; do not present reference images, generated portraits, scenic buildings, Gandrung motifs, or a prototype mark as production-approved facts or assets. Record source/provenance, intended use, file size, and approval status for any asset introduced during Phase 02. Venue information and decoration are outside this prototype's dependency chain.

## 7. Phase 02 deliverables and acceptance gate (future work, NOT TESTED)

If explicitly approved to implement, Phase 02 should deliver a running Opening/Hero prototype, documented design choices and placeholder/asset status, and browser evidence at the proposed widths. Acceptance requires:

- Cover and Hero are visually distinct and use approved color/type roles.
- Cover shows monogram area, names, engraving, whitespace and `BUKA UNDANGAN` clearly.
- Activating the CTA by pointer or keyboard reveals Hero without scrolling; normal scrolling works afterward.
- Hero has the confirmed date and a clearly pending location; it contains none of its prohibited elements.
- Visible texture is restrained and does not degrade rendered contrast, focus, reading, or mobile performance.
- Reduced-motion behavior preserves content and function.
- No invented wedding facts or unapproved final artwork appear; all placeholders are unmistakable.
- Viewport, input, focus, motion, contrast and performance observations are recorded as **PASS/FAIL/BLOCKED/NOT TESTED** with evidence; no status is inferred from this plan.

## 8. Phase boundary

This file is a proposal for review. **Do not begin Phase 02 implementation until the user explicitly approves the resolution and prototype plan.**
