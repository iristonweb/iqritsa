import { useState } from "react";
import type { MiniGameProps } from "./types";

export default function LabWiresGame({ onComplete }: MiniGameProps) {
  const [state, setState] = useState([false, false, false]);
  const target = [true, false, true];

  const toggle = (idx: number) => {
    const next = [...state];
    next[idx] = !next[idx];
    if (idx > 0) next[idx - 1] = !next[idx - 1];
    if (idx < 2) next[idx + 1] = !next[idx + 1];
    setState(next);
    if (next.join(",") === target.join(",")) onComplete(true);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Включи схему в правильной конфигурации.</p>
      <div className="flex gap-2">
        {state.map((on, idx) => (
          <button key={idx} className="iq-filter-btn h-12 w-12" onClick={() => toggle(idx)}>
            {on ? "💡" : "⚫"}
          </button>
        ))}
      </div>
    </div>
  );
}
