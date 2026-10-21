# Undangan Pernikahan Rizal & Dewi

Next.js 16, React 19, dan TypeScript. Target deployment: **Vercel**. Daftar tamu, RSVP, dan ucapan disimpan di Google Sheets melalui Google Apps Script. Koneksi live memerlukan Sheet, deployment Apps Script, dan environment variables milik pemilik acara.

## Menjalankan lokal

```powershell
rtk proxy npm ci
rtk proxy npm run dev
rtk proxy npm run typecheck
rtk proxy npm run build
rtk proxy npm run test:google
```

Buka `http://127.0.0.1:3000`. Salin `.env.example` menjadi `.env.local` setelah Apps Script selesai dipasang. Tanpa dua variabel Google, halaman tetap dapat dibuka, tetapi formulir dinonaktifkan dengan pesan yang jelas.

## Mengganti informasi acara

Detail yang telah dikonfirmasi tersimpan di [`app/wedding-config.ts`](app/wedding-config.ts): **28 November 2026, 10.00–13.00 WIB**, nama lengkap dan orang tua kedua mempelai, lokasi acara, serta rincian hadiah. Konten opsional yang belum tersedia dicatat sebagai komentar kode dan tidak ditampilkan ke tamu. Yang masih perlu diisi:

- URL lokasi yang tepat dari Google Maps, jika tombol petunjuk arah diinginkan.
- Profil singkat, akun sosial, atau cerita pasangan, jika nanti ingin ditampilkan.

Hitung mundur menuju 28 November 2026 pukul 10.00 WIB. Saat pertama terlihat, setiap unit menampilkan angka acak dua digit yang berganti setiap 10 ms selama sekitar 2,8 detik; setelah itu angka sebenarnya muncul tanpa nol di depan. Perubahan digit hitungan berikutnya tetap memakai putaran odometer pendek. Perangkat dengan preferensi reduced motion langsung melihat angka akhir. Tautan Google Calendar memakai jadwal 10.00–13.00 WIB. Tautan Google Maps baru muncul setelah URL lokasi yang valid diisi.

Tombol musik mengontrol lagu **Reverie** karya Scott Buckley yang disimpan lokal di `public/audio/`. Aset musik diunduh saat layar loading, lalu situs mencoba memutarnya saat tamu menekan **Buka Undangan**. Browser yang membatasi autoplay bersuara baru dapat memutar setelah interaksi tamu; tombol Play/Stop tetap tersedia. Lagu berlisensi CC BY 4.0; atribusinya tersedia di `public/audio/ATTRIBUTION.txt`. Ganti file dan atribusinya bersama-sama jika musik diganti.

Gallery setelah RSVP memakai tiga foto yang telah diberikan: foto pasangan serta potret Dewi dan Rizal. Ganti daftar foto di `Gallery()` pada `app/invitation-details.tsx` jika foto tambahan sudah tersedia.

Setiap section memakai latar berbeda dalam palet ivory, emerald, dan champagne-gold. Venue memakai ilustrasi bangunan dekoratif generik di `public/artwork/section-venue-generated.webp`; gambar ini bukan representasi rumah acara. Nama, alamat, dan tautan Google Maps diatur terpisah melalui `app/wedding-config.ts`.

Foto dan nama lengkap mempelai ada pada `app/page.tsx`; elemen profil dan media sosial disimpan sebagai komentar hingga data resminya tersedia. Sapaan personal memakai tautan ringkas `/invite/{id}-{kode4digit}` yang dihasilkan oleh `scripts/prepare-guests.mjs`. Halaman umum `/` hanya menampilkan "Tamu Undangan" dan tidak dapat mengirim RSVP atau ucapan.

## Google Sheets dan Apps Script

1. Buat Google Sheet milik Anda. Salin Spreadsheet ID dari URL Sheet.
2. Untuk Sheet baru, impor `data/private/guests.csv`. Untuk Sheet yang sudah memakai token panjang, gunakan prosedur migrasi di bawah dan `data/private/guests-4digit.csv`. Tab harus bernama `Guests` dan berisi 193 baris tamu plus satu header. Jika Sheet dapat dibaca publik, nama tamu dan data RSVP/ucapan di dalamnya juga dapat dilihat oleh siapa pun yang memiliki tautannya.
3. Di Sheet, buka **Extensions → Apps Script**. Salin isi [`google-apps-script/Code.gs`](google-apps-script/Code.gs) ke editor.
4. Di **Project Settings → Script properties**, tambahkan `SPREADSHEET_ID` dan `RSVP_API_TOKEN`. Buat token API acak yang panjang, minimal 32 karakter. `GUEST_CODE_PEPPER` dari versi sebelumnya tidak dipakai lagi dan dapat dihapus setelah kode baru aktif.
5. Jalankan fungsi `setupSheet` sekali dari editor untuk memberi izin akses dan memvalidasi tab `Guests` serta membuat tab `RSVP` dan `Wishes`. Script menolak header yang tidak cocok agar data tidak tercampur.
6. Pilih **Deploy → New deployment → Web app**. Gunakan **Execute as: Me** dan **Who has access: Anyone**. Salin URL `/exec` dari deployment. Akses tanpa login Google dibutuhkan agar server Vercel dapat memanggil endpoint; token tetap diwajibkan untuk baca/tulis.
7. Isi `GOOGLE_APPS_SCRIPT_URL` dan `GOOGLE_APPS_SCRIPT_TOKEN` di `.env.local` untuk lokal dan di **Vercel → Project Settings → Environment Variables** untuk Production/Preview. Redeploy setelah mengubah environment.
8. Daftar 193 nama saat ini ada di `data/private/daftar_nama.json`. Berkas `guests-4digit.csv` dan `links-4digit.csv` sudah disiapkan dengan kode 4 digit yang sama. Setelah domain ditentukan, jalankan `rtk proxy node scripts/prepare-guests.mjs finalize-links https://domain-anda.id --migrated` untuk membuat `links-4digit-final.csv`. Bagikan hanya URL dari file final setelah pengujian live. Untuk daftar baru di folder kerja kosong, perintah `generate <daftar.csv|json> [base-url]` membuat kode 4 digit unik dan menolak menimpa berkas lama.
9. Uji satu tautan dari `links-4digit-final.csv`. Kirim RSVP dan ucapan uji, cek baris di dua tab terpisah, lalu hapus data uji secara manual jika perlu.

Satu tautan mewakili satu individu. Tautan berisi ID urut dan kode acak 4 digit yang unik di daftar tamu; tab `Guests` menyimpan kode itu secara langsung. Server memvalidasi pasangan ID/kode sebelum membuka sapaan pribadi atau menerima kiriman. Percobaan salah dibatasi sementara per tamu dan sumber permintaan. Siapa pun yang dapat membaca Sheet juga dapat melihat semua kode dan membuka undangan tamu; jangan bagikan tautan Sheet atau daftar tautan secara publik. RSVP hanya berisi Hadir/Tidak hadir dan respons pertama bersifat final. Ucapan adalah formulir terpisah, maksimal satu per tamu, dan langsung tampil setelah tersimpan. Daftar 100 ucapan terbaru dibaca ulang tiap 20 detik selama tab aktif. Nama dan ucapan ditampilkan kepada pengunjung; jangan tulis data pribadi di ucapan. Operator mengelola dan mengekspor data langsung dari Sheet.

Untuk mencabut tautan, ubah `Active` pada baris `Guests` menjadi `FALSE`. Untuk menerbitkan ulang, jalankan `rtk proxy node scripts/prepare-guests.mjs reissue <id> https://domain-anda.id`, lalu ganti `Guest code` pada baris tamu dan kirim URL baru yang dihasilkan. Tautan lama langsung tidak berlaku. Simpan berkas di `data/private/` secara aman; folder ini diabaikan Git. Rincian alur dan batasannya ada di [`docs/BACKEND-GOOGLE-SHEETS.md`](docs/BACKEND-GOOGLE-SHEETS.md).

### Mengaktifkan kode 4 digit pada Sheet yang sudah berjalan

1. Jalankan `rtk proxy node scripts/verify-short-files.mjs` untuk memeriksa seluruh 193 ID, kode unik, dan tautannya. Simpan salinan Sheet dan duplikasi tab `Guests` sebagai `Guests_Backup`. Pemilik memilih mempertahankan akses baca Sheet melalui tautan; setelah migrasi, pemegang tautan Sheet dapat membaca seluruh kode undangan.
2. Tempel `google-apps-script/Code.gs` terbaru dan perbarui deployment Web app yang aktif. Kode ini menerima kode 4 digit langsung dari kolom `Guest code`; tautan token panjang lama berhenti berlaku saat deployment baru aktif.
3. Impor `data/private/guests-4digit.csv` ke tab `Guests` dengan pilihan mengganti isi tab itu saja. Pastikan header sama, jumlah tamu 193, dan ID/nama tidak bergeser. Tab `RSVP` dan `Wishes` tidak perlu diganti; respons lama tetap terhubung lewat ID.
4. Jalankan `rtk proxy node scripts/verify-live-sheets.mjs --migrated`. Setelah hasilnya lulus, bangun dan jalankan/deploy situs baru, lalu uji satu tautan dari `links-4digit.csv` dengan menambahkan domain lokal. Tautan token panjang berhenti berlaku setelah langkah 3.
5. Setelah domain publik diputuskan, jalankan `finalize-links` dengan `--migrated` seperti pada langkah 8. Jangan bagikan `links-4digit.csv` atau `links-4digit-final.csv` secara massal.

### Menambah tamu setelah migrasi

Jalankan `rtk proxy node scripts/prepare-guests.mjs add-short "Nama Tamu Baru"`. Perintah ini membuat `data/private/new-guest-{id}.json` berisi ID berikutnya, nama, kode 4 digit, status `TRUE`, dan path tautan pribadi. Salin `invitationId`, `fullName`, `guestCode`, dan `active` ke **satu baris baru** tab `Guests` (berturut-turut kolom A–D). Tambahkan domain situs di depan `personalPath` hanya saat mengirim undangan. Berkas penambahan tetap privat dan dipakai alat untuk mencegah ID, nama, serta kode ganda pada penambahan berikutnya. Jalankan hanya setelah impor 193 tamu selesai dan baris uji ID 194 sudah hilang. Jika ingin menambah nama sebelum migrasi, sampaikan namanya agar berkas impor awal diperbarui sebelum dipasang.

Jika Apps Script diubah, buat versi deployment baru atau edit deployment aktif, lalu verifikasi lagi. Jangan pernah menaruh token pada variabel `NEXT_PUBLIC_*` atau mengunggah `.env.local`.

## Deployment Vercel

Hubungkan repositori Git ke Vercel, pilih framework **Next.js**, set dua environment variables di atas, lalu deploy. `next.config.js` dibiarkan menggunakan server runtime Next.js karena `/api/rsvp` harus berjalan di Vercel. Tidak diperlukan GitHub Pages atau static export. Domain dan pengaturan indeks mesin pencari dapat ditentukan setelah semua konten final; metadata saat ini menonaktifkan indeksasi agar placeholder belum terbit di hasil pencarian.

Sebelum membagikan tautan pribadi, konfirmasi rincian acara dan hadiah yang tampil, tentukan apakah tombol Google Maps diperlukan, uji Calendar, kirim dan baca RSVP/ucapan nyata dari tautan bertoken, dan periksa tampilan pada perangkat iPhone/Android yang dipakai tamu.

Untuk pemeriksaan browser lokal, jalankan server produksi (`rtk proxy npm run start -- --port 3016`) lalu `rtk proxy npm run test:browser -- http://127.0.0.1:3016`. Pengujian ini memakai respons identitas, RSVP, dan ucapan tiruan untuk memeriksa formulir serta audit aksesibilitas WCAG otomatis. Ini belum menggantikan uji end-to-end dengan Sheet asli, Safari, pembaca layar, atau perangkat fisik.
