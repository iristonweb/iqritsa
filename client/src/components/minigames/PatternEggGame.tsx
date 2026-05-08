import { useMemo, useState } from "react";
import type { MiniGameProps } from "./types";

export default function PatternEggGame({ onComplete }: MiniGameProps) {
  const [answer, setAnswer] = useState<number | null>(null);
  const question = useMemo(() => ({ seq: [2, 4, 8, 16], options: [18, 24, 32, 20], correct: 32 }), []);

  const choose = (option: number) => {
    setAnswer(option);
    onComplete(option === question.correct);
  };

  return (
    <div>
      <p className="mb-2 text-sm">Продолжи закономерность: {question.seq.join(" , ")} , ?</p>
      <div className="flex gap-2 flex-wrap">
        {question.options.map((option) => (
          <button key={option} className={`iq-filter-btn ${answer === option ? "ring-2 ring-[#f2bb2f]" : ""}`} onClick={() => choose(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
