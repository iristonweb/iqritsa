from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def require_file(path: Path, errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing file: {path}")


def require_dimensions(path: Path, expected: tuple[int, int], errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing file: {path}")
        return
    with Image.open(path) as img:
        if img.size != expected:
            errors.append(f"Wrong size for {path}: got {img.size}, expected {expected}")


def require_dimensions_at_least(path: Path, expected_min: tuple[int, int], errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing file: {path}")
        return
    with Image.open(path) as img:
        if img.size[0] < expected_min[0] or img.size[1] < expected_min[1]:
            errors.append(f"Too small {path}: got {img.size}, expected at least {expected_min}")


def require_png(path: Path, errors: list[str]) -> None:
    if not path.exists():
        errors.append(f"Missing file: {path}")
        return
    with Image.open(path) as img:
        if img.format != "PNG":
            errors.append(f"Wrong format for {path}: got {img.format}, expected PNG")


def check_manifest(errors: list[str]) -> None:
    manifest_path = ROOT / "client/public/manifest.webmanifest"
    require_file(manifest_path, errors)
    if not manifest_path.exists():
        return

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    icons = manifest.get("icons", [])
    expected_srcs = {"/icons/icon-192.png", "/icons/icon-512.png"}
    got_srcs = {item.get("src") for item in icons}
    if not expected_srcs.issubset(got_srcs):
        errors.append(f"Manifest icons mismatch: expected at least {sorted(expected_srcs)}, got {sorted(got_srcs)}")


def check_mobile_app_json(errors: list[str]) -> None:
    app_json_path = ROOT / "mobile/app.json"
    require_file(app_json_path, errors)
    if not app_json_path.exists():
        return

    app_json = json.loads(app_json_path.read_text(encoding="utf-8"))
    expo = app_json.get("expo", {})
    if expo.get("icon") != "./assets/icon-1024.png":
        errors.append("mobile/app.json expo.icon must be './assets/icon-1024.png'")
    if expo.get("splash", {}).get("image") != "./assets/splash.png":
        errors.append("mobile/app.json expo.splash.image must be './assets/splash.png'")
    if expo.get("android", {}).get("adaptiveIcon", {}).get("foregroundImage") != "./assets/adaptive-icon.png":
        errors.append("mobile/app.json android.adaptiveIcon.foregroundImage must be './assets/adaptive-icon.png'")


def check_variants(base: Path, names: Iterable[str], relative_files: Iterable[str], errors: list[str]) -> None:
    for name in names:
        for rel in relative_files:
            require_file(base / name / rel, errors)


def main() -> int:
    errors: list[str] = []

    # Active assets
    require_dimensions(ROOT / "mobile/assets/icon-1024.png", (1024, 1024), errors)
    require_dimensions_at_least(ROOT / "mobile/assets/adaptive-icon.png", (1024, 1024), errors)
    require_dimensions(ROOT / "mobile/assets/splash.png", (2048, 2048), errors)
    require_dimensions(ROOT / "client/public/icons/icon-192.png", (192, 192), errors)
    require_dimensions(ROOT / "client/public/icons/icon-512.png", (512, 512), errors)
    require_dimensions(ROOT / "client/public/favicon.png", (64, 64), errors)
    require_dimensions(ROOT / "client/public/brand/og-chicken-brand.png", (1200, 630), errors)
    require_dimensions_at_least(ROOT / "client/public/brand/iqritsa-logo.png", (860, 220), errors)

    png_paths = [
        ROOT / "mobile/assets/icon-1024.png",
        ROOT / "mobile/assets/adaptive-icon.png",
        ROOT / "mobile/assets/splash.png",
        ROOT / "client/public/icons/icon-192.png",
        ROOT / "client/public/icons/icon-512.png",
        ROOT / "client/public/favicon.png",
        ROOT / "client/public/brand/og-chicken-brand.png",
        ROOT / "client/public/brand/iqritsa-logo.png",
    ]
    for path in png_paths:
        require_png(path, errors)

    # Config references
    check_manifest(errors)
    check_mobile_app_json(errors)

    # Variant packs
    variants = ("classic_dark", "neon_glow", "warm_gold")
    check_variants(
        ROOT / "mobile/assets/variants",
        variants,
        ("icon-1024.png", "adaptive-icon.png", "splash.png"),
        errors,
    )
    check_variants(
        ROOT / "client/public/icons/variants",
        variants,
        ("icon-192.png", "icon-512.png"),
        errors,
    )
    check_variants(
        ROOT / "client/public/brand/variants",
        variants,
        ("iqritsa-logo.png", "og-chicken-brand.png"),
        errors,
    )

    if errors:
        print("Brand asset validation failed:")
        for issue in errors:
            print(f"- {issue}")
        return 1

    print("Brand asset validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
