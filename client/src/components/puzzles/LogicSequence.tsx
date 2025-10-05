import { useState, useEffect } from "react";
import GameButton from "../ui/GameButton";

interface LogicSequenceProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function LogicSequence({ puzzle, onAnswer, disabled }: LogicSequenceProps) {
  const [userAnswer, setUserAnswer] = useState("");

  // Generate a logical sequence puzzle
  const generateSequence = () => {
    const sequences = [
      {
        sequence: [2, 4, 8, 16, "?"],
        answer: "32",
        explanation: "Каждое число удваивается",
        type: "Числовая прогрессия"
      },
      {
        sequence: [1, 1, 2, 3, 5, 8, "?"],
        answer: "13",
        explanation: "Числа Фибоначчи",
        type: "Последовательность Фибоначчи"
      },
      {
        sequence: ["А", "Б", "В", "Г", "?"],
        answer: "Д",
        explanation: "Буквы русского алфавита по порядку",
        type: "Буквенная последовательность"
      },
      {
        sequence: [3, 6, 12, 24, "?"],
        answer: "48", 
        explanation: "Каждое число удваивается",
        type: "Геометрическая прогрессия"
      },
      {
        sequence: [100, 81, 64, 49, 36, 25, "?"],
        answer: "16",
        explanation: "Квадраты чисел от 10 до 4",
        type: "Квадраты чисел"
      }
    ];
    
    return sequences[Math.floor(Math.random() * sequences.length)];
  };

  const [sequenceData] = useState(() => generateSequence());

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      onAnswer(userAnswer.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !disabled) {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Логическая Последовательность</h2>
        <p className="text-gray-600">
          Найдите закономерность и продолжите последовательность
        </p>
      </div>

      {/* Sequence Type */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-blue-700 font-medium">
          {sequenceData.type}
        </div>
      </div>

      {/* Sequence Display */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-4">
          {sequenceData.sequence.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
                  item === "?" 
                    ? 'border-red-400 bg-red-50 text-red-600' 
                    : 'border-blue-300 bg-blue-50 text-blue-700'
                }`}
              >
                {item}
              </div>
              
              {index < sequenceData.sequence.length - 1 && (
                <div className="mx-2 text-gray-400 text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Answer Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center mb-4">
          Что идет дальше?
        </h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите ответ..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-blue-500 focus:outline-none"
            disabled={disabled}
          />
          
          <GameButton
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || disabled}
            className="w-full"
            size="lg"
          >
            {disabled ? 'Обрабатывается...' : 'Ответить'}
          </GameButton>
        </div>
      </div>

      {/* Hint Display */}
      {puzzle.hint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-center">
          <div className="text-yellow-700">
            💡 <strong>Подсказка:</strong> {puzzle.hint}
          </div>
        </div>
      )}

      {/* Example explanation for context */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md text-center text-sm text-gray-600">
        <strong>Подсказка:</strong> Ищите математическую или логическую закономерность между соседними элементами
      </div>
    </div>
  );
}
