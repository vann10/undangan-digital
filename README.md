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

Edit satu file: [`app/wedding-config.ts`](app/wedding-config.ts). Nama panggilan Rizal dan Dewi serta **14 November 2026 pukul 09.00 WIB** adalah data yang sudah terkonfirmasi. Nilai lain sengaja `null` dan tampil sebagai `XXX` hingga diberikan pemilik acara. Isi:

- Nama lengkap kedua mempelai, ayah dan ibu mempelai pria.
- Nama dan alamat venue, serta URL tempat yang tepat dari Google Maps.
- Nama bank, nama pemilik rekening, nomor rekening, dan alamat pengiriman hadiah.

Hitung mundur menuju 14 November 2026 pukul 09.00 WIB. Saat pertama terlihat, setiap unit menampilkan angka acak dua digit yang berganti setiap 10 ms selama sekitar 2,8 detik; setelah itu angka sebenarnya muncul tanpa nol di depan. Perubahan digit hitungan berikutnya tetap memakai putaran odometer pendek. Perangkat dengan preferensi reduced motion langsung melihat angka akhir. Tautan Google Calendar aktif setelah nama venue dan alamat venue diisi. Tautan Google Maps aktif setelah alamat dan URL lokasi yang valid diisi. Durasi default acara kalender adalah dua jam; ubah di `calendarUrl()` jika jadwal resmi berbeda.

Tombol musik mengontrol lagu **Reverie** karya Scott Buckley yang disimpan lokal di `public/audio/`. Situs mencoba autoplay saat halaman dimuat dan mencoba lagi saat tamu menekan **Buka Undangan**. Browser yang membatasi autoplay bersuara baru dapat memutar setelah interaksi tamu; tombol Play/Stop tetap tersedia. Lagu berlisensi CC BY 4.0; kredit dan tautan lisensinya ditampilkan di bagian penutup. Ganti file dan kredit bersama-sama jika musik diganti.

Gallery setelah RSVP memakai tiga foto yang telah diberikan: foto pasangan serta potret Dewi dan Rizal. Ganti daftar foto di `Gallery()` pada `app/invitation-details.tsx` jika foto tambahan sudah tersedia.

Setiap section memakai latar berbeda dalam palet ivory, emerald, dan champagne-gold. Venue memakai [`public/artwork/venue-architectural-blueprint.svg`](public/artwork/venue-architectural-blueprint.svg), ilustrasi garis transparan dari bangunan acara generik. Ilustrasi ini **bukan representasi lokasi resmi** karena nama dan alamat venue belum diberikan. Ganti aset tersebut bila ilustrasi bangunan sebenarnya sudah tersedia; nama, alamat, dan tautan Google Maps tetap diatur terpisah melalui `app/wedding-config.ts`.

Foto dan profil mempelai ada pada `app/page.tsx`; teks profil masih placeholder yang perlu diganti dengan data resmi. Sapaan personal memakai tautan `/invite/{id}#{token}` yang dihasilkan oleh `scripts/prepare-guests.mjs`. Halaman umum `/` hanya menampilkan "Tamu Undangan" dan tidak dapat mengirim RSVP atau ucapan.

## Google Sheets dan Apps Script

1. Buat Google Sheet milik Anda. Salin Spreadsheet ID dari URL Sheet.
2. Impor `data/private/guests.csv` ke Sheet kosong melalui **File → Import → Upload**; pilih **Replace current sheet** bila tersedia, atau **Insert new sheet(s)**. Ubah nama tab hasil impor tepat menjadi `Guests` dan pastikan ada 193 baris tamu plus satu header. Jangan jadikan Sheet dapat diakses publik.
3. Di Sheet, buka **Extensions → Apps Script**. Salin isi [`google-apps-script/Code.gs`](google-apps-script/Code.gs) ke editor.
4. Di **Project Settings → Script properties**, tambahkan `SPREADSHEET_ID` dan `RSVP_API_TOKEN`. Buat token acak yang panjang, minimal 32 karakter. Simpan token hanya di Apps Script dan environment server.
5. Jalankan fungsi `setupSheet` sekali dari editor untuk memberi izin akses dan memvalidasi tab `Guests` serta membuat tab `RSVP` dan `Wishes`. Script menolak header yang tidak cocok agar data tidak tercampur.
6. Pilih **Deploy → New deployment → Web app**. Gunakan **Execute as: Me** dan **Who has access: Anyone**. Salin URL `/exec` dari deployment. Akses tanpa login Google dibutuhkan agar server Vercel dapat memanggil endpoint; token tetap diwajibkan untuk baca/tulis.
7. Isi `GOOGLE_APPS_SCRIPT_URL` dan `GOOGLE_APPS_SCRIPT_TOKEN` di `.env.local` untuk lokal dan di **Vercel → Project Settings → Environment Variables** untuk Production/Preview. Redeploy setelah mengubah environment.
8. Daftar 193 nama saat ini ada di `data/private/daftar_nama.json`. Generator sudah membuat `data/private/guests.csv` dan `data/private/links.csv` dengan URL relatif. Setelah domain ditentukan, jalankan `rtk proxy node scripts/prepare-guests.mjs finalize-links https://domain-anda.id` untuk membuat `data/private/links-final.csv`. Bagikan hanya URL dari file final setelah pengujian live. Untuk daftar baru, perintah `generate <daftar.csv|json> [base-url]` membuat token satu kali dan menolak menimpa berkas lama.
9. Uji satu tautan dari `links-final.csv`. Kirim RSVP dan ucapan uji, cek baris di dua tab terpisah, lalu hapus data uji secara manual jika perlu.

Satu tautan mewakili satu individu. Tautan berisi ID urut dan token acak 256 bit di fragmen URL; hanya hash token disimpan di tab `Guests`. Server memvalidasi pasangan ID/token sebelum membuka sapaan pribadi atau menerima kiriman. RSVP hanya berisi Hadir/Tidak hadir dan respons pertama bersifat final. Ucapan adalah formulir terpisah, maksimal satu per tamu, dan langsung tampil setelah tersimpan. Daftar 100 ucapan terbaru dibaca ulang tiap 20 detik selama tab aktif. Nama dan ucapan ditampilkan kepada pengunjung; jangan tulis data pribadi di ucapan. Operator mengelola dan mengekspor data langsung dari Sheet privat.

Untuk mencabut tautan, ubah `Active` pada baris `Guests` menjadi `FALSE`. Untuk menerbitkan ulang, jalankan `rtk proxy node scripts/prepare-guests.mjs reissue <id> https://domain-anda.id`, lalu ganti `Token SHA-256` pada baris tamu dan kirim URL baru yang dihasilkan. Tautan lama langsung tidak berlaku. Simpan berkas di `data/private/` secara aman; folder ini diabaikan Git. Rincian alur dan batasannya ada di [`docs/BACKEND-GOOGLE-SHEETS.md`](docs/BACKEND-GOOGLE-SHEETS.md).

Jika Apps Script diubah, buat versi deployment baru atau edit deployment aktif, lalu verifikasi lagi. Jangan pernah menaruh token pada variabel `NEXT_PUBLIC_*` atau mengunggah `.env.local`.

## Deployment Vercel

Hubungkan repositori Git ke Vercel, pilih framework **Next.js**, set dua environment variables di atas, lalu deploy. `next.config.js` dibiarkan menggunakan server runtime Next.js karena `/api/rsvp` harus berjalan di Vercel. Tidak diperlukan GitHub Pages atau static export. Domain dan pengaturan indeks mesin pencari dapat ditentukan setelah semua konten final; metadata saat ini menonaktifkan indeksasi agar placeholder belum terbit di hasil pencarian.

Sebelum membagikan tautan pribadi, ganti seluruh nilai `XXX`, lengkapi teks profil serta media sosial, uji URL Maps dan Calendar, kirim dan baca RSVP/ucapan nyata dari tautan bertoken, dan periksa tampilan pada perangkat iPhone/Android yang dipakai tamu.

Untuk pemeriksaan browser lokal, jalankan server produksi (`rtk proxy npm run start -- --port 3016`) lalu `rtk proxy npm run test:browser -- http://127.0.0.1:3016`. Pengujian ini memakai respons identitas, RSVP, dan ucapan tiruan untuk memeriksa formulir serta audit aksesibilitas WCAG otomatis. Ini belum menggantikan uji end-to-end dengan Sheet asli, Safari, pembaca layar, atau perangkat fisik.
