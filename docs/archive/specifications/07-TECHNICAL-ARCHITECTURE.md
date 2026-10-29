> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Technical Architecture — Rizal & Dewi Digital Invitation

> **Current backend decision (20 October 2026):** The owner selected Google Sheets + Apps Script as primary storage, individual invitation links, final first RSVP, and immediate wish publication. The Supabase references below describe the earlier plan. Current implementation and operating rules are in [BACKEND-GOOGLE-SHEETS.md](../../architecture/BACKEND-GOOGLE-SHEETS.md).

**Status:** Product decisions locked; implementation details pending  
**Purpose:** Align technical planning with confirmed project decisions without implying the backend has been implemented.

## 1. Confirmed stack and product rules

| Area | Decision | Status |
|---|---|---|
| Frontend | Next.js + TypeScript | LOCKED |
| RSVP backend | Supabase | LOCKED |
| Invitation model | One individual per invitation link | LOCKED |
| RSVP revision | Final after first submission | LOCKED |
| Operator export access | Private login | LOCKED |
| Administration | Spreadsheet/export, not bespoke dashboard | LOCKED |

## 2. Functional boundaries

The guest-facing site presents the ten-section invitation and allows a guest to submit one of the two approved responses:
- `Attending`
- `Unable to Attend`

No guest count, dietary preferences, free-form message, or other RSVP fields are approved.

The invitation model is individual-level. Each personal invitation link should resolve to one invited individual. Do not implement a shared generic link for all guests unless the user explicitly changes the model.

After the first accepted RSVP submission, the response is final under the current policy. The guest-facing experience must not imply that the response can be edited if the backend policy does not permit it.

## 3. Access and export

- Operator access to RSVP data is private and requires authentication.
- Data administration is by spreadsheet/export; do not build a bespoke dashboard unless separately approved.
- Exported data must be handled as private guest information.
- Do not expose operator credentials or unrestricted RSVP data to the public client.

## 4. Technical decisions still required

The following implementation details are not yet established by the current decisions and must not be invented as if already approved:

- Supabase table/schema and field names.
- Invitation token generation, storage, expiry, and revocation policy.
- Exact placement/encoding of the required secret, unpredictable access token alongside the sequential route.
- Token format, generation, storage, delivery, revocation, and reissue behavior.
- How token-to-guest association is validated.
- Database constraints for one response per invitee.
- Exact authentication method for the private operator.
- Export format, delivery method, and authorization checks.
- Error codes and guest-facing error copy.
- Privacy notice/retention policy.
- RSVP deadline, if any.
- Hosting/deployment target, environment configuration, backups, and monitoring.

These should be resolved during technical design before implementation. Any proposed defaults must be marked as proposals, not locked decisions.

## 5. Security baseline for design and implementation

- Validate invitation identity on the server; do not trust a client-supplied guest ID alone.
- Enforce one accepted RSVP per individual using server/database constraints.
- Keep service-role secrets server-side only.
- Use least-privilege access for operator/export workflows.
- Do not make the export endpoint publicly accessible.
- Validate input even though only two choices are permitted.
- Avoid exposing whether arbitrary invitation identifiers belong to a guest.
- A sequential invitation path is only a locator. Require a separate secret, unpredictable access token for personalized guest information and RSVP operations; validate both association and entitlement server-side. A bare sequential path must never authorize access.
- Use environment variables for secrets and document required variables without storing real secrets in source control.
- Test unauthorized, malformed, duplicate, and already-submitted requests.

These are implementation requirements/recommendations, not evidence that the system currently satisfies them.

## 6. Suggested data concepts (not a locked schema)

A future schema will likely need to represent:
- invited individual identity,
- a securely verifiable invitation link/token,
- RSVP response (`attending` or `unable_to_attend`),
- submission timestamp,
- status needed to enforce final-after-first-submission behavior.

This is a conceptual list only. Table names, column names, constraints, and token strategy remain pending technical design.

## 7. Acceptance conditions

Before release, verify:
- a valid personal invitation link resolves correctly;
- invalid/unknown tokens do not expose guest data;
- one individual cannot submit multiple competing responses;
- a second submission follows the final-response policy;
- successful submission feedback appears only after backend confirmation;
- failed submission preserves the choice and provides a retry path where appropriate;
- private operator authentication is required;
- export access is restricted and tested;
- secrets are not included in client bundles;
- mobile, keyboard, and reduced-motion behavior remains correct.

**Status:** product-level technical decisions LOCKED; schema, implementation, deployment, and technical QA NOT TESTED / PENDING.

Catatan audit
Ada satu hal yang sangat penting untuk dipertahankan: RSVP tidak boleh dianggap aman hanya karena tautannya bersifat personal. Dokumen ini sudah benar karena mensyaratkan validasi identitas di server, pembatasan satu respons per individu, dan pengujian akses yang tidak sah.
Sebelum implementasi, ada tiga kelompok keputusan yang masih perlu diselesaikan:
1. Identitas undangan: bagaimana token dibuat, diverifikasi, dicabut, dan dihubungkan dengan individu yang diundang.
2. Pengelolaan data: bagaimana operator login, mengakses, dan mengekspor respons secara privat.
3. Aturan pengiriman: bagaimana sistem menangani pengiriman ganda, respons yang sudah final, dan kegagalan backend.


## 8. Opening revision impact

The Editorial Cover revision does not change the confirmed technical stack or RSVP architecture. Opening interaction may be implemented with CSS and JavaScript within the existing Next.js + TypeScript frontend. Use a semantic button for `BUKA UNDANGAN`, preserve keyboard/focus behavior, and respect `prefers-reduced-motion`. This note defines no new backend requirement and is not evidence of implementation or QA.

---

## 9. Approved architecture additions — implementation required

### 9.1 Personalized invitation data

The guest list will be supplied as CSV or JSON. The import/seed process must validate required fields, normalize input safely, identify duplicates, and map each individual sequential route/identifier to a separate secret, unpredictable access token. The formal guest-facing salutation is `Yth. [nama]`. Neither the sequential path nor a client-provided name/guest ID is sufficient authorization. Validate token-to-guest association on the server before revealing personalized data or accepting RSVP. Do not expose the guest list or permit enumeration. Token format, generation, storage, delivery, revocation, reissue, import tooling, and exact schema remain PENDING technical design; do not invent a policy or store raw guest data or administrative secrets in public client code.

### 9.2 Save the Date / Google Calendar

Create a Google Calendar event URL prefilled with the confirmed date **14 November 2026**. Exact start time, end time, time zone, and venue remain PENDING. Do not generate production event hours or duration by assumption. The implementation must make the missing-time state explicit and regenerate/replace the link after details are approved. Decide and document whether a date-only placeholder link is offered before release.

### 9.3 Wedding Wishes — separate data flow

Wedding Wishes is a separate guest message form displayed after RSVP; it is not part of the RSVP payload and must not alter the locked RSVP choices or first-submission-final rule. Implementation requires persistent storage, server-side validation, safe output encoding, anti-spam/rate limiting, and an explicit publication/moderation policy. Table/schema, message limits, anonymous/public visibility rules, moderation workflow, retention, and abuse handling remain PENDING. Do not display a message as successfully submitted until the backend confirms storage. Do not render raw user input as HTML.

### 9.4 Send Gifts content

The section must support both approved content types: bank transfer details and a physical gift-shipping address. Real bank/account-holder/account-number and address values are PENDING and must not be fabricated. Copy-to-clipboard actions may be implemented with clear success/failure feedback. Confirm what exact values are intended for public display before release.

### 9.5 Organic motion and asset delivery

Rich organic motion is a frontend requirement, not a new backend requirement. Select SVG/CSS, Lottie/Rive, or optimized animated assets per use case. Provide reduced-motion alternatives, lazy-load or pause nonessential off-screen motion where practical, and test performance on mobile. Do not imply that sourcing/generating assets or browser QA is complete until evidence exists.

### 9.6 Event date status

The wedding date has been confirmed as 2026-11-14. Wedding time and event duration remain PENDING. Venue, address, and map URL remain PENDING. Update the relevant date status in implementation records without filling any unknown values.
