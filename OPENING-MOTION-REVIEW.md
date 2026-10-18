# Opening & Hero refinement — 19 Oktober 2026

## Perubahan

- Opening: “YOU’RE INVITED TO THE WEDDING OF”, lalu nama pasangan; sapaan tamu tetap di atas CTA.
- Tambahan botanical spray kiri atas, kupu-kupu dari aset pengguna, dan ilustrasi botanical samar sebagai background. Background bukan venue atau foto faktual.
- Seluruh delapan elemen ilustrasi Opening bergerak berulang via CSS (sway/drift/breathe 8–24 detik). Tidak ada batas empat detik lagi. GIF lama disimpan sebagai arsip, tetapi sprig aktif memakai WebP yang digerakkan kode agar bisa dijeda dan menghormati reduced motion.
- Tombol Jeda animasi / Lanjutkan animasi; reduced motion menonaktifkan seluruh animasi dan menyembunyikan tombol yang tidak diperlukan.
- Tanggal duplikat yang menumpuk di bunga Hero dihapus. Tanggal utama 14 November 2026 dan tanggal header dipertahankan.
- Hero frame mengizinkan bunga melewati sisi kanan hingga gutter halaman, dengan clipping di batas bawah tetap dipertahankan.
- Satu layout mobile dan panel gambar kiri pada PC tetap berlaku. Screenshot baru hanya mobile.

## Hasil verifikasi

| Pemeriksaan | Status | Bukti |
|---|---|---|
| Production build + TypeScript | PASS | npm run build selesai tanpa error |
| Mobile 320, 390, 430 px | PASS | artifacts/opening-motion/browser-results.json; CTA terlihat, tidak ada overflow horizontal |
| Continuous animation dan pause/resume | PASS | Delapan efek dengan iterations Infinity; seluruh efek paused saat tombol jeda diaktifkan |
| Keyboard / fokus / direct Hero | PASS | Enter/Space, outline 2px, fokus ke heading dan scrollY 0 |
| Reduced motion | PASS | Sumber sprig statis, tidak ada animasi aktif |
| Hero tanggal / clipping | PASS | .art-date tidak ada, overflow visible dengan clip-path bawah; screenshot mobile diperiksa |
| Layout PC memakai kolom mobile | PASS | Geometry checks 768/1440, tanpa screenshot PC |
| Kontras warna dasar | PASS | contrast-results.json; tekstur saja, bukan audit pixel setiap frame ilustrasi background |
| Perangkat fisik / Safari / kontras setiap frame | NOT TESTED | Pengujian Chrome lokal; inspeksi visual background dilakukan pada screenshot |

Screenshot aktual: [Opening 390](artifacts/opening-motion/mobile-cover.png), [Hero 390](artifacts/opening-motion/mobile-hero.png), [Opening 320](artifacts/opening-motion/small-mobile-cover.png), [Hero 320](artifacts/opening-motion/small-mobile-hero.png). Lebar 430 juga tersedia di folder yang sama.

Preview terbaru di http://127.0.0.1:3002. Percobaan awal test masih menunjuk port lama yang tidak aktif; setelah diperbaiki semua pemeriksaan final PASS. Aset ilustrasi tetap usulan, nama tamu placeholder, tidak ada fitur backend atau section tambahan. Berhenti untuk review.
