# Decorative artwork inventory

## Nature cover additions — 2026-10-19
- `lake-landscape-review.webp`: generated decorative imaginary lake/mountains, 900×1350, no venue claim. PNG master in assets/lake-landscape-review-master.png.
- `butterfly-spread-review.webp`: generated symmetric butterfly, 500px wide; split into clipped left/right wing layers and body in code, 0.9s flap loop. PNG master in assets/butterfly-spread-review-master.png.
- Both REVIEW CANDIDATES from built-in imagegen. Full prompts and implementation verification: NATURE-COVER-REVIEW.md. Botanical uses existing assets; no new stock or photography.

## User asset update — 2026-10-19
- Current motion revision: `naturalist-butterfly.webp` is used as a decorative Opening accent; botanical spray is also used at low opacity as the Opening background. Eight decorative image elements loop through CSS animations with a pause control and reduced-motion override. `rd-bud-sprig-still.webp` now receives code-driven motion; the four-second GIF is archived and no longer loaded by the page. See OPENING-MOTION-REVIEW.md.
- `monogram_RD_exact_illustration.svg`: user-selected replacement used unchanged in Cover and Hero; 2048×1365 SVG wrapper embedding PNG, ~2.65 MB. Replaces typographic placeholder.
- `rd-bud-sprig-v1.webp`: user-supplied static source, 427×640.
- `rd-bud-sprig-sway.gif`: derived motion candidate, 200×280, 80 frames at 50ms/frame, one 4-second play, no infinite looping. Reproducible using `scripts/create-sprig-gif.py`. Decorative empty alt. GIF palette/alpha can be less precise than WebP.
- `rd-bud-sprig-still.webp`: same canvas, reduced-motion static alternative selected using picture media.
- Other new user assets inspected at file/metadata level: botanical_full_detail_hybrid, botanical_ornament, circular_monogram_ornament, floating_botanical_leaves_fidelity, gandrung-venue, naturalist-butterfly, paper-grain, rd-connecting-branch-v1, rd-peony-accent-v1, romantic-doves, monogram WebP. Not automatically treated as final approved art. File name gandrung-venue does not establish actual venue identity; unused.


Generated 2026-10-19 Asia/Jakarta with built-in image_gen. All three illustrations: **REVIEW CANDIDATES — NOT APPROVED PRODUCTION ART**. Master alpha preserved. No external stock illustrations, no venue representation. User reference boards guided style; their embedded copy is not content authority.

| Base filename | Master | Web delivery | Intended use |
|---|---|---|---|
| botanical-ascending-review | PNG 1024×1536 | WebP full size + 560×840 | Cover lower-left; different placement inside Hero panel |
| botanical-spray-review | PNG 1536×1024 | WebP full size + 560×373 | Cover upper-right; distinct composition |
| ornament-review | PNG 2172×724 | WebP 600×200 | Cover divider above CTA |

All paths in this directory. Original PNG retained for review, only WebP referenced by app. Full flowers use quality 90 / alphaQuality 100; smaller derivatives retain aspect ratio. `srcset` selects according to screen size and DPR. Images are decorative (`alt=""`, hidden from assistive technology), pointer-events none; no continuous artwork motion. Existing section fade honors reduced-motion.

## Final generation prompts (built-in mode)

### botanical-ascending-review
Create a composable website decorative asset: a tall asymmetric flowering branch, dense lower-left flowers tapering into fine curving twigs upper-right. Vintage hand-colored botanical copperplate engraving like luxury nineteenth-century natural-history plates. Ivory five-petal flowers and layered camellia blossoms with individually etched curled petals and intricate golden stamens; natural serrated leaves with hundreds of fine vein and crosshatched shading marks, deep teal #174A4A, muted teal #2F6B6B, sage #6B8B7A and restrained warm beige highlights. Believable stems, varied leaf directions and scale. Extremely detailed ink engraving, rich selective dark shading, not clean outline vectors. Entire isolated composition visible with transparent background, no paper rectangle, no lettering, no borders, no people, no buildings. Portrait composition. Reference style is the botanical board attached by user, but this is a new standalone illustration, not a website mockup.

### botanical-spray-review
Use case stylized-concept. Create one standalone transparent decorative botanical engraving for luxury wedding stationery. Horizontal arching spray of ivory wild roses, small buds and richly shaded deep teal leaves, loosely curving downward from upper right toward lower left. Hand colored nineteenth century natural history copperplate: delicate sepia crosshatching inside every petal, intricate stamens, irregular serrated leaf edges, visible finely drawn veins, varied tonal density. Palette #174A4A deep teal, #2F6B6B muted teal, #6B8B7A sage, ivory and restrained antique gold. Strong botanical anatomy, elegant asymmetry, clustered blossoms at right and tapering airy twigs left. Entire spray isolated with generous transparent margins. No lettering, no background, no vignette, no frame, no website UI, no building. Rich internal engraving detail, never flat modern vector strokes.

### ornament-review
Standalone small horizontal antique engraved ornamental divider on fully transparent background. A delicate symmetrical curling acanthus flourish with a tiny central botanical rosette and tapering pen stroke tendrils on either side. Fine nineteenth century copperplate ink hatch marks within gold leaves. Restrained antique gold #B79A68 with selective sepia engraved contours and pale warm beige highlights. Very wide narrow composition, elegant luxury wedding stationery ornament. Entire ornament visible, no text, no border, no mockup, no shadows, no background or paper rectangle. Crisp intricate print detail.
