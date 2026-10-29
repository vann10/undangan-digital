> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Manual Inputs Checklist — Rizal & Dewi Digital Invitation

This file lists information or access that an agent cannot safely invent. Add only what is required, and never commit secrets or sensitive guest data to a public repository.

## A. Must be supplied/confirmed before production launch
- [ ] Ceremony start time and end time (with local timezone, likely Asia/Jakarta only if confirmed)
- [ ] Venue name
- [ ] Full venue address
- [ ] Approved Google Maps URL
- [ ] Our Story copy and approval of its presentation/format
- [ ] Final gallery photos and desired sequence (or approve agent's proposed sequence)
- [ ] Final monogram/logo artwork, or approve a generated proposal
- [ ] Final RSVP question/copy
- [ ] Closing statement/copy
- [ ] Bank name, account holder name, account number, and which details may be publicly shown
- [ ] Gift shipping recipient name, address, and delivery notes
- [ ] RSVP deadline, if one will be enforced
- [ ] Wedding Wishes display/moderation policy

## B. Guest data — prepare privately
- [ ] Guest list in CSV or JSON
- [ ] Stable internal guest identifier and display name for each invitee
- [ ] Confirm one invitation link per individual
- [ ] Confirm whether the displayed salutation should be `Yth. [nama]`
- [ ] Validate guest names and spelling
- [ ] Decide how links are delivered to guests
- [ ] Keep the real guest list outside public source control; use fake fixtures for development

Suggested CSV headers (example only):
`guest_id,display_name,invitee_status,invitation_code`

Do not treat sequential route IDs as authorization. Agent must design server-side verification. Do not add real guest rows to this example.

## C. Accounts and technical access — configure manually in provider dashboards
- [ ] Create/select a Supabase project
- [ ] Configure database access and apply reviewed migrations
- [ ] Configure operator authentication and allowed operator accounts
- [ ] Create environment variables in local environment and hosting provider
- [ ] Choose hosting/deployment target and domain
- [ ] Configure DNS/domain and HTTPS if launching publicly
- [ ] Set up backups, logging, and error monitoring appropriate to launch
- [ ] Verify production access controls and export authorization

Never send secret keys in a normal prompt if your agent can use environment-variable configuration. Never commit `.env.local`, service-role keys, passwords, or production tokens.

## D. Visual assets
- [ ] Upload approved couple photos
- [ ] Supply or approve a source for decorative Venue ornament if a specific motif is desired; it must not claim to depict the actual venue, and Gandrung requires separate explicit approval
- [ ] Upload brand/monogram source files if available
- [ ] Review any generated birds, butterflies, botanical SVGs, or animated assets
- [ ] Confirm license/provenance for any third-party asset or font
- [ ] Approve final art direction after reviewing the running prototype

## E. Final manual checks before release
- [ ] Test on a real iPhone/iOS Safari if available
- [ ] Test on Android Chrome if available
- [ ] Test desktop browser
- [ ] Test reduced-motion setting
- [ ] Test a valid guest link and an invalid link
- [ ] Test RSVP once, then verify a second submission is rejected/handled per policy
- [ ] Verify private export requires authentication
- [ ] Submit a Wedding Wish and verify safe display/moderation behavior
- [ ] Confirm Google Calendar event has correct date, times, and timezone
- [ ] Verify bank and shipping details character-by-character
- [ ] Review all placeholders and remove or replace them before launch
- [ ] Confirm privacy notice and data retention approach

## F. Do not fill in by guessing
- Venue, event time, address, map link
- Personal relationship story
- Real photographs or claims that placeholder images depict the couple
- Bank details or shipping address
- Real guest identities or credentials
