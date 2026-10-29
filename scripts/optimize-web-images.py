"""Build lightweight display assets while keeping the source artwork intact."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "artwork"
SOURCE = ROOT / "assets" / "source-artwork"

# Source, destination, maximum width, and WebP quality.
ASSETS = (
    (ROOT / "assets" / "Seon-ho Youn-jung.jpeg", PUBLIC / "couple-user-upload.webp", 1000, 80),
    (ROOT / "assets" / "brides.jpeg", PUBLIC / "brides-user-upload.webp", 1000, 78),
    (ROOT / "assets" / "bridesgroom.jpeg", PUBLIC / "bridesgroom-user-upload.webp", 1000, 78),
    (SOURCE / "page-transition-garland.png", PUBLIC / "page-transition-garland.webp", 1100, 78),
    (SOURCE / "page-two-botanical-background.png", PUBLIC / "page-two-botanical-background.webp", 700, 75),
)


for source, destination, maximum_width, quality in ASSETS:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.width > maximum_width:
            image = image.resize(
                (maximum_width, round(image.height * maximum_width / image.width)),
                Image.Resampling.LANCZOS,
            )
        image.save(destination, "WEBP", quality=quality, method=6)
    print(f"{destination.name}: {source.stat().st_size // 1024} KB -> {destination.stat().st_size // 1024} KB")
