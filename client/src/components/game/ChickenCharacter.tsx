import { useEffect, useState } from "react";
import { useChicken } from "../../lib/stores/useChicken";

interface ChickenCharacterProps {
  stage: number;
}

function ChickenSVG({ stage, mood }: { stage: number; mood: string }) {
  const glowColors = [
    '#ffd700', '#c0c0c0', '#4a9eff', '#9b59b6',
    '#1abc9c', '#e74c3c', '#00d4ff', '#ff00ff',
  ];
  const glow = glowColors[Math.min(stage, glowColors.length - 1)];

  const isExcited  = mood === 'excited' || mood === 'happy';
  const isThinking = mood === 'thinking';
  const isConfused = mood === 'confused';

  // Eyebrow shift
  const browY    = isThinking ? -3 : isExcited ? -4 : isConfused ? 2 : 0;
  const pupilDx  = isConfused ? -2 : 0;
  const pupilDy  = isThinking ? -2 : 0;

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Body gradient — white with stage-colored tint at the bottom */}
        <radialGradient id="ckg-body" cx="45%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="60%"  stopColor="#e8eef8"/>
          <stop offset="100%" stopColor="#c8d4ec"/>
        </radialGradient>

        {/* Head gradient */}
        <radialGradient id="ckg-head" cx="42%" cy="32%" r="60%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="70%"  stopColor="#dce8f8"/>
          <stop offset="100%" stopColor="#b8cce8"/>
        </radialGradient>

        {/* Wing gradient */}
        <radialGradient id="ckg-wing" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#f0f4ff"/>
          <stop offset="100%" stopColor="#b0c0dc"/>
        </radialGradient>

        {/* VR goggle lens */}
        <radialGradient id="ckg-lens-l" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor={glow} stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#111" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#000" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id="ckg-lens-r" cx="65%" cy="30%" r="65%">
          <stop offset="0%"   stopColor={glow} stopOpacity="0.5"/>
          <stop offset="50%"  stopColor="#111" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#000" stopOpacity="1"/>
        </radialGradient>

        {/* Comb gradient */}
        <linearGradient id="ckg-comb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ff6666"/>
          <stop offset="100%" stopColor="#cc1111"/>
        </linearGradient>

        {/* Foot gradient */}
        <linearGradient id="ckg-foot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e8a020"/>
          <stop offset="100%" stopColor="#b87010"/>
        </linearGradient>

        {/* Glow filter */}
        <filter id="ckg-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Soft shadow */}
        <filter id="ckg-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.35)"/>
        </filter>

        {/* Circuit pattern for high stages */}
        {stage >= 4 && (
          <pattern id="ckg-circuit" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9 H6 M12 9 H18 M9 0 V6 M9 12 V18" stroke={glow} strokeWidth="0.4" opacity="0.3" fill="none"/>
            <circle cx="9" cy="9" r="1.5" fill={glow} opacity="0.3"/>
          </pattern>
        )}
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="228" rx="52" ry="6"
        fill="rgba(0,0,0,0.25)" style={{ filter: 'blur(3px)' }}/>

      {/* ── FEET ── */}
      {/* Left leg */}
      <rect x="80" y="204" width="7" height="20" rx="3" fill="url(#ckg-foot)"/>
      {/* Left toes */}
      <ellipse cx="72" cy="223" rx="10" ry="3.5" fill="url(#ckg-foot)" transform="rotate(-8 72 223)"/>
      <ellipse cx="80" cy="225" rx="10" ry="3.5" fill="url(#ckg-foot)"/>
      <ellipse cx="88" cy="223" rx="7"  ry="3"   fill="url(#ckg-foot)" transform="rotate(8 88 223)"/>

      {/* Right leg */}
      <rect x="113" y="204" width="7" height="20" rx="3" fill="url(#ckg-foot)"/>
      {/* Right toes */}
      <ellipse cx="105" cy="223" rx="7"  ry="3"   fill="url(#ckg-foot)" transform="rotate(-8 105 223)"/>
      <ellipse cx="113" cy="225" rx="10" ry="3.5" fill="url(#ckg-foot)"/>
      <ellipse cx="121" cy="223" rx="10" ry="3.5" fill="url(#ckg-foot)" transform="rotate(8 121 223)"/>

      {/* ── BODY ── */}
      <ellipse cx="100" cy="162" rx="58" ry="50" fill="url(#ckg-body)" filter="url(#ckg-shadow)"/>

      {/* Circuit overlay for stages 4+ */}
      {stage >= 4 && (
        <ellipse cx="100" cy="162" rx="58" ry="50" fill="url(#ckg-circuit)" opacity="0.6"/>
      )}

      {/* Body highlight */}
      <ellipse cx="82" cy="140" rx="22" ry="14" fill="white" opacity="0.25"/>

      {/* Stage-colored energy shimmer on body (stage 2+) */}
      {stage >= 2 && (
        <ellipse cx="100" cy="162" rx="58" ry="50" fill={glow} opacity="0.04"
          style={{ filter: `drop-shadow(0 0 12px ${glow})` }}/>
      )}

      {/* ── WINGS ── */}
      {/* Left wing */}
      <ellipse cx="50" cy="163" rx="16" ry="28"
        fill="url(#ckg-wing)" opacity="0.95"
        transform="rotate(-18 50 163)" filter="url(#ckg-shadow)"/>
      <ellipse cx="50" cy="163" rx="10" ry="20"
        fill="white" opacity="0.3"
        transform="rotate(-18 50 163)"/>

      {/* Right wing */}
      <ellipse cx="150" cy="163" rx="16" ry="28"
        fill="url(#ckg-wing)" opacity="0.95"
        transform="rotate(18 150 163)" filter="url(#ckg-shadow)"/>
      <ellipse cx="150" cy="163" rx="10" ry="20"
        fill="white" opacity="0.3"
        transform="rotate(18 150 163)"/>

      {/* Chest tuft */}
      <ellipse cx="100" cy="185" rx="24" ry="12" fill="white" opacity="0.4"/>

      {/* ── NECK ── */}
      <ellipse cx="100" cy="118" rx="22" ry="16" fill="url(#ckg-head)"/>

      {/* ── WATTLE (chin) ── */}
      <ellipse cx="100" cy="121" rx="9" ry="7"
        fill="#e03030" opacity="0.85"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}/>

      {/* ── HEAD ── */}
      <circle cx="100" cy="88" r="40" fill="url(#ckg-head)" filter="url(#ckg-shadow)"/>

      {/* Head circuit overlay (stage 4+) */}
      {stage >= 4 && (
        <circle cx="100" cy="88" r="40" fill="url(#ckg-circuit)" opacity="0.5"/>
      )}

      {/* Head highlight */}
      <ellipse cx="86" cy="72" rx="16" ry="10" fill="white" opacity="0.3"/>

      {/* Stage glow ring around head (stage 3+) */}
      {stage >= 3 && (
        <circle cx="100" cy="88" r="43" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.4"
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
      )}

      {/* ── COMB ── */}
      <ellipse cx="91"  cy="50" rx="7" ry="12" fill="url(#ckg-comb)"
        style={{ filter: 'drop-shadow(0 -2px 3px rgba(200,0,0,0.4))' }}/>
      <ellipse cx="100" cy="46" rx="8" ry="14" fill="url(#ckg-comb)"
        style={{ filter: 'drop-shadow(0 -2px 4px rgba(200,0,0,0.4))' }}/>
      <ellipse cx="109" cy="50" rx="7" ry="12" fill="url(#ckg-comb)"
        style={{ filter: 'drop-shadow(0 -2px 3px rgba(200,0,0,0.4))' }}/>
      {/* Comb highlight */}
      <ellipse cx="99" cy="44" rx="4" ry="6" fill="rgba(255,180,180,0.4)"/>

      {/* ── VR GOGGLES ── all stages get VR style, evolving */}
      {/* Goggle bridge/strap */}
      <rect x="62" y="78" width="76" height="22" rx="11"
        fill="#1a1a2e" stroke="#333" strokeWidth="1"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}/>

      {/* Outer goggle frame — left */}
      <circle cx="82" cy="88" r="17" fill="#111" stroke="#2a2a4a" strokeWidth="2"/>
      <circle cx="82" cy="88" r="17" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.6"
        style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>

      {/* Outer goggle frame — right */}
      <circle cx="118" cy="88" r="17" fill="#111" stroke="#2a2a4a" strokeWidth="2"/>
      <circle cx="118" cy="88" r="17" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.6"
        style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>

      {/* Lens — left */}
      <circle cx="82" cy="88" r="13" fill="url(#ckg-lens-l)"/>
      <circle cx="82" cy="88" r="13" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.5"/>

      {/* Lens — right */}
      <circle cx="118" cy="88" r="13" fill="url(#ckg-lens-r)"/>
      <circle cx="118" cy="88" r="13" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.5"/>

      {/* Lens shine — left */}
      <ellipse cx="76" cy="82" rx="5" ry="3" fill="white" opacity="0.18" transform="rotate(-20 76 82)"/>
      {/* Lens shine — right */}
      <ellipse cx="112" cy="82" rx="5" ry="3" fill="white" opacity="0.18" transform="rotate(-20 112 82)"/>

      {/* Center bridge detail */}
      <rect x="95" y="85" width="10" height="6" rx="3" fill="#222" stroke={glow} strokeWidth="0.8" opacity="0.7"/>

      {/* Stage-specific goggle HUD details */}
      {stage === 0 && (
        /* Simple scan line */
        <line x1="70" y1="88" x2="94" y2="88" stroke={glow} strokeWidth="0.8" opacity="0.3"/>
      )}
      {stage >= 1 && stage < 3 && (
        /* Cross-hair */
        <>
          <line x1="76" y1="88" x2="88" y2="88" stroke={glow} strokeWidth="0.6" opacity="0.5"/>
          <line x1="82" y1="82" x2="82" y2="94" stroke={glow} strokeWidth="0.6" opacity="0.5"/>
          <line x1="112" y1="82" x2="112" y2="94" stroke={glow} strokeWidth="0.6" opacity="0.5"/>
          <circle cx="82" cy="88" r="4" fill="none" stroke={glow} strokeWidth="0.6" opacity="0.4"/>
          <circle cx="118" cy="88" r="4" fill="none" stroke={glow} strokeWidth="0.6" opacity="0.4"/>
        </>
      )}
      {stage >= 3 && stage < 6 && (
        /* Targeting arcs */
        <>
          <circle cx="82"  cy="88" r="7" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.5"/>
          <circle cx="82"  cy="88" r="3" fill={glow}  opacity="0.4"/>
          <circle cx="118" cy="88" r="7" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.5"/>
          <circle cx="118" cy="88" r="3" fill={glow}  opacity="0.4"/>
          <path d="M74 80 L76 88 L74 96" stroke={glow} strokeWidth="0.6" fill="none" opacity="0.4"/>
          <path d="M126 80 L124 88 L126 96" stroke={glow} strokeWidth="0.6" fill="none" opacity="0.4"/>
        </>
      )}
      {stage >= 6 && (
        /* Full HUD — holographic grid */
        <>
          <circle cx="82"  cy="88" r="10" fill="none" stroke={glow} strokeWidth="1" opacity="0.5"
            style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>
          <circle cx="82"  cy="88" r="5"  fill={glow} opacity="0.3"/>
          <circle cx="118" cy="88" r="10" fill="none" stroke={glow} strokeWidth="1" opacity="0.5"
            style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>
          <circle cx="118" cy="88" r="5"  fill={glow} opacity="0.3"/>
          {[0,1,2].map(i => (
            <line key={i}
              x1={70 + i * 8} y1="80" x2={70 + i * 8} y2="96"
              stroke={glow} strokeWidth="0.4" opacity="0.25"/>
          ))}
          {[0,1].map(i => (
            <line key={i}
              x1="70" y1={84 + i * 8} x2="94" y2={84 + i * 8}
              stroke={glow} strokeWidth="0.4" opacity="0.25"/>
          ))}
        </>
      )}

      {/* Side goggle straps */}
      <rect x="61" y="82" width="5" height="12" rx="2.5" fill="#222" stroke="#333" strokeWidth="0.5"/>
      <rect x="134" y="82" width="5" height="12" rx="2.5" fill="#222" stroke="#333" strokeWidth="0.5"/>

      {/* ── BEAK ── */}
      <polygon points="90,106 110,106 100,120" fill="#e87800"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}/>
      <polygon points="90,106 110,106 100,112" fill="#ffa020" opacity="0.5"/>
      <line x1="90" y1="111" x2="110" y2="111" stroke="#b05500" strokeWidth="1" opacity="0.5"/>

      {/* ── EYEBROWS (above goggles, mood) ── */}
      <path d={`M72 ${68 + browY} Q82 ${64 + browY} 92 ${68 + browY}`}
        stroke={isExcited ? glow : '#888'} strokeWidth="2.5" fill="none" strokeLinecap="round"
        style={isExcited ? { filter: `drop-shadow(0 0 4px ${glow})` } : undefined}/>
      <path d={`M108 ${68 + browY} Q118 ${64 + browY} 128 ${68 + browY}`}
        stroke={isExcited ? glow : '#888'} strokeWidth="2.5" fill="none" strokeLinecap="round"
        style={isExcited ? { filter: `drop-shadow(0 0 4px ${glow})` } : undefined}/>

      {/* ── HEADGEAR BY STAGE ── */}
      {stage >= 5 && (
        /* Neural crown / antenna array */
        <>
          <path d="M65 62 Q65 30 100 25 Q135 30 135 62"
            fill="none" stroke={glow} strokeWidth="2" opacity="0.7"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          {[-30, 0, 30].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const nx = 100 + 38 * Math.sin(rad);
            const ny = 44 - 38 * Math.cos(rad);
            return (
              <g key={i}>
                <line x1={100 + 35 * Math.sin(rad)} y1={44 - 35 * Math.cos(rad)}
                      x2={nx + 6 * Math.sin(rad)}   y2={ny - 6 * Math.cos(rad)}
                  stroke={glow} strokeWidth="1.5" opacity="0.8"
                  style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>
                <circle cx={nx + 6 * Math.sin(rad)} cy={ny - 6 * Math.cos(rad)} r="4"
                  fill={glow} style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
              </g>
            );
          })}
        </>
      )}
      {stage === 7 && (
        /* Ultimate: holographic halo */
        <>
          <ellipse cx="100" cy="40" rx="42" ry="8" fill="none" stroke={glow} strokeWidth="2.5"
            opacity="0.8" style={{ filter: `drop-shadow(0 0 12px ${glow})` }}/>
          <ellipse cx="100" cy="40" rx="34" ry="5.5" fill={glow} opacity="0.08"/>
        </>
      )}

      {/* ── MOOD FX ── */}
      {isExcited && (
        <>
          <circle cx="40"  cy="75"  r="4" fill={glow} opacity="0.8"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          <circle cx="160" cy="70"  r="5" fill={glow} opacity="0.7"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          <circle cx="45"  cy="110" r="2.5" fill={glow} opacity="0.6"
            style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>
          {/* Star spark */}
          <path d="M30 58 L32 52 L34 58 L40 56 L34 62" fill={glow} opacity="0.85"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          <path d="M158 95 L160 89 L162 95 L168 93 L162 99" fill={glow} opacity="0.75"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
        </>
      )}

      {isThinking && (
        <>
          <circle cx="145" cy="58" r="5"  fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="157" cy="46" r="7"  fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="170" cy="32" r="10" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="170" y="36" textAnchor="middle" fontSize="9" fill="#8b5cf6" fontWeight="bold">?</text>
        </>
      )}

      {isConfused && (
        /* Dizzy stars */
        <>
          {[0, 120, 240].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle key={i}
                cx={100 + 48 * Math.cos(rad)} cy={55 + 20 * Math.sin(rad)}
                r="3" fill="#ffcc00" opacity="0.8"
                style={{ filter: 'drop-shadow(0 0 4px #ffcc00)' }}/>
            );
          })}
          <text x="150" y="50" fontSize="14" fill="#ffcc00" opacity="0.8">×</text>
          <text x="40"  y="55" fontSize="14" fill="#ffcc00" opacity="0.8">×</text>
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
      t += 0.018;
      setFloatOffset(Math.sin(t) * 7);
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

  const stageColors = ['#ffd700','#c0c0c0','#4a9eff','#9b59b6','#1abc9c','#e74c3c','#00d4ff','#ff00ff'];
  const currentColor = stageColors[Math.min(stage, stageColors.length - 1)];

  const moodLabels: Record<string, string> = {
    neutral:  'НЕЙТРАЛЬНО',
    happy:    'ВЕРНО!',
    thinking: 'АНАЛИЗИРУЮ...',
    confused: 'ОШИБКА',
    excited:  'ЭВОЛЮЦИЯ!'
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-full animate-spin-slow"
          style={{
            width: '190px', height: '190px',
            border: `1px solid ${currentColor}33`,
            boxShadow: `0 0 30px ${currentColor}22`
          }}/>
        <div className="absolute rounded-full"
          style={{
            width: '155px', height: '155px',
            border: `1px solid ${currentColor}18`
          }}/>
      </div>

      {/* Chicken */}
      <div
        style={{
          width:  `${144 + stage * 7}px`,
          height: `${150 + stage * 7}px`,
          transform: `translateY(${floatOffset}px)`,
          transition: 'width 0.5s, height 0.5s',
          filter: isAnimating && mood === 'happy'   ? `drop-shadow(0 0 22px ${currentColor})` :
                  isAnimating && mood === 'confused' ? 'drop-shadow(0 0 16px #ff3366)' :
                  isAnimating && mood === 'excited'  ? `drop-shadow(0 0 28px ${currentColor})` : 'none'
        }}
      >
        <ChickenSVG stage={stage} mood={mood} />
      </div>

      {/* Status */}
      <div className="mt-3 px-4 py-1 rounded-sm flex items-center gap-2"
        style={{
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${currentColor}44`,
          boxShadow: `0 0 10px ${currentColor}22`
        }}>
        <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse"
          style={{ background: currentColor, boxShadow: `0 0 6px ${currentColor}` }}/>
        <span className="text-xs font-bold tracking-widest"
          style={{ color: currentColor, textShadow: `0 0 8px ${currentColor}` }}>
          {moodLabels[mood] || 'АКТИВНА'}
        </span>
      </div>

      <div className="mt-1 text-center">
        <span className="text-xs tracking-widest" style={{ color: currentColor + '88' }}>
          КЛАСС: {stageNames[Math.min(stage, stageNames.length - 1)]}
        </span>
      </div>
    </div>
  );
}
