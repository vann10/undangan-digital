> Arsip historis. Status, keputusan, path, dan bukti pengujian di bawah dapat sudah digantikan. Lihat [indeks dokumentasi](../../README.md). Screenshot lama disimpan lokal di `.local/repository-cleanup/artifacts/` dan tidak disertakan dalam clone baru.

# Implementation Plan — Dari Backend Teruji ke Undangan Siap Dibagikan

**Disusun:** 20 Oktober 2026  
**Target:** situs Next.js di Vercel dengan undangan pribadi, Google Sheets sebagai penyimpanan, dan tautan final yang aman dibagikan.

## Titik awal yang sudah terverifikasi

- Daftar privat berisi 193 nama; `guests.csv` dan 193 tautan relatif sudah dibuat. Hash semua token cocok.
- Koneksi Apps Script ke Sheet nyata lulus uji baca. Tiga identitas sampel cocok, token salah ditolak, dan ucapan terbaca.
- Uji tulis dengan tamu sintetis ID 194 lulus: RSVP pertama tersimpan dan final, ucapan tersimpan serta terbaca, dan retry tidak membuat duplikat.
- Domain final, deployment Vercel, dan uji dari URL produksi belum selesai.

## 1. Bersihkan data uji dan kunci baseline

**Pemilik:** hapus baris ID 194 dari `Guests` dan `RSVP`, serta baris dengan Invitation ID 194 dari `Wishes`. Buat salinan Sheet privat sebelum pengeditan lanjutan.  
**Implementasi:** jalankan pemeriksaan baca untuk memastikan tautan 194 sudah ditolak dan ucapan uji tidak lagi tampil. Selaraskan catatan proyek yang masih menyebut Supabase atau koneksi live belum ada. Pastikan `.env.local` dan `data/private/` tetap diabaikan Git.

**Selesai jika:** Sheet hanya berisi 193 tamu asli, tidak ada ucapan uji, dan dokumentasi mencerminkan arsitektur Google Sheets yang berlaku.

## 2. Lengkapi konten dan keputusan rilis

**Pembaruan 21 Oktober 2026:** nama lengkap dan keluarga, tanggal 28 November 2026, jadwal 10.00–13.00 WIB, lokasi rumah, serta rincian hadiah telah dimasukkan. Profil, media sosial, cerita, jenis acara, dan URL Maps yang belum diberikan disimpan sebagai komentar/opsi nonaktif, tanpa placeholder publik. Keputusan privasi, masa simpan data, dan operasional ucapan masih perlu dipastikan sebelum pembagian tautan.

**Pemilik menyediakan/menyetujui:** nama lengkap dan keluarga, venue serta alamat dan URL Maps, waktu selesai acara/durasi kalender, profil dan cerita, teks RSVP/penutup, detail hadiah yang memang boleh tampil publik, serta keputusan tenggat RSVP bila diperlukan. Pastikan kebijakan privasi/retensi data tamu dan penanganan ucapan yang langsung terbit.

**Implementasi:** isi `app/wedding-config.ts` dan teks terkait tanpa membuat data asumsi; cek Maps, Calendar, countdown, nomor rekening, dan seluruh `XXX`. Review visual final di mobile. Data bank/alamat hanya dimasukkan setelah pemilik menentukan nilai yang boleh ditampilkan.

**Selesai jika:** tidak ada placeholder yang terlihat dan setiap detail acara yang ditampilkan sudah dikonfirmasi pemilik.

## 3. Audit teknis sebelum deployment

**Implementasi:** jalankan `typecheck`, build, tes Apps Script/generator, serta tes browser. Tinjau validasi token, finalitas RSVP, penolakan input, penampilan teks ucapan, dan tidak adanya token di bundle klien atau Git. Tentukan langkah operasional untuk cadangan Sheet, penghapusan ucapan tidak pantas, dan pemantauan kegagalan Apps Script. Tinjau frekuensi polling ucapan terhadap beban nyata sebelum pembagian massal.

**Selesai jika:** semua pemeriksaan lulus dan masalah yang menghalangi rilis sudah ditutup.

## 4. Deploy ke Vercel

**Pemilik:** hubungkan repositori Git ke proyek Vercel dan masukkan `GOOGLE_APPS_SCRIPT_URL` serta `GOOGLE_APPS_SCRIPT_TOKEN` sebagai environment variables server, tanpa awalan `NEXT_PUBLIC_`.  
**Implementasi:** deploy build Next.js, lalu uji URL `vercel.app` yang diberikan Vercel: halaman umum, undangan bertoken, RSVP dan ucapan dengan tamu sintetis baru, penolakan token salah, dan pemuatan media. Hapus lagi seluruh baris uji produksi setelah pemeriksaan.

**Selesai jika:** URL deployment dapat diakses, API produksi terhubung ke Sheet, dan tidak ada data uji yang tersisa. Vercel menyediakan URL deployment sebelum domain khusus dipasang; domain khusus dapat ditambahkan setelahnya. [Panduan Git deployment Vercel](https://vercel.com/docs/git), [environment variables](https://vercel.com/docs/environment-variables).

## 5. Tentukan domain dan hasilkan tautan final

**Pemilik:** pilih domain final atau setujui penggunaan URL `vercel.app` sebagai alamat undangan. Jika memakai domain khusus, hubungkan domain di Vercel dan ikuti nilai DNS yang ditampilkan untuk proyek tersebut; verifikasi HTTPS aktif. [Panduan domain Vercel](https://vercel.com/docs/domains/set-up-custom-domain).

**Implementasi:** jalankan `rtk proxy node scripts/prepare-guests.mjs finalize-links https://domain-final` untuk membuat `data/private/links-final.csv`. Jangan jalankan `generate` ulang karena akan mengganti semua token. Validasi jumlah 193, ID urut, host yang benar, dan kecocokan token/hash; uji sampel tautan awal, tengah, akhir pada domain final.

**Selesai jika:** 193 URL final bekerja pada domain kanonis dan tidak mengungkap identitas untuk token salah.

## 6. QA produksi dan pembagian

**Implementasi dan pemilik:** periksa iPhone Safari, Android Chrome, desktop, keyboard, reduced motion, performa media, musik, formulir, Maps, Calendar, serta RSVP final. Periksa ekspor Sheet hanya tersedia untuk akun pemilik. Setelah lolos, bagikan URL personal dari `links-final.csv` lewat kanal privat yang dipilih pemilik, lalu pantau Sheet dan error selama periode awal.

**Selesai jika:** seluruh pemeriksaan rilis lulus, tautan pribadi sudah dibagikan ke penerima yang tepat, dan ada prosedur sederhana untuk mencabut/menerbitkan ulang tautan serta menghapus ucapan bermasalah.

## Urutan keputusan yang dibutuhkan dari pemilik

1. Konfirmasi data uji ID 194 sudah dihapus dari tiga tab.
2. Kirim/konfirmasi detail acara dan konten yang masih kosong.
3. Tentukan alamat final: domain khusus atau URL `vercel.app`.
4. Sediakan akses Vercel/Git yang diperlukan untuk deployment; simpan token hanya di pengaturan environment, bukan chat.
5. Setujui hasil QA akhir sebelum tautan disebarkan.
