"""Generate deterministic production image variants for Villa Calypso."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
OPTIMIZED = IMAGES / "optimized"
SOURCES = IMAGES / "source"
BRAND = ROOT / "assets" / "brand"


def resized(source: Path, width: int) -> Image.Image:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        if image.width <= width:
            return image.copy()
        height = round(image.height * width / image.width)
        return image.resize((width, height), Image.Resampling.LANCZOS)


def save_variants(source: Path, widths: tuple[int, ...], *, include_avif: bool = True) -> None:
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
        if include_avif:
            image.save(
                OPTIMIZED / f"{stem}.avif",
                "AVIF",
                quality=68,
                speed=6,
            )


def save_cover(
    source: Path,
    stem: str,
    size: tuple[int, int],
    centering: tuple[float, float],
) -> None:
    """Build an art-directed crop for a full-bleed surface."""

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        cover = ImageOps.fit(
            image,
            size,
            method=Image.Resampling.LANCZOS,
            centering=centering,
        )
        cover.save(
            OPTIMIZED / f"{stem}.webp",
            "WEBP",
            quality=88,
            method=6,
            optimize=True,
        )
        cover.save(
            OPTIMIZED / f"{stem}.avif",
            "AVIF",
            quality=72,
            speed=6,
        )
        cover.save(
            OPTIMIZED / f"{stem}.jpg",
            "JPEG",
            quality=90,
            optimize=True,
            progressive=True,
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
    source = SOURCES / "villa-pool-wide.jpg"
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

    for name in (
        "villa-pool-wide.jpg",
        "villa-sunset-wide.jpg",
        "villa-lounge-wide.jpg",
        "villa-interior-wide.jpg",
    ):
        save_variants(SOURCES / name, (640, 1024, 1600, 1920))

    save_cover(
        SOURCES / "villa-sunset-wide.jpg",
        "villa-intro-desktop-1920",
        (1920, 1080),
        (0.5, 0.48),
    )
    save_cover(
        SOURCES / "villa-sunset-wide.jpg",
        "villa-intro-mobile-900",
        (900, 1200),
        (0.5, 0.5),
    )
    save_cover(
        SOURCES / "villa-pool-wide.jpg",
        "villa-hero-desktop-1920",
        (1920, 1080),
        (0.52, 0.56),
    )
    save_cover(
        SOURCES / "villa-pool-wide.jpg",
        "villa-hero-mobile-900",
        (900, 1200),
        (0.5, 0.52),
    )
    build_icons()
    build_social_card()

    for path in sorted((*OPTIMIZED.iterdir(), *BRAND.iterdir())):
        if path.is_file():
            with Image.open(path) as image:
                print(f"{path.relative_to(ROOT)}\t{image.width}x{image.height}\t{path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
