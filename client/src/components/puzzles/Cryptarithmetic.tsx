import { useState } from "react";
import GameButton from "../ui/GameButton";

interface CryptarithmeticProps {
  puzzle: any;
  onAnswer: (answer: { [key: string]: number }) => void;
  disabled: boolean;
}

export default function Cryptarithmetic({ puzzle, onAnswer, disabled }: CryptarithmeticProps) {
  const [letterValues, setLetterValues] = useState<{ [key: string]: string }>({});

  // Generate cryptarithmetic puzzle
  const generateCryptarithmetic = () => {
    const puzzles = [
      {
        equation: "SEND + MORE = MONEY",
        letters: ["S", "E", "N", "D", "M", "O", "R", "Y"],
        solution: { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
        hint: "M должно быть 1, так как это максимальный перенос",
        description: "Классическая задача криптарифметики"
      },
      {
        equation: "ABC + ABC = BCA",
        letters: ["A", "B", "C"],
        solution: { A: 1, B: 0, C: 9 },
        hint: "B должно быть 0, чтобы сумма имела тот же разряд",
        description: "Простая трехбуквенная задача"
      },
      {
        equation: "HE + SHE = HELP",
        letters: ["H", "E", "S", "L", "P"],
        solution: { H: 8, E: 5, S: 9, L: 1, P: 3 },
        hint: "H не может быть 0, так как стоит первым",
        description: "Задача на сложение с переносом"
      }
    ];
    
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  };

  const [cryptoData] = useState(() => generateCryptarithmetic());

  const handleLetterInput = (letter: string, value: string) => {
    if (!disabled) {
      setLetterValues(prev => ({
        ...prev,
        [letter]: value
      }));
    }
  };

  const handleSubmit = () => {
    const answer: { [key: string]: number } = {};
    
    for (const letter of cryptoData.letters) {
      const value = parseInt(letterValues[letter]);
      if (!isNaN(value) && value >= 0 && value <= 9) {
        answer[letter] = value;
      } else {
        // Incomplete answer
        return;
      }
    }
    
    onAnswer(answer);
  };

  const isAnswerComplete = () => {
    return cryptoData.letters.every(letter => {
      const value = parseInt(letterValues[letter]);
      return !isNaN(value) && value >= 0 && value <= 9;
    });
  };

  const hasUniqueValues = () => {
    const values = cryptoData.letters
      .map(letter => parseInt(letterValues[letter]))
      .filter(val => !isNaN(val));
    
    return values.length === new Set(values).size;
  };

  const renderEquation = () => {
    const equation = cryptoData.equation;
    const parts = equation.split(/(\s*[+\-=]\s*)/);
    
    return (
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-gray-800 mb-4">
          {parts.map((part, index) => {
            if (part.includes('+') || part.includes('-') || part.includes('=')) {
              return (
                <span key={index} className="text-blue-600 mx-2">
                  {part.trim()}
                </span>
              );
            } else {
              return (
                <span key={index} className="tracking-wider">
                  {part}
                </span>
              );
            }
          })}
        </div>
        
        {/* Show numerical representation if letters are filled */}
        {isAnswerComplete() && (
          <div className="text-xl font-mono text-gray-600 mt-4">
            {parts.map((part, index) => {
              if (part.includes('+') || part.includes('-') || part.includes('=')) {
                return (
                  <span key={index} className="text-blue-600 mx-2">
                    {part.trim()}
                  </span>
                );
              } else {
                const numericPart = part.split('').map(char => {
                  if (cryptoData.letters.includes(char)) {
                    return letterValues[char] || '?';
                  }
                  return char;
                }).join('');
                
                return (
                  <span key={index} className="tracking-wider">
                    {numericPart}
                  </span>
                );
              }
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Криптарифметика</h2>
        <p className="text-gray-600">
          Замените буквы цифрами так, чтобы арифметическое равенство стало верным
        </p>
      </div>

      {/* Description */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
        <div className="text-cyan-700 font-medium">
          {cryptoData.description}
        </div>
      </div>

      {/* Equation Display */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {renderEquation()}
      </div>

      {/* Letter Input Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-center mb-6">
          Назначьте цифры буквам (0-9):
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {cryptoData.letters.map(letter => (
            <div key={letter} className="flex items-center space-x-3">
              <label className="text-xl font-bold text-gray-700 w-8">
                {letter} =
              </label>
              <input
                type="number"
                min="0"
                max="9"
                value={letterValues[letter] || ""}
                onChange={(e) => handleLetterInput(letter, e.target.value)}
                className="w-16 h-12 border-2 border-gray-300 rounded text-center text-lg font-bold focus:border-blue-500 focus:outline-none"
                disabled={disabled}
                placeholder="?"
              />
            </div>
          ))}
        </div>
        
        {/* Validation Messages */}
        {isAnswerComplete() && !hasUniqueValues() && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
            ⚠️ Каждая буква должна иметь уникальную цифру!
          </div>
        )}
        
        {isAnswerComplete() && hasUniqueValues() && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm text-center">
            ✓ Все значения заполнены и уникальны
          </div>
        )}
      </div>

      {/* Submit Button */}
      <GameButton
        onClick={handleSubmit}
        disabled={!isAnswerComplete() || !hasUniqueValues() || disabled}
        size="lg"
        className="px-8"
      >
        {disabled ? 'Обрабатывается...' : 'Проверить решение'}
      </GameButton>

      {/* Hint Display */}
      {puzzle.hint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-center">
          <div className="text-yellow-700">
            💡 <strong>Подсказка:</strong> {puzzle.hint}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg text-center text-sm">
        <div className="text-blue-700">
          <strong>Правила:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Каждая буква представляет одну цифру (0-9)</li>
            <li>Разные буквы означают разные цифры</li>
            <li>Одинаковые буквы означают одинаковые цифры</li>
            <li>Первая буква числа не может быть 0</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
