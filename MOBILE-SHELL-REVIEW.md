# Satu layout mobile — 19 Oktober 2026

Sesuai arahan pengguna: undangan hanya memakai komposisi mobile. Di viewport lebih dari 760 px, kolom undangan selebar 430 px menempel di kanan dan gambar botanical dekoratif mengisi area kiri secara fixed. Pada HP, gambar kiri disembunyikan dan undangan memakai lebar layar. Tinggi mengikuti viewport dan konten tetap bisa di-scroll; bukan rasio tetap yang memotong isi.

Perubahan: `app/page.tsx` menambahkan wrapper dan panel dekoratif; `app/globals.css` mempromosikan aturan mobile menjadi aturan bersama dan menghapus komposisi desktop terpisah. Ukuran tipografi menggunakan lebar container undangan, bukan lebar layar PC. Gambar kiri memakai aset yang sudah ada `botanical-ascending-review.webp`, tanpa menambah foto atau fakta pernikahan.

## Bukti

| Pemeriksaan | Status | Bukti |
|---|---|---|
| Build / TypeScript | PASS | npm run build selesai tanpa warning pada build final |
| Mobile 320, 390, 430 px | PASS | artifacts/mobile-shell/browser-results.json; CTA terlihat, tanpa overflow horizontal, direct Hero dan scroll normal |
| PC 768 dan 1440 px | PASS | Pengukuran browser: kolom 430 px tepat di kanan; tipografi Cover dan dimensi/grid Hero sama dengan mobile 430 px pada tinggi sama |
| Panel kiri khusus PC | PASS | Browser visibility assertion: muncul pada PC, tidak pada HP |
| Keyboard / reduced motion | PASS | Enter/Space, outline fokus 2px, fokus Hero, GIF diganti sumber diam |
| Kontras | PASS | artifacts/mobile-shell/contrast-results.json |
| Screenshot PC | NOT TESTED | Tidak dibuat sesuai instruksi hanya screenshot mobile |
| Safari / perangkat fisik | NOT TESTED | Pengujian memakai Chrome lokal |

Screenshot: [Opening](artifacts/mobile-shell/mobile-cover.png), [Hero](artifacts/mobile-shell/mobile-hero.png). Ukuran 320/430 juga tersedia di folder yang sama.

Preview build terbaru memakai http://127.0.0.1:3001 karena port 3000 sudah terpakai. Percobaan awal pada port 3000 gagal pemeriksaan CTA; seluruh verifikasi diulang pada build terbaru port 3001 dan PASS. Tidak ada deployment atau perluasan phase.
