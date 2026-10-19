# Full botanical frame — 19 Oktober 2026

## Perubahan sesuai instruksi

Tiga tambahan pada revisi terakhir (`cover-top-canopy`, `cover-upper-left`, `cover-upper-right`) dibatalkan, termasuk aturan CSS-nya. Komposisi empat sudut sebelumnya menjadi dasar kembali.

- Sulur botanical baru menghubungkan seluruh sisi kiri, kanan, atas dan bawah. Sulur diam; bunga sudut berayun dan kupu-kupu tetap mengepak. Kombinasi ini mempertahankan bingkai yang stabil tanpa menggerakkan seluruh layar.
- Background bagian atas sekarang berisi awan engraving, dahan pohon, dua burung kecil dan pegunungan samar. Area bawahnya memudar menuju ivory agar monogram tetap jelas. Semua objek simbolik, bukan fakta lokasi.
- Background danau di bawah tetap dipertahankan. Nama tamu tanpa background dan tanpa tanggal di Opening sesuai keputusan sebelumnya. Hero tidak diubah.
- Tidak ada backend, deployment, section tambahan atau phase baru.

## Verifikasi

| Pemeriksaan | Status | Bukti |
|---|---|---|
| Build dan TypeScript | PASS | npm run build selesai |
| Mobile 320/390/430 | PASS | artifacts/full-frame/browser-results.json; CTA terlihat dan tidak ada overflow horizontal |
| Inspeksi visual 320/390 | PASS | Screenshot actual: sulur kontinu di empat sisi, nama dan kontrol terbaca |
| Keyboard, fokus, direct Hero | PASS | Enter/Space, outline, fokus heading, scrollY 0 |
| Motion dan pause/resume | PASS | 13 efek looping; sayap berubah transform dalam 220ms, flap 0.9s |
| Reduced motion | PASS | Tidak ada animasi aktif |
| Kesamaan layout PC/mobile | PASS | Geometry checks 768/1440; screenshot tetap mobile saja |
| Perangkat fisik/Safari/kontras seluruh frame | NOT TESTED | Tidak mengklaim audit aksesibilitas atau performa perangkat menyeluruh |

[Opening 390](artifacts/full-frame/mobile-cover.png) · [Opening 320](artifacts/full-frame/small-mobile-cover.png) · [Opening 430](artifacts/full-frame/mobile-wide-cover.png). Preview lokal: http://127.0.0.1:3005.

## Aset baru dan provenance

Keduanya dibuat dengan built-in imagegen dan berstatus **REVIEW CANDIDATE**, bukan approved production artwork. WebP dikonversi dengan Sharp; PNG master disimpan di workspace.

| Asset | Lokasi | Fungsi |
|---|---|---|
| Edge vine | public/artwork/edge-vine-review.webp | Sulur statis untuk empat sisi; alpha dipertahankan |
| Cloud canopy | public/artwork/cloud-canopy-review.webp | Background alam bagian atas, 900×600 |
| Masters | assets/edge-vine-review-master.png; assets/cloud-canopy-review-master.png | Sumber resolusi penuh |

### Prompt edge vine
Create a single long narrow upright botanical vine border asset for luxury antique wedding stationery. Portrait ratio 1:3. A continuous slender woody climbing stem runs from the very bottom edge to the very top edge, gently sinuous but approximately vertical, with small natural teal and sage leaves, tiny ivory five-petal blossoms and buds branching out along its entire height. Restrained width, airy delicate twigs, no big bouquets. Fine nineteenth century copperplate engraving: detailed leaf veins, petal hatching, sepia outlines, deep teal #174A4A and muted sage with warm ivory blossoms. Truly transparent background. No paper, no rectangle, no text, no frame, no shadows. Entire stem visible and botanically connected; designed to connect top and bottom corner flowers along screen edges. Flat engraved print, not 3D.

### Prompt cloud canopy
Standalone wide landscape illustration for the TOP background of luxury vintage wedding stationery, no text or interface. Nineteenth century delicate copperplate nature engraving on warm ivory #FAF7F1. Beautiful softly layered engraved cumulus clouds across the upper sky, two tiny distant swallows, slender tree boughs entering naturally from upper left and upper right edges with sparse sage and teal leaves. A faint pale distant mountain ridge toward bottom edge. All objects drawn with fine controlled hatching, muted sage and dusty teal, warm beige ink highlights. Dreamy light atmospheric print, low contrast, no dark heavy areas. Central and lower half spacious luminous ivory, soft organic fade to plain ivory at bottom to layer above live text. Horizontal 3:2 composition. No buildings, no people, no venue, no lettering, no ornate frame, no giant flowers. Real engraved detail, not abstract watercolor blobs.

Berhenti untuk review pengguna.
