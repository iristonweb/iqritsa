import { useMemo, useState } from "react";
import type { MiniGameProps } from "./types";

export default function KuroSokobanGame({ onComplete }: MiniGameProps) {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [box, setBox] = useState({ x: 1, y: 1 });
  const goal = useMemo(() => ({ x: 2, y: 2 }), []);

  const move = (dx: number, dy: number) => {
    const nextPlayer = { x: Math.max(0, Math.min(2, player.x + dx)), y: Math.max(0, Math.min(2, player.y + dy)) };
    if (nextPlayer.x === box.x && nextPlayer.y === box.y) {
      const nextBox = { x: Math.max(0, Math.min(2, box.x + dx)), y: Math.max(0, Math.min(2, box.y + dy)) };
      setBox(nextBox);
      if (nextBox.x === goal.x && nextBox.y === goal.y) onComplete(true);
    }
    setPlayer(nextPlayer);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Дотолкай зерно до курицы.</p>
      <div className="grid grid-cols-3 gap-1 w-[150px]">
        {Array.from({ length: 9 }).map((_, idx) => {
          const x = idx % 3;
          const y = Math.floor(idx / 3);
          const cell = x === player.x && y === player.y ? "🐔" : x === box.x && y === box.y ? "🌾" : x === goal.x && y === goal.y ? "🎯" : "·";
          return <div key={idx} className="iq-task-card h-10 flex items-center justify-center">{cell}</div>;
        })}
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        <button className="iq-filter-btn" onClick={() => move(0, -1)}>↑</button>
        <button className="iq-filter-btn" onClick={() => move(-1, 0)}>←</button>
        <button className="iq-filter-btn" onClick={() => move(1, 0)}>→</button>
        <button className="iq-filter-btn" onClick={() => move(0, 1)}>↓</button>
      </div>
    </div>
  );
}
