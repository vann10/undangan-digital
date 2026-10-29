# Arsitektur aplikasi

Next.js App Router menjalankan UI React dan endpoint server. GSAP mengatur transisi dan gerakan. Komponen dan gaya ditempatkan bersama di `app/`; struktur `src/` tambahan tidak diperlukan untuk ukuran aplikasi saat ini.

| Bagian | Lokasi |
| --- | --- |
| Halaman umum | `app/page.tsx` |
| Undangan pribadi | `app/invite/[id]/page.tsx` |
| Pratinjau dua acara | `app/preview/[type]/page.tsx` |
| Informasi acara | `app/wedding-config.ts` |
| Transisi dan musik | `transition.config.js` |
| API identitas, RSVP, ucapan | `app/api/` |
| Klien server Google Sheets | `app/api/_lib/sheets.ts` |
| Web app Apps Script | `integrations/google-apps-script/Code.gs` |

Browser memanggil API Next.js. Server menghubungi Google Apps Script menggunakan token environment, lalu Apps Script mengakses tab `Guests`, `RSVP`, dan `Wishes`. Token backend tidak dimasukkan ke konfigurasi `NEXT_PUBLIC_*`.

Data tamu dan ekspor tautan disiapkan di `data/private/` dan diabaikan Git. Detail validasi identitas dan aturan pengiriman tersedia di [kontrak backend](BACKEND-GOOGLE-SHEETS.md).

`public/` berisi aset browser. `assets/` menyimpan sumber asli; intermediate pengolahan tidak diperlukan untuk build Next.js. Aplikasi memakai WebP termasuk pada `img` di dalam `picture`, sehingga tidak memerlukan salinan PNG publik.

Vercel menjalankan server Next.js untuk API. Konfigurasi dan pemeriksaan live dijelaskan dalam [runbook](../operations/RUNBOOK.md). Static export tidak digunakan karena endpoint API membutuhkan runtime server.
