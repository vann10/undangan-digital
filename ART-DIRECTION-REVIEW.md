# Art Direction Revision — Rizal & Dewi

Tanggal: 19 Oktober 2026 (Asia/Jakarta). Status: siap review; artwork belum disetujui sebagai aset produksi.

## Ringkasan dan batas scope

Implementasi yang ditemukan hanya Opening dan Hero. Sistem botanical SVG berulang telah diganti dua ilustrasi raster transparan dengan kelopak berlapis, urat daun, arsiran dan warna teal/ivory. Divider geometris diganti ornamen acanthus engraving; CTA diberi tepian emas yang terkendali. Struktur halaman, font, konten terkonfirmasi, texture paper, dan state transisi tetap dipertahankan. Posisi dekorasi disesuaikan per breakpoint agar menjauhi teks dan kontrol.

Cover tetap komposisi terpusat dengan dua sudut asimetris. Hero tetap panel emerald dan tipografi terpisah; motif botanical ditempatkan di bawah panel pada desktop dan sisi kanan pada mobile. Tidak ada foto, burung, kupu-kupu, landscape, bangunan atau klaim venue yang ditambahkan. Monogram tetap placeholder yang diberi label. Ilustrasi baru diberi label “Ilustrasi usulan, belum final”.

## Audit dekorasi dan perubahan file

| File / elemen | Temuan dan tindakan |
|---|---|
| `app/botanical.tsx` | SVG daun/bunga berulang dengan outline seragam diganti komponen gambar dekoratif; alt kosong, aria-hidden, object-fit contain, rasio intrinsik dan srcset. |
| `app/page.tsx` | Memilih varian spray untuk sudut kanan Cover, divider raster terpisah, label status aset. Tombol dan teks tetap HTML semantik. |
| `app/globals.css` | Penempatan ilustrasi responsif, clearance monogram, background solid untuk tanggal di panel, CTA ornamental. Garis pembatas struktural dipertahankan untuk menjaga restraint. |
| `public/artwork/` | Tiga PNG master generasi dan lima WebP turunan. Lihat `ASSET-INVENTORY.md`. |
| `scripts/verify-prototype.mjs` | Bukti baru di `artifacts/art-direction/`; cek gambar ter-load, alt dekoratif dan tanggal terkonfirmasi ditambahkan. |
| `scripts/verify-contrast.py` | Pengukuran diarahkan ke capture texture revisi. |
| `PROJECT-STATE.md` | Mencatat persetujuan implementasi Phase 02 dan status review revisi; tidak membuka Phase 03. |
| `docs/DECISION-LOG.md`, `docs/08-CONTENT-AND-ASSET-REGISTER.md` | Addendum scope art overhaul dan provenance aset usulan; catatan historis dipertahankan. |

Tidak ada dependensi baru untuk overhaul. Konversi WebP memakai Sharp yang sudah tersedia dari Next.js. Master disimpan lokal; halaman hanya meminta WebP. Tidak ada backend, migrasi, persistence, section tambahan atau deployment.

## Acceptance dan bukti

PASS visual di bawah adalah penilaian inspeksi implementasi oleh agen, bukan persetujuan final pengguna.

| # | Kriteria | Status | Bukti / batas |
|---|---|---|---|
| 1 | Botanical realistis, detail engraving dan tonal depth | PASS | Screenshot Cover/Hero memperlihatkan kelopak berarsir, pusat bunga, tepi/urat daun dan bidang shading; PNG master dapat diperiksa pada skala penuh. |
| 2 | Gaya ornamen dan ilustrasi koheren | PASS | Bunga ivory/teal dan divider emas memakai garis engraving. Burung, kupu-kupu, landscape tidak digunakan. |
| 3 | Sesuai arah referensi, bukan recolor SVG minimal | PASS | Dua ilustrasi baru dan divider menggantikan konstruksi outline; compare `artifacts/phase-02/` dengan `artifacts/art-direction/`. Komposisi sengaja tetap mengikuti layout existing. |
| 4 | Hierarki, konten, interaksi terjaga | PASS | Browser checks: Cover terpisah; CTA membuka Hero pada scrollY 0; heading menerima fokus; tanggal persis 14 November 2026. |
| 5 | Responsif tanpa overflow/collision signifikan | PASS | Chrome pada 320×568, 390×844, 768×1024, 1440×900 dan landscape 844×390; scrollWidth tidak melebihi viewport; screenshot diperiksa untuk jarak nama/CTA. |
| 6 | Tipografi, kontras, keyboard, reduced motion | PASS | Font lokal ter-load; Enter/Space berfungsi; outline 2px; reduced-motion tanpa animasi aktif. Rasio emerald/texture 8.32:1, charcoal/texture 10.15:1, ivory/emerald 9.29:1 (target 4.5:1). |
| 7 | Aset produksi / perilaku belum diverifikasi dicatat | PASS | Label pada kedua state dan inventory; keterbatasan berikut. |

### Test teknis

- PASS — `rtk proxy npm run build`: Next.js production build dan TypeScript selesai, route `/` statis. Build diverifikasi melalui output terminal; tidak berarti deploy.
- PASS — `rtk proxy npm run test:prototype`: hasil rinci dan timestamp UTC pada [browser-results.json](artifacts/art-direction/browser-results.json). Chrome 155, loopback lokal, DPR 1. Termasuk image loading, keyboard, overflow, scrolling, runtime page errors dan reduced motion.
- PASS — `rtk proxy python scripts/verify-contrast.py`: [contrast-results.json](artifacts/art-direction/contrast-results.json); luminance terburuk dari capture texture dibanding warna foreground CSS. Bukan audit aksesibilitas menyeluruh.
- NOT TESTED — Safari/iOS, Firefox, pembaca layar nyata, perangkat fisik, zoom 200%, jaringan mobile lambat dan Core Web Vitals lapangan. Angka transfer/FCP di JSON hanya pengukuran lokal.
- BLOCKED — screenshot dua section setelah Hero: section tersebut belum ada. Tidak dibuat untuk memenuhi screenshot karena scope melarang fitur/section tambahan.

## Screenshot implementasi aktual

Seluruh capture memakai `fullPage: true`, bukan concept image. Cover dan Hero adalah state berbeda; full-page tidak menggabungkan keduanya secara palsu.

| Bukti | Cover | Hero / halaman setelah dibuka |
|---|---|---|
| Desktop 1440 | [Cover](artifacts/art-direction/desktop-cover.png) | [Full-page Hero](artifacts/art-direction/desktop-hero.png) |
| Mobile 390 | [Cover](artifacts/art-direction/mobile-cover.png) | [Full-page mobile](artifacts/art-direction/mobile-hero.png) |
| Mobile 320 | [Cover](artifacts/art-direction/small-mobile-cover.png) | [Hero](artifacts/art-direction/small-mobile-hero.png) |
| Tablet 768 | [Cover](artifacts/art-direction/tablet-cover.png) | [Hero](artifacts/art-direction/tablet-hero.png) |
| Landscape 844 | [Cover](artifacts/art-direction/landscape-cover.png) | [Hero](artifacts/art-direction/landscape-hero.png) |

[Keyboard focus](artifacts/art-direction/keyboard-focus.png).

## Keterbatasan dan review

- Ilustrasi dibuat dengan built-in image generation; merupakan kandidat visual, bukan approved production artwork. Akurasi botanikal ilmiah dan hak penggunaan produksi belum ditinjau secara terpisah.
- Reference board dan mockup adalah referensi gaya; teks, foto orang, venue dan jam di dalamnya tidak diadopsi sebagai fakta.
- Monogram masih studi tipografis. Venue, waktu/timezone, foto, story dan data pribadi tetap pending.
- Pada layar pendek, bagian halaman bisa memerlukan scroll normal; CTA dan awal Hero tetap muncul tanpa pengguna harus scroll untuk membukanya.
- Revisi berhenti untuk review. Persetujuan baru diperlukan sebelum Phase 03 atau perluasan scope.
