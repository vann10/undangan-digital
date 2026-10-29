# Alat pemeliharaan dan verifikasi

Jalankan dari root repository. Skrip browser menggunakan Playwright dan Chrome lokal. Screenshot/hasil pengujian masuk ke `artifacts/` yang diabaikan Git.

| Kelompok | Skrip / perintah | Kegunaan |
| --- | --- | --- |
| Repository | `npm run check:repository` | Referensi aset statis, tautan dokumentasi aktif, dan kebijakan ignore |
| Backend lokal | `npm run test:google` | Kontrak Apps Script, impor tamu sintetis, dan konfigurasi acara |
| Browser utama | `npm run test:browser -- <base-url>` | RSVP, gallery, dan dialog foto dengan backend tiruan |
| Aset browser | `npm run test:assets -- <base-url>` | URL dinamis, varian 1x/2x, dan fallback gambar di dua pratinjau acara |
| Browser khusus | `verify-cinematic`, `verify-chapter-art`, `verify-event-types`, `verify-footer`, `verify-loading-arch`, `verify-name-transition`, `verify-rsvp-gallery`, `verify-scroll-story`, `verify-guest-hero`, `verify-transition-controls`, `verify-transition-settle` | Pemeriksaan per fitur; lihat parameter URL di masing-masing `.mjs` |
| Aset | `build-*.py`, `optimize-web-images.py`, `verify-transition-assets.py` | Regenerasi opsional; lihat `assets/README.md` |
| Tamu privat | `prepare-guests.mjs`, `verify-short-files.mjs`, `verify-generated-guests.mjs` | Menyiapkan/memeriksa data lokal di `data/private/` |
| Integrasi live | `verify-live-*.mjs`, `prepare-test-guest.mjs` | Memerlukan environment dan layanan asli; sebagian menulis data uji |
| Diagnostik | `diagnose-loading.mjs` | Pemeriksaan loading |
| Historis | `legacy/` | Pengujian desain sebelum versi cinematic, termasuk suite complete lama; perlu pembaruan selector sebelum digunakan |

Tes otomatis tidak menggantikan verifikasi Sheet asli atau perangkat fisik. Jangan menjalankan tes live sebagai bagian cleanup repository.
