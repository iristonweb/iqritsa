import { useChicken } from "../../lib/stores/useChicken";
import ProgressBar from "../ui/ProgressBar";

export default function ProgressSystem() {
  const { chickenStage, currentStageProgress, neurons, achievements } = useChicken();

  const stageNames = [
    "Зёрнышки",
    "Цыплячья Тропа", 
    "Гнездо Мудрости",
    "Куриный Университет",
    "Факультет Логики",
    "Лаборатория Гения",
    "Космический Интеллект",
    "Абсолютный Разум"
  ];

  const getStageColor = (stage: number) => {
    const colors = [
      "#8B4513", // Brown
      "#228B22", // Green
      "#4169E1", // Royal Blue
      "#9932CC", // Dark Orchid
      "#FF6347", // Tomato
      "#FFD700", // Gold
      "#00CED1", // Dark Turquoise
      "#FF1493"  // Deep Pink
    ];
    return colors[Math.min(stage, colors.length - 1)];
  };

  return (
    <div className="space-y-6">
      {/* Current Stage Progress */}
      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold" style={{ color: getStageColor(chickenStage) }}>
            Этап {chickenStage + 1}: {stageNames[chickenStage]}
          </h3>
          <span className="text-sm text-gray-500">
            {Math.round(currentStageProgress * 100)}%
          </span>
        </div>
        
        <ProgressBar 
          progress={currentStageProgress}
          color={getStageColor(chickenStage)}
          height={8}
        />
        
        <div className="mt-2 text-xs text-gray-600">
          {chickenStage < 7 
            ? `${Math.round((1 - currentStageProgress) * 100)}% до следующего этапа`
            : "Максимальный уровень достигнут!"
          }
        </div>
      </div>

      {/* Overall Progress Visualization */}
      <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
        <h4 className="text-md font-semibold mb-3 text-gray-700">Общий Прогресс</h4>
        
        <div className="space-y-2">
          {stageNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white"
                   style={{ 
                     backgroundColor: index <= chickenStage ? getStageColor(index) : '#e5e7eb' 
                   }}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="text-sm" style={{ 
                  color: index <= chickenStage ? getStageColor(index) : '#9ca3af',
                  fontWeight: index === chickenStage ? 'bold' : 'normal'
                }}>
                  {name}
                </div>
                
                {index === chickenStage && (
                  <ProgressBar 
                    progress={currentStageProgress}
                    color={getStageColor(index)}
                    height={4}
                  />
                )}
                
                {index < chickenStage && (
                  <div className="w-full h-1 bg-green-400 rounded-full mt-1"></div>
                )}
              </div>

              {index <= chickenStage && (
                <div className="text-green-500 text-xs">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="text-purple-600 font-bold text-lg">{neurons}</div>
          <div className="text-purple-500 text-xs">Нейроны</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-orange-600 font-bold text-lg">{achievements.length}</div>
          <div className="text-orange-500 text-xs">Достижения</div>
        </div>
      </div>
    </div>
  );
}
