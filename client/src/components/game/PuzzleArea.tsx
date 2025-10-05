import { useState, useEffect } from "react";
import { useIQGame } from "../../lib/stores/useIQGame";
import { usePuzzles } from "../../lib/stores/usePuzzles";
import { useChicken } from "../../lib/stores/useChicken";
import { useGameAudio } from "../../hooks/useGameAudio";
import Timer from "../ui/Timer";
import GameButton from "../ui/GameButton";
import GameModal from "../ui/GameModal";

// Import puzzle components
import RavenMatrix from "../puzzles/RavenMatrix";
import LogicSequence from "../puzzles/LogicSequence";
import MathProblem from "../puzzles/MathProblem";
import Sudoku from "../puzzles/Sudoku";
import Analogies from "../puzzles/Analogies";
import SpatialThinking from "../puzzles/SpatialThinking";
import Cryptarithmetic from "../puzzles/Cryptarithmetic";
import Probability from "../puzzles/Probability";

export default function PuzzleArea() {
  const { setGameState } = useIQGame();
  const { 
    currentPuzzle, 
    currentStage, 
    hints, 
    isComplete,
    nextPuzzle,
    submitAnswer,
    useHint,
    skipPuzzle
  } = usePuzzles();
  const { setMood, addNeurons } = useChicken();
  const { playSuccess, playHit } = useGameAudio();
  
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per puzzle
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeOut();
    }
  }, [timeLeft, isComplete]);

  // Reset timer on new puzzle
  useEffect(() => {
    if (currentPuzzle) {
      setTimeLeft(120);
      setShowResult(false);
      setLastResult(null);
      setMood('thinking');
    }
  }, [currentPuzzle]);

  const handleAnswer = async (answer: any) => {
    const isCorrect = await submitAnswer(answer);
    const bonusPoints = Math.max(1, Math.floor(timeLeft / 10)); // Bonus for speed
    
    setLastResult(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    
    if (isCorrect) {
      setMood('happy');
      addNeurons(10 + bonusPoints);
      playSuccess();
      
      setTimeout(() => {
        if (isComplete) {
          setGameState('hub');
        } else {
          nextPuzzle();
        }
      }, 2000);
    } else {
      setMood('confused');
      playHit();
      
      setTimeout(() => {
        setShowResult(false);
        setMood('thinking');
      }, 1500);
    }
  };

  const handleTimeOut = () => {
    setLastResult('incorrect');
    setShowResult(true);
    setMood('confused');
    
    setTimeout(() => {
      setShowResult(false);
      setMood('thinking');
    }, 2000);
  };

  const handleUseHint = () => {
    useHint();
    setMood('excited');
  };

  const handleSkip = () => {
    skipPuzzle();
    setShowSkipConfirm(false);
    setMood('neutral');
    
    if (isComplete) {
      setGameState('hub');
    } else {
      nextPuzzle();
    }
  };

  const getPuzzleComponent = () => {
    if (!currentPuzzle) return null;
    
    const puzzleProps = {
      puzzle: currentPuzzle,
      onAnswer: handleAnswer,
      disabled: showResult
    };

    switch (currentPuzzle.type) {
      case 'raven_matrix':
        return <RavenMatrix {...puzzleProps} />;
      case 'logic_sequence':
        return <LogicSequence {...puzzleProps} />;
      case 'math_problem':
        return <MathProblem {...puzzleProps} />;
      case 'sudoku':
        return <Sudoku {...puzzleProps} />;
      case 'analogies':
        return <Analogies {...puzzleProps} />;
      case 'spatial_thinking':
        return <SpatialThinking {...puzzleProps} />;
      case 'cryptarithmetic':
        return <Cryptarithmetic {...puzzleProps} />;
      case 'probability':
        return <Probability {...puzzleProps} />;
      default:
        return <div>Неизвестный тип задачи</div>;
    }
  };

  const stageNames = [
    "Зёрнышки", "Цыплячья Тропа", "Гнездо Мудрости", "Куриный Университет",
    "Факультет Логики", "Лаборатория Гения", "Космический Интеллект", "Абсолютный Разум"
  ];

  if (!currentPuzzle) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🧠</div>
          <div>Загрузка задачи...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GameButton
              onClick={() => setGameState('hub')}
              variant="secondary"
              size="sm"
            >
              ← Назад к хабу
            </GameButton>
            
            <div className="text-lg font-semibold text-blue-600">
              {stageNames[currentStage]} - Задача {currentPuzzle.id}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Timer timeLeft={timeLeft} />
            
            <div className="text-sm text-gray-600">
              Подсказки: {hints}
            </div>
          </div>
        </div>
      </div>

      {/* Puzzle Area */}
      <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto h-full">
          {getPuzzleComponent()}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <GameButton
              onClick={handleUseHint}
              variant="secondary"
              disabled={hints === 0 || showResult}
            >
              💡 Подсказка ({hints})
            </GameButton>
            
            <GameButton
              onClick={() => setShowSkipConfirm(true)}
              variant="secondary"
              disabled={showResult}
            >
              ⏭️ Пропустить
            </GameButton>
          </div>
          
          <div className="text-sm text-gray-600">
            {currentPuzzle.hint && (
              <div className="bg-yellow-100 border border-yellow-300 rounded p-2 max-w-md">
                💡 {currentPuzzle.hint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <GameModal 
        isOpen={showResult}
        onClose={() => {}}
        title={lastResult === 'correct' ? "Правильно!" : "Неверно"}
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4">
            {lastResult === 'correct' ? '🎉' : '😔'}
          </div>
          
          <div className="text-xl font-semibold mb-2">
            {lastResult === 'correct' 
              ? "Отличная работа!" 
              : "Не расстраивайтесь, попробуйте еще раз!"
            }
          </div>
          
          {lastResult === 'correct' && (
            <div className="text-green-600">
              Получено нейронов: {10 + Math.max(1, Math.floor(timeLeft / 10))}
            </div>
          )}
        </div>
      </GameModal>

      {/* Skip Confirmation Modal */}
      <GameModal
        isOpen={showSkipConfirm}
        onClose={() => setShowSkipConfirm(false)}
        title="Пропустить задачу?"
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-4">🤔</div>
          <p className="mb-6">
            Вы уверены, что хотите пропустить эту задачу? 
            Вы не получите нейроны за её решение.
          </p>
          
          <div className="flex justify-center space-x-4">
            <GameButton
              onClick={() => setShowSkipConfirm(false)}
              variant="secondary"
            >
              Отмена
            </GameButton>
            
            <GameButton onClick={handleSkip}>
              Да, пропустить
            </GameButton>
          </div>
        </div>
      </GameModal>
    </div>
  );
}
