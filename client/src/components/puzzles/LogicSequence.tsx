import { useState } from "react";
import GameButton from "../ui/GameButton";

interface LogicSequenceProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function LogicSequence({ puzzle, onAnswer, disabled }: LogicSequenceProps) {
  const [userAnswer, setUserAnswer] = useState("");

  const sequence: (number | string)[] = puzzle?.question?.sequence || [2, 4, 8, 16];
  const label: string = puzzle?.question?.label || "Найдите следующий элемент";

  const handleSubmit = () => {
    if (userAnswer.trim()) onAnswer(userAnswer.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#4a9eff', boxShadow: '0 0 6px #4a9eff' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#4a9eff' }}>
          {label.toUpperCase()}
        </span>
      </div>

      {/* Sequence display */}
      <div className="p-5 rounded-sm text-center"
        style={{
          background: 'rgba(74,158,255,0.05)',
          border: '1px solid rgba(74,158,255,0.25)',
          boxShadow: '0 0 20px rgba(74,158,255,0.08)'
        }}>
        <div className="text-xs tracking-widest mb-4" style={{ color: 'rgba(74,158,255,0.5)' }}>
          ОПРЕДЕЛИТЕ ЗАКОНОМЕРНОСТЬ И НАЙДИТЕ СЛЕДУЮЩИЙ ЭЛЕМЕНТ
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {sequence.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="rounded-sm px-4 py-3 min-w-[56px] text-xl font-black font-mono text-center"
                style={{
                  background: 'rgba(74,158,255,0.1)',
                  border: '1px solid rgba(74,158,255,0.4)',
                  color: '#4a9eff',
                  boxShadow: '0 0 8px rgba(74,158,255,0.2)'
                }}>
                {item}
              </div>
              {i < sequence.length - 1 && (
                <span style={{ color: 'rgba(74,158,255,0.3)' }}>→</span>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span style={{ color: 'rgba(74,158,255,0.3)' }}>→</span>
            <div className="rounded-sm px-4 py-3 min-w-[56px] text-xl font-black font-mono text-center animate-neon-pulse"
              style={{
                background: 'rgba(0,255,255,0.08)',
                border: '2px dashed #00ffff',
                color: '#00ffff',
                boxShadow: '0 0 12px rgba(0,255,255,0.3)'
              }}>
              ?
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.5)' }}>
          ВВЕДИТЕ СЛЕДУЮЩИЙ ЭЛЕМЕНТ
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && userAnswer.trim() && handleSubmit()}
          disabled={disabled}
          placeholder="?"
          className="neo-input text-center text-2xl font-black font-mono rounded-sm"
          style={{ width: '120px', height: '60px', padding: '0' }}
          autoFocus
        />
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={!userAnswer.trim() || disabled} size="lg">
          ВЫЧИСЛИТЬ
        </GameButton>
      </div>
    </div>
  );
}
