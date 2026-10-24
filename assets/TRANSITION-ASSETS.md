# Transition asset register

All WebP variants are encoded once from their lossless PNG master. @1x is half the main build width. One new sprite sheet was generated with the three supplied style masters. No vectorization, denoising, sharpening, saturation or contrast adjustments. PNG fallbacks live beside WebP in public/transition.

| Asset | Source | PNG pixels | PNG KB | WebP @2x KB | WebP @1x KB | Notes |
|---|---|---:|---:|---:|---:|---|
| vine-left-back | A · edge-vine master; native alpha, crop/mirror | 450×2172 | 990.8 | 366.1 | 112.9 |  |
| vine-left-front | A · edge-vine master; native alpha, crop/mirror | 450×2172 | 990.8 | 366.1 | 112.9 |  |
| vine-right-back | A · edge-vine master; native alpha, crop/mirror | 450×2172 | 988.8 | 366.3 | 113.2 |  |
| vine-right-front | A · edge-vine master; native alpha, crop/mirror | 450×2172 | 988.8 | 366.3 | 113.2 |  |
| botanical-sprite-sheet | B · built-in imagegen; three supplied masters as style references | 1254×1254 | 1829.4 | 619.4 | 175.1 |  |
| leaf-sprite-01 | B · generated sprite sheet, complete isolated leaf | 256×256 | 86.6 | 62.8 | 16.5 |  |
| leaf-sprite-02 | B · generated sprite sheet, complete isolated leaf | 256×256 | 77.1 | 52.5 | 13.9 |  |
| leaf-sprite-03 | B · generated sprite sheet, complete isolated leaf | 256×256 | 84.4 | 62.0 | 16.5 |  |
| leaf-sprite-04 | B · generated sprite sheet, complete isolated leaf | 256×256 | 79.9 | 54.9 | 14.5 |  |
| leaf-sprite-05 | B · generated sprite sheet, complete isolated leaf | 256×256 | 86.6 | 62.8 | 16.5 |  |
| leaf-sprite-06 | B · generated sprite sheet, complete isolated leaf | 256×256 | 77.1 | 52.5 | 13.9 |  |
| leaf-sprite-07 | B · generated sprite sheet, complete isolated leaf | 256×256 | 84.4 | 62.0 | 16.5 |  |
| leaf-sprite-08 | B · generated sprite sheet, complete isolated leaf | 256×256 | 79.9 | 54.9 | 14.5 |  |
| flower-sprite-01 | B · generated sprite sheet, complete isolated flower | 256×256 | 106.9 | 75.1 | 20.8 |  |
| flower-sprite-02 | B · generated sprite sheet, complete isolated flower | 256×256 | 81.8 | 57.7 | 16.4 |  |
| flower-sprite-03 | B · generated sprite sheet, complete isolated flower | 256×256 | 103.1 | 72.4 | 20.0 |  |
| flower-sprite-04 | B · generated sprite sheet, complete isolated flower | 256×256 | 86.0 | 60.6 | 17.0 |  |
| leaf-small-01 | B · generated sprite sheet | 256×256 | 86.6 | 62.8 | 16.5 |  |
| bouquet-leaf-01 | B · generated sprite sheet | 256×256 | 86.6 | 62.8 | 16.5 |  |
| leaf-small-02 | B · generated sprite sheet | 256×256 | 77.1 | 52.5 | 13.9 |  |
| bouquet-leaf-02 | B · generated sprite sheet | 256×256 | 77.1 | 52.5 | 13.9 |  |
| leaf-small-03 | B · generated sprite sheet | 256×256 | 84.4 | 62.0 | 16.5 |  |
| bouquet-leaf-03 | B · generated sprite sheet | 256×256 | 84.4 | 62.0 | 16.5 |  |
| leaf-small-04 | B · generated sprite sheet | 256×256 | 79.9 | 54.9 | 14.5 |  |
| bouquet-leaf-04 | B · generated sprite sheet | 256×256 | 79.9 | 54.9 | 14.5 |  |
| bouquet-flower-01 | B · generated sprite sheet | 256×256 | 106.9 | 75.1 | 20.8 |  |
| bouquet-flower-02 | B · generated sprite sheet | 256×256 | 81.8 | 57.7 | 16.4 |  |
| bouquet-flower-03 | B · generated sprite sheet | 256×256 | 103.1 | 72.4 | 20.0 |  |
| bouquet-flower-04 | B · generated sprite sheet | 256×256 | 86.0 | 60.6 | 17.0 |  |
| bouquet-flower-05 | B · generated sprite sheet | 256×256 | 86.5 | 61.5 | 17.2 |  |
| petal-01 | B · generated sprite sheet, single isolated petal | 256×256 | 73.9 | 50.9 | 14.0 |  |
| monogram-petals-01 | B · generated sprite sheet | 256×256 | 73.9 | 50.9 | 14.0 |  |
| petal-02 | B · generated sprite sheet, single isolated petal | 256×256 | 58.9 | 41.1 | 11.5 |  |
| monogram-petals-02 | B · generated sprite sheet | 256×256 | 58.9 | 41.1 | 11.5 |  |
| petal-03 | B · generated sprite sheet, single isolated petal | 256×256 | 66.8 | 46.8 | 13.0 |  |
| monogram-petals-03 | B · generated sprite sheet | 256×256 | 66.8 | 46.8 | 13.0 |  |
| petal-04 | B · generated sprite sheet, single isolated petal | 256×256 | 66.0 | 46.6 | 12.7 |  |
| monogram-petals-04 | B · generated sprite sheet | 256×256 | 66.0 | 46.6 | 12.7 |  |
| petal-05 | B · generated sprite sheet, single isolated petal | 256×256 | 69.5 | 48.0 | 12.9 |  |
| monogram-petals-05 | B · generated sprite sheet | 256×256 | 69.5 | 48.0 | 12.9 |  |
| petal-06 | B · generated sprite sheet, single isolated petal | 256×256 | 67.8 | 46.8 | 13.0 |  |
| monogram-petals-06 | B · generated sprite sheet | 256×256 | 67.8 | 46.8 | 13.0 |  |
| particle-atlas | B · packed generated leaf and petal sprites | 512×384 | 144.0 | 56.9 | 20.7 |  |
| butterfly-wing-left | A · butterfly master, anatomical alpha split | 1536×1024 | 2704.9 | 43.7 | 14.4 |  |
| butterfly-wing-right | A · butterfly master, anatomical alpha split | 1536×1024 | 2709.5 | 44.9 | 14.8 |  |
| butterfly-body | A · butterfly master, anatomical alpha split | 1536×1024 | 2684.1 | 11.2 | 4.6 |  |
| monogram | A · existing embedded lossless PNG, same monogram as Opening reference | 1286×1229 | 1624.0 | 94.7 | 32.3 |  |
| garland-top | B (existing) · page-transition-garland.png; original project PNG, no new generation | 2172×716 | 1625.1 | 147.3 | 46.4 |  |
| branch-hero-left | B (existing) · hero-tree-left-v1.png; original project PNG, no new generation | 1302×1192 | 1510.9 | 172.8 | 56.6 |  |
| branch-hero-right | B (existing) · hero-tree-right-v1.png; original project PNG, no new generation | 1221×1244 | 1383.0 | 178.5 | 58.2 |  |
| corner-left | B (existing) · botanical-ascending-review.png | 1011×1519 | 2766.7 | 127.8 | 41.1 |  |
| corner-right | B (existing) · botanical-ascending-review.png | 1011×1519 | 2758.5 | 127.7 | 41.2 |  |
| paper-texture | A · empty paper area of landscape master | 512×512 | 224.9 | 6.9 | 1.0 |  |
| landscape-far | A · lake master; overlapping raster alpha bands | 1024×946 | 2408.1 | 272.2 | 67.8 |  |
| landscape-mid | A · lake master; overlapping raster alpha bands | 1024×946 | 2355.5 | 73.3 | 19.1 |  |
| landscape-lake | A · lake master; overlapping raster alpha bands | 1024×946 | 2349.8 | 138.8 | 35.8 |  |
| landscape-foreground | A · lake master; overlapping raster alpha bands | 1024×946 | 2354.1 | 92.8 | 23.5 |  |
| fog-layer | A · cloud hatching from landscape; cream tint, feathered edges | 1024×230 | 31.0 | 28.5 | 11.5 |  |
| water-glimmer | A · lake reflection crop | 844×170 | 315.8 | 48.5 | 12.4 |  |
