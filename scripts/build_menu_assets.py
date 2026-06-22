#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import json
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
CLIENT_PUBLIC = ROOT / "client" / "public"
BASE_MENU = CLIENT_PUBLIC / "ui" / "pixel-story-menu.png"

MENU_DIR = CLIENT_PUBLIC / "ui" / "menu" / "story"
ACTIVE_DIR = MENU_DIR / "active"
LOCKED_DIR = MENU_DIR / "locked"
SCENARIO_DIR = CLIENT_PUBLIC / "ui" / "scenarios"

ZONES = {
    "laboratory": (0.050, 0.178, 0.271, 0.308),
    "barn": (0.365, 0.178, 0.271, 0.308),
    "incubator": (0.680, 0.178, 0.271, 0.308),
    "collection": (0.050, 0.551, 0.271, 0.308),
    "arena": (0.365, 0.551, 0.271, 0.308),
    "settings": (0.680, 0.551, 0.271, 0.308),
    "home": (0.282, 0.907, 0.070, 0.068),
    "achievements": (0.390, 0.902, 0.220, 0.076),
    "friends": (0.650, 0.907, 0.070, 0.068),
}

SCREENS = ["barn", "laboratory", "incubator", "collection", "arena", "settings"]


def ensure_dirs() -> None:
    for directory in [MENU_DIR, ACTIVE_DIR, LOCKED_DIR, SCENARIO_DIR]:
        directory.mkdir(parents=True, exist_ok=True)
    for screen in SCREENS:
        (SCENARIO_DIR / screen).mkdir(parents=True, exist_ok=True)


def draw_zone_overlay(base: Image.Image, zone_key: str, fill: tuple[int, int, int, int], outline: tuple[int, int, int, int]) -> Image.Image:
    image = base.copy()
    draw = ImageDraw.Draw(image, "RGBA")
    x, y, w, h = ZONES[zone_key]
    left = int(x * image.width)
    top = int(y * image.height)
    right = int((x + w) * image.width)
    bottom = int((y + h) * image.height)
    radius = max(8, int(min(right - left, bottom - top) * 0.11))
    draw.rounded_rectangle([left, top, right, bottom], radius=radius, fill=fill, outline=outline, width=3)
    return image


def create_story_menu_assets() -> None:
    if not BASE_MENU.exists():
        raise FileNotFoundError(f"Base menu asset is missing: {BASE_MENU}")
    base = Image.open(BASE_MENU).convert("RGBA")

    # Frame states.
    base.save(MENU_DIR / "default.png")
    frame_two = base.copy()
    frame_two_overlay = Image.new("RGBA", frame_two.size, (255, 188, 72, 34))
    frame_two = Image.alpha_composite(frame_two, frame_two_overlay)
    frame_two.save(MENU_DIR / "frame-2.png")

    # Per-button active / locked.
    for zone_id in ZONES:
        active = draw_zone_overlay(base, zone_id, (255, 210, 112, 72), (255, 235, 170, 220))
        active.save(ACTIVE_DIR / f"{zone_id}.png")

        locked = draw_zone_overlay(base, zone_id, (26, 18, 12, 156), (186, 148, 96, 200))
        locked.save(LOCKED_DIR / f"{zone_id}.png")

    zone_manifest = {
        "baseWidth": base.width,
        "baseHeight": base.height,
        "zones": [
            {"id": zone_id, "x": values[0], "y": values[1], "w": values[2], "h": values[3]}
            for zone_id, values in ZONES.items()
        ],
    }
    (MENU_DIR / "menu-zones.json").write_text(json.dumps(zone_manifest, indent=2), encoding="utf-8")


def write_svg(path: Path, title: str, subtitle: str, glow: str) -> None:
    content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1b1008"/>
      <stop offset="100%" stop-color="#080503"/>
    </linearGradient>
    <radialGradient id="focus" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="{glow}" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="1536" height="1024" fill="url(#bg)"/>
  <rect x="0" y="0" width="1536" height="1024" fill="url(#focus)"/>
  <rect x="40" y="38" width="1456" height="948" rx="34" fill="none" stroke="#9f6b2b" stroke-width="14"/>
  <rect x="64" y="62" width="1408" height="900" rx="28" fill="none" stroke="#332014" stroke-width="8"/>
  <text x="96" y="136" fill="#ffd777" font-size="46" font-family="Inter, Arial, sans-serif" font-weight="700">{title}</text>
  <text x="96" y="184" fill="#f0d4a3" font-size="26" font-family="Inter, Arial, sans-serif">{subtitle}</text>
</svg>
"""
    path.write_text(content, encoding="utf-8")


def create_scenario_state_assets() -> None:
    palette = {
        "barn": "#f0b35e",
        "laboratory": "#7ac2ff",
        "incubator": "#ffd36f",
        "collection": "#f9d8ac",
        "arena": "#ff9f74",
        "settings": "#dbc58f",
    }
    for screen in SCREENS:
        directory = SCENARIO_DIR / screen
        write_svg(directory / "default.svg", f"{screen} scenario", "default state", palette[screen])
        write_svg(directory / "empty.svg", f"{screen} scenario", "empty state", "#8e7354")
        write_svg(directory / "success.svg", f"{screen} scenario", "success state", "#96de7f")


def main() -> None:
    ensure_dirs()
    create_story_menu_assets()
    create_scenario_state_assets()
    print("Menu and scenario assets generated.")


if __name__ == "__main__":
    main()
