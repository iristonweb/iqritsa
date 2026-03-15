import { useState } from "react";
import GameButton from "../ui/GameButton";

interface SpatialThinkingProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function SpatialThinking({ puzzle, onAnswer, disabled }: SpatialThinkingProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const desc: string = puzzle?.question?.desc || "Выберите правильный ответ:";
  const options: string[] = puzzle?.question?.options || ["A","B","C","D"];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#00d4ff' }}>ПРОСТРАНСТВЕННОЕ МЫШЛЕНИЕ</span>
      </div>

      {/* Question */}
      <div className="p-5 rounded-sm"
        style={{
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.25)',
          boxShadow: '0 0 15px rgba(0,212,255,0.08)'
        }}>
        <div className="text-base text-center font-medium" style={{ color: '#e0e8ff', lineHeight: 1.7 }}>
          {desc}
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
              className="p-4 rounded-sm font-bold font-mono text-center transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(0,212,255,0.12)' : 'rgba(0,0,0,0.4)',
                border: `2px solid ${isSelected ? '#00d4ff' : 'rgba(255,255,255,0.08)'}`,
                color: isSelected ? '#00d4ff' : 'rgba(255,255,255,0.5)',
                boxShadow: isSelected ? '0 0 15px rgba(0,212,255,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              <div className="text-xs mb-1" style={{ color: isSelected ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.2)' }}>
                {labels[i]}
              </div>
              <div className="text-xl">{opt}</div>
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
