# Opening border refinement — 19 Oktober 2026

## Tambahan kepadatan atas
Atas permintaan terbaru, tiga lapisan botanical ditambahkan: canopy di tengah atas dan rumpun bunga yang menempel pada border kiri/kanan atas. Semua memakai aset existing dan animasi angin yang bisa dijeda. Screenshot di folder bukti diperbarui. Build PASS; pemeriksaan mobile 320/390/430, keyboard, reduced motion dan overflow diulang. Inspeksi visual 320/390 menunjukkan nama dan monogram tetap terbaca. Total animasi berulang kini 16.

- Ranting terpisah di tengah sisi kanan dihapus. Botanical kini empat komposisi sudut: dua rangkaian medium mengisi bagian atas, dua rumpun muncul dari batas bawah/kiri/kanan. Titik pencerminan diperbaiki agar bunga tidak terlempar keluar layar; batang tetap menyambung ke tepi.
- Background nama tamu dihapus (computed background rgba(0,0,0,0)). Landscape diberi fade ivory lebih panjang untuk keterbacaan tanpa kotak di belakang teks.
- Tanggal hanya dihapus dari Opening; tanggal 14 November 2026 pada Hero tetap terjaga.
- Kepakan sayap, ayunan botanical berulang, jeda/lanjut, reduced motion dan mobile shell dipertahankan. Hero tidak diubah.

## Verifikasi

PASS — production build dan TypeScript.

PASS — Chrome mobile 320×568, 390×844, 430×932: CTA terlihat, tidak ada overflow horizontal, keyboard/fokus dan direct Hero tetap bekerja. Assert memastikan tidak ada .cover-date dan background sapaan transparan. Tiga belas animasi looping; pause/resume dan reduced motion lulus. Bukti: artifacts/border-cover/browser-results.json.

PASS — inspeksi screenshot 320/390: tanaman tidak berdiri lepas di tengah, sudut atas terisi, nama dan CTA tetap terlihat. Screenshot: [390](artifacts/border-cover/mobile-cover.png), [320](artifacts/border-cover/small-mobile-cover.png), [430](artifacts/border-cover/mobile-wide-cover.png).

NOT TESTED — perangkat fisik, Safari, kontras pixel setiap frame. Tidak ada screenshot desktop baru. Tidak ada aset baru, backend, deployment atau phase tambahan. Preview final: http://127.0.0.1:3004.
