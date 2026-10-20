# Backend Google Sheets — 20 Oktober 2026

## Keputusan

- Google Sheets adalah penyimpanan utama. Apps Script hanya menerima permintaan dari server Next.js yang menyertakan `RSVP_API_TOKEN`.
- Setiap undangan memiliki ID urut dan token acak 256 bit. Token berada di fragmen URL sehingga tidak ikut permintaan halaman awal. Tab `Guests` hanya menyimpan SHA-256 token.
- RSVP memuat satu pilihan kehadiran per individu. Respons pertama final. Ucapan dikirim terpisah, satu per individu, dan langsung tampil setelah tersimpan.
- Tidak ada dashboard operator. Pemilik mengelola dan mengekspor Sheet privat secara langsung.

## Tab dan kontrak

`setupSheet()` membuat tab dan header berikut:

| Tab | Kolom |
| --- | --- |
| Guests | Invitation ID, Full name, Token SHA-256, Active |
| RSVP | Invitation ID, Submitted at (UTC), Attendance |
| Wishes | Wish ID, Invitation ID, Submitted at (UTC), Full name, Message |

Impor daftar tamu dilakukan ke `Guests` mulai baris kedua. Jangan menghapus atau mengubah header. Jika tab `RSVP` lama sudah ada, pindahkan menjadi `RSVP_Legacy` sebelum setup; kode menolak format header lama.

## Alur permintaan

1. Tamu membuka `/invite/{id}#{token}`. Halaman mengirim ID dan token ke `/api/invitation`; server meminta Apps Script mencocokkan SHA-256 token dengan baris `Guests` yang aktif.
2. Jika cocok, server mengembalikan nama dan status RSVP tamu tersebut. Jika tidak cocok, nama dan status tidak dikembalikan.
3. `/api/rsvp` menerima pilihan Hadir/Tidak hadir. Apps Script mengunci penulisan, mengecek ulang keaktifan tautan, dan menolak respons kedua.
4. `/api/wishes` menerima ucapan terpisah. Apps Script mengunci penulisan dan membatasi satu ucapan per tamu. Permintaan ulang dengan Wish ID yang sama aman untuk diulang.
5. Daftar ucapan publik hanya menampilkan 100 terbaru. Teks disimpan aman dari eksekusi rumus spreadsheet dan dirender sebagai teks React.

## Operasi

- **Impor:** 193 nama dari `data/private/daftar_nama.json` telah divalidasi dan menghasilkan `data/private/guests.csv` serta `data/private/links.csv`. Seluruh pasangan hash/token telah diverifikasi. Impor `guests.csv`, lalu setelah domain ditentukan jalankan `finalize-links` dan bagikan URL dari `links-final.csv` secara privat.
- **Cabut:** set `Active` ke `FALSE`. Akses berikutnya ditolak.
- **Terbitkan ulang:** jalankan perintah `reissue`, ganti hash di Sheet, lalu kirim URL baru. Jangan aktifkan ulang URL lama.
- **Ekspor:** gunakan menu ekspor Google Sheets dari akun pemilik. File tamu, tautan, dan ekspor tetap privat.
- **Cadangan:** buat salinan Sheet privat sebelum impor besar atau perubahan manual. Apps Script tidak menyediakan pemulihan otomatis.

## Batasan dan prasyarat rilis

Koneksi live Apps Script/Sheet telah lolos pemeriksaan: tiga identitas sampel cocok, token salah dan payload tulis tidak valid ditolak, RSVP tamu sintetis ID 194 tersimpan dan final, ucapan tamu itu tersimpan serta terbaca, dan retry Wish ID tidak menggandakan baris. Baris uji ID 194 perlu dibersihkan dari `Guests`, `RSVP`, dan `Wishes` sebelum rilis. Vercel belum diverifikasi. Token pribadi tetap bisa digunakan oleh siapa pun yang memperoleh URL penuh; kirim hanya lewat kanal privat. Ucapan langsung tampil sesuai keputusan pemilik, sehingga pemilik perlu memantau Sheet dan menghapus pesan yang tidak pantas secara manual. Pembatasan satu ucapan per tautan mengurangi spam dari satu tautan, tetapi tidak menggantikan moderasi.

Sebelum rilis, uji tautan sah, token salah, tautan dicabut, dua RSVP berurutan, dua permintaan bersamaan, pengiriman ucapan, dan hasil ekspor pada Sheet nyata. Verifikasi juga konfigurasi Vercel serta browser perangkat tamu.
