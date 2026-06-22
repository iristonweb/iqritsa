from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BRAND_ROOT = ROOT / "client" / "public" / "brand"
FONT_PATH = Path(r"C:\Windows\Fonts\arialbd.ttf")
TEXT = "IQюрица"

LOGO_PATHS = [
    BRAND_ROOT / "iqritsa-logo.png",
    BRAND_ROOT / "variants" / "classic_dark" / "iqritsa-logo.png",
    BRAND_ROOT / "variants" / "neon_glow" / "iqritsa-logo.png",
    BRAND_ROOT / "variants" / "warm_gold" / "iqritsa-logo.png",
]


def overlay_exact_title(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    width, height = img.size
    draw = ImageDraw.Draw(img)

    font_size = max(28, int(height * 0.082))
    font = ImageFont.truetype(str(FONT_PATH), font_size)
    stroke = max(2, font_size // 14)
    bbox = draw.textbbox((0, 0), TEXT, font=font, stroke_width=stroke)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    pad_x = max(24, int(width * 0.035))
    pad_y = max(10, int(height * 0.018))
    plaque_width = text_width + pad_x * 2
    plaque_height = text_height + pad_y * 2
    x0 = (width - plaque_width) // 2
    y0 = int(height * 0.76)
    x1 = x0 + plaque_width
    y1 = y0 + plaque_height
    radius = max(16, plaque_height // 3)

    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle(
        (x0 - 4, y0 - 4, x1 + 4, y1 + 4),
        radius=radius + 4,
        outline=(255, 215, 96, 160),
        width=max(4, height // 120),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(max(3, height // 120)))

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rounded_rectangle(
        (x0 + 5, y0 + 7, x1 + 5, y1 + 7),
        radius=radius,
        fill=(0, 0, 0, 95),
    )
    overlay_draw.rounded_rectangle(
        (x0, y0, x1, y1),
        radius=radius,
        fill=(62, 34, 12, 225),
        outline=(247, 190, 62, 255),
        width=max(3, height // 150),
    )

    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    tx = (width - text_width) // 2
    ty = y0 + (plaque_height - text_height) // 2 - bbox[1]
    draw.text(
        (tx, ty),
        TEXT,
        font=font,
        fill=(255, 226, 113, 255),
        stroke_width=stroke,
        stroke_fill=(82, 43, 8, 255),
    )
    img.save(path)
    print(f"updated {path.relative_to(ROOT)}")


for logo_path in LOGO_PATHS:
    overlay_exact_title(logo_path)
