# Legacy Functional Reference (Supplementary)

This file records the user's supplied legacy prompt as a source of functional goals. It is not the active architecture or the authority for conflicts.

## Goals to evaluate
- RSVP submission, manageable records and export
- Wedding Wishes display
- Wedding countdown
- Clickable venue address / Google Maps
- Save the Date / Google Calendar
- Replaceable wedding information and family placeholders
- Gift section with bank details and delivery address
- Mobile-first responsive design and optional motion/music
- Media asset optimization
- Deployment and maintenance handoff
- Google Sheets and/or Google Apps Script if technically justified and explicitly configured

## Required adaptation to this project
- RSVP is limited to `Attending` and `Unable to Attend`; do not add name, guest-count, or wishes fields. Guest identity comes from the individual invitation link.
- Wedding Wishes is separate from RSVP.
- Next.js + TypeScript and Supabase remain the approved baseline.
- Google Sheets is optional export/integration, not the primary database by default.
- GitHub Pages must not be assumed suitable for the complete backend-dependent application.
- Countdown and Google Calendar require confirmed event start/end times and timezone.
- Google Maps requires confirmed venue data.
- Never invent names, venue, family details, account numbers, shipping address, photos, guest records, credentials or external URLs.
- Treat media folder `XXX` from the legacy prompt as an unresolved placeholder; use the actual project asset register and workspace.
