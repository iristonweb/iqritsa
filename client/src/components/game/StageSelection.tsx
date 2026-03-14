import { useChicken } from "../../lib/stores/useChicken";
import { useIQGame } from "../../lib/stores/useIQGame";
import { usePuzzles } from "../../lib/stores/usePuzzles";

const STAGES = [
  { name: "ЗЁРНЫШКИ", desc: "Базовая логика и последовательности", color: '#ffd700', diff: "I" },
  { name: "ЦЫПЛЯЧЬЯ ТРОПА", desc: "Матрицы Равена, аналогии", color: '#c0c0c0', diff: "II" },
  { name: "ГНЕЗДО МУДРОСТИ", desc: "Математика, пространство", color: '#4a9eff', diff: "III" },
  { name: "КУРИНЫЙ УНИ", desc: "Сложные матрицы, загадки", color: '#9b59b6', diff: "IV" },
  { name: "ФАКУЛЬТЕТ ЛОГИКИ", desc: "Числа, криптарифмы", color: '#1abc9c', diff: "V" },
  { name: "ЛАБОРАТОРИЯ ГЕНИЯ", desc: "Вероятность, теория игр", color: '#e74c3c', diff: "VI" },
  { name: "КОСМОС ИНТЕЛЛЕКТ", desc: "Задачи уровня MENSA", color: '#00d4ff', diff: "VII" },
  { name: "АБС. РАЗУМ", desc: "Предел человеческого IQ", color: '#ff00ff', diff: "VIII" },
];

export default function StageSelection() {
  const { chickenStage, unlockedStages } = useChicken();
  const { setGameState } = useIQGame();
  const { setCurrentStage } = usePuzzles();

  const handleSelect = (index: number) => {
    if (index <= unlockedStages) {
      setCurrentStage(index);
      setGameState('puzzle');
    }
  };

  return (
    <div className="space-y-1.5">
      {STAGES.map((stage, index) => {
        const isUnlocked = index <= unlockedStages;
        const isCurrent = index === chickenStage;
        const isCompleted = index < chickenStage;

        return (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={!isUnlocked}
            className="w-full text-left rounded-sm transition-all duration-200"
            style={{
              background: isCurrent
                ? `linear-gradient(90deg, ${stage.color}18, rgba(0,0,0,0.4))`
                : isCompleted
                ? 'rgba(0,255,136,0.04)'
                : isUnlocked
                ? 'rgba(0,0,0,0.3)'
                : 'rgba(0,0,0,0.15)',
              border: `1px solid ${
                isCurrent ? stage.color + 'aa' :
                isCompleted ? '#00ff8833' :
                isUnlocked ? 'rgba(255,255,255,0.08)' :
                'rgba(255,255,255,0.04)'
              }`,
              boxShadow: isCurrent ? `0 0 12px ${stage.color}33` : 'none',
              cursor: isUnlocked ? 'pointer' : 'not-allowed',
              padding: '6px 8px',
            }}
          >
            <div className="flex items-center gap-2">
              {/* Stage number badge */}
              <div className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{
                  background: isLocked(isUnlocked)
                    ? 'rgba(255,255,255,0.04)'
                    : isCompleted
                    ? 'rgba(0,255,136,0.15)'
                    : isCurrent
                    ? stage.color + '22'
                    : 'rgba(255,255,255,0.06)',
                  color: isLocked(isUnlocked)
                    ? 'rgba(255,255,255,0.15)'
                    : isCompleted ? '#00ff88'
                    : stage.color,
                  border: `1px solid ${
                    isLocked(isUnlocked) ? 'transparent' :
                    isCompleted ? '#00ff8844' :
                    stage.color + '66'
                  }`
                }}>
                {isCompleted ? '✓' : isLocked(isUnlocked) ? '⊘' : stage.diff}
              </div>

              {/* Stage info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate"
                    style={{
                      color: isLocked(isUnlocked) ? 'rgba(255,255,255,0.15)' :
                             isCurrent ? stage.color :
                             isCompleted ? 'rgba(0,255,136,0.7)' :
                             'rgba(255,255,255,0.5)',
                      textShadow: isCurrent ? `0 0 6px ${stage.color}` : 'none'
                    }}>
                    {stage.name}
                  </span>
                  {isCurrent && (
                    <span className="text-xs ml-1 flex-shrink-0 animate-neon-pulse"
                      style={{ color: stage.color }}>▶</span>
                  )}
                </div>
                <div className="text-xs truncate mt-0.5"
                  style={{
                    color: isLocked(isUnlocked) ? 'rgba(255,255,255,0.08)' :
                           'rgba(255,255,255,0.25)',
                    fontSize: '10px'
                  }}>
                  {isLocked(isUnlocked) ? '[ ЗАБЛОКИРОВАНО ]' : stage.desc}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function isLocked(isUnlocked: boolean) {
  return !isUnlocked;
}
