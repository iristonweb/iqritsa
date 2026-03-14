import { useState } from "react";
import GameButton from "../ui/GameButton";

interface LogicSequenceProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const SEQUENCES = [
  { seq: [2, 4, 8, 16, "?"], ans: "32", hint: "Каждое число удваивается", label: "ГЕОМЕТРИЧЕСКИЙ РЯД" },
  { seq: [1, 1, 2, 3, 5, 8, "?"], ans: "13", hint: "Числа Фибоначчи", label: "РЯД ФИБОНАЧЧИ" },
  { seq: [3, 6, 12, 24, "?"], ans: "48", hint: "Умножение на 2", label: "ПРОГРЕССИЯ ×2" },
  { seq: [100, 81, 64, 49, "?"], ans: "36", hint: "Убывающие квадраты", label: "КВАДРАТЫ ЧИСЕЛ" },
  { seq: [1, 4, 9, 16, 25, "?"], ans: "36", hint: "Полные квадраты", label: "КВАДРАТНЫЙ РЯД" },
  { seq: [5, 10, 20, 40, "?"], ans: "80", hint: "Каждое следующее вдвое больше", label: "СТЕПЕНИ ДВОЙКИ" },
  { seq: [1, 3, 7, 15, "?"], ans: "31", hint: "Удвоить и прибавить 1", label: "×2 + 1" },
];

export default function LogicSequence({ puzzle, onAnswer, disabled }: LogicSequenceProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [data] = useState(() => SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)]);

  const handleSubmit = () => {
    if (userAnswer.trim()) onAnswer(userAnswer.trim());
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !disabled) handleSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#4a9eff', boxShadow: '0 0 6px #4a9eff' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#4a9eff' }}>{data.label}</span>
      </div>

      {/* Sequence display */}
      <div className="p-5 rounded-sm text-center"
        style={{
          background: 'rgba(74,158,255,0.05)',
          border: '1px solid rgba(74,158,255,0.25)',
          boxShadow: '0 0 20px rgba(74,158,255,0.08)'
        }}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {data.seq.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`rounded-sm px-4 py-3 text-xl font-black font-mono text-center min-w-[60px] transition-all duration-200`}
                style={{
                  background: item === '?' ? 'rgba(0,255,255,0.1)' : 'rgba(74,158,255,0.1)',
                  border: `1px solid ${item === '?' ? '#00ffff' : 'rgba(74,158,255,0.4)'}`,
                  color: item === '?' ? '#00ffff' : '#4a9eff',
                  boxShadow: item === '?' ? '0 0 15px rgba(0,255,255,0.3)' : '0 0 8px rgba(74,158,255,0.2)',
                  animation: item === '?' ? 'neon-pulse 1.5s ease-in-out infinite' : 'none'
                }}>
                {item === '?' ? '?' : item}
              </div>
              {i < data.seq.length - 1 && (
                <div className="text-sm" style={{ color: 'rgba(74,158,255,0.3)' }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.5)' }}>
          ВВЕДИТЕ СЛЕДУЮЩИЙ ЭЛЕМЕНТ РЯДА
        </div>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="?"
          className="neo-input text-center text-2xl font-black font-mono rounded-sm"
          style={{
            width: '120px',
            height: '60px',
            padding: '0',
            fontSize: '24px'
          }}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!userAnswer.trim() || disabled} size="lg">
          ВЫЧИСЛИТЬ
        </GameButton>
      </div>
    </div>
  );
}
