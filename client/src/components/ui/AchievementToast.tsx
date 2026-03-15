import { useEffect, useState } from "react";
import { useChicken } from "../../lib/stores/useChicken";
import { ACHIEVEMENTS } from "../../lib/achievements";

interface ToastItem {
  id: string;
  name: string;
  description: string;
  reward: number;
  rarity: string;
  key: number;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#00ff88',
  rare: '#4a9eff',
  epic: '#9b59b6',
  legendary: '#ffd700',
};

export default function AchievementToast() {
  const { achievements } = useChicken();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [prevAchievements, setPrevAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Find newly unlocked achievements
    const newIds = achievements.filter(id => !prevAchievements.includes(id));
    if (newIds.length > 0) {
      const newToasts: ToastItem[] = newIds.map(id => {
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        return {
          id,
          name: ach?.name || id,
          description: ach?.description || '',
          reward: ach?.reward || 0,
          rarity: ach?.rarity || 'common',
          key: Date.now() + Math.random(),
        };
      });
      setToasts(prev => [...prev, ...newToasts]);
      // Remove each toast after 4 seconds
      newToasts.forEach(t => {
        setTimeout(() => {
          setToasts(prev => prev.filter(x => x.key !== t.key));
        }, 4000);
      });
    }
    setPrevAchievements(achievements);
  }, [achievements]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-3" style={{ pointerEvents: 'none' }}>
      {toasts.map(toast => {
        const color = RARITY_COLORS[toast.rarity] || '#00ff88';
        return (
          <div key={toast.key}
            className="flex items-center gap-3 rounded-sm px-4 py-3 animate-slide-in"
            style={{
              background: 'rgba(5,5,20,0.97)',
              border: `1px solid ${color}`,
              boxShadow: `0 0 20px ${color}44, 0 4px 20px rgba(0,0,0,0.6)`,
              minWidth: 260,
              maxWidth: 320,
              pointerEvents: 'all',
              backdropFilter: 'blur(10px)',
            }}>
            {/* Icon */}
            <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color }}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  stroke="currentColor" strokeWidth="1.5" fill={`${color}33`}/>
              </svg>
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold tracking-widest uppercase" style={{ color }}>
                ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО
              </div>
              <div className="text-sm font-bold mt-0.5" style={{ color: '#e0e8ff' }}>
                {toast.name}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {toast.description}
              </div>
              {toast.reward > 0 && (
                <div className="text-xs mt-1 font-mono font-bold" style={{ color: '#a78bfa' }}>
                  +{toast.reward} нейронов
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
