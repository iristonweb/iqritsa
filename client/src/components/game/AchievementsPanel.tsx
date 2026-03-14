import { useChicken } from "../../lib/stores/useChicken";
import { ACHIEVEMENTS } from "../../lib/achievements";
import GameModal from "../ui/GameModal";

interface AchievementsPanelProps {
  onClose: () => void;
}

const rarityColors = {
  common: { color: '#aaaaaa', bg: 'rgba(170,170,170,0.08)', border: 'rgba(170,170,170,0.2)' },
  rare: { color: '#4a9eff', bg: 'rgba(74,158,255,0.08)', border: 'rgba(74,158,255,0.2)' },
  epic: { color: '#9b59b6', bg: 'rgba(155,89,182,0.08)', border: 'rgba(155,89,182,0.2)' },
  legendary: { color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.3)' },
};

const rarityLabels = {
  common: 'ОБЫЧНОЕ',
  rare: 'РЕДКОЕ',
  epic: 'ЭПИЧЕСКОЕ',
  legendary: 'ЛЕГЕНДАРНОЕ'
};

// SVG icons for achievements (no emojis)
function AchievementIcon({ icon, color, unlocked }: { icon: string; color: string; unlocked: boolean }) {
  const iconMap: Record<string, JSX.Element> = {
    '🌾': (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 2 L14 8 L12 8 L12 22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 8 L9 5 L10 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M12 8 L15 5 L14 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M12 13 L9 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 13 L15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    '🧠': (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 4 Q8 4 7 7 Q4 7 4 11 Q4 15 7 16 Q7 20 12 20 Q17 20 17 16 Q20 15 20 11 Q20 7 17 7 Q16 4 12 4Z"
          stroke={color} strokeWidth="1.2" fill={color + '15'}/>
        <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="0.8" opacity="0.5"/>
        <path d="M7 10 Q10 8 12 12 Q14 8 17 10" stroke={color} strokeWidth="0.8" fill="none"/>
        <circle cx="9" cy="14" r="1" fill={color}/>
        <circle cx="15" cy="14" r="1" fill={color}/>
      </svg>
    ),
    '👓': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="8" cy="13" r="4" stroke={color} strokeWidth="1.5"/>
        <circle cx="16" cy="13" r="4" stroke={color} strokeWidth="1.5"/>
        <line x1="12" y1="13" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 13 L2 11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 13 L22 11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    '⚡': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M13 3 L5 13 L11 13 L11 21 L19 11 L13 11 Z" fill={color + '33'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    '🎓': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <polygon points="12,3 22,9 12,15 2,9" fill={color + '22'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 11 L5 17 Q12 21 19 17 L19 11" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <line x1="22" y1="9" x2="22" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="22" cy="17" r="1.5" fill={color}/>
      </svg>
    ),
    '🔥': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 2 C12 2 16 8 16 12 C16 14.5 14.2 16.5 12 16.5 C9.8 16.5 8 14.5 8 12 C8 10 9 8 9 8 C9 8 10 11 12 11 C12 11 12 6 12 2Z"
          fill={color + '33'} stroke={color} strokeWidth="1.2"/>
        <path d="M10 22 C10 22 7 18 8 14 C9 18 12 19 12 19 C12 19 15 18 16 14 C17 18 14 22 14 22"
          fill={color + '33'} stroke={color} strokeWidth="0.8"/>
      </svg>
    ),
    '🏆': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M7 3 H17 L15 13 Q12 17 9 13 Z" fill={color + '22'} stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M7 5 C5 5 4 7 4 9 C4 11 5.5 12.5 7 13" stroke={color} strokeWidth="1.2" fill="none"/>
        <path d="M17 5 C19 5 20 7 20 9 C20 11 18.5 12.5 17 13" stroke={color} strokeWidth="1.2" fill="none"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    '🔮': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="11" r="7" fill={color + '15'} stroke={color} strokeWidth="1.2"/>
        <ellipse cx="12" cy="11" rx="4" ry="2.5" fill={color + '22'}/>
        <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="12" cy="22" rx="4" ry="1" fill={color + '33'} stroke={color} strokeWidth="0.8"/>
        <circle cx="10" cy="9" r="1.5" fill={color} opacity="0.7"/>
      </svg>
    ),
    '🌟': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 2 L14.5 9.5 L22 9.5 L16 14 L18.5 21.5 L12 17 L5.5 21.5 L8 14 L2 9.5 L9.5 9.5 Z"
          fill={color + '22'} stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
    '🚀': (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M12 2 C16 2 20 6 20 12 L17 15 L7 15 L4 12 C4 6 8 2 12 2Z"
          fill={color + '22'} stroke={color} strokeWidth="1.2"/>
        <circle cx="12" cy="11" r="2.5" fill={color + '33'} stroke={color} strokeWidth="1"/>
        <path d="M7 15 L5 20 L9 18" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        <path d="M17 15 L19 20 L15 18" stroke={color} strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  };

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.2" fill={color + '15'}/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill={color}>★</text>
    </svg>
  );

  return (
    <div style={{ opacity: unlocked ? 1 : 0.3 }}>
      {iconMap[icon] || defaultIcon}
    </div>
  );
}

export default function AchievementsPanel({ onClose }: AchievementsPanelProps) {
  const { achievements: unlockedIds } = useChicken();
  const unlocked = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
  const locked = ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id) && !a.hidden);

  return (
    <GameModal
      isOpen={true}
      onClose={onClose}
      title="ДОСТИЖЕНИЯ КЛЕПЫ"
      accentColor="purple"
    >
      {/* Progress header */}
      <div className="flex items-center gap-4 mb-6 p-3 rounded-sm"
        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="text-center">
          <div className="text-2xl font-black font-mono" style={{ color: '#a78bfa' }}>
            {unlocked.length}
          </div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>ПОЛУЧЕНО</div>
        </div>
        <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.2)' }} />
        <div className="text-center">
          <div className="text-2xl font-black font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {ACHIEVEMENTS.filter(a => !a.hidden).length}
          </div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>ВСЕГО</div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-5">
          <div className="text-xs tracking-widest mb-3 flex items-center gap-2" style={{ color: '#00ff88' }}>
            <div className="w-1 h-3 rounded-sm" style={{ background: '#00ff88' }}/>
            РАЗБЛОКИРОВАНО
          </div>
          <div className="space-y-2">
            {unlocked.map(ach => {
              const r = rarityColors[ach.rarity];
              return (
                <div key={ach.id} className="flex items-center gap-3 p-3 rounded-sm"
                  style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                  <div className="w-8 h-8 flex-shrink-0">
                    <AchievementIcon icon={ach.icon} color={r.color} unlocked={true} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: r.color }}>{ach.name}</span>
                      <span className="text-xs px-1.5 rounded-sm" style={{ color: r.color, background: r.bg, border: `1px solid ${r.border}`, fontSize: '9px' }}>
                        {rarityLabels[ach.rarity]}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{ach.description}</p>
                  </div>
                  <div className="text-xs font-mono font-bold" style={{ color: '#a78bfa' }}>
                    +{ach.reward}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <div className="text-xs tracking-widest mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="w-1 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.2)' }}/>
            НЕ ПОЛУЧЕНО
          </div>
          <div className="space-y-2">
            {locked.map(ach => {
              const r = rarityColors[ach.rarity];
              return (
                <div key={ach.id} className="flex items-center gap-3 p-3 rounded-sm"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.5 }}>
                  <div className="w-8 h-8 flex-shrink-0">
                    <AchievementIcon icon={ach.icon} color={r.color} unlocked={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{ach.name}</div>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{ach.description}</p>
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    ⊘
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unlocked.length === 0 && locked.length === 0 && (
        <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <div className="text-4xl mb-2 opacity-30">
            <svg viewBox="0 0 40 40" width="40" height="40" className="mx-auto" fill="none">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2"/>
              <path d="M13 20 H27 M20 13 V27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sm tracking-widest">НАЧНИТЕ РЕШАТЬ ЗАДАЧИ</p>
        </div>
      )}
    </GameModal>
  );
}
