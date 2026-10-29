# Struktur repository dan kebijakan aset

Root menyimpan entry point dokumentasi dan konfigurasi. Kode aplikasi tetap memakai colocation App Router di `app/`; kode Apps Script berada di `integrations/google-apps-script/`.

## Dokumentasi

- `docs/architecture/`: arsitektur aplikasi saat ini dan kontrak backend.
- `docs/operations/`: setup, data tamu, migrasi Sheet, dan deployment.
- `docs/design/`: sistem visual, motion, dan register aset.
- `docs/archive/`: spesifikasi awal, checkpoint, prompt agen, dan review historis.

Mulai dari [indeks dokumentasi](README.md). Dokumen arsip tidak menjadi sumber tanggal acara, status pengujian terkini, atau aturan fase pekerjaan baru.

## Aset

Sumber asli yang diperlukan untuk regenerasi disimpan di `assets/`. Intermediate `assets/master/` dan `assets/build/` dibuat pipeline dan diabaikan Git. WebP/SVG/audio yang dikirim ke browser berada di `public/`. PNG sumber tidak dipublikasikan sebagai cadangan ketika WebP telah tersedia.

Screenshot dan hasil QA masuk ke `artifacts/` yang diabaikan Git. Skrip yang sebelumnya terselip di output footer dipindahkan ke `scripts/verify-footer.mjs`. Pengujian desain lama berada di `scripts/legacy/`. Placeholder Supabase dikeluarkan karena backend aktif memakai Google Sheets.

## Pemulihan lokal

Hasil pengukuran snapshot pada cleanup 29 Oktober 2026 (sebelum commit):

| Ukuran | Sebelum | Sesudah |
| --- | ---: | ---: |
| Berkas repository | 848 | sekitar 312 |
| Total ukuran berkas | 350,91 MiB | sekitar 80,02 MiB |

Pengurangan sekitar 270,88 MiB (77,2%) terutama berasal dari screenshot QA, salinan intermediate, PNG publik, musik lama, dan referensi gambar duplikat. Sumber asli yang dibutuhkan pipeline serta aset runtime tetap disertakan. Angka menghitung berkas snapshot, tanpa dependency, output build, arsip pemulihan, atau database objek Git.

Cleanup tanggal 29 Oktober 2026 memindahkan output dan aset lama ke `.local/repository-cleanup/`. Manifest mencatat path asal dan tujuan. Folder ini diabaikan Git dan tidak tersedia pada clone baru. Jangan menyalin isinya secara massal ke repository; pulihkan hanya berkas yang diperlukan setelah memeriksa pemakaiannya.

Pengurangan berlaku untuk snapshot berkas yang akan di-commit. Blob besar dari commit lama tetap ada dalam histori Git; cleanup ini tidak menulis ulang histori. Ukuran `.git` atau clone dengan seluruh histori belum tentu ikut mengecil. Ruang disk lokal juga tetap menyimpan salinan pemulihan.

`.vercelignore` mengecualikan sumber gambar, dokumentasi, data privat, dan output lokal dari upload Vercel CLI. Build aplikasi hanya membutuhkan kode dan aset publik yang sudah di-commit.
