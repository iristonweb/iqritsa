import { useChicken } from "../../lib/stores/useChicken";
import ProgressBar from "../ui/ProgressBar";

export default function ProgressSystem() {
  const { chickenStage, currentStageProgress, neurons, achievements } = useChicken();

  const stages = [
    { name: "ЗЁРНЫШКИ", color: '#ffd700' },
    { name: "ЦЫПЛЯЧЬЯ ТРОПА", color: '#c0c0c0' },
    { name: "ГНЕЗДО МУДРОСТИ", color: '#4a9eff' },
    { name: "КУРИНЫЙ УНИ", color: '#9b59b6' },
    { name: "ФАКУЛЬТЕТ ЛОГИКИ", color: '#1abc9c' },
    { name: "ЛАБОРАТОРИЯ ГЕНИЯ", color: '#e74c3c' },
    { name: "КОСМОС ИНТЕЛЛЕКТ", color: '#00d4ff' },
    { name: "АБС. РАЗУМ", color: '#ff00ff' },
  ];

  const currentStage = stages[Math.min(chickenStage, stages.length - 1)];

  return (
    <div className="space-y-4">
      {/* Current stage */}
      <div className="p-3 rounded-sm"
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${currentStage.color}33`,
          boxShadow: `0 0 10px ${currentStage.color}11`
        }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold tracking-widest" style={{ color: currentStage.color }}>
            {currentStage.name}
          </span>
          <span className="text-xs font-mono" style={{ color: currentStage.color + '88' }}>
            {Math.round(currentStageProgress * 100)}%
          </span>
        </div>
        <ProgressBar
          progress={currentStageProgress}
          color={currentStage.color}
          glowColor={currentStage.color}
          height={6}
        />
        <div className="mt-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {chickenStage < 7
            ? `ДО СЛЕДУЮЩЕГО: ${Math.round((1 - currentStageProgress) * 100)}%`
            : 'МАКСИМАЛЬНЫЙ УРОВЕНЬ'
          }
        </div>
      </div>

      {/* Stage pipeline */}
      <div className="space-y-1.5">
        {stages.map((stage, index) => {
          const isCompleted = index < chickenStage;
          const isCurrent = index === chickenStage;
          const isLocked = index > chickenStage;

          return (
            <div key={index} className="flex items-center gap-2">
              {/* Stage dot */}
              <div className="relative flex-shrink-0">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
                  style={{
                    background: isLocked ? 'rgba(255,255,255,0.05)' :
                                isCompleted ? stage.color + '22' : 'rgba(0,0,0,0.6)',
                    border: `1px solid ${isLocked ? 'rgba(255,255,255,0.1)' : stage.color + (isCurrent ? 'cc' : '55')}`,
                    boxShadow: isCurrent ? `0 0 8px ${stage.color}` : 'none',
                    color: isLocked ? 'rgba(255,255,255,0.2)' : stage.color,
                    fontSize: '8px'
                  }}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                {/* Connector */}
                {index < stages.length - 1 && (
                  <div className="absolute left-1/2 top-4 w-px h-1.5 -translate-x-1/2"
                    style={{ background: isCompleted ? stage.color + '66' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>

              {/* Stage info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate"
                    style={{
                      color: isLocked ? 'rgba(255,255,255,0.2)' :
                             isCurrent ? stage.color :
                             stage.color + '88',
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      textShadow: isCurrent ? `0 0 6px ${stage.color}` : 'none'
                    }}>
                    {stage.name}
                  </span>
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse flex-shrink-0"
                      style={{ background: stage.color, boxShadow: `0 0 4px ${stage.color}` }}/>
                  )}
                </div>
                {isCurrent && (
                  <ProgressBar
                    progress={currentStageProgress}
                    color={stage.color}
                    height={2}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="p-2 rounded-sm text-center"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="text-sm font-bold font-mono" style={{ color: '#a78bfa' }}>{neurons}</div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>NRN</div>
        </div>
        <div className="p-2 rounded-sm text-center"
          style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <div className="text-sm font-bold font-mono" style={{ color: '#ffd700' }}>{achievements.length}</div>
          <div className="text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.5)' }}>ACH</div>
        </div>
      </div>
    </div>
  );
}
