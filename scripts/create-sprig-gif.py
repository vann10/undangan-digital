"""Create a short decorative sway from the user-supplied sprig; no infinite loop."""
from PIL import Image
from pathlib import Path
import math

project = Path(__file__).resolve().parents[1]
root = project / 'artifacts/sprig'
root.mkdir(parents=True, exist_ok=True)
source = Image.open(project / 'assets/source-artwork/rd-bud-sprig-v1.webp').convert('RGBA')
source.thumbnail((160, 240), Image.Resampling.LANCZOS)
canvas = Image.new('RGBA', (200, 280))
canvas.alpha_composite(source, ((200-source.width)//2, 20))
frames = []
for i in range(80):
    angle = 2.4 * math.sin(2 * math.pi * i / 79)
    frame = canvas.rotate(angle, Image.Resampling.BICUBIC, center=(100, 260))
    indexed = frame.convert('RGB').quantize(colors=255)
    indexed.paste(255, mask=frame.getchannel('A').point(lambda a: 255 if a < 128 else 0))
    indexed.info['transparency'] = 255
    frames.append(indexed)
frames[0].save(root / 'rd-bud-sprig-sway.gif', save_all=True, append_images=frames[1:], duration=50, transparency=255, disposal=2, optimize=False)
canvas.save(root / 'rd-bud-sprig-still.webp')
print('Created 80 frames / 4 seconds, no repeat, transparent GIF and static fallback.')
