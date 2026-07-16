"""Generate deterministic production image variants for Villa Calypso."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
OPTIMIZED = IMAGES / "optimized"
BRAND = ROOT / "assets" / "brand"


def resized(source: Path, width: int) -> Image.Image:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        if image.width <= width:
            return image.copy()
        height = round(image.height * width / image.width)
        return image.resize((width, height), Image.Resampling.LANCZOS)


def save_variants(source: Path, widths: tuple[int, ...]) -> None:
    with Image.open(source) as probe:
        source_width = probe.width
    for width in sorted({min(width, source_width) for width in widths}):
        image = resized(source, width)
        stem = f"{source.stem}-{width}"
        image.save(
            OPTIMIZED / f"{stem}.webp",
            "WEBP",
            quality=84,
            method=6,
            optimize=True,
        )
        image.save(
            OPTIMIZED / f"{stem}.avif",
            "AVIF",
            quality=68,
            speed=6,
        )


def build_icons() -> None:
    source = BRAND / "logo-calypso.png"
    with Image.open(source) as logo:
        logo = ImageOps.exif_transpose(logo).convert("RGBA")
        for width in (600, 1200):
            height = round(logo.height * width / logo.width)
            compact = logo.resize((width, height), Image.Resampling.LANCZOS)
            compact.save(BRAND / f"logo-calypso-{width}.png", optimize=True)

        side = logo.height
        mark = logo.crop((logo.width - side, 0, logo.width, side))
        for size in (32, 192, 512):
            icon = mark.resize((size, size), Image.Resampling.LANCZOS)
            icon.save(BRAND / f"icon-{size}.png", optimize=True)


def build_social_card() -> None:
    source = ROOT / "assets" / "cinema" / "calypso-official-desktop.jpg"
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        card = ImageOps.fit(
            image,
            (1200, 630),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
        card.save(BRAND / "social-card.jpg", quality=88, optimize=True, progressive=True)


def main() -> None:
    OPTIMIZED.mkdir(parents=True, exist_ok=True)
    for name in ("pool.jpg", "golden.jpg", "bluehour.jpg"):
        save_variants(IMAGES / name, (480, 768, 1176))
    for name in ("villa-table-local.webp", "acapulco-bay-premium.webp"):
        save_variants(IMAGES / name, (768, 1440, 1920))
    build_icons()
    build_social_card()

    for path in sorted((*OPTIMIZED.iterdir(), *BRAND.iterdir())):
        if path.is_file():
            with Image.open(path) as image:
                print(f"{path.relative_to(ROOT)}\t{image.width}x{image.height}\t{path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
