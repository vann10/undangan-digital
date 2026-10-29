> Arsip prompt historis; gunakan dokumentasi aktif di docs/README.md untuk pekerjaan baru.

# 02 — CREATIVE EXPLORATION & OPENING/HERO PROTOTYPE

## Objective
Build and validate the visual foundation and the two distinct first-screen compositions: Editorial Cover Opening and Hero. Use design judgment while preserving approved visual decisions.

## Read first
- `PROJECT-STATE.md` and Phase 01 audit
- `docs/03-OPENING-EXPERIENCE.md`
- `docs/04-SECTION-ART-DIRECTION.md`
- `docs/05-COLOR-SYSTEM.md`
- `docs/06-DESIGN-SYSTEM.md`
- `assets/references/website-design-reference.png`
- `assets/references/opening-screen-reference.png`
- `assets/references/illustration-and-motion-reference.png`

## Tasks
1. Inspect the actual reference images and translate them into a responsive design direction; do not place a screenshot behind the interface.
2. Establish tokens, typography, spacing, responsive grid, reusable primitives, focus styles and semantic color roles based on canonical docs.
3. Implement the Opening as a distinct editorial cover: R & D monogram area, `RIZAL & DEWI`, fine-line botanical art, generous whitespace and `BUKA UNDANGAN` CTA.
4. Implement Hero as a separate composition. Hero must not require scrolling to appear and must not contain a photo, countdown, RSVP CTA or long copy.
5. Make the CTA a real accessible button. Activation should lead into the approved restrained reveal/transition and then Hero; normal scrolling works afterward.
6. Use real UI text and controls, not baked-in screenshot text. Any illustrative copy/data remains labeled as placeholder.
7. Ensure mobile and desktop are intentionally composed, not merely scaled. Prevent clipping, overlap and horizontal overflow.
8. Provide an initial asset strategy for monogram and botanical engraving. Do not claim generated/reference art is final approved production art.
9. Test the prototype in a browser if available. If not, record exactly what remains untested.

## Deliverables
- Running Opening/Hero implementation integrated into the project.
- Documented tokens/components created or changed.
- Responsive screenshots or equivalent test evidence where available.
- Updated `PROJECT-STATE.md` and asset status register.

## Acceptance criteria
- Opening and Hero are visually and behaviorally distinct.
- The CTA is keyboard accessible, visibly focused, semantically correct and works.
- Hero appears without requiring user scroll.
- Palette and type follow locked design documentation.
- Reference images are treated as guidance, not page backgrounds.
- Reduced-motion path is considered from the start.
- Stop at phase boundary.
