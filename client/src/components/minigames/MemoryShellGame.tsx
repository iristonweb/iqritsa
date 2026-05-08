import { useMemo, useState } from "react";
import type { MiniGameProps } from "./types";

export default function MemoryShellGame({ difficulty, onComplete }: MiniGameProps) {
  const symbols = useMemo(() => {
    const base = ["🐔", "🥚", "🧠", "🌾", "⚗️", "🧪", "🪺", "🔬"];
    const pairs = Math.min(6, Math.max(3, difficulty + 2));
    return [...base.slice(0, pairs), ...base.slice(0, pairs)].sort(() => Math.random() - 0.5);
  }, [difficulty]);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [tries, setTries] = useState(0);

  const onOpen = (idx: number) => {
    if (opened.includes(idx) || matched.includes(idx)) return;
    const next = [...opened, idx];
    if (next.length < 2) {
      setOpened(next);
      return;
    }
    setTries((t) => t + 1);
    const [a, b] = next;
    if (symbols[a] === symbols[b]) {
      const nextMatched = [...matched, a, b];
      setMatched(nextMatched);
      setOpened([]);
      if (nextMatched.length === symbols.length) {
        onComplete(tries + 1 <= symbols.length);
      }
      return;
    }
    setTimeout(() => setOpened([]), 350);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Найди пары символов на скорлупе.</p>
      <div className="grid grid-cols-4 gap-2">
        {symbols.map((symbol, idx) => {
          const visible = opened.includes(idx) || matched.includes(idx);
          return (
            <button key={idx} className="iq-filter-btn text-xl h-12" onClick={() => onOpen(idx)}>
              {visible ? symbol : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
