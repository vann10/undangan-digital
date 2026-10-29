> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Memory prompt — undangan Rizal & Dewi

Lanjutkan pekerjaan di `D:\rizal\undangan-digital` (Windows, PowerShell). Checkpoint: 19 Oktober 2026, Asia/Jakarta. Berkomunikasi dalam Bahasa Indonesia. Baca `AGENTS.md` dan `C:\Users\vann\.codex\RTK.md`. **Semua shell command harus diawali `rtk`**, misalnya `rtk proxy npm run build`. Jangan menganggap server dari chat lama masih hidup. Perubahan kerja saat ini belum di-commit; jangan reset atau membuangnya.

## Prioritas keputusan pengguna

- Opening telah disetujui dan komposisi visualnya dikunci; jangan mengubahnya tanpa instruksi baru. Isi Opening mencakup monogram SVG persis pilihan pengguna, nama Rizal & Dewi, `Yth. [nama tamu]`, tombol BUKA UNDANGAN, dan kontrol jeda animasi. Opening tidak menampilkan tanggal.
- Permintaan terbaru: **hapus morph transition Opening → Hero**. Implementasi terkini memakai efek lembar undangan yang terbuka dari atas ke bawah, dengan rangkaian bunga mengikuti garis bukaannya. Hero tetap diam di bawah. Jangan mengembalikan View Transition atau morph kecuali pengguna meminta.
- Pengguna sebelumnya meminta agar **pemisah bunga baru antara Hero dan page 2 tetap dipertahankan**. Jangan menghapusnya.
- Page 2 memakai gambar latar yang disukai pengguna, `page-two-botanical-background.png`, **dua kali** di bagian atas dan bawah dengan fade. Permintaan sempat berganti menjadi satu gambar, kemudian pengguna meminta kembali ke dua gambar. Pertahankan versi dua gambar sampai ada arahan baru.
- Teks nama lengkap, profil, dan akun media sosial kedua mempelai boleh berupa **placeholder sementara** berdasarkan jawaban eksplisit pengguna. Jangan mengarang detail personal.

## Kondisi implementasi

- Stack: Next.js 16 + React 19 + TypeScript. Implementasi utama di `app/page.tsx`, CSS di `app/globals.css`. CSS memuat beberapa override historis; periksa cascade sebelum mengubah visual.
- Stage `cover` → `opening` → `hero`. `openInvitation()` menampilkan Hero di belakang Opening, menjalankan efek bukaan CSS selama 1250 ms, lalu menghapus cover dan fokus ke judul Hero. Mode `prefers-reduced-motion: reduce` langsung membuka Hero tanpa animasi. Foto Hero dan ornamen frame dipreload.
- Efek terbaru: `.stage-opening .cover` memakai animasi `opening-paper-reveal` dengan `clip-path`; `.opening-sweep` memakai gambar `assets/source-artwork/page-transition-garland.png` dan bergerak mengikuti tepi bukaan. Hero tidak diberi animasi masuk setelah bukaan. Foto dan teks tidak melakukan morph.
- Hero: foto pasangan `public/artwork/couple-user-upload.jpg` di frame lengkung, dekorasi frame `botanical_full_detail_hybrid.webp`, nama Rizal & Dewi, tanggal **14 November 2026**. Background alam/lake dan cloud lembut. Jangan menambahkan venue/jam fiktif.
- Page 2: section `.couple-page`, urutan konten wanita lalu pria. Foto: `public/artwork/brides-user-upload.jpg` dan `public/artwork/bridesgroom-user-upload.jpg` (sumber pengguna di `assets/brides.jpg`, `assets/bridesgroom.jpg`). Tiap profil punya foto, nama panggilan, placeholder nama lengkap, profil, dan media sosial. Ornamen frame wanita `rd-peony-accent-v1.webp` di kiri bawah; pria `botanical_ornament.svg` di kanan bawah, lebar CSS 130px dan rotasi 200° clockwise. Ornamen profil tidak dianimasikan, sesuai koreksi pengguna.
- Pemisah Hero/page 2 menggunakan `page-transition-garland.png` dan `botanical-spray-review.png`; spray diberi gerakan naik turun. Ornamen ini tetap melintasi batas kedua section.
- Layout mobile adalah komposisi utama. Pada desktop >760px, panel undangan 430px berada di kanan dan dekorasi statis di kiri. Pengguna menginginkan screenshot mobile saja; geometri desktop boleh diuji tanpa screenshot.

## Bukti terbaru dan cara verifikasi

- `rtk proxy npm run build` **PASS** setelah transisi baru diterapkan.
- `rtk proxy node scripts/verify-pages.mjs http://127.0.0.1:3015` **PASS** pada Chrome 155: viewport 320×568, 390×844, 430×932; mode reduced motion; geometri desktop; gambar ter-load; tidak ada overflow horizontal atau runtime error. Laporan: `artifacts/pages-review/browser-results.json`.
- Cuplikan transisi: `artifacts/pages-review/mobile-reveal-early.png`, `mobile-reveal-mid.png`, `mobile-reveal-late.png`; hasil Hero/page 2 dan batasnya juga ada di folder yang sama. Ini bukti revisi saat ini, bukan jaminan browser/perangkat lain.
- Browser fisik, Safari/Firefox, dan screen reader belum diuji. Jangan mengklaim produksi final.
- Server lokal terakhir pernah dibuka di port 3015; verifikasi proses sebelum menggunakannya. Build Next dapat mengubah `next-env.d.ts`; bila hanya perubahan generated import path, kembalikan ke versi tracked setelah selesai.

## Art direction dan batas scope

- Arah visual: Luxury High-Fashion Wedding Editorial; intricate detail dan restrained composition. Ivory `#FAF7F1`, Emerald Blue `#174A4A`, aksen sage/gold; Cormorant Garamond + DM Sans. Botanical bergaya engraving, bukan outline generik. Lihat `docs/design/OPENING-ART-DIRECTION-LOCK.md` untuk rincian Opening.
- Dokumen seperti `PROJECT-STATE.md` dan `HERO-MORPH-REVIEW.md` mengandung snapshot historis yang masih menyebut morph/Phase 02 lama. **Implementasi di kode dan keputusan terbaru pengguna di atas lebih mutakhir.** Perbarui dokumen bila tugas berikutnya memerlukannya; jangan mengikuti instruksi morph yang sudah dibatalkan.
- Jangan otomatis mengerjakan section berikutnya, backend/Supabase, RSVP, deployment, atau konten personal tanpa permintaan baru. Tanggal 14 November 2026 terkonfirmasi; jam, lokasi, akun sosial, nama lengkap, dan profil belum final. Asia/Jakarta adalah timezone kerja, bukan konfirmasi timezone acara.

## Saat chat baru dimulai

Baca prompt ini dan file yang relevan dengan tugas baru. Periksa status Git, kode terkini, serta screenshot bila mengubah visual. Ikuti arahan baru pengguna tanpa mengulang pertanyaan yang sudah dijawab. Jika pengguna hanya meminta membaca dan memahami prompt, cukup nyatakan siap melanjutkan.
