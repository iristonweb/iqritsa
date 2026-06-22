import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function run() {
  const root = process.cwd();
  const menuRoot = join(root, "client", "public", "ui", "menu", "story");
  const scenarioRoot = join(root, "client", "public", "ui", "scenarios");

  const zoneManifest = JSON.parse(readFileSync(join(menuRoot, "menu-zones.json"), "utf-8")) as {
    baseWidth: number;
    baseHeight: number;
    zones: Array<{ id: string; x: number; y: number; w: number; h: number }>;
  };
  assert(zoneManifest.baseWidth === 1024 && zoneManifest.baseHeight === 682, "Unexpected menu base size");
  const requiredIds = ["laboratory", "barn", "incubator", "collection", "arena", "settings", "home", "achievements", "friends"];
  for (const id of requiredIds) {
    assert(zoneManifest.zones.some((z) => z.id === id), `Menu zone missing in manifest: ${id}`);
    assert(statSync(join(menuRoot, "active", `${id}.png`)).size > 0, `Missing active art for ${id}`);
    assert(statSync(join(menuRoot, "locked", `${id}.png`)).size > 0, `Missing locked art for ${id}`);
  }

  const screens = ["barn", "laboratory", "incubator", "collection", "arena", "settings"];
  for (const screen of screens) {
    for (const state of ["default", "empty", "success"]) {
      assert(
        statSync(join(scenarioRoot, screen, `${state}.svg`)).size > 0,
        `Missing scenario state asset: ${screen}/${state}.svg`
      );
    }
  }

  console.log("[scenario-smoke] Menu zones and per-button/per-screen assets are complete.");
}

run();
