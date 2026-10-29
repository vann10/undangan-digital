# Panduan kontribusi

Gunakan `npm ci` dan Node.js yang kompatibel dengan versi Next.js di lockfile. Baca `AGENTS.md` serta panduan Next.js lokal sebelum mengubah konvensi framework. Jalankan perintah dari root repository. Jika memakai RTK, awali dengan `rtk proxy`.

## Penempatan berkas

- Simpan route, komponen, hook, dan gaya di `app/`; colocation didukung App Router. Buat subfolder berdasarkan fitur ketika ukurannya membutuhkan pemisahan.
- Simpan kode layanan eksternal di `integrations/`, alat pemeliharaan di `scripts/`, dan dokumentasi di `docs/`.
- Tambahkan dokumentasi aktif ke `docs/README.md`. Masukkan rencana atau laporan lama ke `docs/archive/` dengan konteks historis.
- Commit sumber gambar untuk regenerasi dan WebP/SVG/audio yang digunakan aplikasi. Jangan commit intermediate `assets/build/`, `assets/master/`, screenshot `artifacts/`, cache, atau `.local/`.
- Pertahankan sumber/atribusi aset. Uji referensi dinamis dan ukuran layar saat menghapus aset; pencarian nama berkas saja tidak cukup.
- Jangan commit `.env.local`, data tamu asli, kode undangan, atau ekspor Sheet. Gunakan data sintetis untuk pengujian.

## Pemeriksaan perubahan

Jalankan `npm run check:repository`, `npm run typecheck`, `npm run test:google`, dan `npm run build`. Untuk perubahan UI/aset, jalankan `npm run test:browser -- <base-url>` dan `npm run test:assets -- <base-url>` terhadap server produksi. Output browser disimpan lokal; bagikan melalui artifact CI atau lampiran review jika diperlukan.

Lihat [daftar skrip](scripts/README.md). Tes live tidak termasuk pemeriksaan rutin dan memerlukan persiapan tamu uji. Tinjau `git diff` sebelum commit, termasuk penghapusan dan pemindahan berkas.
