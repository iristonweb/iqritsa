import { useChicken } from "../../lib/stores/useChicken";
import GameModal from "../ui/GameModal";
import GameButton from "../ui/GameButton";

interface ShopPanelProps {
  onClose: () => void;
}

const UPGRADES = [
  {
    id: 'extraHints',
    name: 'БАНК ПОДСКАЗОК',
    desc: 'Дополнительная подсказка за задачу',
    baseCost: 50,
    maxLevel: 5,
    color: '#00ffff',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill={color + '10'}/>
        <path d="M12 7 Q14.5 7 14.5 10 Q14.5 12 12 13" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1" fill={color}/>
      </svg>
    )
  },
  {
    id: 'timeBonus',
    name: 'УСКОРИТЕЛЬ МЫСЛИ',
    desc: 'Бонусное время на решение',
    baseCost: 75,
    maxLevel: 5,
    color: '#00ff88',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill={color + '10'}/>
        <path d="M12 7 L12 12 L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 4 L10 6" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
        <path d="M15 4 L14 6" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      </svg>
    )
  },
  {
    id: 'neuronMultiplier',
    name: 'НЕЙРОННЫЙ УСИЛИТЕЛЬ',
    desc: 'Множитель получаемых нейронов',
    baseCost: 100,
    maxLevel: 5,
    color: '#8b5cf6',
    icon: (color: string) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="4" fill={color + '33'} stroke={color} strokeWidth="1.5"/>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 12 + 4.5 * Math.cos(rad);
          const y1 = 12 + 4.5 * Math.sin(rad);
          const x2 = 12 + 8 * Math.cos(rad);
          const y2 = 12 + 8 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeLinecap="round"/>;
        })}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={i} cx={12 + 8.5 * Math.cos(rad)} cy={12 + 8.5 * Math.sin(rad)} r="1.5" fill={color}/>;
        })}
      </svg>
    )
  }
];

export default function ShopPanel({ onClose }: ShopPanelProps) {
  const { neurons, upgrades, purchaseUpgrade } = useChicken();

  const handlePurchase = (upgradeId: string, cost: number) => {
    const level = upgrades[upgradeId as keyof typeof upgrades] as number;
    if (level >= 5) return;
    if (neurons < cost) return;
    purchaseUpgrade(upgradeId, cost);
  };

  return (
    <GameModal
      isOpen={true}
      onClose={onClose}
      title="МАГАЗИН УЛУЧШЕНИЙ"
      accentColor="cyan"
    >
      {/* Neuron balance */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-sm"
        style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 0 15px rgba(139,92,246,0.1)'
        }}>
        <div className="w-8 h-8">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="9" stroke="#a78bfa" strokeWidth="1.5" fill="rgba(139,92,246,0.1)"/>
            <circle cx="12" cy="12" r="3" fill="#a78bfa"/>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              return <line key={i}
                x1={12 + 4 * Math.cos(rad)} y1={12 + 4 * Math.sin(rad)}
                x2={12 + 6.5 * Math.cos(rad)} y2={12 + 6.5 * Math.sin(rad)}
                stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round"/>;
            })}
          </svg>
        </div>
        <div>
          <div className="text-xl font-black font-mono" style={{ color: '#a78bfa' }}>
            {neurons}
          </div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>
            НЕЙРОНОВ ДОСТУПНО
          </div>
        </div>
      </div>

      {/* Upgrades */}
      <div className="space-y-3">
        {UPGRADES.map(upg => {
          const level = upgrades[upg.id as keyof typeof upgrades] as number || 0;
          const cost = upg.baseCost * (level + 1);
          const canAfford = neurons >= cost;
          const maxed = level >= upg.maxLevel;

          return (
            <div key={upg.id} className="p-4 rounded-sm"
              style={{
                background: maxed ? 'rgba(0,255,136,0.04)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${maxed ? '#00ff8844' : upg.color + '33'}`,
                boxShadow: maxed ? '0 0 10px rgba(0,255,136,0.1)' : 'none'
              }}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 flex-shrink-0">
                  {upg.icon(maxed ? '#00ff88' : upg.color)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold tracking-widest"
                      style={{ color: maxed ? '#00ff88' : upg.color }}>
                      {upg.name}
                    </span>
                    <span className="text-xs font-mono"
                      style={{ color: maxed ? '#00ff88' : upg.color + '88' }}>
                      {maxed ? 'МАКС' : `УР.${level}/${upg.maxLevel}`}
                    </span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{upg.desc}</p>

                  {/* Level bar */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: upg.maxLevel }, (_, i) => (
                      <div key={i} className="flex-1 h-1 rounded-sm"
                        style={{
                          background: i < level ? (maxed ? '#00ff88' : upg.color) : 'rgba(255,255,255,0.08)',
                          boxShadow: i < level ? `0 0 4px ${maxed ? '#00ff88' : upg.color}` : 'none'
                        }} />
                    ))}
                  </div>

                  {/* Buy button */}
                  {!maxed && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3">
                          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full">
                            <circle cx="6" cy="6" r="5" stroke="#a78bfa" strokeWidth="1"/>
                            <circle cx="6" cy="6" r="2" fill="#a78bfa"/>
                          </svg>
                        </div>
                        <span className="text-xs font-mono" style={{ color: canAfford ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}>
                          {cost} NRN
                        </span>
                      </div>
                      <GameButton
                        onClick={() => handlePurchase(upg.id, cost)}
                        disabled={!canAfford || maxed}
                        variant={canAfford ? 'default' : 'ghost'}
                        size="sm"
                      >
                        КУПИТЬ
                      </GameButton>
                    </div>
                  )}

                  {maxed && (
                    <div className="text-xs tracking-widest" style={{ color: '#00ff88' }}>
                      ✓ ПОЛНОСТЬЮ УЛУЧШЕНО
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GameModal>
  );
}
