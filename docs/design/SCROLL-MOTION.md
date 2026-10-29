# Animasi antar bagian dan koreksi rasio raster

`app/scroll-story.tsx` membungkus halaman setelah Hero. IntersectionObserver memainkan timeline GSAP per komposisi saat masuk viewport dan menyiapkannya kembali ketika keluar, sehingga kunjungan ulang turut beranimasi. Tidak ada scroll hijacking atau pinning.

- Mempelai: potret masuk dari sisi berlawanan, foto melakukan zoom settle, burung dan nama menyusul.
- Garland penghubung: terbuka dari tengah dengan sedikit rotasi.
- Countdown: empat kartu terangkat bergantian seperti susunan kartu.
- Informasi acara: baris bergantian datang dari kiri dan kanan.
- Venue: landscape bergeser masuk, panel terangkat, peta terbuka dari tengah.
- RSVP dan ucapan: kolom masuk bertahap, tombol menyusul. Kartu ucapan yang dimuat kemudian mendapat animasi tersendiri.
- Galeri: foto utama membuka seperti halaman album, dua foto kecil datang dari sisi berlawanan.
- Hadiah: track rekening terangkat dan alamat masuk dari samping. Transform aktif carousel tetap dimiliki carousel.
- Penutup: divider membuka, kalimat terangkat, nama muncul melalui mask.

Tombol `Jeda animasi halaman` menyelesaikan gerak aktif dan menampilkan isi langsung selama jeda. Fokus keyboard juga menyelesaikan animasi komposisi terkait agar formulir dapat digunakan. Reduced motion menampilkan semua isi tanpa timeline scroll. Tanpa JavaScript, tidak ada CSS yang menyembunyikan isi.

## Rasio dan unduhan

`object-fit: fill` dihapus. Vine memakai aspect-ratio asli 450:2172 dan `contain`, garland memakai `contain`, landscape memakai crop `cover` yang proporsional. Vine kanan memakai mirror CSS dari satu sumber yang sama, dan back/front berbagi URL, sehingga browser mengunduh dan men-decode satu berkas vine saja. Ini menghemat sekitar 1,1 MB unduhan vine pada DPR 2 dibanding empat URL terpisah.

Leaf, flower, dan petal identik memakai URL bersama. Sprite kecil memakai WebP @1x yang masih cukup untuk ukuran tampilan; ilustrasi besar mempertahankan srcset @1x/@2x. Development kini juga memakai WebP agar tidak memuat puluhan MB PNG master saat preview. Master PNG tetap tersedia untuk pengerjaan dan fallback. Bagian setelah Hero baru dipasang setelah Opening selesai, dan gambar bagian bawah tetap memakai lazy loading.

Jalankan `node scripts/verify-scroll-story.mjs` dengan server produksi di port 3015, atau environment `CINEMATIC_URL` untuk alamat lain. Bukti browser dan screenshot ada di `artifacts/scroll-story/`.
