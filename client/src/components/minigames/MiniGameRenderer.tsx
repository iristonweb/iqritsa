import MemoryShellGame from "./MemoryShellGame";
import KuroSokobanGame from "./KuroSokobanGame";
import BrokenPictureGame from "./BrokenPictureGame";
import LabWiresGame from "./LabWiresGame";
import PatternEggGame from "./PatternEggGame";
import type { MiniGameId } from "@/store/types";

interface MiniGameRendererProps {
  gameId: MiniGameId;
  difficulty: number;
  onComplete: (success: boolean) => void;
}

export default function MiniGameRenderer({ gameId, difficulty, onComplete }: MiniGameRendererProps) {
  if (gameId === "memory_shell") return <MemoryShellGame difficulty={difficulty} onComplete={onComplete} />;
  if (gameId === "kuro_sokoban") return <KuroSokobanGame difficulty={difficulty} onComplete={onComplete} />;
  if (gameId === "lab_wires") return <LabWiresGame difficulty={difficulty} onComplete={onComplete} />;
  if (gameId === "pattern_egg") return <PatternEggGame difficulty={difficulty} onComplete={onComplete} />;
  return <BrokenPictureGame difficulty={difficulty} onComplete={onComplete} />;
}
