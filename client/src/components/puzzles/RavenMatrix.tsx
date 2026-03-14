import { useState } from "react";
import GameButton from "../ui/GameButton";

interface RavenMatrixProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

type Shape = 'circle' | 'square' | 'triangle' | 'diamond';
type Color = '#00ffff' | '#8b5cf6' | '#00ff88' | '#ff3366';

const MatrixCell = ({ shape, color, size = 30 }: { shape: Shape | '?'; color: Color | string; size?: number }) => {
  if (shape === '?') {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-sm"
        style={{ background: 'rgba(0,255,255,0.05)', border: '2px dashed rgba(0,255,255,0.4)' }}>
        <span className="text-xl font-black animate-neon-pulse" style={{ color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>?</span>
      </div>
    );
  }

  const s = size;
  return (
    <div className="w-full h-full flex items-center justify-center rounded-sm"
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        {shape === 'circle' && (
          <circle cx="20" cy="20" r="16" fill={color + '33'} stroke={color} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
        )}
        {shape === 'square' && (
          <rect x="6" y="6" width="28" height="28" rx="2" fill={color + '33'} stroke={color} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
        )}
        {shape === 'triangle' && (
          <polygon points="20,4 36,36 4,36" fill={color + '33'} stroke={color} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
        )}
        {shape === 'diamond' && (
          <polygon points="20,3 37,20 20,37 3,20" fill={color + '33'} stroke={color} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
        )}
      </svg>
    </div>
  );
};

export default function RavenMatrix({ puzzle, onAnswer, disabled }: RavenMatrixProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'diamond'];
  const COLORS: Color[] = ['#00ffff', '#8b5cf6', '#00ff88', '#ff3366'];

  // Generate a 3x3 matrix puzzle
  const [matrixData] = useState(() => {
    const s = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const matrix: Array<{ shape: Shape | '?'; color: Color | string }> = [
      { shape: SHAPES[0], color: COLORS[0] }, { shape: SHAPES[1], color: COLORS[1] }, { shape: SHAPES[2], color: COLORS[2] },
      { shape: SHAPES[1], color: COLORS[2] }, { shape: SHAPES[2], color: COLORS[0] }, { shape: SHAPES[0], color: COLORS[1] },
      { shape: SHAPES[2], color: COLORS[1] }, { shape: SHAPES[0], color: COLORS[2] }, { shape: '?', color: '' },
    ];
    const answer = { shape: SHAPES[1], color: COLORS[0] };
    const options = [
      answer,
      { shape: SHAPES[0], color: COLORS[1] },
      { shape: SHAPES[2], color: COLORS[2] },
      { shape: SHAPES[1], color: COLORS[2] },
    ];
    return { matrix, answer, options, correctIndex: 0 };
  });

  const handleSubmit = () => {
    if (selected !== null) {
      onAnswer(selected === matrixData.correctIndex ? matrixData.correctIndex : selected);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#ffd700', boxShadow: '0 0 6px #ffd700' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#ffd700' }}>МАТРИЦА РАВЕНА</span>
      </div>

      <div className="text-xs text-center tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        ОПРЕДЕЛИТЕ ПАТТЕРН И ВЫБЕРИТЕ НЕДОСТАЮЩИЙ ЭЛЕМЕНТ
      </div>

      {/* 3x3 Matrix */}
      <div className="mx-auto" style={{ width: 'fit-content' }}>
        <div className="grid grid-cols-3 gap-2 p-4 rounded-sm"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,215,0,0.2)' }}>
          {matrixData.matrix.map((cell, i) => (
            <div key={i} style={{ width: '70px', height: '70px' }}>
              <MatrixCell shape={cell.shape} color={cell.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="text-xs text-center tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        ВАРИАНТЫ ОТВЕТОВ
      </div>
      <div className="grid grid-cols-4 gap-3">
        {matrixData.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !disabled && setSelected(i)}
            disabled={disabled}
            className="relative transition-all duration-200"
            style={{
              height: '70px',
              background: selected === i ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.4)',
              border: `2px solid ${selected === i ? '#ffd700' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '4px',
              boxShadow: selected === i ? '0 0 15px rgba(255,215,0,0.3)' : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}>
            <div className="absolute top-1 left-1 text-xs font-bold"
              style={{ color: selected === i ? '#ffd700' : 'rgba(255,255,255,0.2)' }}>
              {['A', 'B', 'C', 'D'][i]}
            </div>
            <MatrixCell shape={opt.shape} color={opt.color} size={25}/>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <GameButton onClick={handleSubmit} disabled={selected === null || disabled} size="lg">
          ПОДТВЕРДИТЬ
        </GameButton>
      </div>
    </div>
  );
}
