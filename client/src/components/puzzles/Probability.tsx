import { useState } from "react";
import GameButton from "../ui/GameButton";

interface ProbabilityProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const PROBLEMS = [
  {
    question: "В мешке 3 красных, 4 синих и 5 белых шаров. Какова вероятность вытащить красный?",
    options: ["1/4", "1/3", "3/12", "3/7"],
    answer: "3/12",
    cat: "КЛАССИЧЕСКАЯ ВЕРОЯТНОСТЬ",
    explanation: "P(красный) = 3/(3+4+5) = 3/12 = 1/4"
  },
  {
    question: "Монету бросают дважды. Вероятность выпадения двух орлов?",
    options: ["1/2", "1/4", "1/3", "1/8"],
    answer: "1/4",
    cat: "НЕЗАВИСИМЫЕ СОБЫТИЯ",
    explanation: "P = 1/2 × 1/2 = 1/4"
  },
  {
    question: "Карту вытаскивают из 52-колоды. Вероятность туза?",
    options: ["1/13", "1/4", "4/13", "1/52"],
    answer: "1/13",
    cat: "КАРТОЧНАЯ ВЕРОЯТНОСТЬ",
    explanation: "4 туза из 52 карт = 4/52 = 1/13"
  },
  {
    question: "На кубике 6 граней. Вероятность выбросить число > 4?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    answer: "1/3",
    cat: "БРОСОК КУБИКА",
    explanation: "Числа > 4: {5, 6} → 2/6 = 1/3"
  }
];

export default function Probability({ puzzle, onAnswer, disabled }: ProbabilityProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [data] = useState(() => PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)]);
  const labels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (selected) onAnswer(selected);
  };

  // Visual probability bar
  const probValue = data.answer === '1/4' ? 0.25 : data.answer === '1/3' ? 0.33 : data.answer === '1/13' ? 0.077 : data.answer === '3/12' ? 0.25 : 0.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#ffd700', boxShadow: '0 0 6px #ffd700' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#ffd700' }}>{data.cat}</span>
      </div>

      {/* Visual probability display */}
      <div className="flex items-center gap-3">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)' }}>0%</div>
        <div className="flex-1 h-3 rounded-sm relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <div className="h-full rounded-sm transition-all duration-1000"
            style={{
              width: `${probValue * 100}%`,
              background: 'linear-gradient(90deg, #ffd700aa, #ffd700)',
              boxShadow: '0 0 8px rgba(255,215,0,0.5)'
            }}/>
        </div>
        <div className="text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)' }}>100%</div>
      </div>

      {/* Question */}
      <div className="p-5 rounded-sm"
        style={{
          background: 'rgba(255,215,0,0.04)',
          border: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 15px rgba(255,215,0,0.06)'
        }}>
        <div className="text-sm text-center" style={{ color: '#e0e8ff', lineHeight: 1.7 }}>
          {data.question}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {data.options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button
              key={i}
              onClick={() => !disabled && setSelected(opt)}
              disabled={disabled}
              className="p-4 rounded-sm text-center transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.4)',
                border: `2px solid ${isSelected ? '#ffd700' : 'rgba(255,255,255,0.08)'}`,
                color: isSelected ? '#ffd700' : 'rgba(255,255,255,0.5)',
                boxShadow: isSelected ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              <div className="text-xs mb-1" style={{ color: isSelected ? '#ffd70088' : 'rgba(255,255,255,0.2)' }}>
                {labels[i]}
              </div>
              <div className="text-lg font-black font-mono">{opt}</div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!selected || disabled} size="lg">
          ПОДТВЕРДИТЬ
        </GameButton>
      </div>
    </div>
  );
}
