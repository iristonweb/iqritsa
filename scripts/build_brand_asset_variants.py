from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "mobile/assets/icon-1024.png"


@dataclass(frozen=True)
class Variant:
    name: str
    top: Tuple[int, int, int]
    bottom: Tuple[int, int, int]
    glow: Tuple[int, int, int, int]
    title_color: Tuple[int, int, int, int]
    subtitle_color: Tuple[int, int, int, int]
    sat: float
    contrast: float
    brightness: float


VARIANTS = [
    Variant(
        name="classic_dark",
        top=(5, 5, 16),
        bottom=(18, 26, 52),
        glow=(0, 242, 255, 28),
        title_color=(0, 242, 255, 255),
        subtitle_color=(157, 215, 255, 255),
        sat=1.05,
        contrast=1.03,
        brightness=1.0,
    ),
    Variant(
        name="neon_glow",
        top=(6, 8, 24),
        bottom=(36, 14, 64),
        glow=(165, 80, 255, 42),
        title_color=(115, 255, 255, 255),
        subtitle_color=(198, 165, 255, 255),
        sat=1.18,
        contrast=1.09,
        brightness=1.02,
    ),
    Variant(
        name="warm_gold",
        top=(14, 8, 20),
        bottom=(56, 30, 24),
        glow=(255, 186, 88, 34),
        title_color=(255, 214, 120, 255),
        subtitle_color=(255, 238, 195, 255),
        sat=1.12,
        contrast=1.06,
        brightness=1.01,
    ),
]


def get_variants_map() -> dict[str, Variant]:
    return {variant.name: variant for variant in VARIANTS}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate and activate IQritsa brand asset variants.")
    parser.add_argument(
        "--activate",
        default="neon_glow",
        help="Variant to activate after generation (default: neon_glow).",
    )
    parser.add_argument(
        "--only-activate",
        action="store_true",
        help="Skip generation and only activate an already generated variant.",
    )
    parser.add_argument(
        "--source",
        default=os.environ.get("IQRITSA_BRAND_SOURCE", str(DEFAULT_SOURCE)),
        help="Path to source PNG for brand generation. Can also be set via IQRITSA_BRAND_SOURCE.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List available variants and exit.",
    )
    return parser.parse_args()


def resolve_source(path_value: str) -> Path:
    source = Path(path_value)
    if not source.is_absolute():
        source = (ROOT / source).resolve()
    if not source.exists():
        raise FileNotFoundError(
            f"Brand source image not found: '{source}'. Pass --source or set IQRITSA_BRAND_SOURCE."
        )
    return source


def _bg_color(arr: np.ndarray) -> np.ndarray:
    samples = np.vstack([arr[0, 0], arr[0, -1], arr[-1, 0], arr[-1, -1]])
    return samples.mean(axis=0)


def extract_subject(src: Image.Image) -> Image.Image:
    rgb = np.asarray(src.convert("RGB"), dtype=np.float32)
    bg = _bg_color(rgb)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    alpha = np.clip((dist - 16) * 10, 0, 255).astype(np.uint8)
    mask = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(1.2))
    rgba = src.convert("RGBA")
    rgba.putalpha(mask)
    bbox = rgba.getbbox()
    return rgba.crop(bbox) if bbox else rgba


def process_subject(subject: Image.Image, variant: Variant) -> Image.Image:
    out = subject.copy()
    out = ImageEnhance.Color(out).enhance(variant.sat)
    out = ImageEnhance.Contrast(out).enhance(variant.contrast)
    out = ImageEnhance.Brightness(out).enhance(variant.brightness)
    return out


def gradient(size: Tuple[int, int], top: Tuple[int, int, int], bottom: Tuple[int, int, int]) -> Image.Image:
    w, h = size
    top_np = np.array(top, dtype=np.float32)
    bottom_np = np.array(bottom, dtype=np.float32)
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(h):
        t = y / max(1, h - 1)
        row = (top_np * (1 - t) + bottom_np * t).astype(np.uint8)
        arr[y, :, :] = row
    return Image.fromarray(arr, mode="RGB")


def rounded_bg(size: int, variant: Variant) -> Image.Image:
    base = gradient((size, size), variant.top, variant.bottom).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=max(24, size // 5), fill=255)
    base.putalpha(mask)
    return base


def paste_center(bg: Image.Image, fg: Image.Image, scale: float, y_shift: float = 0.0) -> Image.Image:
    w, h = bg.size
    fw = int(w * scale)
    ratio = fw / fg.width
    fh = int(fg.height * ratio)
    fg2 = fg.resize((fw, fh), Image.Resampling.LANCZOS)
    x = (w - fw) // 2
    y = int((h - fh) // 2 + y_shift * h)
    bg.alpha_composite(fg2, (x, y))
    return bg


def glow_layer(size: Tuple[int, int], color: Tuple[int, int, int, int], box: Tuple[int, int, int, int], blur: int) -> Image.Image:
    w, h = size
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(lay)
    draw.ellipse(box, fill=color)
    return lay.filter(ImageFilter.GaussianBlur(blur))


def write_icon(subject: Image.Image, variant: Variant, out_path: Path, size: int) -> None:
    img = rounded_bg(size, variant)
    glow = glow_layer((size, size), variant.glow, (int(size * 0.2), int(size * 0.15), int(size * 0.82), int(size * 0.9)), max(12, size // 20))
    img.alpha_composite(glow)
    img = paste_center(img, subject, scale=0.72, y_shift=0.03)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)


def write_adaptive(subject: Image.Image, variant: Variant, out_path: Path) -> None:
    size = 1024
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    halo = glow_layer((size, size), variant.glow, (220, 160, 820, 870), 28)
    fg.alpha_composite(halo)
    fg = paste_center(fg, subject, scale=0.78, y_shift=0.03)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fg.save(out_path, format="PNG", optimize=True)


def write_splash(subject: Image.Image, variant: Variant, out_path: Path) -> None:
    size = 2048
    bg = gradient((size, size), variant.top, variant.bottom).convert("RGBA")
    bg.alpha_composite(glow_layer((size, size), variant.glow, (520, 520, 1528, 1528), 90))
    bg = paste_center(bg, subject, scale=0.46, y_shift=-0.02)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def _fonts() -> tuple[ImageFont.ImageFont, ImageFont.ImageFont]:
    title_candidates = ["arialbd.ttf", "Arial Bold.ttf", "DejaVuSans-Bold.ttf"]
    body_candidates = ["arial.ttf", "Arial.ttf", "DejaVuSans.ttf"]

    def load(candidates: list[str], size: int) -> ImageFont.ImageFont:
        for candidate in candidates:
            try:
                return ImageFont.truetype(candidate, size)
            except OSError:
                continue
        return ImageFont.load_default()

    return load(title_candidates, 86), load(body_candidates, 34)


def write_og(subject: Image.Image, variant: Variant, out_path: Path) -> None:
    w, h = 1200, 630
    bg = gradient((w, h), variant.top, variant.bottom).convert("RGBA")
    bg.alpha_composite(glow_layer((w, h), variant.glow, (140, 120, 520, 520), 36))
    bg = paste_center(bg, subject, scale=0.34, y_shift=0.03)
    f1, f2 = _fonts()
    d = ImageDraw.Draw(bg)
    d.text((430, 235), "IQRITSA", fill=variant.title_color, font=f1)
    d.text((432, 330), "Evolve the brainy chicken", fill=variant.subtitle_color, font=f2)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def write_logo(subject: Image.Image, variant: Variant, out_path: Path) -> None:
    w, h = 860, 220
    bg = gradient((w, h), variant.top, variant.bottom).convert("RGBA")
    fg = subject.resize((170, int(subject.height * 170 / subject.width)), Image.Resampling.LANCZOS)
    bg.alpha_composite(fg, (24, 24))
    try:
        f1 = ImageFont.truetype("arialbd.ttf", 74)
        f2 = ImageFont.truetype("arial.ttf", 24)
    except OSError:
        f1 = ImageFont.load_default()
        f2 = ImageFont.load_default()
    d = ImageDraw.Draw(bg)
    d.text((225, 72), "IQRITSA", fill=variant.title_color, font=f1)
    d.text((228, 148), "Chicken of intelligence", fill=variant.subtitle_color, font=f2)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def generate_variant(subject: Image.Image, variant: Variant) -> None:
    subject_v = process_subject(subject, variant)
    write_icon(subject_v, variant, ROOT / f"mobile/assets/variants/{variant.name}/icon-1024.png", 1024)
    write_adaptive(subject_v, variant, ROOT / f"mobile/assets/variants/{variant.name}/adaptive-icon.png")
    write_splash(subject_v, variant, ROOT / f"mobile/assets/variants/{variant.name}/splash.png")
    write_icon(subject_v, variant, ROOT / f"client/public/icons/variants/{variant.name}/icon-192.png", 192)
    write_icon(subject_v, variant, ROOT / f"client/public/icons/variants/{variant.name}/icon-512.png", 512)
    write_og(subject_v, variant, ROOT / f"client/public/brand/variants/{variant.name}/og-chicken-brand.png")
    write_logo(subject_v, variant, ROOT / f"client/public/brand/variants/{variant.name}/iqritsa-logo.png")


def activate_variant(variant_name: str) -> None:
    mobile = ROOT / f"mobile/assets/variants/{variant_name}"
    web_icons = ROOT / f"client/public/icons/variants/{variant_name}"
    web_brand = ROOT / f"client/public/brand/variants/{variant_name}"

    mapping = [
        (mobile / "icon-1024.png", ROOT / "mobile/assets/icon-1024.png"),
        (mobile / "adaptive-icon.png", ROOT / "mobile/assets/adaptive-icon.png"),
        (mobile / "splash.png", ROOT / "mobile/assets/splash.png"),
        (web_icons / "icon-192.png", ROOT / "client/public/icons/icon-192.png"),
        (web_icons / "icon-512.png", ROOT / "client/public/icons/icon-512.png"),
        (web_brand / "og-chicken-brand.png", ROOT / "client/public/brand/og-chicken-brand.png"),
        (web_brand / "iqritsa-logo.png", ROOT / "client/public/brand/iqritsa-logo.png"),
    ]

    for src, dst in mapping:
        if not src.exists():
            raise FileNotFoundError(f"Cannot activate '{variant_name}': missing file '{src}'. Generate variants first.")
        dst.parent.mkdir(parents=True, exist_ok=True)
        Image.open(src).save(dst, format="PNG", optimize=True)

    # favicon from active 192 icon
    icon_192 = Image.open(ROOT / "client/public/icons/icon-192.png")
    icon_192.resize((64, 64), Image.Resampling.LANCZOS).save(ROOT / "client/public/favicon.png", format="PNG", optimize=True)
    (ROOT / "client/public/brand/ACTIVE_VARIANT.txt").write_text(f"{variant_name}\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    variants_map = get_variants_map()

    if args.list:
        print("Available variants:")
        for name in variants_map:
            print(f"- {name}")
        return

    if args.activate not in variants_map:
        names = ", ".join(variants_map.keys())
        raise SystemExit(f"Unknown variant '{args.activate}'. Available: {names}")

    source_path = resolve_source(args.source)

    if not args.only_activate:
        subject = extract_subject(Image.open(source_path).convert("RGBA"))
        for variant in VARIANTS:
            generate_variant(subject, variant)

    activate_variant(args.activate)
    print(f"Active brand variant: {args.activate}")


if __name__ == "__main__":
    main()
