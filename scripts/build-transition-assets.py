"""Raster pipeline for Route A masters and a Route B generated specimen plate.
No illustration drawing, tracing, sharpening or color enhancement.
Run: python scripts/build-transition-assets.py
PNG masters are always the only input to each WebP export.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps
import numpy as np
import base64, io, re, json, shutil

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'assets/master'
BUILD = ROOT / 'assets/build'
PUBLIC = ROOT / 'public/transition'
for folder in (MASTER, BUILD, PUBLIC):
    folder.mkdir(parents=True, exist_ok=True)
records = []

def save(name, im, source, width=None, note=''):
    im = im.convert('RGBA')
    master_path=MASTER / f'{name}.png'
    same=master_path.exists() and Image.open(master_path).convert('RGBA').tobytes()==im.tobytes()
    if not same: im.save(master_path, optimize=True)
    width = min(width or im.width, im.width)
    variants = []
    for suffix, w in [('', width), ('@1x', max(1, width // 2))]:
        out = im.resize((w, round(im.height * w / im.width)), Image.Resampling.LANCZOS) if w != im.width else im
        target = BUILD / f'{name}{suffix}.webp'
        valid=False
        if target.exists():
            try:
                with Image.open(target) as previous: valid=previous.size==out.size
            except OSError: pass
        if not same or not valid:
            temporary=target.with_suffix('.tmp')
            out.save(temporary, 'WEBP', quality=94, method=4, lossless=im.width <= 320 and im.height <= 320, exact=True)
            temporary.replace(target)
        shutil.copy2(target, PUBLIC / target.name)
        variants.append({'file': target.name, 'width': out.width, 'height': out.height, 'bytes': target.stat().st_size})
    shutil.copy2(MASTER / f'{name}.png', PUBLIC / f'{name}.png')
    records.append({'name': name, 'source': source, 'width': im.width, 'height': im.height,
                    'bytes': (MASTER / f'{name}.png').stat().st_size, 'variants': variants, 'note': note})
    return im

vine = Image.open(ROOT / 'assets/edge-vine-review-master.png').convert('RGBA')
# Existing clean alpha is retained. Only fully transparent RGB is cleared.
va = np.array(vine)
va[va[:,:,3] == 0, :3] = 0
vine = Image.fromarray(va)
box = vine.getbbox()
trim = vine.crop(box)
for side in ('left', 'right'):
    v = trim if side == 'left' else ImageOps.mirror(trim)
    for depth in ('back', 'front'):
        save(f'vine-{side}-{depth}', v, 'A · edge-vine master; native alpha, crop/mirror', 420)

# Individual botanical specimens from the generated transparent plate.
plate=Image.open(ROOT/'assets/botanical-sprite-sheet-generated.png').convert('RGBA')
save('botanical-sprite-sheet',plate,'B · built-in imagegen; three supplied masters as style references',plate.width)
cells=[]
for i in range(16):
    cell=plate.crop((i%4*plate.width//4,i//4*plate.height//4,(i%4+1)*plate.width//4,(i//4+1)*plate.height//4))
    # All cells have genuine alpha. Preserve it; no white-key removal or pigment changes.
    cells.append(cell.resize((256,256),Image.Resampling.LANCZOS))
leaves=[]; flowers=[]
for i in range(8):
    leaves.append(save(f'leaf-sprite-{i+1:02}', cells[i%4], 'B · generated sprite sheet, complete isolated leaf'))
for i in range(4):
    flowers.append(save(f'flower-sprite-{i+1:02}', cells[i+4], 'B · generated sprite sheet, complete isolated flower'))
for i in range(4):
    save(f'leaf-small-{i+1:02}', leaves[i], 'B · generated sprite sheet')
    save(f'bouquet-leaf-{i+1:02}', leaves[i], 'B · generated sprite sheet')
for i in range(5):
    save(f'bouquet-flower-{i+1:02}', cells[15] if i==4 else flowers[i], 'B · generated sprite sheet')
for i in range(6):
    petal=cells[i+8]
    save(f'petal-{i+1:02}', petal, 'B · generated sprite sheet, single isolated petal')
    save(f'monogram-petals-{i+1:02}', petal, 'B · generated sprite sheet')

# Atlas packs existing raster pixels only; canvas will drawImage from these cells.
atlas = Image.new('RGBA', (512, 384))
for i, sprite in enumerate(leaves[:4] + cells[8:14]):
    s=sprite.copy(); s.thumbnail((112,112), Image.Resampling.LANCZOS)
    atlas.alpha_composite(s, (i%4*128+(128-s.width)//2, i//4*128+(128-s.height)//2))
save('particle-atlas', atlas, 'B · packed generated leaf and petal sprites')

butterfly = Image.open(ROOT/'assets/butterfly-spread-review-master.png').convert('RGBA')
w,h=butterfly.size
y,x=np.mgrid[:h,:w]
# Pixel masks split at the anatomical wing roots. Antennae remain on the body.
left_edge=np.interp(y[:,0],[0,280,400,510,700,1024],[730,748,724,720,748,768])[:,None]
right_edge=1536-left_edge
antenna_left=(y>55)&(y<330)&(np.abs(x-(565+(y-70)*.78))<17)
antenna_right=(y>55)&(y<330)&(np.abs(x-(971-(y-70)*.78))<17)
left=(x<left_edge)&~antenna_left
right=(x>right_edge)&~antenna_right
for name, mask in [('wing-left',left),('wing-right',right),('body',~(left|right))]:
    a=np.array(butterfly); a[:,:,3]=(a[:,:,3].astype(float)*mask).astype('uint8')
    save('butterfly-'+name, Image.fromarray(a), 'A · butterfly master, anatomical alpha split', 600)

# Recover the original raster embedded in the legacy SVG wrapper; no SVG rendering/tracing.
svg=(ROOT/'public/artwork/monogram_RD_exact_illustration.svg').read_text(encoding='utf-8')
raw=re.search(r'base64,([^"\s]+)',svg).group(1)
monogram=Image.open(io.BytesIO(base64.b64decode(raw))).convert('RGBA')
monogram=monogram.crop(monogram.getbbox())
save('monogram',monogram,'A · existing embedded lossless PNG, same monogram as Opening reference',400)

# Original lossless sources already present in the project and shown in the reference.
for name, source in [('garland-top','page-transition-garland.png'),
                     ('branch-hero-left','hero-tree-left-v1.png'),('branch-hero-right','hero-tree-right-v1.png')]:
    im=Image.open(ROOT/'public/artwork'/source).convert('RGBA')
    im=im.crop(im.getbbox())
    save(name,im,'B (existing) · '+source+'; original project PNG, no new generation',900 if name=='garland-top' else 600)
for side in ('left','right'):
    corner=Image.open(ROOT/'public/artwork/botanical-ascending-review.png').convert('RGBA')
    if side=='right': corner=ImageOps.mirror(corner)
    save('corner-'+side,corner.crop(corner.getbbox()),'B (existing) · botanical-ascending-review.png',400)

lake=Image.open(ROOT/'assets/lake-landscape-review-master.png').convert('RGB')
save('paper-texture',lake.crop((100,100,612,612)),'A · empty paper area of landscape master',512)
scene=lake.crop((0,590,1024,1536)).convert('RGBA')
a=np.array(scene).astype(float)
yy=np.arange(scene.height)[:,None]
# Only remove the sky paper outside the landscape; no color enhancement inside the illustration.
paper=np.array([248,245,237.])
distance=np.maximum(0,(paper-a[:,:,:3]).max(axis=2))
sky_alpha=np.clip(distance/45,0,1)
opaque=np.clip((yy-130)/100,0,1)
alpha=np.maximum(sky_alpha,opaque)*np.clip(yy/110,0,1)
a[:,:,:3]=np.clip((a[:,:,:3]-paper*(1-alpha[:,:,None]))/np.maximum(alpha[:,:,None],.01),0,255)
a[:,:,3]=alpha*255
scene=Image.fromarray(a.astype('uint8'))
# Nested overlapping masks: each lower band covers its predecessor at rest.
# Every layer keeps original coordinates, so there are no independent resizing seams.
for name,start,end in [('far',0,470),('mid',420,570),('lake',520,830),('foreground',780,946)]:
    a=np.array(scene)
    mask=np.ones(scene.height)
    if start: mask[:start]=0; mask[start:start+48]=np.linspace(0,1,48)
    # A base underlap extends under the following band; it is covered by identical pixels.
    if end<946: mask[end:]=0
    a[:,:,3]=(a[:,:,3]*mask[:,None]).astype('uint8')
    save('landscape-'+name,Image.fromarray(a),'A · lake master; overlapping raster alpha bands',900)

fog=scene.crop((0,0,1024,230))
fa=np.array(fog); fa[:,:,:3]=[250,247,241]
fa[:,:,3]=np.array(Image.fromarray(fa[:,:,3]).filter(ImageFilter.GaussianBlur(5)))
fade=np.sin(np.linspace(0,np.pi,230))[:,None]*np.sin(np.linspace(0,np.pi,1024))[None,:]
fa[:,:,3]=(fa[:,:,3]*fade).astype('uint8')
save('fog-layer',Image.fromarray(fa),'A · cloud hatching from landscape; cream tint, feathered edges',900)
save('water-glimmer',scene.crop((180,570,1024,740)),'A · lake reflection crop',700)

(BUILD/'manifest.json').write_text(json.dumps(records,indent=2,ensure_ascii=False),encoding='utf-8')
shutil.copy2(BUILD/'manifest.json',PUBLIC/'manifest.json')
lines=['# Transition asset register','', 'All WebP variants are encoded once from their lossless PNG master. @1x is half the main build width. One new sprite sheet was generated with the three supplied style masters. No vectorization, denoising, sharpening, saturation or contrast adjustments. PNG fallbacks live beside WebP in public/transition.','','| Asset | Source | PNG pixels | PNG KB | WebP @2x KB | WebP @1x KB | Notes |','|---|---|---:|---:|---:|---:|---|']
for r in records:
    lines.append(f"| {r['name']} | {r['source']} | {r['width']}×{r['height']} | {r['bytes']/1024:.1f} | {r['variants'][0]['bytes']/1024:.1f} | {r['variants'][1]['bytes']/1024:.1f} | {r['note']} |")
(ROOT/'assets/TRANSITION-ASSETS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
for folder in (MASTER,BUILD,PUBLIC):
    # Remove only this pipeline's superseded, explicitly named interim fragments.
    for obsolete in folder.glob('*-placeholder*'):
        if obsolete.resolve().parent==folder.resolve() and obsolete.is_file(): obsolete.unlink()
for geometric in ('arch-frame.svg','divider.svg'):
    if (BUILD/geometric).exists(): shutil.copy2(BUILD/geometric,PUBLIC/geometric)
print(f'Exported {len(records)} masters and direct WebP variants; see assets/TRANSITION-ASSETS.md')
