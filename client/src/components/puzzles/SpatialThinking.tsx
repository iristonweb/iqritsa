import { useState } from "react";
import GameButton from "../ui/GameButton";

interface SpatialThinkingProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function SpatialThinking({ puzzle, onAnswer, disabled }: SpatialThinkingProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Generate spatial thinking puzzle
  const generateSpatialPuzzle = () => {
    const puzzles = [
      {
        type: "Поворот фигуры",
        description: "Какая из фигур является результатом поворота исходной фигуры на 90° по часовой стрелке?",
        originalShape: "🔸",
        options: ["🔹", "🔸", "◂", "▸"],
        correct: 2,
        explanation: "При повороте на 90° ромб изменяет ориентацию"
      },
      {
        type: "Отражение",
        description: "Какая фигура получится при отражении исходной фигуры по вертикальной оси?",
        originalShape: "◥",
        options: ["◤", "◢", "◣", "◥"],
        correct: 0,
        explanation: "При отражении по вертикали треугольник меняет направление"
      },
      {
        type: "Развертка куба",
        description: "Какая из разверток может быть свернута в куб?",
        originalShape: "⬛",
        options: ["┼", "⊥", "┬", "├"],
        correct: 0,
        explanation: "Только крестообразная развертка образует полный куб"
      },
      {
        type: "Подсчет граней",
        description: "Сколько граней у этой трехмерной фигуры?",
        originalShape: "🔺",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "Тетраэдр (треугольная пирамида) имеет 4 грани"
      },
      {
        type: "Сечение",
        description: "Какая фигура получится при разрезе куба диагональной плоскостью?",
        originalShape: "⬛",
        options: ["⬜", "🔸", "⬟", "○"],
        correct: 2,
        explanation: "Диагональное сечение куба образует шестиугольник"
      }
    ];
    
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  };

  const [puzzleData] = useState(() => generateSpatialPuzzle());

  const handleAnswerSelect = (index: number) => {
    if (!disabled) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  const renderVisualization = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-6">Исходная фигура:</h3>
          
          <div className="relative mb-6">
            {/* Original shape display */}
            <div className="text-8xl mb-4">
              {puzzleData.originalShape}
            </div>
            
            {/* Add some visual context based on puzzle type */}
            {puzzleData.type === "Поворот фигуры" && (
              <div className="absolute top-0 right-0 text-2xl animate-spin">
                ↻
              </div>
            )}
            
            {puzzleData.type === "Отражение" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-30">
                |
              </div>
            )}
            
            {puzzleData.type.includes("куб") && (
              <div className="grid grid-cols-3 gap-1 mt-4 mx-auto w-fit">
                <div className="w-6 h-6"></div>
                <div className="w-6 h-6 bg-blue-300 border border-blue-500"></div>
                <div className="w-6 h-6"></div>
                <div className="w-6 h-6 bg-blue-300 border border-blue-500"></div>
                <div className="w-6 h-6 bg-blue-500 border border-blue-700"></div>
                <div className="w-6 h-6 bg-blue-300 border border-blue-500"></div>
                <div className="w-6 h-6"></div>
                <div className="w-6 h-6 bg-blue-300 border border-blue-500"></div>
                <div className="w-6 h-6"></div>
              </div>
            )}
          </div>
          
          <div className="text-gray-600">
            {puzzleData.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Пространственное Мышление</h2>
        <p className="text-gray-600">
          Представьте трансформацию фигуры в пространстве
        </p>
      </div>

      {/* Puzzle Type */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
        <div className="text-indigo-700 font-medium">
          {puzzleData.type}
        </div>
      </div>

      {/* Visualization */}
      {renderVisualization()}

      {/* Answer Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-center mb-6">
          Выберите правильный ответ:
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {puzzleData.options.map((option, index) => (
            <button
              key={index}
              className={`w-20 h-20 border-2 rounded-lg flex items-center justify-center text-3xl transition-all ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-100 shadow-lg transform scale-105'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={disabled}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <GameButton
        onClick={handleSubmit}
        disabled={selectedAnswer === null || disabled}
        size="lg"
        className="px-8"
      >
        {disabled ? 'Обрабатывается...' : 'Ответить'}
      </GameButton>

      {/* Hint Display */}
      {puzzle.hint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-center">
          <div className="text-yellow-700">
            💡 <strong>Подсказка:</strong> {puzzle.hint}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-lg text-center text-sm">
        <div className="text-gray-700">
          <strong>Совет:</strong> Попробуйте мысленно представить, как изменится фигура при указанной трансформации. 
          Используйте воображение для визуализации процесса.
        </div>
      </div>
    </div>
  );
}
