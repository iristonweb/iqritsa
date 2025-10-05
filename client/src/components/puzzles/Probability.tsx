import { useState } from "react";
import GameButton from "../ui/GameButton";

interface ProbabilityProps {
  puzzle: any;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

export default function Probability({ puzzle, onAnswer, disabled }: ProbabilityProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFormat, setAnswerFormat] = useState<'fraction' | 'decimal' | 'percentage'>('fraction');

  // Generate probability puzzle
  const generateProbabilityPuzzle = () => {
    const puzzles = [
      {
        question: "В корзине 12 яиц: 8 белых и 4 коричневых. Какова вероятность вытащить белое яйцо?",
        answer: 2/3,
        explanation: "P = 8/12 = 2/3 ≈ 0.67 или 67%",
        type: "Простая вероятность",
        format: "fraction"
      },
      {
        question: "Бросаем игральную кость два раза. Какова вероятность получить сумму 7?",
        answer: 1/6,
        explanation: "Возможных исходов: 36. Благоприятных (1+6, 2+5, 3+4, 4+3, 5+2, 6+1): 6. P = 6/36 = 1/6",
        type: "Сложная вероятность",
        format: "fraction"
      },
      {
        question: "Из колоды 52 карты извлекают одну карту. Какова вероятность, что это туз или король?",
        answer: 2/13,
        explanation: "Тузов: 4, королей: 4. P = (4+4)/52 = 8/52 = 2/13",
        type: "Вероятность объединения событий",
        format: "fraction"
      },
      {
        question: "Вероятность дождя завтра 0.3, а вероятность ветра 0.4. Если события независимы, какова вероятность И дождя, И ветра?",
        answer: 0.12,
        explanation: "P(A и B) = P(A) × P(B) = 0.3 × 0.4 = 0.12",
        type: "Независимые события",
        format: "decimal"
      },
      {
        question: "В урне 5 красных и 3 синих шара. Вытаскиваем 2 шара без возвращения. Какова вероятность, что оба красные?",
        answer: 5/14,
        explanation: "P = (5/8) × (4/7) = 20/56 = 5/14",
        type: "Условная вероятность",
        format: "fraction"
      }
    ];
    
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  };

  const [probabilityData] = useState(() => generateProbabilityPuzzle());

  const parseAnswer = (input: string): number => {
    // Try to parse as fraction (e.g., "1/6", "2/3")
    if (input.includes('/')) {
      const [numerator, denominator] = input.split('/').map(s => parseFloat(s.trim()));
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
    
    // Try to parse as percentage (e.g., "50%")
    if (input.includes('%')) {
      const percentage = parseFloat(input.replace('%', ''));
      if (!isNaN(percentage)) {
        return percentage / 100;
      }
    }
    
    // Try to parse as decimal
    const decimal = parseFloat(input);
    if (!isNaN(decimal)) {
      return decimal;
    }
    
    return NaN;
  };

  const handleSubmit = () => {
    const parsedAnswer = parseAnswer(userAnswer);
    if (!isNaN(parsedAnswer)) {
      onAnswer(parsedAnswer);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !disabled) {
      handleSubmit();
    }
  };

  const isAnswerValid = () => {
    const parsed = parseAnswer(userAnswer);
    return !isNaN(parsed) && parsed >= 0 && parsed <= 1;
  };

  const getAnswerFormatHint = () => {
    switch (probabilityData.format) {
      case 'fraction':
        return "Ответ можно дать в виде дроби (например: 1/6) или десятичной дроби (например: 0.167)";
      case 'decimal':
        return "Ответ дайте в виде десятичной дроби (например: 0.25)";
      case 'percentage':
        return "Ответ можно дать в процентах (например: 25%) или десятичной дроби (например: 0.25)";
      default:
        return "Ответ можно дать в виде дроби, десятичной дроби или процентов";
    }
  };

  const renderVisualization = () => {
    // Simple visual aid based on puzzle type
    if (probabilityData.type.includes("игральную кость")) {
      return (
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded text-center text-xl">🎲</div>
          <div className="text-2xl">+</div>
          <div className="w-12 h-12 bg-white border-2 border-gray-400 rounded text-center text-xl">🎲</div>
        </div>
      );
    }
    
    if (probabilityData.type.includes("карт")) {
      return (
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="w-8 h-12 bg-blue-500 border border-blue-700 rounded text-white text-center">🂠</div>
          ))}
        </div>
      );
    }
    
    if (probabilityData.type.includes("яиц") || probabilityData.type.includes("шар")) {
      return (
        <div className="flex justify-center space-x-2 mb-6">
          <div className="text-2xl">🥚</div>
          <div className="text-2xl">🥚</div>
          <div className="text-2xl">🥚</div>
          <div className="text-gray-400 text-xl">...</div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Теория Вероятностей</h2>
        <p className="text-gray-600">
          Рассчитайте вероятность указанного события
        </p>
      </div>

      {/* Puzzle Type */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
        <div className="text-pink-700 font-medium">
          {probabilityData.type}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
        {renderVisualization()}
        
        <div className="text-lg text-gray-800 leading-relaxed text-center">
          {probabilityData.question}
        </div>
      </div>

      {/* Answer Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center mb-4">
          Ваш ответ:
        </h3>
        
        <div className="space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Например: 1/6 или 0.167 или 16.7%"
            className={`w-full px-4 py-3 border-2 rounded-lg text-center text-xl font-bold focus:outline-none ${
              userAnswer && isAnswerValid() 
                ? 'border-green-500 bg-green-50' 
                : userAnswer && !isAnswerValid()
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            disabled={disabled}
          />
          
          {userAnswer && !isAnswerValid() && (
            <div className="text-red-600 text-sm text-center">
              ⚠️ Вероятность должна быть числом от 0 до 1
            </div>
          )}
          
          <GameButton
            onClick={handleSubmit}
            disabled={!userAnswer.trim() || !isAnswerValid() || disabled}
            className="w-full"
            size="lg"
          >
            {disabled ? 'Обрабатывается...' : 'Ответить'}
          </GameButton>
        </div>
      </div>

      {/* Format Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg text-center text-sm">
        <div className="text-blue-700">
          <strong>Формат ответа:</strong><br />
          {getAnswerFormatHint()}
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

      {/* Probability Formula Reminder */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-lg text-center text-sm">
        <div className="text-gray-700">
          <strong>Напоминание:</strong> Вероятность = Количество благоприятных исходов / Общее количество возможных исходов
        </div>
      </div>
    </div>
  );
}
