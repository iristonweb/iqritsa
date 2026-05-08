import { useState } from "react";
import type { MiniGameProps } from "./types";

const initial = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const target = "1,2,3,4,5,6,7,8,0";

export default function BrokenPictureGame({ onComplete }: MiniGameProps) {
  const [tiles, setTiles] = useState(() => [...initial].sort(() => Math.random() - 0.5));

  const swapWithZero = (idx: number) => {
    const zeroIdx = tiles.indexOf(0);
    const neighbors = [zeroIdx - 1, zeroIdx + 1, zeroIdx - 3, zeroIdx + 3];
    if (!neighbors.includes(idx)) return;
    const next = [...tiles];
    [next[zeroIdx], next[idx]] = [next[idx], next[zeroIdx]];
    setTiles(next);
    if (next.join(",") === target) onComplete(true);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Собери картинку, двигая фрагменты.</p>
      <div className="grid grid-cols-3 gap-1 w-[150px]">
        {tiles.map((n, idx) => (
          <button key={idx} className="iq-task-card h-12 flex items-center justify-center" onClick={() => swapWithZero(idx)}>
            {n === 0 ? "" : n}
          </button>
        ))}
      </div>
    </div>
  );
}
