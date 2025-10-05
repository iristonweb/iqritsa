import { useChicken } from "../../lib/stores/useChicken";
import { useIQGame } from "../../lib/stores/useIQGame";
import { usePuzzles } from "../../lib/stores/usePuzzles";
import GameButton from "../ui/GameButton";

export default function StageSelection() {
  const { chickenStage, unlockedStages } = useChicken();
  const { setGameState } = useIQGame();
  const { setCurrentStage } = usePuzzles();

  const stageData = [
    {
      name: "Зёрнышки",
      description: "Простые логические задачки для разминки",
      icon: "🌾",
      difficulty: "Очень легко",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800"
    },
    {
      name: "Цыплячья Тропа", 
      description: "Матрицы Равена и простые аналогии",
      icon: "🐣",
      difficulty: "Легко",
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      name: "Гнездо Мудрости",
      description: "Математические задачи и пространственное мышление",
      icon: "🏠",
      difficulty: "Средне",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      name: "Куриный Университет",
      description: "Сложные матрицы и логические загадки",
      icon: "🎓",
      difficulty: "Сложно",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      name: "Факультет Логики",
      description: "Числовые ряды и криптарифмы",
      icon: "🧮",
      difficulty: "Очень сложно",
      color: "bg-indigo-100 border-indigo-300 text-indigo-800"
    },
    {
      name: "Лаборатория Гения",
      description: "Вероятность и теория игр",
      icon: "🔬",
      difficulty: "Экстремально",
      color: "bg-pink-100 border-pink-300 text-pink-800"
    },
    {
      name: "Космический Интеллект",
      description: "Задачи уровня MENSA",
      icon: "🚀",
      difficulty: "Гениальный",
      color: "bg-cyan-100 border-cyan-300 text-cyan-800"
    },
    {
      name: "Абсолютный Разум",
      description: "Самые сложные задачи человечества",
      icon: "🧠",
      difficulty: "Богоподобный",
      color: "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 text-purple-900"
    }
  ];

  const handleStageSelect = (stageIndex: number) => {
    if (stageIndex <= unlockedStages) {
      setCurrentStage(stageIndex);
      setGameState('puzzle');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Выберите этап обучения</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {stageData.map((stage, index) => {
          const isUnlocked = index <= unlockedStages;
          const isCurrent = index === chickenStage;
          const isCompleted = index < chickenStage;
          
          return (
            <div
              key={index}
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isUnlocked 
                  ? stage.color + (isCurrent ? ' ring-2 ring-offset-2 ring-blue-500' : '') 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => handleStageSelect(index)}
            >
              {/* Lock icon for locked stages */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  🔒
                </div>
              )}
              
              {/* Completion checkmark */}
              {isCompleted && (
                <div className="absolute top-2 right-2 text-green-500">
                  ✅
                </div>
              )}
              
              {/* Current stage indicator */}
              {isCurrent && (
                <div className="absolute top-2 right-2 text-blue-500">
                  ▶️
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="text-2xl">{stage.icon}</div>
                
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {index + 1}. {stage.name}
                  </div>
                  
                  <div className="text-xs mt-1 opacity-80">
                    {stage.description}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium">
                      {stage.difficulty}
                    </span>
                    
                    {isUnlocked && (
                      <GameButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStageSelect(index);
                        }}
                        size="sm"
                        variant={isCurrent ? "default" : "secondary"}
                      >
                        {isCurrent ? "Продолжить" : isCompleted ? "Повторить" : "Начать"}
                      </GameButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-1">
          Прогресс: {chickenStage + 1} из {stageData.length} этапов
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((chickenStage + 1) / stageData.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
