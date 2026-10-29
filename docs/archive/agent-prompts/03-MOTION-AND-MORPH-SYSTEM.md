> Arsip prompt historis; gunakan dokumentasi aktif di docs/README.md untuk pekerjaan baru.

# 03 — SIGNATURE MOTION SYSTEM & MORPH TRANSITIONS

## Objective
Create a coherent, performant motion language for the Opening, section changes and decorative illustrations. Motion must support the editorial experience, not compete with content.

## Read first
- `PROJECT-STATE.md`
- `docs/03-OPENING-EXPERIENCE.md`
- `docs/06-DESIGN-SYSTEM.md`
- `docs/09-QA-AND-ACCEPTANCE.md`
- `assets/references/illustration-and-motion-reference.png`

## Tasks
1. Audit existing transitions before adding new ones. Define motion tokens for duration, easing, distance, stagger and layering.
2. Use morph transitions as the signature language for meaningful transitions where visual continuity supports them. Use fades, wipes, clip-path, SVG or other techniques where morphing would be awkward, expensive or inaccessible.
3. Implement the Opening reveal and Opening-to-Hero transition with the documented target duration of approximately 1.2–1.6 seconds, then validate in browser.
4. Develop organic decorative movement where appropriate: botanical sway, floating petals, butterflies, bird flight and subtle bloom/reveal. Keep decorative elements away from text, CTA and form controls.
5. Prefer lightweight CSS/SVG or carefully justified animation assets. Do not add large animation libraries without need. Record source and license for sourced assets.
6. Provide a complete `prefers-reduced-motion` path: reduce or remove nonessential motion without hiding content or blocking interactions.
7. Ensure motion is not the only carrier of meaning and never creates scroll traps, focus traps, or layout shifts that obscure controls.
8. Measure or inspect mobile performance; cap simultaneous animated elements and avoid excessive continuous repaints.
9. Record which animations are implemented, intentionally omitted, blocked by assets, or not tested.

## Deliverables
- Reusable motion tokens/utilities/components.
- Opening-to-Hero motion integrated with Phase 02.
- Selected decorative animation behavior and asset/license notes.
- Reduced-motion implementation.
- Updated `PROJECT-STATE.md` and QA evidence.

## Acceptance criteria
- Motion feels coherent, restrained and editorial.
- Morphing is used selectively, not forced everywhere.
- Reduced-motion users retain all content and functionality.
- No decorative motion obscures reading or interaction.
- Performance and browser checks are reported honestly.
- Stop at phase boundary.
