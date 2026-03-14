import { useState, useEffect } from "react";
import { useIQGame } from "../../lib/stores/useIQGame";
import { usePuzzles } from "../../lib/stores/usePuzzles";
import { useChicken } from "../../lib/stores/useChicken";
import { useGameAudio } from "../../hooks/useGameAudio";
import Timer from "../ui/Timer";
import GameButton from "../ui/GameButton";
import GameModal from "../ui/GameModal";
import ChickenCharacter from "./ChickenCharacter";

// Import puzzle components
import RavenMatrix from "../puzzles/RavenMatrix";
import LogicSequence from "../puzzles/LogicSequence";
import MathProblem from "../puzzles/MathProblem";
import Sudoku from "../puzzles/Sudoku";
import Analogies from "../puzzles/Analogies";
import SpatialThinking from "../puzzles/SpatialThinking";
import Cryptarithmetic from "../puzzles/Cryptarithmetic";
import Probability from "../puzzles/Probability";

const PUZZLE_TYPE_LABELS: Record<string, string> = {
  raven_matrix: 'МАТРИЦЫ РАВЕНА',
  logic_sequence: 'ЛОГИКА РЯДОВ',
  math_problem: 'МАТЕМАТИКА',
  sudoku: 'СУДОКУ',
  analogies: 'АНАЛОГИИ',
  spatial_thinking: 'ПРОСТРАНСТВО',
  cryptarithmetic: 'КРИПТАРИФМ',
  probability: 'ВЕРОЯТНОСТЬ',
};

const STAGE_COLORS = ['#ffd700', '#c0c0c0', '#4a9eff', '#9b59b6', '#1abc9c', '#e74c3c', '#00d4ff', '#ff00ff'];

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
  const { setMood, addNeurons, chickenStage } = useChicken();
  const { playSuccess, playError } = useGameAudio();

  const [timeLeft, setTimeLeft] = useState(120);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [earnedNeurons, setEarnedNeurons] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  const stageColor = STAGE_COLORS[Math.min(currentStage, STAGE_COLORS.length - 1)];

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isComplete && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeOut();
    }
  }, [timeLeft, isComplete, showResult]);

  // Reset timer on new puzzle
  useEffect(() => {
    if (currentPuzzle) {
      setTimeLeft(currentPuzzle.timeLimit || 120);
      setShowResult(false);
      setLastResult(null);
      setHint(null);
      setMood('thinking');
    }
  }, [currentPuzzle?.id]);

  const handleAnswer = async (answer: any) => {
    if (showResult) return;
    const isCorrect = await submitAnswer(answer);
    const bonusPoints = Math.max(1, Math.floor(timeLeft / 10));
    const neurons = isCorrect ? 10 + bonusPoints : 0;

    setLastResult(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    setEarnedNeurons(neurons);

    if (isCorrect) {
      setMood('happy');
      addNeurons(neurons);
      playSuccess();
      setTimeout(() => {
        setShowResult(false);
        if (isComplete) {
          setMood('excited');
          setTimeout(() => setGameState('hub'), 500);
        } else {
          nextPuzzle();
        }
      }, 2200);
    } else {
      setMood('confused');
      playError();
      setTimeout(() => {
        setShowResult(false);
        setMood('thinking');
      }, 1600);
    }
  };

  const handleTimeOut = () => {
    setLastResult('incorrect');
    setShowResult(true);
    setEarnedNeurons(0);
    setMood('confused');
    playError();
    setTimeout(() => {
      setShowResult(false);
      setMood('thinking');
    }, 2000);
  };

  const handleUseHint = () => {
    if (hints > 0 && currentPuzzle) {
      useHint();
      setMood('excited');
      if (currentPuzzle.hint) {
        setHint(currentPuzzle.hint);
      }
    }
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
    const puzzleProps = { puzzle: currentPuzzle, onAnswer: handleAnswer, disabled: showResult };

    switch (currentPuzzle.type) {
      case 'raven_matrix': return <RavenMatrix {...puzzleProps} />;
      case 'logic_sequence': return <LogicSequence {...puzzleProps} />;
      case 'math_problem': return <MathProblem {...puzzleProps} />;
      case 'sudoku': return <Sudoku {...puzzleProps} />;
      case 'analogies': return <Analogies {...puzzleProps} />;
      case 'spatial_thinking': return <SpatialThinking {...puzzleProps} />;
      case 'cryptarithmetic': return <Cryptarithmetic {...puzzleProps} />;
      case 'probability': return <Probability {...puzzleProps} />;
      default: return (
        <div className="flex items-center justify-center h-full">
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузка задачи...</p>
        </div>
      );
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto animate-spin-slow">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <circle cx="20" cy="20" r="16" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
              <circle cx="20" cy="20" r="8" fill="rgba(0,255,255,0.1)" stroke="#00ffff" strokeWidth="1"/>
            </svg>
          </div>
          <p className="text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.5)' }}>
            ГЕНЕРАЦИЯ ЗАДАЧИ...
          </p>
        </div>
      </div>
    );
  }

  const puzzleLabel = PUZZLE_TYPE_LABELS[currentPuzzle.type] || currentPuzzle.type.toUpperCase();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 relative"
        style={{
          background: 'rgba(0,0,0,0.7)',
          borderBottom: `1px solid ${stageColor}22`,
          backdropFilter: 'blur(10px)'
        }}>

        {/* Back button + stage info */}
        <div className="flex items-center gap-4">
          <GameButton
            onClick={() => setGameState('hub')}
            variant="ghost"
            size="sm"
          >
            ← НАЗАД
          </GameButton>

          <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.1)' }}/>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-neon-pulse"
              style={{ background: stageColor, boxShadow: `0 0 6px ${stageColor}` }}/>
            <span className="text-xs font-bold tracking-widest uppercase"
              style={{ color: stageColor }}>
              {puzzleLabel}
            </span>
          </div>

          <div className="text-xs tracking-widest px-2 py-0.5 rounded-sm"
            style={{
              color: 'rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
            ЭТАП {currentStage + 1}
          </div>
        </div>

        {/* Right side: timer + hints */}
        <div className="flex items-center gap-3">
          {/* Hint info */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${hints > 0 ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: hints > 0 ? '#ffd700' : '#444' }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7 Q14 7 14 10 Q14 12.5 12 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <span className="text-xs font-mono font-bold"
              style={{ color: hints > 0 ? '#ffd700' : 'rgba(255,255,255,0.2)' }}>
              {hints}
            </span>
          </div>

          <Timer timeLeft={timeLeft} />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Puzzle area */}
        <div className="flex-1 overflow-y-auto p-5 relative">
          {/* Puzzle type indicator */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${stageColor}33, transparent)` }}/>
            <span className="text-xs tracking-widest" style={{ color: stageColor + '88' }}>
              ЗАДАЧА АКТИВНА
            </span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${stageColor}33, transparent)` }}/>
          </div>

          {/* Puzzle panel */}
          <div className="max-w-3xl mx-auto rounded-sm overflow-hidden"
            style={{
              background: 'rgba(5,5,20,0.85)',
              border: `1px solid ${stageColor}33`,
              boxShadow: `0 0 30px ${stageColor}11`
            }}>
            {/* Puzzle content */}
            <div className="p-5">
              {getPuzzleComponent()}
            </div>
          </div>

          {/* Hint display */}
          {hint && (
            <div className="max-w-3xl mx-auto mt-4 px-4 py-3 rounded-sm"
              style={{
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.3)',
                boxShadow: '0 0 10px rgba(255,215,0,0.1)'
              }}>
              <div className="flex items-center gap-2 mb-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: '#ffd700' }}>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 7 Q14 7 14 10 Q14 12.5 12 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
                <span className="text-xs font-bold tracking-widest" style={{ color: '#ffd700' }}>ПОДСКАЗКА</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>{hint}</p>
            </div>
          )}
        </div>

        {/* Right sidebar: chicken + actions */}
        <div className="w-56 flex flex-col flex-shrink-0"
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderLeft: `1px solid ${stageColor}18`,
            backdropFilter: 'blur(10px)'
          }}>
          {/* Chicken */}
          <div className="p-4 flex flex-col items-center border-b" style={{ borderColor: `${stageColor}18` }}>
            <div className="w-32 h-36">
              <ChickenCharacter stage={chickenStage} />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <div className="text-xs tracking-widest mb-3 flex items-center gap-2"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              <div className="w-1 h-3 rounded-sm" style={{ background: stageColor }}/>
              ДЕЙСТВИЯ
            </div>

            <GameButton
              onClick={handleUseHint}
              variant="ghost"
              disabled={hints === 0 || showResult}
              className="w-full justify-start"
              size="sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mr-2"
                style={{ color: hints > 0 ? '#ffd700' : 'currentColor' }}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7 Q14 7 14 10 Q14 12.5 12 13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              ПОДСКАЗКА ({hints})
            </GameButton>

            <GameButton
              onClick={() => setShowSkipConfirm(true)}
              variant="ghost"
              disabled={showResult}
              className="w-full justify-start"
              size="sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M5 4 L15 12 L5 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              ПРОПУСТИТЬ
            </GameButton>
          </div>

          {/* Difficulty info */}
          <div className="mt-auto p-4 border-t" style={{ borderColor: `${stageColor}18` }}>
            <div className="text-xs mb-2 tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              СЛОЖНОСТЬ
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex-1 h-1 rounded-sm"
                  style={{
                    background: i < (currentPuzzle.difficulty || 1)
                      ? stageColor
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: i < (currentPuzzle.difficulty || 1) ? `0 0 4px ${stageColor}` : 'none'
                  }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result overlay */}
      {showResult && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}/>
          <div className="relative px-10 py-8 rounded-sm text-center"
            style={{
              background: 'rgba(5,5,20,0.95)',
              border: `2px solid ${lastResult === 'correct' ? '#00ff88' : '#ff3366'}`,
              boxShadow: `0 0 40px ${lastResult === 'correct' ? 'rgba(0,255,136,0.4)' : 'rgba(255,51,102,0.4)'}`
            }}>

            {/* Result icon */}
            <div className="w-16 h-16 mx-auto mb-4">
              {lastResult === 'correct' ? (
                <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
                  <circle cx="30" cy="30" r="28" stroke="#00ff88" strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 0 8px #00ff88)' }}/>
                  <path d="M18 30 L26 38 L42 22" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px #00ff88)' }}/>
                </svg>
              ) : (
                <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
                  <circle cx="30" cy="30" r="28" stroke="#ff3366" strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 0 8px #ff3366)' }}/>
                  <path d="M20 20 L40 40 M40 20 L20 40" stroke="#ff3366" strokeWidth="3" strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px #ff3366)' }}/>
                </svg>
              )}
            </div>

            <div className="text-lg font-black tracking-widest mb-2"
              style={{
                color: lastResult === 'correct' ? '#00ff88' : '#ff3366',
                textShadow: `0 0 15px ${lastResult === 'correct' ? '#00ff88' : '#ff3366'}`
              }}>
              {lastResult === 'correct' ? 'ВЕРНО!' : 'ОШИБКА'}
            </div>

            {lastResult === 'correct' && earnedNeurons > 0 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4">
                  <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                    <circle cx="8" cy="8" r="6" stroke="#a78bfa" strokeWidth="1"/>
                    <circle cx="8" cy="8" r="2.5" fill="#a78bfa"/>
                  </svg>
                </div>
                <span className="text-sm font-mono font-bold" style={{ color: '#a78bfa' }}>
                  +{earnedNeurons} НЕЙРОНОВ
                </span>
              </div>
            )}

            {lastResult === 'incorrect' && (
              <p className="text-xs tracking-wide" style={{ color: 'rgba(255,51,102,0.6)' }}>
                Попробуйте ещё раз...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Skip Confirmation Modal */}
      <GameModal
        isOpen={showSkipConfirm}
        onClose={() => setShowSkipConfirm(false)}
        title="ПРОПУСТИТЬ ЗАДАЧУ?"
        accentColor="red"
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4">
            <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
              <circle cx="28" cy="28" r="26" stroke="#ff3366" strokeWidth="1.5" fill="rgba(255,51,102,0.08)"/>
              <path d="M28 18 L28 30" stroke="#ff3366" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="28" cy="37" r="2" fill="#ff3366"/>
            </svg>
          </div>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Вы потеряете возможность заработать нейроны<br/>за эту задачу.
          </p>
          <div className="flex justify-center gap-3">
            <GameButton onClick={() => setShowSkipConfirm(false)} variant="secondary">
              ОТМЕНА
            </GameButton>
            <GameButton onClick={handleSkip} variant="danger">
              ПРОПУСТИТЬ
            </GameButton>
          </div>
        </div>
      </GameModal>
    </div>
  );
}
