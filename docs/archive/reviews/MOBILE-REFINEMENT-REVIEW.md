> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Mobile refinement — 19 Oktober 2026

## Perubahan sesuai permintaan pengguna

- Monogram pada Cover, sudut Cover, dan Hero memakai file persis `public/artwork/monogram_RD_exact_illustration.svg`. Tidak direcolor atau diganti dengan gambar lain. SVG berisi bitmap PNG tertanam, bukan path vector murni; ukuran sumber sekitar 2.65 MB. Tidak ditemukan script atau referensi jaringan eksternal dalam file.
- Sapaan **Yth. [nama tamu]** ditambahkan tepat di atas BUKA UNDANGAN. Ini placeholder eksplisit, bukan identitas tamu nyata. Tidak ada query URL, daftar tamu atau backend yang ditambahkan.
- GIF baru `public/artwork/rd-bud-sprig-sway.gif` dibuat sebagai turunan dari `rd-bud-sprig-v1.webp` yang ditambahkan pengguna: ayunan ±2.4°, 80 frame / 4 detik / 20 fps, satu kali lalu berhenti. Bukan GIF yang sudah disediakan pengguna—tidak ditemukan GIF pada audit awal.
- `picture` memilih `rd-bud-sprig-still.webp` ketika reduced motion aktif; CSS saja tidak dapat menghentikan GIF sehingga sumber animasi benar-benar diganti.
- GIF menggantikan dekorasi sudut kanan Cover. Monogram, teks dan CTA tetap terpisah dari dekorasi. Detail asset lain yang ditambahkan tidak otomatis dianggap artwork final atau venue faktual; tidak semuanya dipasang agar komposisi tetap tenang.
- Mulai revisi ini, semua screenshot baru hanya mobile. Bukti desktop lama tetap arsip historis.

## Verifikasi

| Pemeriksaan | Status | Bukti |
|---|---|---|
| Build dan TypeScript | PASS | `npm run build` selesai, 19 Oktober 2026 |
| Mobile 320×568, 390×844, 430×932 | PASS | `artifacts/mobile-refinement/browser-results.json`; tidak ada overflow horizontal, CTA terlihat di viewport |
| SVG yang diminta dan posisi sapaan | PASS | Assert source monogram dan bounding box greeting di atas button; screenshot Cover |
| Keyboard dan direct Hero transition | PASS | Enter/Space, outline 2px, focus heading, scrollY 0 setelah membuka |
| GIF bergerak dan berhenti | PASS | `gif-results.json`: frame berbeda, 80 frame, 4 detik, tanpa loop extension; browser memilih URL GIF |
| Reduced motion | PASS | Browser memilih WebP diam, tidak ada animasi CSS aktif |
| Kontras | PASS | `contrast-results.json`; emerald/ivory texture 8.32, charcoal/texture 10.15, ivory/emerald 9.29; target 4.5 |
| Kehalusan GIF pada perangkat fisik / Safari | NOT TESTED | Metadata 20 fps dan capture Chrome bukan jaminan performa perangkat nyata |
| Desktop revision screenshots | NOT TESTED | Tidak diambil, sesuai fokus mobile pengguna |

## Screenshot aktual

- [Opening 390](../../../artifacts/mobile-refinement/mobile-cover.png) · [Hero 390](../../../artifacts/mobile-refinement/mobile-hero.png)
- [Opening 320](../../../artifacts/mobile-refinement/small-mobile-cover.png) · [Hero 320](../../../artifacts/mobile-refinement/small-mobile-hero.png)
- [Opening 430](../../../artifacts/mobile-refinement/mobile-wide-cover.png) · [Hero 430](../../../artifacts/mobile-refinement/mobile-wide-hero.png)

Keterbatasan: nama tamu masih placeholder; GIF membatasi warna/alpha dibanding sumber WebP; monogram SVG bitmap cukup besar untuk mobile. File monogram yang dipilih dipertahankan persis. Tidak ada deployment, backend atau Phase 03. Menunggu review.
