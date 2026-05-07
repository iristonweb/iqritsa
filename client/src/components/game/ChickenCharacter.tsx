import { useEffect, useState } from "react";
import { useChicken } from "../../lib/stores/useChicken";

interface ChickenCharacterProps {
  stage: number;
  compact?: boolean;
}

const STAGE_COLORS = [
  '#ffd700', '#c0c0c0', '#4a9eff', '#9b59b6',
  '#1abc9c', '#e74c3c', '#00d4ff', '#ff00ff',
];

const STAGE_NAMES = [
  "ПРОСТАЯ НЕСУШКА",
  "УМНАЯ КУРОЧКА",
  "МЫСЛЯЩАЯ ПТИЦА",
  "КУРИНЫЙ СТУДЕНТ",
  "ПТИЧИЙ ПРОФЕССОР",
  "ГЕНИАЛЬНАЯ КЛЕПА",
  "КОСМИЧЕСКИЙ РАЗУМ",
  "АБСОЛЮТНЫЙ ИНТЕЛЛЕКТ",
];

const MOOD_LABELS: Record<string, string> = {
  neutral:  'НЕЙТРАЛЬНО',
  happy:    'ВЕРНО!',
  thinking: 'АНАЛИЗИРУЮ...',
  confused: 'ОШИБКА',
  excited:  'ЭВОЛЮЦИЯ!'
};

function ChickenSVG({ stage, mood }: { stage: number; mood: string }) {
  const glow = STAGE_COLORS[Math.min(stage, STAGE_COLORS.length - 1)];
  const isExcited  = mood === 'excited' || mood === 'happy';
  const isThinking = mood === 'thinking';
  const isConfused = mood === 'confused';
  const browY = isThinking ? -3 : isExcited ? -5 : isConfused ? 2 : 0;

  // Body color shifts with stage
  const bodyTint = [
    '#ffffff', '#e8e8f0', '#d0e0ff', '#e0d0f0',
    '#c8f0e8', '#f0d0d0', '#c0f0ff', '#f0c0ff',
  ][Math.min(stage, 7)];

  return (
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`body-${stage}`} cx="42%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="55%" stopColor={bodyTint}/>
          <stop offset="100%" stopColor={stage >= 6 ? glow : '#c8d4ec'} stopOpacity={stage >= 6 ? 0.5 : 1}/>
        </radialGradient>
        <radialGradient id={`head-${stage}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="65%" stopColor={bodyTint}/>
          <stop offset="100%" stopColor={stage >= 4 ? glow : '#b8cce8'} stopOpacity={stage >= 4 ? 0.4 : 1}/>
        </radialGradient>
        <radialGradient id={`lens-l-${stage}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.7"/>
          <stop offset="40%" stopColor="#111" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#000" stopOpacity="1"/>
        </radialGradient>
        <radialGradient id={`lens-r-${stage}`} cx="65%" cy="30%" r="65%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.7"/>
          <stop offset="40%" stopColor="#111" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#000" stopOpacity="1"/>
        </radialGradient>
        <linearGradient id={`comb-${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stage >= 5 ? '#ff4444' : '#ff6666'}/>
          <stop offset="100%" stopColor={stage >= 5 ? '#cc0000' : '#cc1111'}/>
        </linearGradient>
        <linearGradient id={`foot-${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={stage >= 3 ? '#c8a840' : '#e8a020'}/>
          <stop offset="100%" stopColor={stage >= 3 ? '#906010' : '#b87010'}/>
        </linearGradient>
        <filter id={`glow-${stage}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`shadow-${stage}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.4)"/>
        </filter>
        <filter id={`strongglow-${stage}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Circuit pattern stage 3+ */}
        {stage >= 3 && (
          <pattern id={`circuit-${stage}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8 H5 M11 8 H16 M8 0 V5 M8 11 V16" stroke={glow} strokeWidth="0.5" opacity="0.35" fill="none"/>
            <rect x="6" y="6" width="4" height="4" fill="none" stroke={glow} strokeWidth="0.4" opacity="0.25"/>
          </pattern>
        )}
        {/* Energy field stage 6+ */}
        {stage >= 6 && (
          <radialGradient id={`aura-${stage}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glow} stopOpacity="0"/>
            <stop offset="70%" stopColor={glow} stopOpacity="0.08"/>
            <stop offset="100%" stopColor={glow} stopOpacity="0.25"/>
          </radialGradient>
        )}
      </defs>

      {/* ── Stage 6-7: Outer aura field ── */}
      {stage >= 6 && (
        <ellipse cx="100" cy="130" rx="85" ry="100" fill={`url(#aura-${stage})`}
          style={{ filter: `drop-shadow(0 0 20px ${glow})` }}/>
      )}

      {/* ── Stage 4+: Energy wings (mechanical) ── */}
      {stage >= 4 && stage < 7 && (
        <g opacity="0.85">
          {/* Left mech wing */}
          <path d={`M55 155 Q20 130 ${stage >= 5 ? '5' : '15'} 100 Q25 110 45 130 Q35 140 55 160`}
            fill={`${glow}22`} stroke={glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          <path d={`M52 158 Q15 145 ${stage >= 5 ? '0' : '10'} 140 Q20 145 48 162`}
            fill={`${glow}15`} stroke={glow} strokeWidth="1" opacity="0.7"/>
          {/* Right mech wing */}
          <path d={`M145 155 Q180 130 ${stage >= 5 ? '195' : '185'} 100 Q175 110 155 130 Q165 140 145 160`}
            fill={`${glow}22`} stroke={glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          <path d={`M148 158 Q185 145 ${stage >= 5 ? '200' : '190'} 140 Q180 145 152 162`}
            fill={`${glow}15`} stroke={glow} strokeWidth="1" opacity="0.7"/>
          {/* Wing circuit lines */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <line x1={55 - i*5} y1={150 + i*5} x2={20 - i*3} y2={120 + i*8}
                stroke={glow} strokeWidth="0.6" opacity="0.5"/>
              <line x1={145 + i*5} y1={150 + i*5} x2={180 + i*3} y2={120 + i*8}
                stroke={glow} strokeWidth="0.6" opacity="0.5"/>
            </g>
          ))}
        </g>
      )}

      {/* ── Stage 7: Divine light wings ── */}
      {stage === 7 && (
        <g>
          {/* Big feathered light wings */}
          {[-40, -25, -10, 5, 20].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const len = 70 - i * 5;
            return (
              <g key={i}>
                <line x1="55" y1="155"
                  x2={55 - len * Math.cos(rad)} y2={155 - len * Math.sin(rad)}
                  stroke={glow} strokeWidth={4 - i * 0.5} opacity={0.8 - i * 0.1}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
                <line x1="145" y1="155"
                  x2={145 + len * Math.cos(rad)} y2={155 - len * Math.sin(rad)}
                  stroke={glow} strokeWidth={4 - i * 0.5} opacity={0.8 - i * 0.1}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
              </g>
            );
          })}
        </g>
      )}

      {/* Ground shadow */}
      <ellipse cx="100" cy="230" rx="50" ry="5" fill="rgba(0,0,0,0.2)" style={{ filter: 'blur(3px)' }}/>

      {/* ── Stage 2+: Shoulder armor ── */}
      {stage >= 2 && (
        <g>
          {/* Left shoulder plate */}
          <path d="M38 148 Q30 138 36 126 Q44 120 56 128 Q62 140 56 150 Z"
            fill={`${glow}33`} stroke={glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>
          <path d="M40 145 Q35 138 39 130 Q44 125 52 131 Q56 140 52 147"
            fill={`${glow}22`} stroke={glow} strokeWidth="0.8" opacity="0.7"/>
          {/* Right shoulder plate */}
          <path d="M162 148 Q170 138 164 126 Q156 120 144 128 Q138 140 144 150 Z"
            fill={`${glow}33`} stroke={glow} strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>
          <path d="M160 145 Q165 138 161 130 Q156 125 148 131 Q144 140 148 147"
            fill={`${glow}22`} stroke={glow} strokeWidth="0.8" opacity="0.7"/>
        </g>
      )}

      {/* ── Stage 5+: Chest energy core ── */}
      {stage >= 5 && (
        <g>
          <circle cx="100" cy="170" r="14" fill={`${glow}15`} stroke={glow} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 10px ${glow})` }}/>
          <circle cx="100" cy="170" r="8" fill={`${glow}30`} stroke={glow} strokeWidth="1.5"/>
          <circle cx="100" cy="170" r="4" fill={glow} opacity="0.9"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          {/* Energy conduits */}
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line key={i}
                x1={100 + 8 * Math.cos(rad)} y1={170 + 8 * Math.sin(rad)}
                x2={100 + 14 * Math.cos(rad)} y2={170 + 14 * Math.sin(rad)}
                stroke={glow} strokeWidth="1" opacity="0.8"/>
            );
          })}
        </g>
      )}

      {/* ── FEET ── */}
      <rect x="80" y="205" width={stage >= 3 ? 8 : 7} height="20" rx="3" fill={`url(#foot-${stage})`}/>
      <ellipse cx="72" cy="224" rx="10" ry="3.5" fill={`url(#foot-${stage})`} transform="rotate(-8 72 224)"/>
      <ellipse cx="80" cy="226" rx="10" ry="3.5" fill={`url(#foot-${stage})`}/>
      <ellipse cx="88" cy="224" rx="7" ry="3" fill={`url(#foot-${stage})`} transform="rotate(8 88 224)"/>
      <rect x="112" y="205" width={stage >= 3 ? 8 : 7} height="20" rx="3" fill={`url(#foot-${stage})`}/>
      <ellipse cx="105" cy="224" rx="7" ry="3" fill={`url(#foot-${stage})`} transform="rotate(-8 105 224)"/>
      <ellipse cx="113" cy="226" rx="10" ry="3.5" fill={`url(#foot-${stage})`}/>
      <ellipse cx="121" cy="224" rx="10" ry="3.5" fill={`url(#foot-${stage})`} transform="rotate(8 121 224)"/>
      {/* Stage 3+: Gold/cyber foot accents */}
      {stage >= 3 && (
        <>
          <line x1="76" y1="207" x2="76" y2="218" stroke={glow} strokeWidth="1" opacity="0.6"/>
          <line x1="116" y1="207" x2="116" y2="218" stroke={glow} strokeWidth="1" opacity="0.6"/>
        </>
      )}

      {/* ── BODY ── */}
      <ellipse cx="100" cy="164" rx={56 + stage * 1.5} ry={48 + stage} fill={`url(#body-${stage})`} filter={`url(#shadow-${stage})`}/>

      {/* Stage 3+: Circuit overlay on body */}
      {stage >= 3 && (
        <ellipse cx="100" cy="164" rx={56 + stage * 1.5} ry={48 + stage} fill={`url(#circuit-${stage})`} opacity="0.7"/>
      )}

      {/* Body energy shimmer */}
      {stage >= 1 && (
        <ellipse cx="100" cy="164" rx={56 + stage * 1.5} ry={48 + stage} fill={glow} opacity={0.02 + stage * 0.01}
          style={{ filter: `drop-shadow(0 0 ${8 + stage * 3}px ${glow})` }}/>
      )}
      {/* Body highlight */}
      <ellipse cx="80" cy="142" rx="22" ry="14" fill="white" opacity="0.25"/>
      <ellipse cx="100" cy="186" rx="22" ry="10" fill="white" opacity="0.35"/>

      {/* ── NATURAL WINGS (reduced at higher stages) ── */}
      {/* Left wing */}
      <ellipse cx="48" cy="164" rx={stage >= 4 ? 12 : 16} ry={stage >= 4 ? 22 : 28}
        fill="rgba(240,244,255,0.9)" opacity={stage >= 4 ? 0.5 : 0.95}
        transform="rotate(-18 48 164)" filter={`url(#shadow-${stage})`}/>
      {/* Right wing */}
      <ellipse cx="152" cy="164" rx={stage >= 4 ? 12 : 16} ry={stage >= 4 ? 22 : 28}
        fill="rgba(240,244,255,0.9)" opacity={stage >= 4 ? 0.5 : 0.95}
        transform="rotate(18 152 164)" filter={`url(#shadow-${stage})`}/>

      {/* Stage 1+: Metallic wing strips */}
      {stage >= 1 && (
        <>
          <ellipse cx="48" cy="164" rx="8" ry="18" fill={`${glow}20`} stroke={glow} strokeWidth="0.8"
            transform="rotate(-18 48 164)" opacity="0.7"/>
          <ellipse cx="152" cy="164" rx="8" ry="18" fill={`${glow}20`} stroke={glow} strokeWidth="0.8"
            transform="rotate(18 152 164)" opacity="0.7"/>
        </>
      )}

      {/* ── NECK ── */}
      <ellipse cx="100" cy="120" rx="20" ry="14" fill={`url(#head-${stage})`}/>
      {/* Stage 5+: Neck circuit collar */}
      {stage >= 5 && (
        <>
          <rect x="80" y="113" width="40" height="6" rx="3" fill={`${glow}33`} stroke={glow} strokeWidth="1.2"
            style={{ filter: `drop-shadow(0 0 5px ${glow})` }}/>
          {[84, 92, 100, 108, 116].map((x, i) => (
            <circle key={i} cx={x} cy="116" r="1.5" fill={glow} opacity="0.9"/>
          ))}
        </>
      )}

      {/* ── WATTLE ── */}
      <ellipse cx="100" cy="122" rx="8" ry="6" fill="#e03030" opacity="0.85"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}/>

      {/* ── HEAD ── */}
      <circle cx="100" cy="88" r={38 + Math.min(stage, 3)} fill={`url(#head-${stage})`} filter={`url(#shadow-${stage})`}/>
      {/* Head circuit overlay stage 3+ */}
      {stage >= 3 && (
        <circle cx="100" cy="88" r={38 + Math.min(stage, 3)} fill={`url(#circuit-${stage})`} opacity="0.5"/>
      )}
      {/* Head highlight */}
      <ellipse cx="86" cy="73" rx="14" ry="9" fill="white" opacity="0.3"/>
      {/* Stage 2+: Head glow ring */}
      {stage >= 2 && (
        <circle cx="100" cy="88" r={42 + Math.min(stage, 3)} fill="none" stroke={glow}
          strokeWidth={1 + stage * 0.3} opacity={0.3 + stage * 0.05}
          style={{ filter: `drop-shadow(0 0 ${6 + stage * 2}px ${glow})` }}/>
      )}

      {/* ── COMB ── */}
      <ellipse cx="91" cy="51" rx="7" ry="12" fill={`url(#comb-${stage})`}
        style={{ filter: `drop-shadow(0 -2px ${stage >= 5 ? 6 : 3}px rgba(200,0,0,0.5))` }}/>
      <ellipse cx="100" cy="47" rx="8" ry="14" fill={`url(#comb-${stage})`}
        style={{ filter: `drop-shadow(0 -2px ${stage >= 5 ? 8 : 4}px rgba(200,0,0,0.5))` }}/>
      <ellipse cx="109" cy="51" rx="7" ry="12" fill={`url(#comb-${stage})`}
        style={{ filter: `drop-shadow(0 -2px ${stage >= 5 ? 6 : 3}px rgba(200,0,0,0.5))` }}/>
      <ellipse cx="99" cy="45" rx="4" ry="6" fill="rgba(255,180,180,0.4)"/>

      {/* ── VR GOGGLES ── */}
      {/* Goggle strap */}
      <rect x="62" y="77" width="76" height="23" rx="11.5"
        fill="#0d0d1a" stroke={stage >= 2 ? glow : '#333'} strokeWidth={stage >= 3 ? 1.5 : 0.8}
        style={stage >= 3 ? { filter: `drop-shadow(0 0 4px ${glow})` } : { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}/>
      {/* Goggle frames */}
      <circle cx="82" cy="88" r="17" fill="#0a0a18" stroke={glow} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 ${5 + stage * 2}px ${glow})` }}/>
      <circle cx="118" cy="88" r="17" fill="#0a0a18" stroke={glow} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 ${5 + stage * 2}px ${glow})` }}/>
      {/* Goggle lenses */}
      <circle cx="82" cy="88" r="13" fill={`url(#lens-l-${stage})`}/>
      <circle cx="118" cy="88" r="13" fill={`url(#lens-r-${stage})`}/>
      {/* Lens shine */}
      <ellipse cx="76" cy="82" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-20 76 82)"/>
      <ellipse cx="112" cy="82" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-20 112 82)"/>
      {/* Center bridge */}
      <rect x="95" y="84" width="10" height="8" rx="4" fill="#1a1a2e" stroke={glow} strokeWidth="1" opacity="0.8"/>
      {/* Side straps */}
      <rect x="61" y="81" width="5" height="14" rx="2.5" fill="#222" stroke={glow} strokeWidth="0.5" opacity="0.8"/>
      <rect x="134" y="81" width="5" height="14" rx="2.5" fill="#222" stroke={glow} strokeWidth="0.5" opacity="0.8"/>

      {/* ── HUD content in lenses by stage ── */}
      {stage === 0 && (
        <line x1="72" y1="88" x2="92" y2="88" stroke={glow} strokeWidth="1" opacity="0.35"/>
      )}
      {stage === 1 && (
        <>
          <line x1="76" y1="88" x2="88" y2="88" stroke={glow} strokeWidth="0.8" opacity="0.6"/>
          <line x1="82" y1="82" x2="82" y2="94" stroke={glow} strokeWidth="0.8" opacity="0.6"/>
          <circle cx="82" cy="88" r="4" fill="none" stroke={glow} strokeWidth="0.7" opacity="0.5"/>
          <circle cx="118" cy="88" r="4" fill="none" stroke={glow} strokeWidth="0.7" opacity="0.5"/>
        </>
      )}
      {stage === 2 && (
        <>
          <circle cx="82" cy="88" r="7" fill="none" stroke={glow} strokeWidth="1" opacity="0.6"/>
          <circle cx="82" cy="88" r="3" fill={glow} opacity="0.5"/>
          <circle cx="118" cy="88" r="7" fill="none" stroke={glow} strokeWidth="1" opacity="0.6"/>
          <circle cx="118" cy="88" r="3" fill={glow} opacity="0.5"/>
          {/* Data readout bars */}
          {[0,1,2].map(i => (
            <rect key={i} x={70 + i * 4} y="96" width="3" height={4 + i * 2} rx="1" fill={glow} opacity={0.3 + i * 0.15}/>
          ))}
        </>
      )}
      {stage === 3 && (
        <>
          <circle cx="82" cy="88" r="9" fill="none" stroke={glow} strokeWidth="1" opacity="0.5"/>
          <circle cx="82" cy="88" r="5" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.7"/>
          <circle cx="82" cy="88" r="2" fill={glow} opacity="0.8"/>
          <circle cx="118" cy="88" r="9" fill="none" stroke={glow} strokeWidth="1" opacity="0.5"/>
          <circle cx="118" cy="88" r="5" fill="none" stroke={glow} strokeWidth="0.8" opacity="0.7"/>
          <circle cx="118" cy="88" r="2" fill={glow} opacity="0.8"/>
          <path d="M74 80 L78 88 L74 96" stroke={glow} strokeWidth="0.8" fill="none" opacity="0.5"/>
          <path d="M126 80 L122 88 L126 96" stroke={glow} strokeWidth="0.8" fill="none" opacity="0.5"/>
        </>
      )}
      {stage >= 4 && (
        <>
          <circle cx="82" cy="88" r="10" fill="none" stroke={glow} strokeWidth="1.2" opacity="0.6"
            style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>
          <circle cx="82" cy="88" r="5" fill="none" stroke={glow} strokeWidth="1" opacity="0.8"/>
          <circle cx="82" cy="88" r="2" fill={glow} opacity="0.9"/>
          <circle cx="118" cy="88" r="10" fill="none" stroke={glow} strokeWidth="1.2" opacity="0.6"
            style={{ filter: `drop-shadow(0 0 4px ${glow})` }}/>
          <circle cx="118" cy="88" r="5" fill="none" stroke={glow} strokeWidth="1" opacity="0.8"/>
          <circle cx="118" cy="88" r="2" fill={glow} opacity="0.9"/>
          {/* Scanning lines */}
          {[0, 1, 2].map(i => (
            <line key={i} x1="70" y1={83 + i * 5} x2="94" y2={83 + i * 5}
              stroke={glow} strokeWidth="0.4" opacity="0.3"/>
          ))}
          {stage >= 6 && (
            <>
              {[0, 1, 2].map(i => (
                <line key={i} x1={106 + i * 4} y1="79" x2={106 + i * 4} y2="97"
                  stroke={glow} strokeWidth="0.4" opacity="0.3"/>
              ))}
            </>
          )}
        </>
      )}

      {/* ── BEAK ── */}
      <polygon points="90,106 110,106 100,120" fill="#e87800"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}/>
      <polygon points="90,106 110,106 100,112" fill="#ffa020" opacity="0.5"/>
      <line x1="90" y1="110" x2="110" y2="110" stroke="#b05500" strokeWidth="1" opacity="0.5"/>

      {/* ── EYEBROWS (above goggles) ── */}
      <path d={`M72 ${69 + browY} Q82 ${65 + browY} 92 ${69 + browY}`}
        stroke={isExcited ? glow : (stage >= 3 ? '#aaa' : '#888')} strokeWidth="2.5" fill="none" strokeLinecap="round"
        style={isExcited ? { filter: `drop-shadow(0 0 5px ${glow})` } : undefined}/>
      <path d={`M108 ${69 + browY} Q118 ${65 + browY} 128 ${69 + browY}`}
        stroke={isExcited ? glow : (stage >= 3 ? '#aaa' : '#888')} strokeWidth="2.5" fill="none" strokeLinecap="round"
        style={isExcited ? { filter: `drop-shadow(0 0 5px ${glow})` } : undefined}/>

      {/* ── HEADGEAR BY STAGE ── */}

      {/* Stage 1: Single antenna */}
      {stage === 1 && (
        <g>
          <line x1="100" y1="50" x2="100" y2="18" stroke={glow} strokeWidth="2" opacity="0.8"/>
          <circle cx="100" cy="15" r="4" fill={glow} style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
        </g>
      )}

      {/* Stage 2: Twin antennas */}
      {stage === 2 && (
        <g>
          <line x1="90" y1="50" x2="78" y2="18" stroke={glow} strokeWidth="2" opacity="0.8"/>
          <circle cx="76" cy="14" r="4" fill={glow} style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          <line x1="110" y1="50" x2="122" y2="18" stroke={glow} strokeWidth="2" opacity="0.8"/>
          <circle cx="124" cy="14" r="4" fill={glow} style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
        </g>
      )}

      {/* Stage 3: Neural crown */}
      {stage === 3 && (
        <g>
          <path d="M68 64 Q68 30 100 22 Q132 30 132 64"
            fill="none" stroke={glow} strokeWidth="1.8" opacity="0.7"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          {[-32, 0, 32].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const nx = 100 + 36 * Math.sin(rad);
            const ny = 43 - 36 * Math.cos(rad);
            return (
              <g key={i}>
                <line x1={100 + 30 * Math.sin(rad)} y1={43 - 30 * Math.cos(rad)}
                      x2={nx} y2={ny}
                  stroke={glow} strokeWidth="1.5" opacity="0.8"/>
                <circle cx={nx} cy={ny} r="5" fill={glow} opacity="0.9"
                  style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
                <circle cx={nx} cy={ny} r="2.5" fill="white" opacity="0.8"/>
              </g>
            );
          })}
        </g>
      )}

      {/* Stage 4: Neural crown + battle visor top */}
      {stage === 4 && (
        <g>
          <path d="M62 62 Q62 26 100 18 Q138 26 138 62"
            fill="none" stroke={glow} strokeWidth="2" opacity="0.75"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          {[-35, -12, 12, 35].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const nx = 100 + 40 * Math.sin(rad);
            const ny = 40 - 40 * Math.cos(rad);
            return (
              <g key={i}>
                <line x1={100 + 34 * Math.sin(rad)} y1={40 - 34 * Math.cos(rad)} x2={nx} y2={ny}
                  stroke={glow} strokeWidth="1.5" opacity="0.85"/>
                <circle cx={nx} cy={ny} r={i === 0 || i === 3 ? 4 : 5.5} fill={glow}
                  style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
                <circle cx={nx} cy={ny} r={i === 0 || i === 3 ? 2 : 2.5} fill="white" opacity="0.9"/>
              </g>
            );
          })}
        </g>
      )}

      {/* Stage 5: Battle crown + exo-spine */}
      {stage === 5 && (
        <g>
          <path d="M58 60 Q58 22 100 14 Q142 22 142 60"
            fill="none" stroke={glow} strokeWidth="2.2" opacity="0.8"
            style={{ filter: `drop-shadow(0 0 10px ${glow})` }}/>
          {[-38, -20, 0, 20, 38].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const nx = 100 + 44 * Math.sin(rad);
            const ny = 37 - 44 * Math.cos(rad);
            const r = i === 2 ? 7 : i === 1 || i === 3 ? 5.5 : 4;
            return (
              <g key={i}>
                <line x1={100 + 36 * Math.sin(rad)} y1={37 - 36 * Math.cos(rad)} x2={nx} y2={ny}
                  stroke={glow} strokeWidth={i === 2 ? 2 : 1.5} opacity="0.85"/>
                <circle cx={nx} cy={ny} r={r} fill={glow}
                  style={{ filter: `drop-shadow(0 0 ${i === 2 ? 12 : 8}px ${glow})` }}/>
                <circle cx={nx} cy={ny} r={r * 0.45} fill="white" opacity="0.9"/>
              </g>
            );
          })}
          {/* Exo-spine on back */}
          <path d="M100 128 L100 205" stroke={glow} strokeWidth="2" opacity="0.3"
            strokeDasharray="4 4"/>
          {[140, 158, 176, 194].map((y, i) => (
            <g key={i}>
              <line x1="98" y1={y} x2="88" y2={y - 3} stroke={glow} strokeWidth="1.2" opacity="0.5"/>
              <line x1="102" y1={y} x2="112" y2={y - 3} stroke={glow} strokeWidth="1.2" opacity="0.5"/>
            </g>
          ))}
        </g>
      )}

      {/* Stage 6: Cyber crown + full antenna array */}
      {stage === 6 && (
        <g>
          {/* Main arc */}
          <path d="M55 58 Q55 18 100 10 Q145 18 145 58"
            fill="none" stroke={glow} strokeWidth="2.5" opacity="0.85"
            style={{ filter: `drop-shadow(0 0 12px ${glow})` }}/>
          {/* 6 orb antennas */}
          {[-40, -24, -8, 8, 24, 40].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            const nx = 100 + 47 * Math.sin(rad);
            const ny = 34 - 47 * Math.cos(rad);
            const r = i === 2 || i === 3 ? 7.5 : 5;
            return (
              <g key={i}>
                <line x1={100 + 38 * Math.sin(rad)} y1={34 - 38 * Math.cos(rad)} x2={nx} y2={ny}
                  stroke={glow} strokeWidth={i === 2 || i === 3 ? 2.2 : 1.6} opacity="0.9"/>
                <circle cx={nx} cy={ny} r={r + 3} fill={`${glow}15`}/>
                <circle cx={nx} cy={ny} r={r} fill={glow}
                  style={{ filter: `drop-shadow(0 0 12px ${glow})` }}/>
                <circle cx={nx} cy={ny} r={r * 0.4} fill="white" opacity="0.95"/>
              </g>
            );
          })}
          {/* Secondary ring around head */}
          <ellipse cx="100" cy="50" rx="52" ry="14" fill="none" stroke={glow} strokeWidth="1"
            opacity="0.4" style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
          {/* Exo-spine enhanced */}
          <path d="M100 128 L100 205" stroke={glow} strokeWidth="2.5" opacity="0.4" strokeDasharray="6 3"/>
          {[135, 150, 165, 180, 195].map((y, i) => (
            <g key={i}>
              <line x1="100" y1={y} x2="84" y2={y - 4} stroke={glow} strokeWidth="1.5" opacity="0.6"/>
              <line x1="100" y1={y} x2="116" y2={y - 4} stroke={glow} strokeWidth="1.5" opacity="0.6"/>
              <circle cx="83" cy={y - 5} r="2" fill={glow} opacity="0.7"/>
              <circle cx="117" cy={y - 5} r="2" fill={glow} opacity="0.7"/>
            </g>
          ))}
        </g>
      )}

      {/* Stage 7: Ultimate form — maximum augmentation */}
      {stage === 7 && (
        <g>
          {/* Outer halo */}
          <ellipse cx="100" cy="44" rx="58" ry="10" fill="none" stroke={glow} strokeWidth="3"
            opacity="0.9" style={{ filter: `drop-shadow(0 0 18px ${glow})` }}/>
          <ellipse cx="100" cy="44" rx="50" ry="7" fill={glow} opacity="0.08"/>
          {/* Inner halo */}
          <ellipse cx="100" cy="50" rx="44" ry="7" fill="none" stroke={glow} strokeWidth="1.5"
            opacity="0.6" style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>

          {/* 8 ultimate orb antennas */}
          {[-45, -30, -15, 0, 15, 30, 45, 60].map((a, i) => {
            if (i === 7) return null;
            const rad = ((a - 10) * Math.PI) / 180;
            const nx = 100 + 52 * Math.sin(rad);
            const ny = 30 - 52 * Math.cos(rad);
            const r = i === 3 ? 9 : i === 2 || i === 4 ? 6.5 : 4.5;
            return (
              <g key={i}>
                <line x1={100 + 42 * Math.sin(rad)} y1={30 - 42 * Math.cos(rad)} x2={nx} y2={ny}
                  stroke={glow} strokeWidth={i === 3 ? 2.5 : 1.8} opacity="0.95"/>
                <circle cx={nx} cy={ny} r={r + 4} fill={`${glow}18`}/>
                <circle cx={nx} cy={ny} r={r} fill={glow}
                  style={{ filter: `drop-shadow(0 0 ${r * 2}px ${glow})` }}/>
                <circle cx={nx} cy={ny} r={r * 0.38} fill="white"/>
              </g>
            );
          })}

          {/* Full exo-spine */}
          <path d="M100 125 L100 210" stroke={glow} strokeWidth="3" opacity="0.5" strokeDasharray="8 3"/>
          {[132, 148, 163, 178, 194].map((y, i) => (
            <g key={i}>
              <line x1="100" y1={y} x2="80" y2={y - 6} stroke={glow} strokeWidth="2" opacity="0.7"/>
              <line x1="100" y1={y} x2="120" y2={y - 6} stroke={glow} strokeWidth="2" opacity="0.7"/>
              <circle cx="79" cy={y - 7} r="2.5" fill={glow}
                style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
              <circle cx="121" cy={y - 7} r="2.5" fill={glow}
                style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
            </g>
          ))}
          {/* Full body energy field */}
          <ellipse cx="100" cy="160" rx="70" ry="58" fill="none" stroke={glow} strokeWidth="1"
            opacity="0.3" strokeDasharray="8 4"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
        </g>
      )}

      {/* ── MOOD FX ── */}
      {isExcited && (
        <>
          <circle cx="38" cy="74" r="5" fill={glow} opacity="0.9"
            style={{ filter: `drop-shadow(0 0 10px ${glow})` }}/>
          <circle cx="162" cy="70" r="6" fill={glow} opacity="0.8"
            style={{ filter: `drop-shadow(0 0 10px ${glow})` }}/>
          <circle cx="43" cy="110" r="3" fill={glow} opacity="0.7"/>
          <path d="M28 57 L30 51 L32 57 L38 55 L32 61" fill={glow} opacity="0.9"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          <path d="M158 94 L160 88 L162 94 L168 92 L162 98" fill={glow} opacity="0.8"
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}/>
          <path d="M16 90 L18 84 L20 90 L26 88 L20 94" fill={glow} opacity="0.7"
            style={{ filter: `drop-shadow(0 0 6px ${glow})` }}/>
        </>
      )}
      {isThinking && (
        <>
          <circle cx="148" cy="58" r="5" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="160" cy="44" r="7" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.8"/>
          <circle cx="173" cy="30" r="10" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1.5"/>
          <text x="173" y="34" textAnchor="middle" fontSize="9" fill="#8b5cf6" fontWeight="bold">?</text>
          <circle cx="28" cy="64" r="4" fill="none" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.5"/>
          <circle cx="18" cy="52" r="6" fill="none" stroke="#8b5cf6" strokeWidth="1.2" opacity="0.6"/>
        </>
      )}
      {isConfused && (
        <>
          {[0, 120, 240].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle key={i}
                cx={100 + 50 * Math.cos(rad)} cy={52 + 22 * Math.sin(rad)}
                r="3.5" fill="#ffcc00" opacity="0.85"
                style={{ filter: 'drop-shadow(0 0 5px #ffcc00)' }}/>
            );
          })}
          <text x="154" y="48" fontSize="16" fill="#ffcc00" opacity="0.8" fontWeight="bold">×</text>
          <text x="36" y="52" fontSize="16" fill="#ffcc00" opacity="0.8" fontWeight="bold">×</text>
        </>
      )}
    </svg>
  );
}

export default function ChickenCharacter({ stage, compact = false }: ChickenCharacterProps) {
  const { mood } = useChicken();
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);

  const glow = STAGE_COLORS[Math.min(stage, STAGE_COLORS.length - 1)];

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1200);
    return () => clearTimeout(timer);
  }, [mood]);

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.016;
      setFloatOffset(Math.sin(t) * (compact ? 4 : 7));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [compact]);

  if (compact) {
    return (
      <div className="relative flex flex-col items-center w-full h-full">
        <div className="w-full h-full"
          style={{
            transform: `translateY(${floatOffset}px)`,
            filter: isAnimating && mood === 'happy'   ? `drop-shadow(0 0 16px ${glow})` :
                    isAnimating && mood === 'confused' ? 'drop-shadow(0 0 12px #ff3366)' :
                    isAnimating && mood === 'excited'  ? `drop-shadow(0 0 20px ${glow})` : 'none'
          }}>
          <ChickenSVG stage={stage} mood={mood} />
        </div>
      </div>
    );
  }

  const chickenSize = 148 + stage * 8;

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ top: '10px' }}>
        <div className="rounded-full animate-spin-slow"
          style={{
            width: '200px', height: '200px',
            border: `1px solid ${glow}33`,
            boxShadow: `0 0 ${20 + stage * 5}px ${glow}${Math.min(stage * 4 + 10, 40).toString(16).padStart(2,'0')}`
          }}/>
        <div className="absolute rounded-full"
          style={{
            width: '162px', height: '162px',
            border: `1px solid ${glow}18`
          }}/>
        {stage >= 4 && (
          <div className="absolute rounded-full"
            style={{
              width: '230px', height: '230px',
              border: `1px dashed ${glow}12`
            }}/>
        )}
      </div>

      {/* Chicken */}
      <div style={{
        width: `${chickenSize}px`,
        height: `${chickenSize + 10}px`,
        transform: `translateY(${floatOffset}px)`,
        transition: 'width 0.6s, height 0.6s',
        filter: isAnimating && mood === 'happy'   ? `drop-shadow(0 0 24px ${glow})` :
                isAnimating && mood === 'confused' ? 'drop-shadow(0 0 18px #ff3366)' :
                isAnimating && mood === 'excited'  ? `drop-shadow(0 0 32px ${glow})` : 'none'
      }}>
        <ChickenSVG stage={stage} mood={mood} />
      </div>

      {/* Status badge */}
      <div className="mt-2 px-4 py-1 rounded-sm flex items-center gap-2"
        style={{
          background: 'rgba(0,0,0,0.65)',
          border: `1px solid ${glow}44`,
          boxShadow: `0 0 12px ${glow}22`
        }}>
        <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse"
          style={{ background: glow, boxShadow: `0 0 6px ${glow}` }}/>
        <span className="text-xs font-bold tracking-widest"
          style={{ color: glow, textShadow: `0 0 8px ${glow}` }}>
          {MOOD_LABELS[mood] || 'АКТИВНА'}
        </span>
      </div>

      <div className="mt-1 text-center">
        <span className="text-xs tracking-widest" style={{ color: glow + '88' }}>
          КЛАСС: {STAGE_NAMES[Math.min(stage, STAGE_NAMES.length - 1)]}
        </span>
      </div>
    </div>
  );
}
