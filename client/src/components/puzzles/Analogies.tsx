import { useState } from "react";
import GameButton from "../ui/GameButton";

interface AnalogiesProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const ANALOGIES = [
  { q: "Курица → яйцо, как дерево → ___?", opts: ["листу", "плоду", "корню", "ветке"], ans: "плоду", cat: "Биологические" },
  { q: "Врач → больница, как учитель → ___?", opts: ["ученику", "школе", "книге", "доске"], ans: "школе", cat: "Профессии" },
  { q: "Рука → палец, как нога → ___?", opts: ["колену", "ступне", "пальцу ноги", "голени"], ans: "пальцу ноги", cat: "Анатомия" },
  { q: "Молоток → гвоздь, как отвёртка → ___?", opts: ["винту", "доске", "металлу", "рукоятке"], ans: "винту", cat: "Функции" },
  { q: "Рассвет → закат, как начало → ___?", opts: ["утру", "концу", "дню", "вечеру"], ans: "концу", cat: "Антонимы" },
  { q: "Книга → библиотека, как картина → ___?", opts: ["художнику", "музею", "раме", "холсту"], ans: "музею", cat: "Место хранения" },
  { q: "Слово → предложение, как нота → ___?", opts: ["звуку", "мелодии", "скрипке", "паузе"], ans: "мелодии", cat: "Структура" },
];

export default function Analogies({ puzzle, onAnswer, disabled }: AnalogiesProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [data] = useState(() => {
    if (puzzle?.question?.text && puzzle?.question?.options) {
      return {
        q: puzzle.question.text,
        opts: puzzle.question.options,
        ans: puzzle.question.options[puzzle.answer] || ANALOGIES[0].ans,
        cat: "Аналогия"
      };
    }
    return ANALOGIES[Math.floor(Math.random() * ANALOGIES.length)];
  });

  const labels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (selectedAnswer) onAnswer(selectedAnswer);
  };

  return (
    <div className="space-y-6">
      {/* Category badge */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#9b59b6', boxShadow: '0 0 6px #9b59b6' }}/>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#9b59b6' }}>
          {data.cat}
        </span>
      </div>

      {/* Question */}
      <div className="p-5 rounded-sm"
        style={{
          background: 'rgba(155,89,182,0.06)',
          border: '1px solid rgba(155,89,182,0.3)',
          boxShadow: '0 0 15px rgba(155,89,182,0.1)'
        }}>
        <div className="text-base font-medium text-center" style={{ color: '#e0e8ff', lineHeight: 1.6 }}>
          {data.q}
        </div>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.opts.map((opt: string, i: number) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => !disabled && setSelectedAnswer(opt)}
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

      {/* Submit */}
      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!selectedAnswer || disabled} size="lg" variant="secondary">
          ПОДТВЕРДИТЬ ОТВЕТ
        </GameButton>
      </div>
    </div>
  );
}
