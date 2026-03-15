import { useState } from "react";
import GameButton from "../ui/GameButton";

interface SudokuProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function Sudoku({ puzzle, onAnswer, disabled }: SudokuProps) {
  const [answer, setAnswer] = useState("");

  const grid: number[][] = puzzle?.question?.grid || [[1,0,3,4],[3,4,0,2],[0,1,4,3],[4,3,2,0]];
  const targetRow: number = puzzle?.question?.targetRow ?? 0;
  const targetCol: number = puzzle?.question?.targetCol ?? 1;
  const question: string = puzzle?.question?.question || "Найдите пропущенное число";

  const handleSubmit = () => {
    if (answer.trim()) onAnswer(answer.trim());
  };

  const getColor = (val: number) => {
    if (val === 0) return 'rgba(0,255,255,0.3)';
    const colors = ['', '#00ffff', '#8b5cf6', '#00ff88', '#ff9900'];
    return colors[val] || '#00ffff';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#1abc9c', boxShadow: '0 0 6px #1abc9c' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#1abc9c' }}>МИНИ-СУДОКУ 4×4</span>
      </div>

      <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Каждое число 1–4 встречается ровно один раз в каждой строке, столбце и квадранте 2×2
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="p-3 rounded-sm"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(26,188,156,0.3)' }}>
          <div className="grid grid-cols-4 gap-0.5">
            {grid.map((row, ri) =>
              row.map((cell, ci) => {
                const isEmpty = cell === 0;
                const isTarget = ri === targetRow && ci === targetCol;
                const c = getColor(cell);
                const borderRight = ci === 1 ? '2px solid rgba(26,188,156,0.5)' : '1px solid rgba(255,255,255,0.06)';
                const borderBottom = ri === 1 ? '2px solid rgba(26,188,156,0.5)' : '1px solid rgba(255,255,255,0.06)';

                return (
                  <div key={`${ri}-${ci}`}
                    className="flex items-center justify-center text-lg font-black font-mono"
                    style={{
                      width: 52, height: 52,
                      background: isTarget
                        ? 'rgba(26,188,156,0.15)'
                        : isEmpty ? 'rgba(0,255,255,0.03)' : 'rgba(0,0,0,0.4)',
                      borderRight, borderBottom,
                      color: isEmpty ? 'rgba(0,255,255,0.3)' : c,
                      textShadow: isEmpty ? 'none' : `0 0 6px ${c}`,
                      boxShadow: isTarget ? '0 0 10px rgba(26,188,156,0.4) inset' : 'none',
                    }}>
                    {isEmpty ? (
                      <span className="animate-neon-pulse"
                        style={{ color: isTarget ? '#1abc9c' : 'rgba(0,255,255,0.4)', fontSize: 22 }}>
                        ?
                      </span>
                    ) : cell}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-3 rounded-sm text-center"
        style={{ background: 'rgba(26,188,156,0.06)', border: '1px solid rgba(26,188,156,0.2)' }}>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{question}</p>
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(n => (
            <button key={n}
              onClick={() => !disabled && setAnswer(String(n))}
              className="w-12 h-12 font-bold font-mono text-lg rounded-sm transition-all"
              style={{
                background: answer === String(n) ? 'rgba(26,188,156,0.2)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${answer === String(n) ? '#1abc9c' : 'rgba(255,255,255,0.1)'}`,
                color: answer === String(n) ? '#1abc9c' : 'rgba(255,255,255,0.4)',
                boxShadow: answer === String(n) ? '0 0 8px rgba(26,188,156,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!answer.trim() || disabled} size="lg">
          ПОДТВЕРДИТЬ
        </GameButton>
      </div>
    </div>
  );
}
