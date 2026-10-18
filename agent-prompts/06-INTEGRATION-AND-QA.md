# 06 — INTEGRATION, ACCESSIBILITY, SECURITY & REGRESSION QA

## Objective
Integrate the visual experience with real backend flows and validate the application across supported devices, browsers, accessibility needs and failure cases.

## Read first
- `PROJECT-STATE.md`
- `docs/09-QA-AND-ACCEPTANCE.md`
- `docs/07-TECHNICAL-ARCHITECTURE.md`
- Phase 02–05 implementation notes and evidence

## Tasks
1. Verify all ten sections appear in the correct order and internal navigation/scroll behavior works.
2. Test Opening CTA, Opening-to-Hero transition, keyboard focus, reduced-motion path and post-transition scrolling.
3. Test mobile, tablet and desktop layouts at documented representative viewports. Record device/browser, steps, expected and observed outcomes.
4. Test RSVP: both valid choices, invalid guest, repeated submission, first-response-final behavior, network/backend failure and unauthorized access.
5. Test guest route privacy: sequential path guessing must not expose guest data or authorize another guest.
6. Test Wedding Wishes: valid/empty/over-limit content, persistence, safe rendering of markup-like input, spam/rate limits, publication/moderation rules, loading and error states.
7. Test private export authentication and confirm unauthenticated users cannot retrieve exports or private guest records.
8. Test countdown against known test datetimes and timezone boundaries; do not mark the live countdown production-ready until the actual event time/timezone are confirmed.
9. Test Maps and Calendar links using confirmed details when available. Otherwise mark them blocked and record the missing inputs.
10. If Google Sheets is enabled, test authentication, write/export path, duplicates, failure/retry and permissions. If not enabled, document that explicitly.
11. Check contrast, semantic headings, labels, screen-reader feedback, keyboard operation, focus visibility, touch targets and reduced motion.
12. Check image sizes, loading behavior, font loading, layout shifts, animation performance, console errors and build/lint/typecheck output where available.
13. Fix defects found within scope and rerun relevant regression checks.
14. Update the QA evidence log and `PROJECT-STATE.md`. Never mark an untested item as PASS.

## Deliverables
- QA matrix with PASS / FAIL / BLOCKED / NOT TESTED statuses.
- Reproducible defect list and fixes.
- Build/lint/typecheck/test results with actual command output summaries.
- Browser/device and accessibility findings.
- Updated `PROJECT-STATE.md`.

## Acceptance criteria
- No unsupported claim of full test coverage or production readiness.
- Critical security and RSVP tests have explicit evidence.
- Known blockers are clearly separated from failures.
- Regressions are retested after fixes.
- Stop at phase boundary.
