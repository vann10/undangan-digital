# Color System — Rizal & Dewi

**Status:** LOCKED palette and semantic direction; final browser contrast QA NOT TESTED  
**Principle:** Intricate Details, Restrained Composition

## 1. Locked primitive palette

| Color | Hex | Role |
|---|---|---|
| Emerald Blue | `#174A4A` | Brand/interaction accent, monogram details, important links, selected states |
| Warm Ivory | `#FAF7F1` | Dominant page canvas and whitespace |
| White | `#FFFFFF` | Selected stationery surfaces and editorial contrast |
| Muted Sage | `#899783` | Secondary botanical layers/details |
| Deep Sage | `#596957` | Primary botanical structure and engraving |
| Champagne | `#B79A68` | Restrained ornamental details only |
| Warm Charcoal | `#393534` | Primary readable text |
| Soft Brown | `#746A66` | Secondary text and metadata, subject to contrast checks |

Do not add new brand colors for ordinary components without explicit approval. Older dusty-blush references are historical and do not supersede the locked Emerald Blue palette.

## 2. Semantic roles

| Token | Value / alias | Use |
|---|---|---|
| `--color-bg-primary` | Warm Ivory | Default page background |
| `--color-bg-surface` | White | Selected stationery/reply surfaces |
| `--color-bg-accent` | Emerald Blue | Limited accent fields |
| `--color-text-primary` | Warm Charcoal | Names, headings, body, essential information |
| `--color-text-secondary` | Soft Brown | Metadata/supporting copy when contrast passes |
| `--color-text-on-accent` | Warm Ivory | Text on Emerald Blue, verify contrast in context |
| `--color-accent-primary` | Emerald Blue | Important links/actions, monogram accents |
| `--color-focus` | Emerald Blue | Keyboard focus indicator |
| `--color-botanical-primary` | Deep Sage | Primary botanical illustration |
| `--color-botanical-secondary` | Muted Sage | Secondary botanical details |
| `--color-ornament` | Champagne | Fine decorative lines and stationery details |
| `--color-border-subtle` | Contextual palette color | Fine border with adequate contrast |

## 3. Hierarchy and usage

1. Warm Ivory — primary canvas.
2. Emerald Blue — distinctive brand accent.
3. Deep Sage — primary botanical structure.
4. Muted Sage — lighter botanical support.
5. White — selected surface contrast.
6. Warm Charcoal — primary typography.
7. Soft Brown — supporting typography/metadata.
8. Champagne — small ornamental highlights.

Warm Ivory is dominant; Emerald Blue must not become the background for the entire site. Do not apply every palette color to every section.

### Champagne

Use for fine ornament, engraved details, dividers, and restrained monogram accents. Do not use it for small functional text or as the default status/focus color. Avoid large gold fields and heavy gold gradients.

### Photography

Preserve natural photographic character. Use crop, framing, and whitespace rather than applying a uniform tint to every image.

### Borders

A semantic border role does not mandate one color. Choose a suitable palette color according to the border's function and contrast requirement. Decorative Champagne borders must not replace sufficiently contrasting functional boundaries.

## 4. Section mapping

| Section | Direction |
|---|---|
| Opening | Warm Ivory canvas; selective Emerald Blue monogram/CTA accents; Deep Sage botanical details |
| Hero | Warm Ivory; selected White stationery surface; Emerald Blue monogram/accent |
| Our Story | Warm Ivory/White in controlled composition; Deep Sage botanical framing; natural photography |
| The Wedding | Warm Ivory and White invitation surface; Emerald Blue accents; restrained Champagne ornament |
| Venue | Warm Ivory; decorative engraving supports the composition without representing the actual venue; botanical details secondary |
| Gallery | Warm Ivory; photography dominates; minimal decoration |
| RSVP | Warm Ivory or White; Warm Charcoal text; Emerald Blue selected state and interaction |
| Closing | Warm Ivory; monogram as final anchor; restrained botanical ornament |

Do not alternate backgrounds mechanically.

## 5. Interaction states

- Default: semantic color for the element.
- Hover: small tonal, underline, or shadow change; no dramatic hue shift.
- Keyboard focus: clear visible outline; not color-only.
- Pressed: brief, restrained response.
- RSVP selected: stronger typographic emphasis and subtle Emerald Blue rule/marker; selection must not rely on color alone.
- Disabled: use only when needed; preserve readability and clear status.
- Success: quiet acknowledgement; no confetti, large checkmark, modal, or flashy toast.

For the Opening CTA, express hover/pressed state through a restrained tonal, underline, or subtle movement cue—not glow or destructive effects.

## 6. Contrast and accessibility

The source color system reports approximate contrast values for solid colors; overlays, opacity, photography, and actual rendering can change the result. Re-test rendered components before release.

Requirements:
- Normal text contrast at least 4.5:1.
- Large text contrast at least 3:1.
- Do not use Champagne or Muted Sage as small functional text on Ivory/White when contrast is insufficient.
- Focus must be visible.
- State changes must not be communicated by color alone.
- Reduced motion must preserve state feedback.

**Status:** palette LOCKED; rendered browser contrast QA NOT TESTED.
