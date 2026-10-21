# Backend Google Sheets — 20 Oktober 2026

## Keputusan

- Google Sheets adalah penyimpanan utama. Apps Script hanya menerima permintaan dari server Next.js yang menyertakan `RSVP_API_TOKEN`.
- Setiap undangan memiliki ID urut dan kode acak 4 digit yang unik di daftar tamu. Tab `Guests` menyimpan kode langsung; `GUEST_CODE_PEPPER` tidak digunakan lagi.
- RSVP memuat satu pilihan kehadiran per individu. Respons pertama final. Ucapan dikirim terpisah, satu per individu, dan langsung tampil setelah tersimpan.
- Tidak ada dashboard operator. Pemilik mengelola dan mengekspor Sheet secara langsung. Pemilik memilih mempertahankan akses baca melalui tautan Sheet.

## Tab dan kontrak

`setupSheet()` membuat tab dan header berikut:

| Tab | Kolom |
| --- | --- |
| Guests | Invitation ID, Full name, Guest code, Active |
| RSVP | Invitation ID, Submitted at (UTC), Attendance |
| Wishes | Wish ID, Invitation ID, Submitted at (UTC), Full name, Message |

Impor daftar tamu dilakukan ke `Guests` mulai baris kedua. Jangan menghapus atau mengubah header. Jika tab `RSVP` lama sudah ada, pindahkan menjadi `RSVP_Legacy` sebelum setup; kode menolak format header lama.

Pada Sheet live, kolom A (`Invitation ID`) di tab `RSVP` disembunyikan agar operator melihat nama tamu. Kolom D (`Full name`) mengambil nama secara otomatis dari `Guests`, dengan cadangan nama lama dari `Guests_Backup_2026-10-21`. Hasil rumus dibatasi sampai baris RSVP yang terisi agar penambahan RSVP baru tetap masuk ke baris berikutnya. ID tetap tersimpan di kolom A sebagai kunci unik; jangan hapus atau ganti kolom ini. Aturan warna Hadir/Tidak Hadir berlaku untuk A2:D1000 berdasarkan nilai `Attendance` di kolom C.

## Alur permintaan

1. Tamu membuka `/invite/{id}-{kode4digit}`. Halaman mengirim ID dan kode ke `/api/invitation`; server meminta Apps Script mencocokkan ID dan kode dengan baris `Guests` yang aktif.
2. Jika cocok, server mengembalikan nama dan status RSVP tamu tersebut. Jika tidak cocok, nama dan status tidak dikembalikan.
3. `/api/rsvp` menerima pilihan Hadir/Tidak hadir. Apps Script mengunci penulisan, mengecek ulang keaktifan tautan, dan menolak respons kedua.
4. `/api/wishes` menerima ucapan terpisah. Apps Script mengunci penulisan dan membatasi satu ucapan per tamu. Permintaan ulang dengan Wish ID yang sama aman untuk diulang.
5. Daftar ucapan publik hanya menampilkan 100 terbaru. Teks disimpan aman dari eksekusi rumus spreadsheet dan dirender sebagai teks React.

## Operasi

- **Impor baru:** `prepare-guests.mjs generate` menghasilkan kode 4 digit unik beserta `guests.csv` dan `links.csv` di folder kerja baru.
- **Migrasi Sheet aktif:** `guests-4digit.csv` dan `links-4digit.csv` disiapkan dari 193 nama dengan ID dan kode tetap. Cadangkan Sheet, perbarui kode serta deployment Apps Script, lalu ganti isi tab `Guests` saja dengan `guests-4digit.csv`. Lakukan dua langkah terakhir berdekatan karena header lama tidak kompatibel dan tautan lama berhenti berlaku. Tab `RSVP` dan `Wishes` tetap. Jalankan `verify-live-sheets.mjs --migrated` sebelum membagikan tautan baru. Setelah domain ditentukan, jalankan `prepare-guests.mjs finalize-links https://domain-anda.id --migrated`.
- **Cabut:** set `Active` ke `FALSE`. Akses berikutnya ditolak.
- **Terbitkan ulang:** jalankan perintah `reissue`, ganti `Guest code` di Sheet, lalu kirim URL baru. Jangan aktifkan ulang URL lama.
- **Tambah tamu setelah migrasi:** jalankan `rtk proxy node scripts/prepare-guests.mjs add-short "Nama Tamu Baru"`. Berkas privat `new-guest-{id}.json` berisi empat nilai untuk kolom A–D di `Guests` dan `personalPath` untuk dikirim dengan domain situs. Alat memeriksa ID/nama/kode yang sudah dikeluarkan.
- **Ekspor:** gunakan menu ekspor Google Sheets dari akun pemilik. File tamu, tautan, dan ekspor tetap privat.
- **Cadangan:** buat salinan Sheet privat sebelum impor besar atau perubahan manual. Apps Script tidak menyediakan pemulihan otomatis.

## Batasan dan prasyarat rilis

Status migrasi 21 Oktober 2026: deployment Apps Script yang digunakan situs telah diperbarui dari versi 2 ke versi 3 dengan URL tetap. Tab `Guests` aktif berisi 193 ID, nama, dan kode 4 digit dari `guests-4digit.csv`; baris tamu uji ID 194 tidak ada. Tab `Guests_Backup_2026-10-21` berisi 193 hash lama serta ID 194 untuk pemulihan. Tab `RSVP` dan `Wishes` tetap ada. Uji langsung `verify-live-sheets.mjs --migrated` dan `verify-live-backend.mjs http://127.0.0.1:3020 --migrated` lolos untuk undangan sah, kode salah, penolakan tulis tidak sah, dan pembacaan ucapan. Tautan panjang lama tidak berlaku. Properti `GUEST_CODE_PEPPER` lama belum dihapus dan tidak dipakai oleh kode versi 3.

Sheet ini dapat dibaca tanpa login; setiap pemegang tautan Sheet dapat membaca seluruh kode tamu dan membuka undangan pribadi. Pemilik menyatakan akses ini dapat dipertahankan. Kode 4 digit dapat ditebak: untuk satu ID peluang tebakan acak adalah 1 dari 10.000, dan pembatasan percobaan berbasis cache hanya memperlambat serangan, bukan jaminan keamanan. URL kode baru masuk ke log permintaan halaman; kirim hanya lewat kanal privat, dan jangan cantumkan URL pribadi pada halaman atau indeks pencarian. RSVP tamu sintetis ID 194 sudah final dan ucapan ujinya tersimpan sebagai riwayat, walaupun ID 194 telah dicabut dari `Guests`. Vercel belum diverifikasi. Ucapan langsung tampil sesuai keputusan pemilik, sehingga pemilik perlu memantau Sheet dan menghapus pesan yang tidak pantas secara manual.

Sebelum rilis, uji tautan sah, token salah, tautan dicabut, dua RSVP berurutan, dua permintaan bersamaan, pengiriman ucapan, dan hasil ekspor pada Sheet nyata. Verifikasi juga konfigurasi Vercel serta browser perangkat tamu.
