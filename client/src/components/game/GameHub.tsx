import { useEffect, useState } from "react";
import ChickenCharacter from "./ChickenCharacter";
import BrainVisualization from "./BrainVisualization";
import ProgressSystem from "./ProgressSystem";
import StageSelection from "./StageSelection";
import { useChicken } from "../../lib/stores/useChicken";
import { useIQGame } from "../../lib/stores/useIQGame";
import { useGameAudio } from "../../hooks/useGameAudio";
import GameButton from "../ui/GameButton";
import { Volume2, VolumeX } from "lucide-react";

export default function GameHub() {
  const { chickenStage, neurons, totalSolved } = useChicken();
  const { setGameState } = useIQGame();
  const { isMuted, toggleMute } = useGameAudio();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const stageNames = [
    "Простая Несушка",
    "Умная Курочка", 
    "Мыслящая Птица",
    "Куриный Студент",
    "Птичий Профессор",
    "Гениальная Клепа",
    "Космический Разум",
    "Абсолютный Интеллект"
  ];

  const environmentDescriptions = [
    "Простой курятник с соломой",
    "Курятник с книжками",
    "Научная лаборатория",
    "Университетская аудитория", 
    "Исследовательский центр",
    "Высокотехнологичная лаборатория",
    "Космическая станция",
    "Квантовый нейроинтерфейс"
  ];

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-yellow-200">
        <div className="text-2xl font-bold text-orange-600">
          IQ-рица: Эволюция Интеллекта
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-purple-600">
            Нейроны: {neurons}
          </div>
          <GameButton
            onClick={toggleMute}
            variant="secondary"
            size="sm"
            className="p-2"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </GameButton>
        </div>
      </div>

      {/* Main Hub Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Chicken and Environment */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              Клепа - {stageNames[chickenStage]}
            </h2>
            <p className="text-gray-600 text-lg">
              {environmentDescriptions[chickenStage]}
            </p>
          </div>

          {/* Chicken Character Display */}
          <div className="relative mb-8">
            <ChickenCharacter stage={chickenStage} />
            
            {/* Brain Visualization Overlay */}
            <div className="absolute -top-12 -right-12 w-24 h-24">
              <BrainVisualization stage={chickenStage} />
            </div>
          </div>

          {/* Stats Display */}
          <div className="flex gap-6 text-center">
            <div className="bg-white/90 rounded-lg p-4 border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{totalSolved}</div>
              <div className="text-sm text-gray-600">Задач решено</div>
            </div>
            <div className="bg-white/90 rounded-lg p-4 border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{chickenStage + 1}</div>
              <div className="text-sm text-gray-600">Уровень</div>
            </div>
            <div className="bg-white/90 rounded-lg p-4 border-2 border-green-200">
              <div className="text-2xl font-bold text-green-600">{neurons}</div>
              <div className="text-sm text-gray-600">Нейроны</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Progress and Actions */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-yellow-200 flex flex-col">
          {/* Progress System */}
          <div className="p-6">
            <ProgressSystem />
          </div>

          {/* Stage Selection */}
          <div className="flex-1 p-6">
            <StageSelection />
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3">
            <GameButton
              onClick={() => setGameState('puzzle')}
              className="w-full"
              size="lg"
            >
              🧠 Начать тренировку
            </GameButton>
            
            <GameButton
              onClick={() => setShowShop(true)}
              variant="secondary"
              className="w-full"
            >
              🛒 Магазин улучшений
            </GameButton>
            
            <GameButton
              onClick={() => setShowAchievements(true)}
              variant="secondary"
              className="w-full"
            >
              🏆 Достижения
            </GameButton>
          </div>
        </div>
      </div>

      {/* Story Text */}
      <div className="bg-orange-100 border-t border-orange-200 p-4 text-center">
        <p className="text-orange-800 italic">
          "После научного эксперимента интеллект Клепы начал стремительно расти. 
          Помогите ей пройти через Поляну Испытаний и достичь абсолютного разума!"
        </p>
      </div>
    </div>
  );
}
