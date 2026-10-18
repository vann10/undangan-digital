# 01 — DISCOVERY, RECONCILIATION & IMPLEMENTATION PLAN

## Objective
Audit the project before coding. Produce one consistent, evidence-based implementation plan that incorporates the supplementary legacy functional prompt without silently changing approved decisions.

## Read first
- `PROJECT-STATE.md`
- All files in `docs/`, especially `01` through `10`
- `docs/reference/LEGACY-FUNCTIONAL-REFERENCE.md`
- All files in `assets/references/`
- `MANUAL-INPUT-CHECKLIST.md`

## Tasks
1. Inspect repository/workspace structure and identify existing code, package manager, tests, deployment config, Supabase migrations and assets. Do not assume the project is already a Next.js app.
2. Compare canonical docs, later explicit project decisions, visual references and legacy prompt.
3. Produce a conflict/decision matrix with: topic, current decision, source of authority, conflict or gap, proposed handling, whether user confirmation is required.
4. Reconcile historical eight-section descriptions to the active ten-section sequence: Opening, Hero, Our Story, The Wedding, Venue, Gallery, RSVP, Wedding Wishes, Send Gifts, Closing. Preserve the topic-specific rules (e.g. countdown in The Wedding; no countdown in Hero).
5. Plan functional requirements: countdown, Google Maps, Google Calendar, separate Wedding Wishes, Send Gifts, RSVP and private export. Identify which are blocked by missing event times/timezone, venue details, content, credentials, or deployment access.
6. Decide and document a technical approach consistent with Next.js + TypeScript + Supabase. Treat Google Sheets as optional export/integration, not primary storage. Do not assume GitHub Pages is suitable for server-side features.
7. Plan guest route resolution for sequential invitation URLs without treating sequential IDs as authorization. Specify server-side guest validation and privacy boundaries.
8. Define an asset plan for the three visual references. Keep reference imagery separate from production assets; list asset source/license obligations.
9. Propose milestones, architecture, data-flow, risk register, test strategy, and deployment options. Do not implement the full app in this phase.
10. Update canonical documents only when the resolution is supported by explicit user decisions or is a non-conflicting technical elaboration. Otherwise log a conflict for user confirmation.
11. Update `PROJECT-STATE.md` and `docs/DECISION-LOG.md`.

## Deliverables
- Discovery audit and requirements traceability matrix.
- Conflict/gap register with statuses.
- Proposed application architecture and data flows.
- Technical implementation plan split across remaining phases.
- Updated `PROJECT-STATE.md`.
- Explicit list of required user inputs and external permissions.

## Acceptance criteria
- Every requirement from the legacy prompt is classified as adopt / adapt / reject / pending, with rationale.
- No locked RSVP rule or stack decision is silently changed.
- The event time and timezone are marked pending until supplied.
- Google Sheets role is documented and not assumed to be the primary database.
- Deployment plan accounts for server/backend needs.
- No production code is implemented beyond small, clearly justified setup checks.
- Stop after the audit and wait for the next phase.
