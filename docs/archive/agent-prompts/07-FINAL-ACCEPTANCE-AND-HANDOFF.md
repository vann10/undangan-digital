> Arsip prompt historis; gunakan dokumentasi aktif di docs/README.md untuk pekerjaan baru.

# 07 — FINAL ACCEPTANCE AUDIT & HANDOFF

## Objective
Produce an evidence-based final release assessment and a useful maintenance handoff. Do not imply deployment or integration is complete unless verified.

## Read first
- `PROJECT-STATE.md`
- `MANUAL-INPUT-CHECKLIST.md`
- `docs/08-CONTENT-AND-ASSET-REGISTER.md`
- `docs/09-QA-AND-ACCEPTANCE.md`
- Latest QA report and deployment configuration

## Tasks
1. Compare the delivered app against every applicable canonical requirement and the legacy functional reference.
2. Produce a traceability checklist linking each requirement to implementation location and verification evidence.
3. Report unresolved user inputs: event start/end time and timezone, venue/address/map URL, approved Our Story/closing copy, final photography, monogram/artwork, bank details, gift address, wishes publication policy, and any required guest data.
4. Verify that no placeholders, invented event details, test guest records or debug UI are presented as real production content.
5. Verify secret handling, Supabase policies, guest-link authorization, RSVP finality, wishes safe rendering and operator export protection.
6. Report the actual repository URL and deployment URL only if directly verified. If unavailable, state the exact user action or permission required.
7. Document Supabase schema, migrations, environment variable names, setup steps, guest import format, operator export process and backup/retention notes.
8. Document Google Maps and Calendar behavior and their confirmed configuration. If Google Sheets was not implemented, say so; if implemented, document auth, data flow, failure handling and maintenance.
9. Provide commands for local development, linting, type checking, tests, build and deployment based on the actual repository.
10. Provide known limitations, deferred work, risk notes and rollback/recovery guidance.
11. Finalize `PROJECT-STATE.md` and QA evidence log.

## Deliverables
- Final implementation/acceptance report.
- Requirement-to-evidence traceability matrix.
- Repository and deployed URLs if verified.
- Google Sheets status/schema if applicable.
- Google Apps Script source only if actually used; otherwise explicitly state it was not needed/implemented.
- Maintenance, environment setup, guest import/export and deployment instructions.
- Remaining blocker list.

## Acceptance criteria
- Every status is evidence-based.
- `PASS`, `BLOCKED`, `PENDING` and `NOT TESTED` are not conflated.
- No invented URL, integration, credentials, or success claim.
- The user can distinguish what is done from what they must still provide or authorize.
- Stop after handoff.
