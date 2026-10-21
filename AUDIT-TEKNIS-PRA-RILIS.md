# Audit teknis pra-rilis

**Tanggal:** 20 Oktober 2026  
**Cakupan:** langkah 3 yang dapat dikerjakan sebelum data acara final dan deployment.

## Pemeriksaan yang lulus

- `npm run typecheck` — lulus.
- `npm run build` — lulus; halaman undangan serta tiga API berhasil dibangun.
- `npm run test:google` — lulus. Pengujian lokal mencakup identitas tamu, penolakan token salah, satu RSVP final, satu ucapan per tamu, retry tanpa duplikat, penonaktifan tautan, perlindungan formula spreadsheet, generator tautan, dan tanggal/kalender.
- `npm run test:browser` terhadap server build lokal — lulus pada lebar 320, 390, dan 430 px. Tes mencakup alur antarmuka RSVP/ucapan dengan respons API simulasi, tidak ada galat runtime atau luapan horizontal, kontrol musik, countdown, dan audit aksesibilitas otomatis.
- Pemeriksaan berkas privat — `.env.local`, `data/private/guests.csv`, `data/private/links.csv`, dan formulir data diabaikan Git. Hanya `data/private/.gitkeep` yang terlacak.
- Pemeriksaan kebocoran — 193 token tamu, URL Apps Script, dan token servis dari berkas privat tidak ditemukan dalam 256 berkas terlacak Git atau 49 berkas build klien (`.next/static`). Nilai rahasia tidak dicetak dalam laporan.

## Temuan dan tindak lanjut

1. **Konten acara belum final.** Nama lengkap, lokasi, waktu selesai, dan pilihan hadiah masih kosong. Pemeriksaan tautan Maps/Calendar serta sapuan placeholder final dilakukan setelah formulir langkah 2 diisi.
2. **Tes browser memakai API simulasi.** Pengujian baca/tulis Google Sheets nyata pernah lulus dengan tamu sintetis pada tahap backend, tetapi belum diulang pada URL produksi. Uji terintegrasi produksi dilakukan pada langkah 4, memakai tamu uji baru, lalu data ujinya dibersihkan.
3. **Beban pembacaan ucapan perlu diperiksa saat rilis.** Setiap tab undangan aktif meminta daftar ucapan tiap 20 detik. Pada 193 tab aktif bersamaan, itu sekitar 579 permintaan per menit ke API; setiap permintaan saat ini meneruskan pembacaan ke Apps Script. Sebelum pembagian massal, tinjau frekuensi atau cache dan pantau kegagalan/latensi pada URL produksi.
4. **Operasional ucapan dan data tamu belum diputuskan.** Ucapan langsung tampil sesuai keputusan pemilik. Tetapkan penanggung jawab penghapusan ucapan bermasalah, cadangan Sheet, dan masa simpan data pada formulir langkah 2.
5. **`test:prototype` adalah tes lama.** Skripnya mengharapkan server pada port 3006 serta teks/struktur antarmuka versi sebelumnya. Percobaan awal berhenti karena server itu tidak tersedia; gunakan `test:browser` sebagai pemeriksaan antarmuka saat ini. Skrip lama perlu diperbarui atau dihapus sebelum dijadikan syarat rilis.

## Status

Audit lokal selesai tanpa kegagalan pada pemeriksaan utama. Keputusan konten dari langkah 2 dan uji terintegrasi pada deployment produksi masih diperlukan sebelum undangan dibagikan.
