import { useEffect, useState } from "react";
import { useChicken } from "../../lib/stores/useChicken";

interface ChickenCharacterProps {
  stage: number;
}

function ChickenSVG({ stage, mood }: { stage: number; mood: string }) {
  const stageColors = [
    { body: '#d4a853', accent: '#c8913a', glow: '#ffd700' },
    { body: '#c0c0c0', accent: '#a0a0a0', glow: '#e0e0ff' },
    { body: '#4a9eff', accent: '#2563eb', glow: '#00aaff' },
    { body: '#9b59b6', accent: '#7d3c98', glow: '#cc66ff' },
    { body: '#1abc9c', accent: '#148f77', glow: '#00ff88' },
    { body: '#e74c3c', accent: '#c0392b', glow: '#ff3366' },
    { body: '#00d4ff', accent: '#0088cc', glow: '#00ffff' },
    { body: '#f0f', accent: '#cc00cc', glow: '#ff00ff' },
  ];

  const c = stageColors[Math.min(stage, stageColors.length - 1)];
  const isExcited = mood === 'excited' || mood === 'happy';
  const isThinking = mood === 'thinking';
  const isConfused = mood === 'confused';

  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <filter id="glow-chicken">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="body-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={c.body} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={c.accent} stopOpacity="1"/>
        </radialGradient>
        <radialGradient id="head-grad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor={c.body} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={c.accent} stopOpacity="1"/>
        </radialGradient>
        {/* Neural circuit overlay for higher stages */}
        {stage >= 3 && (
          <pattern id="circuit-pat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 H8 M12 10 H20 M10 0 V8 M10 12 V20" stroke={c.glow} strokeWidth="0.5" opacity="0.4" fill="none"/>
            <circle cx="10" cy="10" r="2" fill={c.glow} opacity="0.4"/>
          </pattern>
        )}
      </defs>

      {/* Glow aura */}
      <ellipse cx="100" cy="180" rx="60" ry="10" fill={c.glow} opacity="0.15" filter="url(#glow-chicken)"/>

      {/* Body */}
      <ellipse cx="100" cy="155" rx="55" ry="48" fill="url(#body-grad)" filter="url(#glow-chicken)"/>

      {/* Circuit overlay for high stages */}
      {stage >= 3 && (
        <ellipse cx="100" cy="155" rx="55" ry="48" fill="url(#circuit-pat)" opacity="0.5"/>
      )}

      {/* Wing left */}
      <ellipse cx="53" cy="155" rx="18" ry="30"
        fill={c.accent} opacity="0.9"
        transform="rotate(-15 53 155)" filter="url(#glow-chicken)"/>
      {/* Wing right */}
      <ellipse cx="147" cy="155" rx="18" ry="30"
        fill={c.accent} opacity="0.9"
        transform="rotate(15 147 155)" filter="url(#glow-chicken)"/>

      {/* Neck */}
      <ellipse cx="100" cy="112" rx="22" ry="18" fill="url(#body-grad)"/>

      {/* Head */}
      <circle cx="100" cy="88" r="38" fill="url(#head-grad)" filter="url(#glow-chicken)"/>
      {stage >= 3 && (
        <circle cx="100" cy="88" r="38" fill="url(#circuit-pat)" opacity="0.4"/>
      )}

      {/* Eyes */}
      <circle cx="86" cy="82" r="10" fill="white"/>
      <circle cx="114" cy="82" r="10" fill="white"/>
      <circle cx={isConfused ? "84" : "88"} cy={isThinking ? "80" : "83"} r="6" fill="#111"/>
      <circle cx={isConfused ? "116" : "112"} cy={isThinking ? "80" : "83"} r="6" fill="#111"/>
      {/* Eye shine */}
      <circle cx="90" cy="80" r="2" fill="white" opacity="0.9"/>
      <circle cx="116" cy="80" r="2" fill="white" opacity="0.9"/>
      {/* Pupil glow */}
      <circle cx="88" cy="83" r="3" fill={c.glow} opacity="0.4"/>
      <circle cx="112" cy="83" r="3" fill={c.glow} opacity="0.4"/>

      {/* Eyebrows - react to mood */}
      {isThinking && (
        <>
          <path d="M78 70 Q86 66 93 70" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M107 70 Q114 66 122 70" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
      {isExcited && (
        <>
          <path d="M78 68 Q86 63 93 67" stroke={c.glow} strokeWidth="2.5" fill="none" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <path d="M107 67 Q114 63 122 68" stroke={c.glow} strokeWidth="2.5" fill="none" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
        </>
      )}
      {isConfused && (
        <>
          <path d="M78 69 Q86 72 93 68" stroke="#aaa" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M107 68 Q114 72 122 69" stroke="#aaa" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}

      {/* Beak */}
      <polygon points="94,98 106,98 100,110" fill="#ff9900" filter="url(#glow-chicken)"/>
      <line x1="94" y1="103" x2="106" y2="103" stroke="#c07000" strokeWidth="1.5" opacity="0.6"/>

      {/* Comb / head accessory based on stage */}
      {stage === 0 && (
        <>
          <ellipse cx="100" cy="52" rx="6" ry="10" fill="#ff3333" filter="url(#glow-chicken)"/>
          <ellipse cx="91" cy="55" rx="4" ry="7" fill="#ff3333" filter="url(#glow-chicken)"/>
          <ellipse cx="109" cy="55" rx="4" ry="7" fill="#ff3333" filter="url(#glow-chicken)"/>
        </>
      )}
      {stage === 1 && (
        <>
          <ellipse cx="100" cy="52" rx="6" ry="10" fill="#ff3333" filter="url(#glow-chicken)"/>
          {/* Glasses */}
          <circle cx="86" cy="83" r="13" fill="none" stroke="#00d4ff" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
          <circle cx="114" cy="83" r="13" fill="none" stroke="#00d4ff" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
          <line x1="99" y1="83" x2="101" y2="83" stroke="#00d4ff" strokeWidth="1.5"/>
        </>
      )}
      {stage === 2 && (
        <>
          {/* Lab coat collar indicator */}
          <path d="M65 175 Q100 165 135 175" stroke="white" strokeWidth="3" fill="none" opacity="0.5"/>
          <circle cx="86" cy="83" r="13" fill="none" stroke="#00d4ff" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
          <circle cx="114" cy="83" r="13" fill="none" stroke="#00d4ff" strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
          <line x1="99" y1="83" x2="101" y2="83" stroke="#00d4ff" strokeWidth="1.5"/>
        </>
      )}
      {stage >= 3 && stage < 6 && (
        <>
          {/* Graduation / Professor hat */}
          <rect x="75" y="47" width="50" height="8" rx="2" fill="#222" stroke={c.glow} strokeWidth="1"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <rect x="82" y="30" width="36" height="18" rx="2" fill="#111" stroke={c.glow} strokeWidth="1"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <line x1="118" y1="47" x2="128" y2="60" stroke={c.glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <circle cx="128" cy="62" r="3" fill={c.glow} style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
          {/* Glasses */}
          <circle cx="86" cy="83" r="13" fill="none" stroke={c.glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <circle cx="114" cy="83" r="13" fill="none" stroke={c.glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <line x1="99" y1="83" x2="101" y2="83" stroke={c.glow} strokeWidth="1.5"/>
        </>
      )}
      {stage >= 6 && (
        <>
          {/* Sci-fi helmet / neural crown */}
          <path d="M62 80 Q62 35 100 30 Q138 35 138 80" fill="none" stroke={c.glow} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }}/>
          {/* Neural nodes */}
          {[0, 30, 60, 90, 120, 150, 180].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const r = 40;
            const nx = 100 + r * Math.cos(rad - Math.PI / 2);
            const ny = 80 + r * Math.sin(rad - Math.PI / 2);
            if (ny > 80) return null;
            return (
              <circle key={i} cx={nx} cy={ny} r="3" fill={c.glow}
                style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
            );
          })}
          {/* Energy lines */}
          <line x1="62" y1="80" x2="50" y2="65" stroke={c.glow} strokeWidth="1.5" opacity="0.7"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <line x1="138" y1="80" x2="150" y2="65" stroke={c.glow} strokeWidth="1.5" opacity="0.7"
            style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          {/* Glasses - holographic */}
          <circle cx="86" cy="83" r="13" fill="none" stroke={c.glow} strokeWidth="1.5" opacity="0.8"
            style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }}/>
          <circle cx="114" cy="83" r="13" fill="none" stroke={c.glow} strokeWidth="1.5" opacity="0.8"
            style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }}/>
          <circle cx="86" cy="83" r="10" fill={c.glow} opacity="0.08"/>
          <circle cx="114" cy="83" r="10" fill={c.glow} opacity="0.08"/>
          <line x1="99" y1="83" x2="101" y2="83" stroke={c.glow} strokeWidth="1.5"/>
        </>
      )}

      {/* Legs */}
      <rect x="82" y="198" width="8" height="18" rx="2" fill="#ff9900"/>
      <rect x="110" y="198" width="8" height="18" rx="2" fill="#ff9900"/>
      <rect x="76" y="214" width="14" height="4" rx="1" fill="#cc7700"/>
      <rect x="104" y="214" width="14" height="4" rx="1" fill="#cc7700"/>

      {/* Excited sparkles */}
      {isExcited && (
        <>
          <circle cx="45" cy="70" r="3" fill={c.glow} opacity="0.8" style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
          <circle cx="155" cy="65" r="4" fill={c.glow} opacity="0.7" style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
          <circle cx="50" cy="100" r="2" fill={c.glow} opacity="0.6" style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}/>
          <path d="M35 55 L38 50 L41 55 L46 52 L41 57" fill={c.glow} opacity="0.8"
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}/>
        </>
      )}

      {/* Thinking indicator */}
      {isThinking && (
        <>
          <circle cx="140" cy="55" r="5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="150" cy="45" r="7" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="162" cy="33" r="9" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="162" y="37" textAnchor="middle" fontSize="8" fill="#8b5cf6">?</text>
        </>
      )}
    </svg>
  );
}

export default function ChickenCharacter({ stage }: ChickenCharacterProps) {
  const { mood } = useChicken();
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1200);
    return () => clearTimeout(timer);
  }, [mood]);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.02;
      setFloatOffset(Math.sin(t) * 8);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const stageNames = [
    "ПРОСТАЯ НЕСУШКА",
    "УМНАЯ КУРОЧКА",
    "МЫСЛЯЩАЯ ПТИЦА",
    "КУРИНЫЙ СТУДЕНТ",
    "ПТИЧИЙ ПРОФЕССОР",
    "ГЕНИАЛЬНАЯ КЛЕПА",
    "КОСМИЧЕСКИЙ РАЗУМ",
    "АБСОЛЮТНЫЙ ИНТЕЛЛЕКТ"
  ];

  const stageColors = ['#ffd700', '#c0c0c0', '#4a9eff', '#9b59b6', '#1abc9c', '#e74c3c', '#00d4ff', '#ff00ff'];
  const currentColor = stageColors[Math.min(stage, stageColors.length - 1)];

  const moodLabels: Record<string, string> = {
    neutral: 'НЕЙТРАЛЬНО',
    happy: 'ВЕРНО!',
    thinking: 'АНАЛИЗИРУЮ...',
    confused: 'ОШИБКА',
    excited: 'ЭВОЛЮЦИЯ!'
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow ring behind chicken */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-full animate-spin-slow"
          style={{
            width: '180px', height: '180px',
            border: `1px solid ${currentColor}33`,
            boxShadow: `0 0 30px ${currentColor}22`
          }} />
        <div className="absolute rounded-full"
          style={{
            width: '150px', height: '150px',
            border: `1px solid ${currentColor}22`,
          }} />
      </div>

      {/* Chicken SVG */}
      <div
        style={{
          width: `${140 + stage * 8}px`,
          height: `${140 + stage * 8}px`,
          transform: `translateY(${floatOffset}px)`,
          transition: 'width 0.5s, height 0.5s',
          filter: isAnimating && mood === 'happy' ? `drop-shadow(0 0 20px ${currentColor})` :
                  isAnimating && mood === 'confused' ? 'drop-shadow(0 0 15px #ff3366)' : 'none'
        }}
      >
        <ChickenSVG stage={stage} mood={mood} />
      </div>

      {/* Status bar */}
      <div className="mt-4 px-4 py-1.5 rounded-sm flex items-center gap-2"
        style={{
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${currentColor}44`,
          boxShadow: `0 0 10px ${currentColor}22`
        }}>
        <div className="w-2 h-2 rounded-full animate-neon-pulse"
          style={{ background: currentColor, boxShadow: `0 0 6px ${currentColor}` }} />
        <span className="text-xs font-bold tracking-widest"
          style={{ color: currentColor, textShadow: `0 0 8px ${currentColor}` }}>
          {moodLabels[mood] || 'АКТИВНА'}
        </span>
      </div>

      {/* IQ display */}
      <div className="mt-2 text-center">
        <span className="text-xs tracking-widest" style={{ color: currentColor + '88' }}>
          КЛАСС: {stageNames[Math.min(stage, stageNames.length - 1)]}
        </span>
      </div>
    </div>
  );
}
