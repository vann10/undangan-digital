# Sumber aset

| Lokasi | Isi |
| --- | --- |
| Gambar di root `assets/` | Foto asli dan sumber generasi ilustrasi transisi |
| `source-artwork/` | Sumber pengolahan yang sebelumnya tercampur di `public/artwork/` |
| `chapter-sources/` | Sumber ilustrasi section yang dipakai pipeline |
| `references/` | Referensi visual; bukan konten acara |
| `master/`, `build/` | Intermediate hasil pipeline, diabaikan Git |

Aset browser berada di `public/`. Simpan sumber asli untuk regenerasi satu kali, tanpa menyalinnya sebagai PNG publik. Pipeline menghasilkan WebP; perubahan hasilnya perlu review.

## Regenerasi opsional

`npm run build` tidak memerlukan Python atau regenerasi aset. Untuk mengolah ilustrasi, siapkan Python dengan Pillow dan NumPy:

```sh
python -m pip install -r scripts/requirements-assets.txt
python scripts/build-transition-assets.py
python scripts/build-chapter-art.py
python scripts/optimize-web-images.py
python scripts/verify-transition-assets.py
```

Register hasil berada di `docs/design/`. Intermediate dan screenshot tetap lokal. `create-sprig-gif.py` menghasilkan kandidat lama ke `artifacts/sprig/`. Keterangan musik aktif berada di `public/audio/ATTRIBUTION.txt`; provenance ilustrasi lama berada dalam arsip inventaris aset.
