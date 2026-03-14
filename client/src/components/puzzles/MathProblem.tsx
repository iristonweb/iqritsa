import { useState } from "react";
import GameButton from "../ui/GameButton";

interface MathProblemProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const PROBLEMS = [
  { q: "Если 5 кур снесли 5 яиц за 5 дней, сколько яиц снесут 10 кур за 10 дней?", ans: "20", cat: "ЗАДАЧА НА ЛОГИКУ" },
  { q: "Найдите x: 2x + 7 = 19", ans: "6", cat: "ЛИНЕЙНОЕ УРАВНЕНИЕ" },
  { q: "Чему равно 15% от 200?", ans: "30", cat: "ПРОЦЕНТЫ" },
  { q: "Площадь квадрата со стороной 7 см?", ans: "49", cat: "ГЕОМЕТРИЯ" },
  { q: "17 × 13 = ?", ans: "221", cat: "УМНОЖЕНИЕ" },
  { q: "Найдите сумму чисел от 1 до 20", ans: "210", cat: "СУММИРОВАНИЕ" },
];

export default function MathProblem({ puzzle, onAnswer, disabled }: MathProblemProps) {
  const [answer, setAnswer] = useState("");
  const [data] = useState(() => {
    if (puzzle?.question) {
      return { q: puzzle.question.text || puzzle.question, ans: "", cat: "МАТЕМАТИКА" };
    }
    return PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
  });

  const handleSubmit = () => {
    if (answer.trim()) onAnswer(answer.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#00ff88' }}>{data.cat}</span>
      </div>

      <div className="p-6 rounded-sm"
        style={{
          background: 'rgba(0,255,136,0.04)',
          border: '1px solid rgba(0,255,136,0.25)',
          boxShadow: '0 0 20px rgba(0,255,136,0.06)'
        }}>
        <div className="text-base font-medium text-center" style={{ color: '#e0e8ff', lineHeight: 1.8 }}>
          {data.q}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(0,255,136,0.5)' }}>
          ВВЕДИТЕ ОТВЕТ
        </div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && answer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="0"
          className="neo-input text-center rounded-sm font-mono font-black text-2xl"
          style={{ width: '160px', height: '60px', padding: '0 12px', color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.5)' }}
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
