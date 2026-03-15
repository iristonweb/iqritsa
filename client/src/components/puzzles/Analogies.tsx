import { useState } from "react";
import GameButton from "../ui/GameButton";

interface AnalogiesProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function Analogies({ puzzle, onAnswer, disabled }: AnalogiesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const questionText: string = puzzle?.question?.text || "Выберите правильный ответ:";
  const options: string[] = puzzle?.question?.options || ["A","B","C","D"];
  const labels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (selectedIndex !== null) onAnswer(selectedIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#9b59b6', boxShadow: '0 0 6px #9b59b6' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#9b59b6' }}>АНАЛОГИИ</span>
      </div>

      {/* Question */}
      <div className="p-5 rounded-sm"
        style={{
          background: 'rgba(155,89,182,0.06)',
          border: '1px solid rgba(155,89,182,0.3)',
          boxShadow: '0 0 15px rgba(155,89,182,0.1)'
        }}>
        <div className="text-base font-medium text-center" style={{ color: '#e0e8ff', lineHeight: 1.6 }}>
          {questionText}
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button key={i}
              onClick={() => !disabled && setSelectedIndex(i)}
              disabled={disabled}
              className="p-4 rounded-sm text-left transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(155,89,182,0.2)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${isSelected ? '#9b59b6' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: isSelected ? '0 0 15px rgba(155,89,182,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: isSelected ? '#c084fc' : 'rgba(255,255,255,0.5)',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: isSelected ? '#9b59b6' : 'rgba(255,255,255,0.06)',
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${isSelected ? '#9b59b6' : 'rgba(255,255,255,0.1)'}`,
                  }}>
                  {labels[i]}
                </div>
                <span className="text-sm">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={selectedIndex === null || disabled} size="lg" variant="secondary">
          ПОДТВЕРДИТЬ ОТВЕТ
        </GameButton>
      </div>
    </div>
  );
}
