import { useState } from "react";
import GameButton from "../ui/GameButton";

interface MathProblemProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function MathProblem({ puzzle, onAnswer, disabled }: MathProblemProps) {
  const [userAnswer, setUserAnswer] = useState("");

  // Generate various math problems based on difficulty
  const generateMathProblem = () => {
    const problems = [
      {
        question: "Если 5 куриц несут 5 яиц за 5 дней, сколько яиц снесут 10 куриц за 10 дней?",
        answer: 20,
        explanation: "Одна курица несет одно яйцо за 5 дней, значит за 10 дней - 2 яйца. 10 куриц × 2 яйца = 20 яиц",
        type: "Логическая задача"
      },
      {
        question: "Найдите x: 3x + 15 = 48",
        answer: 11,
        explanation: "3x = 48 - 15 = 33, x = 33 ÷ 3 = 11",
        type: "Алгебраическое уравнение"
      },
      {
        question: "Сколько различных способов можно выбрать 2 курицы из 5?",
        answer: 10,
        explanation: "C(5,2) = 5!/(2!×3!) = (5×4)/(2×1) = 10",
        type: "Комбинаторика"
      },
      {
        question: "Периметр прямоугольного курятника 24 м, длина в 2 раза больше ширины. Найдите площадь.",
        answer: 32,
        explanation: "Пусть ширина = x, длина = 2x. Периметр: 2(x + 2x) = 6x = 24, x = 4. Площадь = 4 × 8 = 32 м²",
        type: "Геометрическая задача"
      },
      {
        question: "Каков следующий член последовательности: 2, 6, 18, 54, ...?",
        answer: 162,
        explanation: "Каждый следующий член умножается на 3: 54 × 3 = 162",
        type: "Арифметическая прогрессия"
      }
    ];
    
    return problems[Math.floor(Math.random() * problems.length)];
  };

  const [problemData] = useState(() => generateMathProblem());

  const handleSubmit = () => {
    const numAnswer = parseFloat(userAnswer);
    if (!isNaN(numAnswer)) {
      onAnswer(numAnswer);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Математическая Задача</h2>
        <p className="text-gray-600">
          Решите задачу и введите числовой ответ
        </p>
      </div>

      {/* Problem Type */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="text-green-700 font-medium">
          {problemData.type}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
        <div className="text-lg text-gray-800 leading-relaxed text-center">
          {problemData.question}
        </div>
      </div>

      {/* Answer Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center mb-4">
          Ваш ответ:
        </h3>
        
        <div className="space-y-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите число..."
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

      {/* Formula helper */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md text-center text-sm">
        <div className="text-blue-700">
          <strong>Совет:</strong> Внимательно читайте условие и разбейте задачу на простые шаги
        </div>
      </div>
    </div>
  );
}
