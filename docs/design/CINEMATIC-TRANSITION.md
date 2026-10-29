# Opening → Hero · Rizal & Dewi

Implementasi Next.js yang terintegrasi dengan halaman utama dan route undangan pribadi. Formulir tamu, RSVP, ucapan, dan bagian undangan berikutnya tetap menggunakan kode yang sudah ada. Tanggal tunggal di `app/wedding-config.ts` mengikuti brief terbaru: **14 November 2026**. Tidak ada deployment atau penulisan data tamu dalam pekerjaan ini.

## Menjalankan

```sh
npm install
npm run dev
```

- `/` — Opening; klik **MEMBUKA UNDANGAN** untuk memainkan transisi.
- `/?debug=1` — scrubber detik, tombol Ulangi, serta pause/resume. Saat debug aktif, `window.__weddingTransition.timeline` memberikan GSAP timeline yang sama.
- `/?view=hero` — langsung ke posisi akhir Hero untuk perbandingan tata letak. Tidak memutar audio otomatis.
- Mode produksi: `npm run build`, lalu `npm run start`.

`app/cinematic-opening.tsx` menyediakan markup React, preloading/decode, state aksesibilitas, dan UI debug. `app/cinematic-opening.css` menyediakan layout mobile. `app/opening-timeline.ts` mengekspor `playOpenTransition(options)`, yang **mengembalikan GSAP timeline dalam keadaan paused**. Pemanggil memakai `.play()`, `.pause()`, `.time(seconds)`, atau `.restart()`.

## Fase dan timing

Semua warna UI, opacity efek, label fase, durasi utama, easing, stagger, konfigurasi audio, serta jumlah partikel ada di `transition.config.js`.

| Rentang | Perilaku |
|---|---|
| 0–0,65 s | Ripple emas dari titik klik, tombol mengecil, audio fade-in menuju 0,6. Scroll dikunci. |
| 0,15–1,58 s | Empat vine raster membuka ke samping; empat segmen per vine punya stagger dan rotasi berbeda. Garland terangkat, bunga sudut keluar, daun lepas ikut bergerak. |
| 0,2–1,4 s | Tiga bagian kupu-kupu mengikuti kurva S melalui MotionPathPlugin; sayap mengepak di dalam master timeline. |
| 0,2–2,8 s | 32 partikel raster dari satu atlas; simulasi berbasis waktu absolut agar seek mundur dan pause tetap deterministik. |
| 0,3–1,16 s | Monogram membesar dan hilang, kelopak terlepas radial, teks Opening keluar lewat mask. |
| 0,9–3,2 s | Landscape bergerak sebagai satu komposisi menuju skala 1,2. Layer air dan bukit tetap selaras; tidak ada gerakan koreksi kedua di akhir. |
| 1,1–2,4 s | Stroke arch digambar; foto muncul dari bawah dengan mask, scale, dan blur. |
| 1,4–2,6 s | Cabang Hero menjulur; daun tumbuh dengan stagger. Bouquet dirakit dari sembilan sprite terpisah. |
| 1,6–3,2 s | Nama dan divider bergerak ke posisi Hero. Ampersand mendapat sweep emas lembut, label dan tanggal muncul bertahap. |
| Sepanjang halaman | Kedua garland pembatas tetap statis; tidak mengikuti timeline Opening maupun animasi scroll. |
| 3,2–3,8 s | Komposisi diam di posisi akhir. Saat selesai, scroll dibuka dan fokus berpindah ke nama; cabang dan kabut melanjutkan ke idle dari posisi yang sama. Partikel idle masuk perlahan selama 1,5 s. |

Ubah `at.arch` untuk menggeser awal arch, `duration.arch` untuk kecepatannya, dan `at.photo` untuk waktu reveal foto. Label timeline mengikuti `at`, sehingga `timeline.seek('arch')` juga tersedia. Jika total koreografi diubah, sesuaikan `duration.total` dan `at.settle`. Seluruh tween satu fase berada berdekatan di `opening-timeline.ts`; subgerakan tombol dan aksen memakai offset lokal agar mudah dikoreografikan.

Kontrol **Jeda** tersedia hanya dalam mode `?debug=1`. Kontrol ini menghentikan timeline, flap, serta partikel; audio mempunyai kontrol terpisah dan tidak dibuat ulang. Ketika tab disembunyikan, transisi yang sedang berjalan dijeda. `prefers-reduced-motion` menggunakan timeline 0,6 detik tanpa kupu-kupu terbang, partikel, atau parallax berlapis.

Warna dan bayangan nama, termasuk ampersand, sekarang dimiliki timeline. Class `cin-ended` tidak mengganti tampilannya secara mendadak. Halaman lanjutan sudah terpasang dalam keadaan tersembunyi dan inert, sehingga penyelesaian transisi tidak sekaligus memasang seluruh halaman. Gutter scrollbar stabil di desktop; mobile tetap memakai lebar penuh. Idle memakai endpoint eksplisit dan periode mandiri untuk cabang/kabut agar replay tidak mengambil posisi lama.

Jalankan `node scripts/verify-transition-settle.mjs` untuk memeriksa posisi setiap frame dari detik 3,25 melewati penyelesaian, sambungan idle, replay, dan reduced motion. Hasilnya ada di `artifacts/cinematic/settle/`. Statistik frame dari browser development merupakan diagnostik, bukan jaminan 60 fps pada perangkat fisik.

## Pipeline raster

```sh
python scripts/build-transition-assets.py
```

Dependensi Python: Pillow dan NumPy. Master asli tetap disimpan di `assets/`. Hasil kerja ada di `assets/master/*.png`; ekspor satu langkah dari master tersebut ada di `assets/build/*.webp`, dengan varian `@1x`. Berkas runtime disalin ke `public/transition/`, termasuk PNG fallback. Mode development memuat PNG master; production memakai `<picture>` dengan WebP `1x/2x` dan PNG fallback. Foto pasangan dan audio memakai berkas lokal yang sudah tersedia, tanpa konversi lossy ulang.

Register lengkap (nama, Jalur A/B, resolusi, byte/KB tiap varian): **`docs/design/TRANSITION-ASSETS.md`**. Data terstruktur: `assets/build/manifest.json`. Dua SVG ekspor hanya berisi geometri: `arch-frame.svg` dan `divider.svg`. Geometri yang sama ditulis inline di komponen agar stroke dapat dikendalikan GSAP. Tidak ada ilustrasi SVG baru; Canvas hanya memanggil `drawImage` pada atlas raster.

- **Jalur A:** vine dan empat layer landscape dari master pengguna; tiga bagian kupu-kupu dari master pengguna; kabut dan tekstur kertas dari area landscape. Monogram diambil sebagai PNG asli dari pembungkus SVG lama (bukan rasterisasi/tracing).
- **Jalur B yang sudah ada:** garland, cabang Hero, bunga sudut dari PNG lossless proyek sebelumnya yang sejenis dengan screenshot referensi. Tidak ada konversi dari WebP lama.
- **Jalur B baru:** `assets/botanical-sprite-sheet-generated.png`, dibuat dengan built-in imagegen dan ketiga master sebagai referensi; dipotong menjadi daun, bunga, kelopak, bouquet, dan atlas. Prompt dan catatan pemeriksaan ada di `docs/design/CINEMATIC-IMAGE-PROMPT.md`.
- **Placeholder aktif: tidak ada.** Potongan kelopak/daun kasar pertama telah diganti oleh sprite sheet dan berkas bersuffix `-placeholder` dihapus dari keluaran pipeline.

Mask landscape bertumpuk pada koordinat piksel asli: layer berikutnya sudah penuh sebelum layer sebelumnya berakhir, sehingga tidak timbul sambungan horizontal saat posisi akhir. Alpha asli vine/kupu-kupu dipertahankan. Tidak ada peningkatan saturasi, sharpen, denoise, atau tracing.

## Verifikasi

```sh
npm run typecheck
npm run build
node scripts/verify-cinematic.mjs
```

Skrip browser menggunakan server `http://127.0.0.1:3012` secara default; atur environment `CINEMATIC_URL` untuk port lain. Skrip memakai Chrome dan Playwright yang sudah tersedia dalam proyek.

Hasil tersimpan di `artifacts/cinematic/verification.json`, beserta screenshot Opening, transisi, dan Hero pada 360×640, 390×844, dan 430×932. Pemeriksaan mencakup node persisten, canvas berhenti saat pause, scrub mundur, kesamaan geometri Hero statis, tanggal terlihat, reduced motion 0,6 s, fokus, frame desktop di tengah, serta kegagalan decode dan retry. Cuplikan raster pada skala 200% disimpan sebagai bukti visual terpisah.

Target 60 fps memakai transform, atlas tunggal, DPR Canvas maksimum 2, dan penurunan otomatis 32 → 18 partikel bila rerata 40 frame jatuh di bawah 45 fps. **60 fps pada Android kelas menengah belum diukur di perangkat fisik**; pengujian Chrome desktop tidak membuktikan target perangkat tersebut. Kurva penerbangan kupu-kupu diukur saat komponen disiapkan; untuk pemeriksaan koreografi setelah mengubah orientasi viewport, muat ulang halaman. Posisi akhir shared elements tetap responsif tanpa perhitungan ulang piksel.

File SVG ilustrasi lama di `public/artwork/` untuk bagian undangan lainnya tidak dihapus dalam pekerjaan transisi ini. Folder hasil `assets/master`, `assets/build`, dan `public/transition` hanya menggunakan raster untuk ilustrasi.

### Hasil pemeriksaan akhir

- TypeScript dan build produksi: **PASS**.
- Seluruh enam kelompok uji browser di atas: **PASS**, baik di development maupun build produksi; tidak ada JavaScript error atau respons HTTP lokal gagal pada jalur normal.
- Pemeriksaan konfigurasi tanggal dan tautan Google Calendar: **PASS** untuk 14 November 2026.
- 59 master PNG; 0 placeholder aktif; hanya 2 SVG geometris di `assets/`.
- WebP vine terbesar **375.088 byte**, layer landscape terbesar **278.722 byte**.
- Detail kupu-kupu, vine, danau, serta daun baru telah diperiksa pada kontak raster 200%; tekstur engraving tetap terlihat. Bukti: `artifacts/cinematic/raster-detail-200.png`.
