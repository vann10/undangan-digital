from pathlib import Path
from PIL import Image, ImageDraw
import json

root=Path(__file__).resolve().parents[1]
(root/'artifacts/cinematic').mkdir(parents=True,exist_ok=True)
records=json.loads((root/'assets/build/manifest.json').read_text(encoding='utf-8'))
for asset in records:
    name=asset['name']
    with Image.open(root/'assets/master'/f'{name}.png') as im:
        assert im.mode=='RGBA',name
        assert im.size==(asset['width'],asset['height']),name
    for variant in asset['variants']:
        path=root/'assets/build'/variant['file']
        with Image.open(path) as im: im.load();assert im.size==(variant['width'],variant['height'])
        assert path.stat().st_size==variant['bytes']
        assert path.read_bytes()==(root/'public/transition'/path.name).read_bytes()
    if name.startswith('vine-'):assert asset['variants'][0]['bytes']<=400000,name
    if name.startswith('landscape-'):assert asset['variants'][0]['bytes']<=500000,name
assert {p.name for p in (root/'assets/build').glob('*.svg')} <= {'arch-frame.svg','divider.svg'}
assert not list((root/'assets/master').glob('*placeholder*'))

# Contact sheet at literal 200% pixel magnification for visual inspection only.
samples=[('butterfly',root/'assets/master/butterfly-wing-left.png',(220,140,476,396)),
         ('vine',root/'assets/master/vine-left-front.png',(90,190,346,446)),
         ('landscape',root/'assets/master/landscape-lake.png',(450,570,706,826)),
         ('new specimen',root/'assets/master/leaf-sprite-01.png',(0,0,256,256))]
sheet=Image.new('RGBA',(2048,560),(250,247,241,255))
draw=ImageDraw.Draw(sheet)
for i,(label,path,box) in enumerate(samples):
    im=Image.open(path).convert('RGBA').crop(box).resize((512,512),Image.Resampling.NEAREST)
    sheet.alpha_composite(im,(i*512,40));draw.text((i*512+16,12),label+' - 200%',fill=(23,74,74,255))
sheet.convert('RGB').save(root/'artifacts/cinematic/raster-detail-200.png')
summary={'masters':len(records),'svg':['arch-frame.svg','divider.svg'],'placeholders':0,
         'maxVineBytes':max(r['variants'][0]['bytes'] for r in records if r['name'].startswith('vine-')),
         'maxLandscapeBytes':max(r['variants'][0]['bytes'] for r in records if r['name'].startswith('landscape-'))}
(root/'artifacts/cinematic/asset-verification.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
