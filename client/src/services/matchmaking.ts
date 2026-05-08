export interface DuelCandidate {
  id: string;
  mmr: number;
  league: string;
}

export const pickBalancedOpponent = (selfMmr: number, pool: DuelCandidate[]): DuelCandidate | null => {
  const sorted = [...pool].sort((a, b) => Math.abs(a.mmr - selfMmr) - Math.abs(b.mmr - selfMmr));
  return sorted[0] ?? null;
};
