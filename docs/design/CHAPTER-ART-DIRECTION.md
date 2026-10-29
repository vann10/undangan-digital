# Chapter artwork — 28 November 2026

Latest refinement (24 October): only the original Hero→Mempelai garland is displayed. All other connections use plain feathered color blends without additional ornament. Hero typography has a thin teal outline, the Opening guest greeting is black, and the Footer date is replaced with the original raster RD monogram. Footer copy is lifted 25px. The generated connector remains archived as an unused asset.

Five raster assets were generated with built-in `image_gen.imagegen`. Original outputs are retained in `assets/chapter-sources`; generated PNG masters in `assets/master` and intermediate WebP exports in `assets/build` are ignored by Git. Runtime WebP variants live in `public/chapter-art`; public PNG copies were removed during repository cleanup. See `docs/design/CHAPTER-ASSETS.md` for dimensions and file sizes. Rebuild with `python scripts/build-chapter-art.py` (Pillow required).

## Different scenes, one engraving style

- **RSVP / rsvp-correspondence:** envelopes, folded wedding letters, teal wax seal, antique pen, an asymmetric blossom sprig. Quiet upper center for the form.
- **Gallery / gallery-conservatory:** Victorian glasshouse arches, etched iron ribs, potted fern and roses, a tiled walkway. Architecture frames the photos; the background fades in rather than starting with a rectangular edge.
- **Footer / footer-wedding-arch:** freestanding floral trellis, a garden path, and two cream doves; deep teal center behind the closing words.
- **chapter-garland:** transparent botanical raster with intact leaves at both ends. Shared among seven new boundaries, mirrored/rotated for variation; the previous two Hero/Mempelai connectors remain.
- **desktop-wedding-blueprint:** landscape botanical drafting plate with roses, olive branches, butterflies and wedding rings on a faint ivory technical grid. Desktop-only CSS avoids downloading it for mobile. The invitation remains 430px wide and centered.

The first three lake/vine studies (`rsvp-garden`, `gallery-garden`, `footer-garden`) remain source studies only and are not served or used. They were superseded after the user's correction requesting different subjects and compositions rather than color variations.

## Prompt set

Style references for chapter imagery: supplied edge-vine, lake-landscape and butterfly master PNGs. For desktop: existing `public/artwork/section-venue-generated.webp` is the lineart blueprint reference. References guide line quality and palette, never claim to depict the real venue.

Common chapter prompt: “Portrait 2:3 raster background for a wedding invitation website. The attached references define LINE QUALITY AND PALETTE ONLY; do NOT copy their compositions. Vintage 19th century scientific engraving and muted watercolor, extremely fine crosshatching and stipple, desaturated teal, olive, ivory and soft ochre, flat illumination, no photorealism, glossy lighting, vector art, uniform thick outlines or text.”

RSVP subject prompt: Victorian wedding correspondence still life; lower third antique cream envelopes, folded blank letters, small muted teal wax seal, engraved brass pen, ivory blossoms. Asymmetric lower corners and one upper-left twig, quiet pale cream central/upper 65%. No lake, mountains, side vines, gates, architecture or readable writing.

Gallery subject prompt: Victorian botanical conservatory interior, iron ribs and glass panes forming architectural arches restricted to margins; potted fern and rose at lower corners; tiled walkway at the base. Upper/central 70% quiet ivory. No lake, mountains, envelopes, butterfly borders or painted photo placeholders.

Footer subject prompt: freestanding wrought iron wedding floral arch with ivory roses and olive leaves in a woodland garden; two cream doves on a branch, winding garden path below. Deep desaturated teal ground with cream, sage and faded ochre etching, central 60% quiet for closing words. No lake, mountains, continuous side vines, envelopes or conservatory.

Garland prompt: isolated horizontal 4:1 interwoven olive and eucalyptus garland with small ivory wild roses, faded teal and sage, extremely fine Victorian engraving and stippling; truly transparent background, intact tapered leaves, clear padding, dense ends and an airy center. No vector or glossy rendering.

Desktop prompt: landscape 16:9 continuous wedding wallpaper matching the reference's fine desaturated teal architectural blueprint lines on pale cream drafting paper, faint square grid and construction circles; Victorian botanical studies of roses, olive sprays, ferns, butterflies and two interlocking wedding rings; motifs at left/right thirds with sparse center. No text, numbers, labels, dark blue background, photography, 3D, glossy metal or thick outlines.

Visual review: the final scenes have distinct objects and silhouettes, fine hatching, faded pigment, flat illumination and no vector substitutes. The garland's transparency was inspected in the actual page; no paper rectangle. Export preserves native proportions; no sharpening or saturation adjustment.

## Integration and verification

Chapter backgrounds and new garlands use the existing GSAP/IntersectionObserver entrance system. Backgrounds drift/settle while fading in; connectors sway. Reduced motion displays everything without entrance motion. All chapter images are lazy-loaded after Opening, and repeated connectors share one URL.

The original lineart loading flower is restored at `/artwork/loading-petals-lineart.svg`, explicitly requested by the user. Hero text is white. Full names each occupy a single heading with a uniform font size and wrap naturally only when needed. `app/wedding-config.ts` is the date source for all pages, countdown and Calendar URL, now 28 November 2026.

Build and TypeScript pass. `scripts/verify-chapter-art.mjs` verifies three mobile widths, full-name sizing/overflow, Hero color, new image decoding, connector presence and centered 430px desktop layout. Browser results and screenshots: `artifacts/chapter-art/`. Date/Calendar checks: `scripts/test-wedding-config.mjs`. Device-specific Android frame rate has not been measured.
