import { useState } from "react";
import GameButton from "../ui/GameButton";

interface ProbabilityProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function Probability({ puzzle, onAnswer, disabled }: ProbabilityProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const questionText: string = puzzle?.question?.text || "Выберите правильный ответ:";
  const options: string[] = puzzle?.question?.options || ["0.25","0.5","0.75","1.0"];
  const labels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  // Visual bar for currently selected
  const probBar = selected !== null ? (() => {
    const s = options[selected];
    if (s.includes('/')) {
      const [a, b] = s.split('/').map(Number);
      return b ? a / b : 0;
    }
    return parseFloat(s) || 0;
  })() : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#ffd700', boxShadow: '0 0 6px #ffd700' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#ffd700' }}>ТЕОРИЯ ВЕРОЯТНОСТИ</span>
      </div>

      {/* Probability bar */}
      <div className="flex items-center gap-3">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)' }}>0%</div>
        <div className="flex-1 h-3 rounded-sm relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <div className="h-full rounded-sm transition-all duration-500"
            style={{
              width: `${Math.min(1, probBar) * 100}%`,
              background: 'linear-gradient(90deg, #ffd700aa, #ffd700)',
              boxShadow: '0 0 8px rgba(255,215,0,0.5)'
            }}/>
        </div>
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)' }}>100%</div>
      </div>

      {/* Question */}
      <div className="p-5 rounded-sm"
        style={{
          background: 'rgba(255,215,0,0.04)',
          border: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 15px rgba(255,215,0,0.06)'
        }}>
        <div className="text-sm text-center" style={{ color: '#e0e8ff', lineHeight: 1.7 }}>
          {questionText}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i}
              onClick={() => !disabled && setSelected(i)}
              disabled={disabled}
              className="p-4 rounded-sm text-center transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.4)',
                border: `2px solid ${isSelected ? '#ffd700' : 'rgba(255,255,255,0.08)'}`,
                color: isSelected ? '#ffd700' : 'rgba(255,255,255,0.5)',
                boxShadow: isSelected ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              <div className="text-xs mb-1" style={{ color: isSelected ? '#ffd70088' : 'rgba(255,255,255,0.2)' }}>
                {labels[i]}
              </div>
              <div className="text-xl font-black font-mono">{opt}</div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={selected === null || disabled} size="lg">
          ПОДТВЕРДИТЬ
        </GameButton>
      </div>
    </div>
  );
}
