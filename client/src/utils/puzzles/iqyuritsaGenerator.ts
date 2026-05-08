import { generatePuzzle } from "@/lib/puzzleGenerator";

export type LabRoom = "logic" | "memory" | "spatial" | "chaos" | "duel";

const roomMap: Record<LabRoom, string[]> = {
  logic: ["logic_sequence", "raven_matrix"],
  memory: ["analogies", "verbal_reasoning"],
  spatial: ["spatial_thinking", "sudoku"],
  chaos: ["probability", "math_problem", "cryptarithmetic"],
  duel: ["logic_sequence", "raven_matrix"],
};

export const buildRoomPuzzle = (room: LabRoom, playerLevel: number) => {
  const pool = roomMap[room];
  const pickedType = pool[Math.floor(Math.random() * pool.length)];
  return generatePuzzle(pickedType, Math.max(0, playerLevel - 1));
};
