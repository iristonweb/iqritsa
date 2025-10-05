import { useState } from "react";
import GameButton from "../ui/GameButton";

interface AnalogiesProps {
  puzzle: any;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function Analogies({ puzzle, onAnswer, disabled }: AnalogiesProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Generate analogy puzzles
  const generateAnalogy = () => {
    const analogies = [
      {
        question: "Курица относится к яйцу, как дерево к ___?",
        options: ["листу", "плоду", "корню", "ветке"],
        correct: "плоду",
        explanation: "И курица несет яйца, и дерево дает плоды - это их продукты",
        category: "Биологические аналогии"
      },
      {
        question: "Врач относится к больнице, как учитель к ___?",
        options: ["ученику", "школе", "книге", "доске"],
        correct: "школе",
        explanation: "И врач работает в больнице, и учитель работает в школе - место работы",
        category: "Профессиональные аналогии"
      },
      {
        question: "Рука относится к пальцу, как нога к ___?",
        options: ["колену", "ступне", "пальцу ноги", "голени"],
        correct: "пальцу ноги",
        explanation: "Рука состоит из пальцев, нога тоже имеет пальцы",
        category: "Анатомические аналогии"
      },
      {
        question: "Молоток относится к гвоздю, как отвертка к ___?",
        options: ["винту", "доске", "металлу", "рукоятке"],
        correct: "винту",
        explanation: "Молоток вбивает гвозди, отвертка закручивает винты - инструмент и его объект",
        category: "Функциональные аналогии"
      },
      {
        question: "Начало относится к концу, как рассвет к ___?",
        options: ["утру", "закату", "дню", "вечеру"],
        correct: "закату",
        explanation: "Начало противоположно концу, рассвет противоположен закату",
        category: "Противоположности"
      }
    ];
    
    return analogies[Math.floor(Math.random() * analogies.length)];
  };

  const [analogyData] = useState(() => generateAnalogy());

  const handleAnswerSelect = (option: string) => {
    if (!disabled) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Аналогии</h2>
        <p className="text-gray-600">
          Найдите логическую связь между словами и выберите подходящий ответ
        </p>
      </div>

      {/* Category */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="text-purple-700 font-medium">
          {analogyData.category}
        </div>
      </div>

      {/* Analogy Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
        <div className="text-xl text-gray-800 text-center font-medium">
          {analogyData.question}
        </div>
      </div>

      {/* Answer Options */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center mb-6">
          Выберите правильный ответ:
        </h3>
        
        <div className="space-y-3">
          {analogyData.options.map((option, index) => (
            <button
              key={index}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-100 shadow-lg'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={disabled}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="text-lg">{option}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <GameButton
        onClick={handleSubmit}
        disabled={!selectedAnswer || disabled}
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
          <strong>Как решать:</strong> Определите, какая связь существует между первой парой слов, 
          затем найдите слово, которое имеет такую же связь с третьим словом.
        </div>
      </div>
    </div>
  );
}
