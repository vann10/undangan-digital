"""Build lightweight display assets while keeping the source artwork intact."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "artwork"
SOURCE = ROOT / "assets" / "source-artwork"
PHOTO_SOURCE = ROOT / "assets" / "photoshot"
PHOTO_PUBLIC = PUBLIC / "photos"

# Source, destination, maximum width, and WebP quality.
ASSETS = (
    (SOURCE / "page-transition-garland.png", PUBLIC / "page-transition-garland.webp", 1100, 78),
    (SOURCE / "page-two-botanical-background.png", PUBLIC / "page-two-botanical-background.webp", 700, 75),
)

PROFILE_SIZES = ((320, 77), (720, 80))
ALBUM_SIZES = ((160, 75), (320, 78), (960, 82))
PHOTOS = (
    ("ARY_4846.JPG", ((420, 79), (960, 82))),
    ("ARY_5282.jpg", PROFILE_SIZES),
    ("ARY_5340.jpg", PROFILE_SIZES),
    ("ARY_5268.jpg", ALBUM_SIZES),
    ("ARY_4842.JPG", ALBUM_SIZES),
    ("ARY_4885.JPG", ALBUM_SIZES),
    ("ARY_5008.JPG", ALBUM_SIZES),
    ("ARY_5341.jpg", ALBUM_SIZES),
    ("ARY_5224.JPG", ALBUM_SIZES),
    ("ARY_5096.JPG", ALBUM_SIZES),
    ("ARY_5162.JPG", ALBUM_SIZES),
)

PHOTO_PUBLIC.mkdir(exist_ok=True)
photo_assets = (
    (PHOTO_SOURCE / filename, PHOTO_PUBLIC / f"{Path(filename).stem}-{width}.webp", width, quality)
    for filename, variants in PHOTOS
    for width, quality in variants
)
for source, destination, maximum_width, quality in (*ASSETS, *photo_assets):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.width > maximum_width:
            image = image.resize(
                (maximum_width, round(image.height * maximum_width / image.width)),
                Image.Resampling.LANCZOS,
            )
        image.save(destination, "WEBP", quality=quality, method=6)
    print(f"{destination.name}: {source.stat().st_size // 1024} KB -> {destination.stat().st_size // 1024} KB")
