# Decision Log — Rizal & Dewi Digital Invitation

Record decisions with dates and evidence. Do not use this file to duplicate the whole spec.

## Status vocabulary
- LOCKED: user-approved; do not change without explicit authorization.
- DEFINED: implementation approach selected; validate where appropriate.
- PENDING: user input or decision needed.
- PLACEHOLDER: temporary, not production content.
- BLOCKED: cannot proceed safely/correctly.
- NOT TESTED: no evidence of validation.
- CONFLICT — USER CONFIRMATION REQUIRED: sources disagree and explicit user decision does not resolve it.

## Current confirmed decisions
| Topic | Decision | Status | Source/notes |
|---|---|---|---|
| Couple | Rizal & Dewi | LOCKED | Project docs |
| Wedding date | 14 November 2026 | LOCKED | Later explicit project decision; reconcile stale docs |
| Art direction | Luxury High-Fashion Wedding Editorial | LOCKED | Project docs |
| Principle | Intricate Details, Restrained Composition | LOCKED | Project docs |
| Primary palette | Emerald Blue #174A4A, Warm Ivory #FAF7F1, White #FFFFFF + documented supports | LOCKED | Color system |
| Frontend | Next.js + TypeScript | LOCKED | Technical architecture |
| RSVP backend | Supabase | LOCKED | Technical architecture |
| Transitions | Morph is primary language for most meaningful transitions; use alternatives when morph is unsuitable | DEFINED/USER-DIRECTED | Later explicit user direction |
| Section scope | Opening, Hero, Our Story, The Wedding, Venue, Gallery, RSVP, Wedding Wishes, Send Gifts, Closing | LOCKED | Reconcile older eight-section docs |
| Guest routes and access | Retain sequential paths plus a separate secret, unpredictable access token; validate access to personalized data and RSVP server-side | LOCKED | Explicit Phase 01 review decision, 2026-10-18; sequential ID alone never authorizes |
| Paper texture | Visible but controlled paper texture is part of the editorial material direction | LOCKED | Explicit Phase 01 review decision, 2026-10-18; supersedes flat/imperceptible texture guidance; prototype intensity/scale/placement pending |
| Venue illustration | Decorative ornamentation only; never depicts or claims to represent the actual venue | LOCKED | Explicit Phase 01 review decision, 2026-10-18; Gandrung motif requires separate approval and verified asset |
| RSVP choices | Attending / Unable to Attend only; first accepted response final | LOCKED | Technical architecture |
| Wedding Wishes | Independent from RSVP | LOCKED | Later explicit project decision |
| Save the Date | Google Calendar event; do not invent event times/timezone | LOCKED | Later explicit project decision |

## Open decisions
### 2026-10-19 — Phase 02 approval and illustration overhaul
- Source: explicit user approval of Phase 01 resolution/Phase 02 plan, followed by ART DIRECTION OVERHAUL request.
- Implementation authorized for existing Opening and Hero; no new sections, backend, migrations or deployment.
- Decorative illustration direction: richly detailed hand-colored natural-history engraving, internal hatching/shading and organic silhouettes. Replace uniform SVG botanical outlines; retain layout hierarchy and interaction requirements.
- Emerald Blue / Warm Ivory remain foundations. Muted teal #2F6B6B, sage #6B8B7A, beige #E7DCC6 and antique gold #C9A96B are authorized controlled illustration accents, not replacement dominant UI colors.
- Three generated transparent artwork candidates now exist under public/artwork; not approved final assets. Birds, butterflies and architecture are optional and unused in this revision.
- Implementation evidence and remaining verification limits: ART-DIRECTION-REVIEW.md. Stop for review before any next phase.

| Topic | Status | Needed input or safe proposal |
|---|---|---|
| Ceremony start/end time and timezone | PENDING | User to provide |
| Venue name, full address, map URL | PENDING | User to provide |
| Our Story copy and format | PENDING | User to provide |
| Gallery photos/order | PENDING | User to provide/approve |
| Final monogram | PENDING | User asset or approve generated direction |
| Bank recipient/account details | PENDING | User to provide securely |
| Shipping address | PENDING | User to provide |
| RSVP deadline/question copy | PENDING | User to decide |
| Wedding Wishes moderation/publication policy | PENDING | Agent propose safe default and request approval if needed |
| Supabase project credentials and deployment target | PENDING | Configure outside source control |
| Invitation token lifecycle | PENDING | Define token format, generation, storage, delivery, revocation and reissue before backend implementation; do not infer policy |
| Paper texture treatment | PENDING | Review prototype proposals for intensity, grain scale and placement against legibility and mobile performance |
| Venue ornament subject | PENDING | Gandrung or any specific motif requires explicit approval; no Gandrung reference/artwork verified in workspace |
