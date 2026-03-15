import { useState } from "react";
import GameButton from "../ui/GameButton";

interface MathProblemProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function MathProblem({ puzzle, onAnswer, disabled }: MathProblemProps) {
  const [answer, setAnswer] = useState("");

  const questionText: string = puzzle?.question?.text || "Решите задачу:";

  const handleSubmit = () => {
    if (answer.trim()) onAnswer(answer.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#00ff88' }}>МАТЕМАТИКА</span>
      </div>

      <div className="p-6 rounded-sm"
        style={{
          background: 'rgba(0,255,136,0.04)',
          border: '1px solid rgba(0,255,136,0.25)',
          boxShadow: '0 0 20px rgba(0,255,136,0.06)'
        }}>
        <div className="text-base font-medium text-center" style={{ color: '#e0e8ff', lineHeight: 1.8 }}>
          {questionText}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(0,255,136,0.5)' }}>
          ВВЕДИТЕ ЧИСЛОВОЙ ОТВЕТ
        </div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && answer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="0"
          className="neo-input text-center rounded-sm font-mono font-black text-2xl"
          style={{
            width: '160px', height: '60px', padding: '0 12px',
            color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.5)',
            background: 'rgba(0,255,136,0.05)',
            borderColor: 'rgba(0,255,136,0.3)',
          }}
          autoFocus
        />
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!answer.trim() || disabled} size="lg" variant="success">
          ВЫЧИСЛИТЬ
        </GameButton>
      </div>
    </div>
  );
}
