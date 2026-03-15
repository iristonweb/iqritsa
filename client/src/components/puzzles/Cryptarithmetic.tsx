import { useState } from "react";
import GameButton from "../ui/GameButton";

interface CryptarithmeticProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function Cryptarithmetic({ puzzle, onAnswer, disabled }: CryptarithmeticProps) {
  const [answer, setAnswer] = useState("");

  const eq: string = puzzle?.question?.eq || "123 + 456 = ?";
  const desc: string = puzzle?.question?.desc || "Найдите числовое значение выражения";

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
        <div className="font-black font-mono text-2xl tracking-widest"
          style={{ color: '#ff6688', textShadow: '0 0 15px rgba(255,51,102,0.5)', letterSpacing: '0.2em' }}>
          {eq}
        </div>
      </div>

      {/* Description */}
      <div className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {desc}
      </div>

      {/* Answer input */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,51,102,0.5)' }}>
          ВВЕДИТЕ ЧИСЛОВОЙ ОТВЕТ
        </div>
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setAnswer(val);
          }}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && answer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="?"
          className="neo-input text-center text-2xl font-black font-mono rounded-sm"
          style={{ width: '160px', height: '60px', padding: '0 12px', color: '#ff3366', borderColor: 'rgba(255,51,102,0.3)' }}
          autoFocus
        />
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!answer.trim() || disabled} size="lg" variant="danger">
          ДЕШИФРОВАТЬ
        </GameButton>
      </div>
    </div>
  );
}
