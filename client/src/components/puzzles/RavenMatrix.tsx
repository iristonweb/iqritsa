import { useState } from "react";
import GameButton from "../ui/GameButton";

interface RavenMatrixProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function RavenMatrix({ puzzle, onAnswer, disabled }: RavenMatrixProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const matrix: string[][] = puzzle?.question?.matrix || [['○','□','△'],['□','△','○'],['△','○','?']];
  const options: string[] = puzzle?.question?.options || ['□','○','△','◇'];
  const label: string = puzzle?.question?.label || "Определите паттерн";

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#ffd700', boxShadow: '0 0 6px #ffd700' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#ffd700' }}>МАТРИЦА РАВЕНА</span>
      </div>

      <div className="text-xs text-center tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {label.toUpperCase()} — выберите элемент вместо «?»
      </div>

      {/* 3x3 Matrix */}
      <div className="flex justify-center">
        <div className="p-4 rounded-sm" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 68px)', gap: 6 }}>
            {matrix.flat().map((cell, i) => {
              const isQuestion = cell === '?';
              return (
                <div key={i}
                  style={{
                    width: 68, height: 68, borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontFamily: 'monospace',
                    background: isQuestion ? 'rgba(0,255,255,0.08)' : 'rgba(0,0,0,0.4)',
                    border: `1px solid ${isQuestion ? '#00ffff' : 'rgba(255,215,0,0.2)'}`,
                    boxShadow: isQuestion ? '0 0 12px rgba(0,255,255,0.3)' : 'none',
                    color: isQuestion ? '#00ffff' : 'rgba(200,220,255,0.8)',
                  }}>
                  {isQuestion ? (
                    <span className="animate-neon-pulse" style={{ textShadow: '0 0 10px #00ffff' }}>?</span>
                  ) : cell}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="text-xs text-center tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        ВАРИАНТЫ ОТВЕТОВ
      </div>
      <div className="flex justify-center gap-3 flex-wrap">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button key={i}
              onClick={() => !disabled && setSelected(i)}
              disabled={disabled}
              style={{
                width: 68, height: 68, borderRadius: 4, position: 'relative',
                background: isSelected ? 'rgba(255,215,0,0.12)' : 'rgba(0,0,0,0.4)',
                border: `2px solid ${isSelected ? '#ffd700' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: isSelected ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: 26, fontFamily: 'monospace',
                color: isSelected ? '#ffd700' : 'rgba(200,220,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
              <span style={{
                position: 'absolute', top: 2, left: 4, fontSize: 9, fontWeight: 'bold',
                color: isSelected ? '#ffd700' : 'rgba(255,255,255,0.2)'
              }}>{labels[i]}</span>
              {opt}
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
