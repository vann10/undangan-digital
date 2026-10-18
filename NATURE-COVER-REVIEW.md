# Nature Opening — 19 Oktober 2026

Opening mengikuti referensi melalui lapisan alam dan framing botanical; tetap memakai HTML untuk teks/CTA, monogram SVG pilihan pengguna dan satu layout mobile. Hero tidak diubah pada revisi ini.

## Implementasi

- Latar danau, hutan dan pegunungan engraving; tanpa bangunan atau klaim venue.
- Framing bunga di kiri, kanan dan sudut atas, dengan ruang tenang di tengah. Sapaan tamu diberi permukaan ivory agar tetap terbaca di atas scenery.
- Dua kupu-kupu dengan sayap kiri/kanan terpisah memakai clip-path dan rotateY berlawanan, bukan sekadar menggeser gambar utuh. Kepakan 0.9 detik per siklus; hover 4 detik.
- Botanical berayun sekitar ±3 derajat, dengan variasi 3.8–5 detik dan offset fase. Infinite; tombol jeda/lanjut dan reduced motion tetap berlaku.
- Tanggal terkonfirmasi 14 November 2026 tampil pada Opening. Nama tamu masih placeholder.
- Aset generasi baru adalah kandidat review, bukan artwork produksi yang sudah disetujui.

## Bukti dan status

| Pemeriksaan | Status | Bukti |
|---|---|---|
| Build / TypeScript | PASS | npm run build selesai |
| Mobile 320/390/430 | PASS | artifacts/nature-cover/browser-results.json; CTA terlihat dan tanpa overflow horizontal |
| Kepakan sayap | PASS | Transform wing berubah setelah 220ms; durasi CSS 0.9s; konstruksi dua wing terpisah |
| Infinite motion / jeda | PASS | 14 efek looping; pause/resume seluruh efek diperiksa |
| Keyboard, fokus, direct Hero | PASS | Enter/Space; fokus heading; scrollY 0 |
| Reduced motion | PASS | Tidak ada animasi aktif |
| Visual mobile | PASS | Screenshot 320/390 diperiksa; background, border, sapaan dan tombol terlihat |
| Kecepatan yang paling disukai pengguna | NOT TESTED | Tempo yang dipilih perlu review pengguna di preview bergerak |
| Perangkat fisik / Safari / kontras setiap frame | NOT TESTED | Tidak menganggap uji Chrome atau screenshot sebagai audit menyeluruh |

Screenshot: [390](artifacts/nature-cover/mobile-cover.png), [320](artifacts/nature-cover/small-mobile-cover.png), [430](artifacts/nature-cover/mobile-wide-cover.png). Preview http://127.0.0.1:3003. Screenshot hanya mobile; PC hanya pengukuran kesamaan layout. Tidak ada deployment, backend atau section tambahan.

## Aset dan provenance

Built-in imagegen digunakan. WebP di `public/artwork/` dan PNG master di `assets/`. Konversi format/resolusi menggunakan Sharp; artwork tidak diganti dengan gambar screenshot website.

- `lake-landscape-review.webp`: 900×1350, background dekoratif. Master `assets/lake-landscape-review-master.png`.
- `butterfly-spread-review.webp`: lebar 500, alpha dipertahankan, dipakai sebagai wing/body layer. Master `assets/butterfly-spread-review-master.png`.

### Prompt landscape
Create a standalone vintage natural-history landscape engraving background for a portrait luxury wedding invitation. Portrait 2:3 composition. Bottom half: detailed romantic Alpine mountains, tranquil lake with fine horizontal etched water ripples, distant forested shores, a tiny distant sailboat. Deep teal #174A4A ink, muted sage, dusty blue teal and warm ivory #FAF7F1 paper. Upper half mostly spacious warm ivory paper with very faint distant mountain contours fading naturally toward blank top. Nineteenth century hand colored copperplate, intricate hatch shading, fine ink lines, restrained desaturated colors. No buildings, no architecture, no text, no letters, no people, no flowers, no border, no interface. Landscape scenery decorative imaginary nature, not a real venue. Scenic detail concentrated in bottom 40%, remaining upper area quiet ivory for live typography.

### Prompt butterfly
One anatomically convincing butterfly, dorsal overhead view, perfectly vertical thin body on the exact central vertical axis, two fully spread symmetrical wings left and right. Entire butterfly centered and isolated on transparent background with margin. Vintage nineteenth century hand colored copperplate natural history engraving, intricate dark deep teal wing veins and muted antique gold and ivory patterned wing panels, finely hatched tonal depth. Wings extend horizontally, head at top and tail at bottom, straight vertical body so wings can be animated separately around central body. No shadow, no text, no background scenery, no frame. Luxury botanical wedding stationery illustration, restrained palette #174A4A #6B8B7A #B79A68 ivory.
