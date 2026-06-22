#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "client" / "public"

REQUIRED = [
    "ui/menu/story/default.png",
    "ui/menu/story/frame-2.png",
    "ui/menu/story/menu-zones.json",
    "ui/menu/story/active/laboratory.png",
    "ui/menu/story/active/barn.png",
    "ui/menu/story/active/incubator.png",
    "ui/menu/story/active/collection.png",
    "ui/menu/story/active/arena.png",
    "ui/menu/story/active/settings.png",
    "ui/menu/story/active/home.png",
    "ui/menu/story/active/achievements.png",
    "ui/menu/story/active/friends.png",
    "ui/menu/story/locked/laboratory.png",
    "ui/menu/story/locked/barn.png",
    "ui/menu/story/locked/incubator.png",
    "ui/menu/story/locked/collection.png",
    "ui/menu/story/locked/arena.png",
    "ui/menu/story/locked/settings.png",
    "ui/menu/story/locked/home.png",
    "ui/menu/story/locked/achievements.png",
    "ui/menu/story/locked/friends.png",
    "ui/scenarios/barn/default.svg",
    "ui/scenarios/barn/empty.svg",
    "ui/scenarios/barn/success.svg",
    "ui/scenarios/laboratory/default.svg",
    "ui/scenarios/incubator/default.svg",
    "ui/scenarios/collection/default.svg",
    "ui/scenarios/arena/default.svg",
    "ui/scenarios/settings/default.svg",
]


def main() -> None:
    missing = []
    for relative in REQUIRED:
        absolute = PUBLIC_DIR / relative
        if not absolute.exists():
            missing.append(relative)
            continue
        if absolute.is_file() and absolute.stat().st_size == 0:
            missing.append(relative)
    if missing:
        print("Missing menu assets:")
        for item in missing:
            print(f"- {item}")
        raise SystemExit(1)
    print(f"Menu assets OK ({len(REQUIRED)} files checked).")


if __name__ == "__main__":
    main()
