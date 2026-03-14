import { useState } from "react";
import GameButton from "../ui/GameButton";

interface SpatialThinkingProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const SPATIAL_PUZZLES = [
  {
    question: "Сколько кубиков изображено на рисунке?",
    svgKey: 'cubes',
    options: ["6", "7", "8", "9"],
    answer: "7",
    cat: "ПОДСЧЁТ КУБОВ"
  },
  {
    question: "Какая фигура является зеркальным отображением оригинала?",
    svgKey: 'mirror',
    options: ["A", "B", "C", "D"],
    answer: "B",
    cat: "ЗЕРКАЛЬНОЕ ОТРАЖЕНИЕ"
  },
  {
    question: "Сколько треугольников содержится в фигуре?",
    svgKey: 'triangles',
    options: ["4", "5", "6", "7"],
    answer: "5",
    cat: "ПОДСЧЁТ ФИГУР"
  },
];

const SVGs = {
  cubes: (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* 3D cube grid illustration */}
      {[[0,0],[1,0],[2,0],[0,1],[1,1],[0,2],[1,2]].map(([x,y], i) => {
        const px = 30 + x * 40 + y * 20;
        const py = 80 - y * 25 + x * 10;
        return (
          <g key={i} transform={`translate(${px},${py})`}>
            <polygon points="0,-15 20,-10 20,15 0,10" fill={`rgba(0,255,255,${0.15 + i * 0.03})`} stroke="#00ffff" strokeWidth="1"/>
            <polygon points="0,-15 -20,-10 -20,15 0,10" fill={`rgba(0,255,255,${0.08 + i * 0.02})`} stroke="#00ffff" strokeWidth="1"/>
            <polygon points="-20,-10 0,-15 20,-10 0,-5" fill={`rgba(0,255,255,${0.25 + i * 0.02})`} stroke="#00ffff" strokeWidth="1"/>
          </g>
        );
      })}
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <text x="20" y="20" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace">ОРИГИНАЛ:</text>
      <polygon points="40,40 80,80 40,80" fill="rgba(139,92,246,0.3)" stroke="#8b5cf6" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 4px #8b5cf6)' }}/>
      <text x="100" y="20" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace">ВАРИАНТЫ:</text>
      {['A','B','C','D'].map((l, i) => {
        const x = 110 + i * 22;
        return (
          <g key={l}>
            <polygon
              points={i === 1 ? `${x+20},40 ${x},80 ${x+20},80` : `${x},40 ${x+20},80 ${x},80`}
              fill={i === 1 ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.06)'}
              stroke={i === 1 ? '#00ff88' : 'rgba(255,255,255,0.3)'}
              strokeWidth="1.5"/>
            <text x={x+10} y="105" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace">{l}</text>
          </g>
        );
      })}
    </svg>
  ),
  triangles: (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Main triangle with inner triangles */}
      <polygon points="100,20 180,140 20,140" fill="rgba(255,153,0,0.08)" stroke="#ff9900" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #ff9900)' }}/>
      <line x1="60" y1="80" x2="140" y2="80" stroke="#ff9900" strokeWidth="1.5" opacity="0.7"/>
      <line x1="100" y1="80" x2="20" y2="140" stroke="#ff9900" strokeWidth="1.5" opacity="0.7"/>
      <line x1="100" y1="80" x2="180" y2="140" stroke="#ff9900" strokeWidth="1.5" opacity="0.7"/>
      <line x1="60" y1="80" x2="100" y2="20" stroke="#ff9900" strokeWidth="1.5" opacity="0.7"/>
    </svg>
  ),
};

export default function SpatialThinking({ puzzle, onAnswer, disabled }: SpatialThinkingProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [data] = useState(() => SPATIAL_PUZZLES[Math.floor(Math.random() * SPATIAL_PUZZLES.length)]);
  const labels = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    if (selected) onAnswer(selected);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-sm" style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}/>
        <span className="text-xs font-bold tracking-widest" style={{ color: '#00d4ff' }}>{data.cat}</span>
      </div>

      <div className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>{data.question}</div>

      {/* Visual */}
      <div className="rounded-sm overflow-hidden mx-auto" style={{ width: '220px', height: '140px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,212,255,0.2)', padding: '8px' }}>
        {SVGs[data.svgKey as keyof typeof SVGs]}
      </div>

      {/* Options */}
      <div className="grid grid-cols-4 gap-2">
        {data.options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button key={i}
              onClick={() => !disabled && setSelected(opt)}
              disabled={disabled}
              className="py-3 rounded-sm font-bold font-mono text-base transition-all"
              style={{
                background: isSelected ? 'rgba(0,212,255,0.15)' : 'rgba(0,0,0,0.4)',
                border: `2px solid ${isSelected ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                color: isSelected ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                boxShadow: isSelected ? '0 0 15px rgba(0,212,255,0.3)' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              {labels[i]}: {opt}
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
