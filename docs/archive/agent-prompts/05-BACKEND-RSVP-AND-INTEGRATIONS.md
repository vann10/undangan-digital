> Arsip prompt historis; gunakan dokumentasi aktif di docs/README.md untuk pekerjaan baru.

# 05 — BACKEND, RSVP, WEDDING WISHES & INTEGRATIONS

## Objective
Implement the secure data model and server-side flows for guest-specific invitations, final RSVP submissions, Wedding Wishes, private exports, and event integrations.

## Read first
- `PROJECT-STATE.md`
- `docs/07-TECHNICAL-ARCHITECTURE.md`
- `docs/08-CONTENT-AND-ASSET-REGISTER.md`
- `docs/09-QA-AND-ACCEPTANCE.md`
- Phase 01 architecture and risk decisions

## Required architecture
Use Next.js + TypeScript and Supabase. Google Sheets may be evaluated as optional export/integration; it is not the primary database unless the user explicitly changes the decision.

## Guest identity and invitation routes
1. Support sequential guest paths such as `/1`, `/2`, `/3` only as route identifiers mapped to guest records.
2. Do not treat a sequential ID as proof of authorization. Define and implement server-side identity/authorization validation appropriate to the agreed guest-link model.
3. Prevent enumeration or exposure of other guests' data. Public pages must not return a full guest list.
4. Keep private guest data out of public repositories and client bundles.

## RSVP invariants
1. Only two choices are accepted: `Attending` and `Unable to Attend`.
2. One individual per invitation link.
3. First accepted submission is final. Enforce this on the server/database, not only in UI.
4. Do not add free-form name, guest count, wishes, or other fields.
5. Validate input, handle invalid/duplicate submissions safely, and make the operation idempotent where appropriate.
6. Show success only after server confirmation; preserve the choice and provide an accessible retry state on failure.
7. Protect exports behind private operator authentication. No service-role key or private secret may reach the client.

## Wedding Wishes
1. Implement a separate form and data flow, independent of RSVP.
2. Persist approved messages in Supabase and display them in the Wedding Wishes section according to the documented publication/moderation policy.
3. If the policy is not yet specified, record it as a blocking decision or implement a safe moderation-ready default only if it does not silently publish unapproved content.
4. Add server validation, length limits, safe rendering/escaping, spam/rate limiting and accessible success/error feedback.
5. Avoid displaying private guest information beyond the approved display name.

## Countdown, Google Maps and Google Calendar
- Countdown uses the confirmed wedding datetime and timezone. Do not invent event time or timezone.
- Google Maps link must use the confirmed venue/address/map URL. Do not fabricate venue coordinates or venue details.
- Build a Google Calendar event link only from confirmed title, date, start time, end time, timezone, venue and description. Do not present an incomplete event as final.
- If inputs are missing, implement configuration interfaces and mark integration `PENDING`/`BLOCKED`; do not fake a successful action.

## Google Sheets and exports
1. Treat Sheets as optional unless the user explicitly approves it as a live integration.
2. Prefer a documented authenticated export path if spreadsheet export is sufficient.
3. If live synchronization is proposed, document data flow, auth, failure/retry behavior, duplication handling, access controls and privacy implications before implementing.
4. Never store OAuth credentials or secrets in client code.
5. Provide export format/schema and operator setup instructions.

## Deliverables
- Supabase schema/migrations and secure data access policies.
- Server-side route/actions/API as appropriate.
- Guest resolution and RSVP flow.
- Separate Wedding Wishes persistence/display flow.
- Authenticated operator export flow.
- Configured/blocked status for countdown, Maps, Calendar and optional Sheets.
- Environment variable documentation using names only, no secret values.
- Updated `PROJECT-STATE.md`, architecture docs and tests.

## Acceptance criteria
- Server/database enforces RSVP invariants and guest boundaries.
- Wishes are separate and safely rendered.
- Operator exports require authentication.
- No secrets/private guest data leak into the client or repository.
- Missing wedding inputs are explicit blockers, not invented.
- Tests cover allowed/invalid/duplicate cases and authorization boundaries.
- Stop at phase boundary.
