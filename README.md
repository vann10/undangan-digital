# Rizal & Dewi — Revised Agent Pack

This package contains canonical project documentation, the revised phase-based agent prompts, the current project-state handoff, a manual-input checklist, and three visual reference images.

## Start here
1. Read `agent-prompts/00-MASTER-CONTROLLER.md`.
2. Run `agent-prompts/01-DISCOVERY-AND-RECONCILIATION.md` first.
3. Review the audit and updated `PROJECT-STATE.md`.
4. Proceed one phase at a time, in order, stopping at each phase boundary.

## Prompt files
- `00-MASTER-CONTROLLER.md` — global rules, source hierarchy, scope, privacy, truthfulness and phase protocol.
- `01-DISCOVERY-AND-RECONCILIATION.md` — audit docs, legacy prompt, conflicts and implementation plan.
- `02-CREATIVE-PROTOTYPE-OPENING-HERO.md` — design foundation and Opening/Hero.
- `03-MOTION-AND-MORPH-SYSTEM.md` — motion system, organic animation, reduced motion.
- `04-FULL-VISUAL-EXPERIENCE.md` — all ten sections.
- `05-BACKEND-RSVP-AND-INTEGRATIONS.md` — Supabase, RSVP, wishes, guest links, exports and integrations.
- `06-INTEGRATION-AND-QA.md` — integration, security, accessibility, responsive and regression QA.
- `07-FINAL-ACCEPTANCE-AND-HANDOFF.md` — release audit and maintenance handoff.

## Visual references
- `assets/references/website-design-reference.png`
- `assets/references/opening-screen-reference.png`
- `assets/references/illustration-and-motion-reference.png`

These are visual references, not final production assets or sources of verified wedding details. The agent should inspect them and recreate responsive components rather than use screenshots as page backgrounds.

## Important project decisions
- Stack: Next.js + TypeScript + Supabase.
- Active sequence: Opening → Hero → Our Story → The Wedding → Venue → Gallery → RSVP → Wedding Wishes → Send Gifts → Closing.
- RSVP: `Attending` / `Unable to Attend` only; one person per invitation link; first accepted response is final.
- Wedding Wishes is independent from RSVP.
- Google Sheets is optional and not the primary database by default.
- Event date is 14 November 2026; exact event start/end times and timezone remain pending.
- Venue and other personal/financial details must not be invented.

## Manual inputs
See `MANUAL-INPUT-CHECKLIST.md`. Do not place private guest data or secrets in public source control.

## Status
Documentation and prompts are a project starter, not proof of a complete application, live backend, deployment, or passed QA.
