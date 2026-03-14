import { useState } from "react";
import GameButton from "../ui/GameButton";

interface CryptarithmeticProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const PUZZLES = [
  { eq: "КУР + НА = ЯЙЦО", desc: "Каждая буква — цифра от 0 до 9. Найдите значение буквы К.", ans: "1", clue: "К=1, У=0, Р=9, Н=1, А=0" },
  { eq: "SEND + MORE = MONEY", desc: "Классическая задача. Чему равна М?", ans: "1", clue: "Это классическая задача криптарифметики. M=1" },
  { eq: "AB + BA = CBC", desc: "Найдите значение C.", ans: "1", clue: "A+B<10 даёт перенос, поэтому C=1" },
  { eq: "TWO + TWO = FOUR", desc: "Если T=2, W=3, O=8, чему равна F?", ans: "4", clue: "238+238=476, F=4" },
];

export default function Cryptarithmetic({ puzzle, onAnswer, disabled }: CryptarithmeticProps) {
  const [answer, setAnswer] = useState("");
  const [showClue, setShowClue] = useState(false);
  const [data] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);

  const handleSubmit = () => {
    if (answer.trim()) onAnswer(answer.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#ff3366', boxShadow: '0 0 6px #ff3366' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#ff3366' }}>КРИПТАРИФМЕТИКА</span>
      </div>

      {/* Equation display */}
      <div className="p-6 rounded-sm text-center"
        style={{
          background: 'rgba(255,51,102,0.05)',
          border: '1px solid rgba(255,51,102,0.3)',
          boxShadow: '0 0 20px rgba(255,51,102,0.1)'
        }}>
        <div className="font-black font-mono text-3xl tracking-widest"
          style={{ color: '#ff6688', textShadow: '0 0 15px rgba(255,51,102,0.5)', letterSpacing: '0.2em' }}>
          {data.eq}
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {data.desc}
      </div>

      {/* Help */}
      <div className="p-3 rounded-sm"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Правило: каждая буква представляет уникальную цифру (0–9). Одинаковые буквы — одинаковые цифры.
        </p>
      </div>

      {/* Answer input */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,51,102,0.5)' }}>
          ВВЕДИТЕ ЦИФРУ
        </div>
        <input
          type="number"
          min="0"
          max="9"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && answer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="0-9"
          className="neo-input text-center text-2xl font-black font-mono rounded-sm"
          style={{ width: '100px', height: '60px', padding: '0', color: '#ff3366', borderColor: 'rgba(255,51,102,0.3)' }}
        />
        {/* Digit keypad */}
        <div className="grid grid-cols-5 gap-1.5">
          {[0,1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n}
              onClick={() => !disabled && setAnswer(String(n))}
              className="w-9 h-9 font-bold font-mono text-sm rounded-sm transition-all"
              style={{
                background: answer === String(n) ? 'rgba(255,51,102,0.2)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${answer === String(n) ? '#ff3366' : 'rgba(255,255,255,0.1)'}`,
                color: answer === String(n) ? '#ff3366' : 'rgba(255,255,255,0.4)',
                boxShadow: answer === String(n) ? '0 0 8px rgba(255,51,102,0.3)' : 'none'
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!answer.trim() || disabled} size="lg" variant="danger">
          ДЕШИФРОВАТЬ
        </GameButton>
      </div>
    </div>
  );
}
