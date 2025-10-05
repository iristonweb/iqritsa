import { useState, useEffect } from "react";
import GameButton from "../ui/GameButton";

interface RavenMatrixProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function RavenMatrix({ puzzle, onAnswer, disabled }: RavenMatrixProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Generate a simple Raven's matrix pattern
  const generateMatrix = () => {
    // For demo purposes, create a 3x3 pattern with shapes
    const shapes = ['○', '□', '△', '◇', '★', '♦', '●', '■', '▲'];
    const matrix = [
      [shapes[0], shapes[1], shapes[2]],
      [shapes[3], shapes[4], shapes[5]],
      [shapes[6], shapes[7], '?']
    ];
    
    // Generate 6 answer options
    const options = [shapes[8], shapes[0], shapes[2], shapes[4], shapes[6], shapes[1]];
    const correctIndex = 0; // shapes[8] is correct
    
    return { matrix, options, correctIndex };
  };

  const [matrixData] = useState(() => generateMatrix());

  const handleAnswerSelect = (optionIndex: number) => {
    if (!disabled) {
      setSelectedAnswer(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Матрица Равена</h2>
        <p className="text-gray-600">
          Найдите закономерность и выберите недостающий элемент
        </p>
      </div>

      {/* Matrix Display */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {matrixData.matrix.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-3xl ${
                  cell === '?' ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50'
                }`}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-center mb-4">Выберите правильный ответ:</h3>
        
        <div className="grid grid-cols-6 gap-3">
          {matrixData.options.map((option, index) => (
            <button
              key={index}
              className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl transition-all ${
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
    </div>
  );
}
