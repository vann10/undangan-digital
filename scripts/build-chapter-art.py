"""Encode each new illustration once from its original generated PNG. No repainting."""
from pathlib import Path
from PIL import Image
import shutil,json
root=Path(__file__).resolve().parents[1]
source=root/'assets/chapter-sources'; master=root/'assets/master'; build=root/'assets/build'; public=root/'public/chapter-art'
for folder in (master,build,public):
    folder.mkdir(parents=True,exist_ok=True)
rows=[]
for name in ['rsvp-correspondence','gallery-conservatory','footer-wedding-arch','chapter-garland','desktop-wedding-blueprint']:
    im=Image.open(source/f'{name}.png').convert('RGBA')
    if name=='chapter-garland':im=im.crop(im.getbbox())
    im.save(master/f'{name}.png',optimize=True)
    width=min(im.width,1600 if name.startswith('desktop') else 1100 if name=='chapter-garland' else 900)
    variants=[]
    for suffix,w in [('',width),('@1x',width//2)]:
        img=im.resize((w,round(im.height*w/im.width)),Image.Resampling.LANCZOS)
        target=build/f'{name}{suffix}.webp';img.save(target,'WEBP',quality=94,method=4,exact=True)
        shutil.copy2(target,public/target.name)
        variants.append({'file':target.name,'size':img.size,'bytes':target.stat().st_size})
    rows.append({'name':name,'source':'B · built-in imagegen with supplied style references','master':im.size,'variants':variants})
(build/'chapter-manifest.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
lines=['# New chapter artwork','', '| Name | PNG master | WebP 2x bytes | WebP 1x bytes |','|---|---|---:|---:|']
for r in rows:lines.append(f"| {r['name']} | {r['master'][0]}×{r['master'][1]} | {r['variants'][0]['bytes']} | {r['variants'][1]['bytes']} |")
(root/'docs/design/CHAPTER-ASSETS.md').write_text('\n'.join(lines),encoding='utf-8')
print(json.dumps(rows,indent=2))
