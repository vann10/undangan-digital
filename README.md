# Undangan Digital Rizal & Dewi

Undangan pernikahan dengan Next.js App Router, React, TypeScript, dan GSAP. Data tamu, RSVP, serta ucapan menggunakan Google Sheets melalui Google Apps Script. Target deployment: Vercel.

## Mulai

```sh
npm ci
npm run dev
```

Buka `http://127.0.0.1:3000`. Salin `.env.example` ke `.env.local` untuk mengaktifkan backend. Pratinjau tersedia di `/preview/pria` dan `/preview/wanita`; formulir pratinjau dinonaktifkan.

## Struktur

| Folder | Tanggung jawab |
| --- | --- |
| `app/` | Route, komponen, gaya, dan API Next.js |
| `public/` | Aset yang disajikan ke browser |
| `assets/` | Sumber gambar asli untuk pipeline pengolahan |
| `integrations/` | Kode Google Apps Script |
| `scripts/` | Pengolahan aset, pengelolaan tamu, dan verifikasi |
| `docs/` | Arsitektur, panduan operasional, desain, dan arsip |
| `data/private/` | Data tamu lokal; diabaikan Git |

Detail acara berada di [app/wedding-config.ts](app/wedding-config.ts). Pengaturan transisi dan musik berada di [transition.config.js](transition.config.js).

## Verifikasi

```sh
npm run check:repository
npm run typecheck
npm run test:google
npm run build
npm run start -- --port 3016
# Di terminal lain:
npm run test:browser -- http://127.0.0.1:3016
npm run test:assets -- http://127.0.0.1:3016
```

Tes browser memakai backend tiruan. Tes yang namanya mengandung `live` memerlukan layanan asli; baca skrip sebelum menjalankannya karena sebagian menulis data uji.

Lihat [indeks dokumentasi](docs/README.md), [panduan operasional dan deployment](docs/operations/RUNBOOK.md), serta [panduan kontribusi](CONTRIBUTING.md).
