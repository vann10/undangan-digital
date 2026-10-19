# Undangan Pernikahan Rizal & Dewi

Next.js 16, React 19, dan TypeScript. Target deployment: **Vercel**. RSVP disimpan di Google Sheets melalui Google Apps Script. Situs dan Sheet belum bisa terhubung secara live sampai pemilik memasang Apps Script serta mengisi environment variables.

## Menjalankan lokal

```powershell
rtk proxy npm ci
rtk proxy npm run dev
rtk proxy npm run typecheck
rtk proxy npm run build
rtk proxy npm run test:google
```

Buka `http://127.0.0.1:3000`. Salin `.env.example` menjadi `.env.local` setelah Apps Script selesai dipasang. Tanpa dua variabel Google, halaman tetap dapat dibuka, tetapi formulir RSVP dinonaktifkan dengan pesan yang jelas.

## Mengganti informasi acara

Edit satu file: [`app/wedding-config.ts`](app/wedding-config.ts). Nama panggilan Rizal dan Dewi serta **14 November 2026** adalah data yang sudah terkonfirmasi. Nilai lain sengaja `null` dan tampil sebagai `XXX` hingga diberikan pemilik acara. Isi:

- Nama lengkap kedua mempelai, ayah dan ibu mempelai pria.
- `time` dalam format 24 jam (`HH:mm`) dan `timeZone` berupa zona IANA. Zona kerja Asia/Jakarta belum dianggap sebagai zona acara.
- Nama dan alamat venue, serta URL tempat yang tepat dari Google Maps.
- Nama bank, nama pemilik rekening, nomor rekening, dan alamat pengiriman hadiah.

Hitung mundur lengkap aktif setelah jam dan zona acara diisi. Tautan Google Calendar aktif setelah jam, zona, nama venue, dan alamat venue diisi. Tautan Google Maps aktif setelah alamat dan URL lokasi yang valid diisi. Durasi default acara kalender adalah dua jam; ubah di `calendarUrl()` jika jadwal resmi berbeda.

Foto dan profil mempelai ada pada `app/page.tsx`; teks profil masih placeholder yang perlu diganti dengan data resmi. Untuk sapaan personal, bagikan tautan `https://domain-anda/?to=Nama%20Tamu`. Bila tidak ada parameter, halaman menyapa "Tamu Undangan". Nama tamu di URL bersifat publik di riwayat browser dan log; hindari informasi sensitif.

## Google Sheets dan Apps Script

1. Buat Google Sheet milik Anda. Salin Spreadsheet ID dari URL Sheet.
2. Di Sheet, buka **Extensions → Apps Script**. Salin isi [`google-apps-script/Code.gs`](google-apps-script/Code.gs) ke editor.
3. Di **Project Settings → Script properties**, tambahkan `SPREADSHEET_ID` dan `RSVP_API_TOKEN`. Buat token acak yang panjang, minimal 32 karakter. Simpan token hanya di Apps Script dan environment Vercel.
4. Jalankan fungsi `setupSheet` sekali dari editor untuk memberi izin akses dan membuat header Sheet.
5. Pilih **Deploy → New deployment → Web app**. Gunakan **Execute as: Me** dan **Who has access: Anyone**. Salin URL `/exec` dari deployment. Akses publik dibutuhkan agar server Vercel dapat memanggil endpoint; token tetap diwajibkan untuk baca/tulis.
6. Isi `GOOGLE_APPS_SCRIPT_URL` dan `GOOGLE_APPS_SCRIPT_TOKEN` di `.env.local` untuk lokal dan di **Vercel → Project Settings → Environment Variables** untuk Production/Preview. Redeploy setelah mengubah environment.
7. Kirim RSVP percobaan dari situs dan pastikan satu baris baru muncul pada tab `RSVP`, lalu cek ucapan muncul di bawah formulir. Untuk percobaan yang dibatalkan, hapus baris percobaan secara manual dari Sheet.

Setiap kiriman membuat baris berisi ID, waktu UTC, nama, status kehadiran, jumlah tamu, dan ucapan. Permintaan yang diulang dengan ID yang sama tidak menggandakan baris. Tab `RSVP` dapat difilter, diedit, serta diekspor lewat **File → Download → CSV / Microsoft Excel**. Daftar ucapan pada halaman dibaca ulang tiap 20 detik selama tab aktif. Nama dan ucapan ditampilkan kepada pengunjung; jangan kirim data pribadi lewat kolom ucapan.

Jika Apps Script diubah, buat versi deployment baru atau edit deployment aktif, lalu verifikasi lagi. Jangan pernah menaruh token pada variabel `NEXT_PUBLIC_*` atau mengunggah `.env.local`.

## Deployment Vercel

Hubungkan repositori Git ke Vercel, pilih framework **Next.js**, set dua environment variables di atas, lalu deploy. `next.config.js` dibiarkan menggunakan server runtime Next.js karena `/api/rsvp` harus berjalan di Vercel. Tidak diperlukan GitHub Pages atau static export. Domain dan pengaturan indeks mesin pencari dapat ditentukan setelah semua konten final; metadata saat ini menonaktifkan indeksasi agar placeholder belum terbit di hasil pencarian.

Sebelum membagikan tautan publik, ganti seluruh nilai `XXX`, lengkapi teks profil serta media sosial, uji URL Maps dan Calendar, kirim dan baca RSVP nyata, dan periksa tampilan pada perangkat iPhone/Android yang dipakai tamu.

Untuk pemeriksaan browser lokal, jalankan server produksi (`rtk proxy npm run start -- --port 3016`) lalu `rtk proxy npm run test:browser -- http://127.0.0.1:3016`. Pengujian ini memakai respons RSVP tiruan untuk memeriksa formulir dan daftar ucapan, serta audit aksesibilitas WCAG otomatis. Ini belum menggantikan uji end-to-end dengan Sheet asli, Safari, pembaca layar, atau perangkat fisik.
