from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "mobile/assets/icon-1024.png"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate base IQritsa brand assets from a source PNG.")
    parser.add_argument(
        "--source",
        default=os.environ.get("IQRITSA_BRAND_SOURCE", str(DEFAULT_SOURCE)),
        help="Path to source PNG. Can also be set via IQRITSA_BRAND_SOURCE.",
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


def dark_gradient(size: Tuple[int, int]) -> Image.Image:
    w, h = size
    top = np.array([5, 5, 16], dtype=np.float32)
    bottom = np.array([20, 28, 52], dtype=np.float32)
    grad = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(h):
        t = y / max(1, h - 1)
        row = (top * (1 - t) + bottom * t).astype(np.uint8)
        grad[y, :, :] = row
    return Image.fromarray(grad, mode="RGB")


def rounded_bg(size: int, radius: int) -> Image.Image:
    base = dark_gradient((size, size)).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
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


def write_icon_png(subject: Image.Image, out_path: Path, size: int) -> None:
    icon = rounded_bg(size, max(24, size // 5))
    icon = paste_center(icon, subject, scale=0.72, y_shift=0.03)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    icon.save(out_path, format="PNG", optimize=True)


def write_adaptive_png(subject: Image.Image, out_path: Path, size: int = 1024) -> None:
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fg = paste_center(fg, subject, scale=0.78, y_shift=0.03)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fg.save(out_path, format="PNG", optimize=True)


def write_splash_png(subject: Image.Image, out_path: Path) -> None:
    size = 2048
    bg = dark_gradient((size, size)).convert("RGBA")
    # soft glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse([520, 520, 1528, 1528], fill=(0, 242, 255, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    bg.alpha_composite(glow)
    bg = paste_center(bg, subject, scale=0.46, y_shift=-0.02)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def write_og_png(subject: Image.Image, out_path: Path) -> None:
    w, h = 1200, 630
    bg = dark_gradient((w, h)).convert("RGBA")
    bg = paste_center(bg, subject, scale=0.34, y_shift=0.03)
    draw = ImageDraw.Draw(bg)
    try:
        f1 = ImageFont.truetype("arialbd.ttf", 86)
        f2 = ImageFont.truetype("arial.ttf", 34)
    except OSError:
        f1 = ImageFont.load_default()
        f2 = ImageFont.load_default()
    draw.text((430, 235), "IQRITSA", fill=(0, 242, 255, 255), font=f1)
    draw.text((432, 330), "Evolve the brainy chicken", fill=(157, 215, 255, 255), font=f2)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def write_logo_png(subject: Image.Image, out_path: Path) -> None:
    w, h = 860, 220
    bg = dark_gradient((w, h)).convert("RGBA")
    fg = subject.resize((170, int(subject.height * 170 / subject.width)), Image.Resampling.LANCZOS)
    bg.alpha_composite(fg, (24, 24))
    draw = ImageDraw.Draw(bg)
    try:
        f1 = ImageFont.truetype("arialbd.ttf", 74)
        f2 = ImageFont.truetype("arial.ttf", 24)
    except OSError:
        f1 = ImageFont.load_default()
        f2 = ImageFont.load_default()
    draw.text((225, 72), "IQRITSA", fill=(0, 242, 255, 255), font=f1)
    draw.text((228, 148), "Chicken of intelligence", fill=(157, 215, 255, 255), font=f2)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out_path, format="PNG", optimize=True)


def main() -> None:
    args = parse_args()
    source = resolve_source(args.source)
    src = Image.open(source).convert("RGBA")
    subject = extract_subject(src)

    write_icon_png(subject, ROOT / "mobile/assets/icon-1024.png", 1024)
    write_adaptive_png(subject, ROOT / "mobile/assets/adaptive-icon.png")
    write_splash_png(subject, ROOT / "mobile/assets/splash.png")
    write_icon_png(subject, ROOT / "client/public/icons/icon-192.png", 192)
    write_icon_png(subject, ROOT / "client/public/icons/icon-512.png", 512)
    write_og_png(subject, ROOT / "client/public/brand/og-chicken-brand.png")
    write_logo_png(subject, ROOT / "client/public/brand/iqritsa-logo.png")

    # Optional social fallback icon
    write_icon_png(subject, ROOT / "client/public/favicon-192.png", 192)


if __name__ == "__main__":
    main()
