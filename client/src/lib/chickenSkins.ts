export interface SkinDefinition {
  id: string;
  title: string;
  minCombinedProgress: number;
  brainScale: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  accent: string;
}

export const CHICKEN_SKINS: SkinDefinition[] = [
  { id: "base-hen", title: "Базовая несушка", minCombinedProgress: 0, brainScale: 1.0, rarity: "common", accent: "#ffd700" },
  { id: "spark-hen", title: "Искровая несушка", minCombinedProgress: 80, brainScale: 1.08, rarity: "common", accent: "#7dd3fc" },
  { id: "logic-hen", title: "Логическая курица", minCombinedProgress: 160, brainScale: 1.16, rarity: "rare", accent: "#60a5fa" },
  { id: "lab-hen", title: "Лабораторная курица", minCombinedProgress: 260, brainScale: 1.24, rarity: "rare", accent: "#a78bfa" },
  { id: "prof-hen", title: "Профессор Клепа", minCombinedProgress: 380, brainScale: 1.34, rarity: "epic", accent: "#34d399" },
  { id: "quantum-hen", title: "Квантовая Клепа", minCombinedProgress: 520, brainScale: 1.44, rarity: "epic", accent: "#fb7185" },
  { id: "cosmo-hen", title: "Космо-Клепа", minCombinedProgress: 700, brainScale: 1.56, rarity: "legendary", accent: "#22d3ee" },
  { id: "omega-hen", title: "Омега Клепа", minCombinedProgress: 900, brainScale: 1.7, rarity: "legendary", accent: "#f472b6" },
];

export const MAX_COMBINED_PROGRESS = 1000;

export function computeCombinedProgress(stage: number, playerLevel: number, playerXp: number): number {
  const stageScore = Math.max(0, Math.min(7, stage)) * 90;
  const levelScore = Math.max(1, playerLevel) * 35;
  const xpScore = Math.floor(Math.max(0, playerXp) * 0.35);
  return Math.min(MAX_COMBINED_PROGRESS, stageScore + levelScore + xpScore);
}

export function getUnlockedSkinIds(combinedProgress: number): string[] {
  return CHICKEN_SKINS.filter((skin) => combinedProgress >= skin.minCombinedProgress).map((skin) => skin.id);
}

export function getBestSkinId(combinedProgress: number): string {
  const unlocked = CHICKEN_SKINS.filter((skin) => combinedProgress >= skin.minCombinedProgress);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1].id : CHICKEN_SKINS[0].id;
}

export function getBrainGrowthTier(combinedProgress: number): number {
  const tier = Math.floor((Math.max(0, combinedProgress) / MAX_COMBINED_PROGRESS) * 7);
  return Math.max(0, Math.min(7, tier));
}

export function getSkinById(id: string): SkinDefinition {
  return CHICKEN_SKINS.find((skin) => skin.id === id) ?? CHICKEN_SKINS[0];
}
