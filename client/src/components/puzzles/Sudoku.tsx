import { useState } from "react";
import GameButton from "../ui/GameButton";

interface SudokuProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

// Mini 4x4 Sudoku for speed
const SUDOKU_PUZZLES = [
  {
    grid: [[1,0,3,4],[3,4,0,2],[2,3,4,1],[4,0,2,3]],
    solution: [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]],
    missing: [[1,2],[1,6],[3,1]],
    answer: "2",
    question: "Какое число должно стоять в позиции [2,2]?"
  },
  {
    grid: [[0,2,3,4],[3,4,1,0],[2,0,4,1],[4,1,2,3]],
    solution: [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]],
    missing: [[0,0],[1,3],[2,1]],
    answer: "1",
    question: "Какое число стоит в верхнем левом углу (строка 1, колонка 1)?"
  }
];

export default function Sudoku({ puzzle, onAnswer, disabled }: SudokuProps) {
  const [data] = useState(() => SUDOKU_PUZZLES[Math.floor(Math.random() * SUDOKU_PUZZLES.length)]);
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) onAnswer(answer.trim());
  };

  const getColor = (val: number) => {
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
        Каждое число 1-4 встречается ровно один раз в каждой строке, столбце и квадранте 2×2
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="p-3 rounded-sm"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(26,188,156,0.3)' }}>
          <div className="grid grid-cols-4 gap-0.5">
            {data.grid.map((row, ri) =>
              row.map((cell, ci) => {
                const isEmpty = cell === 0;
                const c = getColor(cell);
                // Bold border for 2x2 quadrants
                const borderRight = (ci === 1) ? '2px solid rgba(26,188,156,0.5)' : '1px solid rgba(255,255,255,0.06)';
                const borderBottom = (ri === 1) ? '2px solid rgba(26,188,156,0.5)' : '1px solid rgba(255,255,255,0.06)';

                return (
                  <div key={`${ri}-${ci}`}
                    className="flex items-center justify-center text-lg font-black font-mono"
                    style={{
                      width: '52px',
                      height: '52px',
                      background: isEmpty ? 'rgba(0,255,255,0.05)' : 'rgba(0,0,0,0.4)',
                      borderRight,
                      borderBottom,
                      color: isEmpty ? 'rgba(0,255,255,0.3)' : c,
                      textShadow: isEmpty ? 'none' : `0 0 6px ${c}`,
                      position: 'relative'
                    }}>
                    {isEmpty ? (
                      <span className="animate-neon-pulse" style={{ color: 'rgba(0,255,255,0.4)' }}>?</span>
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
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{data.question}</p>
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-4">
        <input
          type="number"
          min="1"
          max="4"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && answer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="1-4"
          className="neo-input text-center text-2xl font-black font-mono rounded-sm"
          style={{ width: '100px', height: '60px', padding: '0', color: '#1abc9c' }}
        />
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(n => (
            <button key={n}
              onClick={() => !disabled && setAnswer(String(n))}
              className="w-10 h-10 font-bold font-mono text-sm rounded-sm transition-all"
              style={{
                background: answer === String(n) ? 'rgba(26,188,156,0.2)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${answer === String(n) ? '#1abc9c' : 'rgba(255,255,255,0.1)'}`,
                color: answer === String(n) ? '#1abc9c' : 'rgba(255,255,255,0.4)',
                boxShadow: answer === String(n) ? '0 0 8px rgba(26,188,156,0.3)' : 'none'
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
