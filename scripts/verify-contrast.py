"""Measure contrast against the rendered texture-only browser capture. Requires Pillow."""
import json
from pathlib import Path
from PIL import Image

def luminance(rgb):
    values = [v / 255 for v in rgb]
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values]
    return sum(a * b for a, b in zip(linear, (0.2126, 0.7152, 0.0722)))

root = Path('artifacts/nature-cover')
im = Image.open(root / 'texture-background.png').convert('RGB')
darkest = min(luminance(pixel) for pixel in im.get_flattened_data())
checks = []
for label, foreground in [('Emerald headings/labels', '174a4a'), ('Warm Charcoal text/notes', '393534')]:
    ratio = (darkest + .05) / (luminance(bytes.fromhex(foreground)) + .05)
    checks.append({'name': label, 'contrast': round(ratio, 2), 'target': 4.5, 'status': 'PASS' if ratio >= 4.5 else 'FAIL'})
ratio = (luminance(bytes.fromhex('faf7f1')) + .05) / (luminance(bytes.fromhex('174a4a')) + .05)
checks.append({'name': 'Ivory button text on Emerald', 'contrast': round(ratio, 2), 'target': 4.5, 'status': 'PASS' if ratio >= 4.5 else 'FAIL'})
result = {'method': 'Worst luminance across texture-only screenshot; CSS foreground colors (not antialiased edge pixels).', 'checks': checks}
(root / 'contrast-results.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result, indent=2))
assert all(check['status'] == 'PASS' for check in checks)
