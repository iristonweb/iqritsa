import { useState, useEffect, useRef } from "react";
import { useIQGame } from "../../lib/stores/useIQGame";
import { usePuzzles } from "../../lib/stores/usePuzzles";
import { useChicken } from "../../lib/stores/useChicken";
import { useGameAudio } from "../../hooks/useGameAudio";
import Timer from "../ui/Timer";
import GameButton from "../ui/GameButton";
import GameModal from "../ui/GameModal";
import ChickenCharacter from "./ChickenCharacter";

import RavenMatrix from "../puzzles/RavenMatrix";
import LogicSequence from "../puzzles/LogicSequence";
import MathProblem from "../puzzles/MathProblem";
import Sudoku from "../puzzles/Sudoku";
import Analogies from "../puzzles/Analogies";
import SpatialThinking from "../puzzles/SpatialThinking";
import Cryptarithmetic from "../puzzles/Cryptarithmetic";
import Probability from "../puzzles/Probability";
import VerbalReasoning from "../puzzles/VerbalReasoning";

const PUZZLE_TYPE_LABELS: Record<string, string> = {
  raven_matrix: 'МАТРИЦЫ РАВЕНА',
  logic_sequence: 'ЛОГИКА РЯДОВ',
  math_problem: 'МАТЕМАТИКА',
  sudoku: 'СУДОКУ',
  analogies: 'АНАЛОГИИ',
  spatial_thinking: 'ПРОСТРАНСТВО',
  cryptarithmetic: 'КРИПТАРИФМ',
  probability: 'ВЕРОЯТНОСТЬ',
  verbal_reasoning: 'СЛОВО И РАЗУМ',
};

const STAGE_COLORS = ['#ffd700','#c0c0c0','#4a9eff','#9b59b6','#1abc9c','#e74c3c','#00d4ff','#ff00ff'];

export default function PuzzleArea() {
  const { setGameState } = useIQGame();
  const {
    currentPuzzle, currentStage, sessionStats, hints,
    isComplete, nextPuzzle, submitAnswer, useHint, skipPuzzle
  } = usePuzzles();
  const { setMood, addNeurons, solvePuzzle, chickenStage, upgrades } = useChicken();
  const { playSuccess, playError } = useGameAudio();

  const [timeLeft, setTimeLeft]       = useState(120);
  const [showResult, setShowResult]   = useState(false);
  const [lastResult, setLastResult]   = useState<'correct' | 'incorrect' | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [earnedNeurons, setEarnedNeurons]     = useState(0);
  const [hint, setHint]               = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const puzzleStartTime = useRef<number>(Date.now());
  const stageColor = STAGE_COLORS[Math.min(currentStage, STAGE_COLORS.length - 1)];
  const requiredPuzzles = 5;
  const solvedCount = sessionStats.solved;

  // Timer
  useEffect(() => {
    if (!currentPuzzle || showResult || isComplete) return;
    if (timeLeft <= 0) { handleTimeOut(); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showResult, isComplete, currentPuzzle]);

  // Reset on new puzzle
  useEffect(() => {
    if (!currentPuzzle) return;
    const base = currentPuzzle.timeLimit || 120;
    const mult = 1 + (upgrades.timeBonus * 0.2);
    setTimeLeft(Math.round(base * mult));
    setShowResult(false);
    setLastResult(null);
    setHint(null);
    setMood('thinking');
    puzzleStartTime.current = Date.now();
  }, [currentPuzzle?.id]);

  // Stage complete → back to hub
  useEffect(() => {
    if (!isComplete) return;
    setMood('excited');
    const t = setTimeout(() => setGameState('hub'), 2500);
    return () => clearTimeout(t);
  }, [isComplete]);

  const handleAnswer = async (answer: any) => {
    if (showResult) return;
    const timeSpent = (Date.now() - puzzleStartTime.current) / 1000;
    const isCorrect = await submitAnswer(answer);
    const bonusPoints = Math.max(1, Math.floor(timeLeft / 10));
    const neurons = isCorrect ? 10 + bonusPoints : 0;

    setLastResult(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    setEarnedNeurons(neurons);

    if (isCorrect) {
      solvePuzzle(timeSpent, 0);
      addNeurons(neurons);
      setMood('happy');
      playSuccess();
      setTimeout(() => { setShowResult(false); nextPuzzle(); }, 2000);
    } else {
      setMood('confused');
      playError();
      setTimeout(() => { setShowResult(false); setMood('thinking'); }, 1600);
    }
  };

  const handleTimeOut = () => {
    setLastResult('incorrect');
    setShowResult(true);
    setMood('confused');
    playError();
    setTimeout(() => { setShowResult(false); setMood('thinking'); nextPuzzle(); }, 2000);
  };

  const handleUseHint = () => {
    if (hints > 0 && currentPuzzle) {
      useHint();
      setMood('excited');
      if (currentPuzzle.hint) setHint(currentPuzzle.hint);
      setTimeout(() => setMood('thinking'), 1000);
    }
  };

  const handleSkip = () => {
    skipPuzzle();
    setShowSkipConfirm(false);
    setMood('neutral');
    nextPuzzle();
  };

  const getPuzzleComponent = () => {
    if (!currentPuzzle) return null;
    const props = { puzzle: currentPuzzle, onAnswer: handleAnswer, disabled: showResult };
    switch (currentPuzzle.type) {
      case 'raven_matrix':    return <RavenMatrix {...props} />;
      case 'logic_sequence':  return <LogicSequence {...props} />;
      case 'math_problem':    return <MathProblem {...props} />;
      case 'sudoku':          return <Sudoku {...props} />;
      case 'analogies':       return <Analogies {...props} />;
      case 'spatial_thinking':return <SpatialThinking {...props} />;
      case 'cryptarithmetic':  return <Cryptarithmetic {...props} />;
      case 'probability':      return <Probability {...props} />;
      case 'verbal_reasoning': return <VerbalReasoning {...props} />;
      default: return (
        <div className="flex items-center justify-center h-32">
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Загрузка...</p>
        </div>
      );
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto animate-spin-slow">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <circle cx="20" cy="20" r="16" stroke="#00ffff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
              <circle cx="20" cy="20" r="8" fill="rgba(0,255,255,0.1)" stroke="#00ffff" strokeWidth="1"/>
            </svg>
          </div>
          <p className="text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.5)' }}>ГЕНЕРАЦИЯ ЗАДАЧИ...</p>
        </div>
      </div>
    );
  }

  const puzzleLabel = PUZZLE_TYPE_LABELS[currentPuzzle.type] || currentPuzzle.type.toUpperCase();

  return (
    <div className="w-full h-full flex flex-col relative" style={{ overflow: 'hidden' }}>

      {/* ─── HEADER ─── */}
      <header className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{
          background: 'rgba(0,0,0,0.8)',
          borderBottom: `1px solid ${stageColor}22`,
          backdropFilter: 'blur(10px)',
          minHeight: '48px'
        }}>

        {/* Left: back + label */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setGameState('hub')}
            className="flex-shrink-0 px-2 py-1 text-xs tracking-widest rounded-sm transition-all"
            style={{
              color: 'rgba(0,255,255,0.7)',
              border: '1px solid rgba(0,255,255,0.2)',
              background: 'rgba(0,0,0,0.4)'
            }}>
            ← НАЗАД
          </button>

          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-neon-pulse"
              style={{ background: stageColor }}/>
            <span className="text-xs font-bold tracking-wider truncate hidden sm:block"
              style={{ color: stageColor }}>
              {puzzleLabel}
            </span>
            <span className="text-xs font-bold tracking-wider truncate sm:hidden"
              style={{ color: stageColor }}>
              {puzzleLabel.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Center: progress — visible on all sizes */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-mono font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {solvedCount}/{requiredPuzzles}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: requiredPuzzles }, (_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{
                  background: i < solvedCount ? stageColor : 'rgba(255,255,255,0.12)',
                  boxShadow: i < solvedCount ? `0 0 4px ${stageColor}` : 'none',
                  transition: 'all 0.3s'
                }}/>
            ))}
          </div>
        </div>

        {/* Right: timer + hint + menu button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Hint badge */}
          <button onClick={handleUseHint} disabled={hints === 0 || showResult}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-sm text-xs"
            style={{
              border: `1px solid ${hints > 0 ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
              background: 'rgba(0,0,0,0.4)',
              color: hints > 0 ? '#ffd700' : '#444',
              cursor: hints > 0 ? 'pointer' : 'not-allowed'
            }}>
            ? {hints}
          </button>

          <Timer timeLeft={timeLeft} />

          {/* Mobile menu toggle */}
          <button onClick={() => setShowSidebar(s => !s)}
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-sm"
            style={{
              border: `1px solid ${stageColor}33`,
              background: 'rgba(0,0,0,0.4)',
              color: stageColor
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      {/* On mobile: column. On desktop: row */}
      <div className="flex-1 flex overflow-hidden"
        style={{ flexDirection: 'row' }}>

        {/* Puzzle scroll area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">

          {/* Puzzle card */}
          <div className="rounded-sm overflow-hidden"
            style={{
              background: 'rgba(5,5,20,0.9)',
              border: `1px solid ${stageColor}33`,
              boxShadow: `0 0 20px ${stageColor}0a`
            }}>
            <div className="p-3 sm:p-5">
              {getPuzzleComponent()}
            </div>
          </div>

          {/* Hint display */}
          {hint && (
            <div className="mt-3 px-4 py-3 rounded-sm"
              style={{
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.3)'
              }}>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#ffd700' }}>ПОДСКАЗКА</p>
              <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>{hint}</p>
            </div>
          )}

          {/* Mobile action bar */}
          <div className="sm:hidden mt-3 flex gap-2">
            <button onClick={handleUseHint} disabled={hints === 0 || showResult}
              className="flex-1 py-2 rounded-sm text-xs font-bold tracking-widest"
              style={{
                border: `1px solid ${hints > 0 ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: 'rgba(0,0,0,0.5)',
                color: hints > 0 ? '#ffd700' : '#444',
                cursor: hints > 0 ? 'pointer' : 'not-allowed',
                opacity: hints === 0 ? 0.5 : 1
              }}>
              ? ПОДСКАЗКА ({hints})
            </button>
            <button onClick={() => setShowSkipConfirm(true)} disabled={showResult}
              className="flex-1 py-2 rounded-sm text-xs font-bold tracking-widest"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.5)',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }}>
              ▶| ПРОПУСТИТЬ
            </button>
          </div>

          {/* Difficulty (mobile) */}
          <div className="sm:hidden mt-3 flex items-center gap-3 px-1">
            <span className="text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>СЛОЖНОСТЬ</span>
            <div className="flex gap-1 flex-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex-1 h-1 rounded-sm"
                  style={{
                    background: i < (currentPuzzle.difficulty || 1) ? stageColor : 'rgba(255,255,255,0.08)',
                    boxShadow: i < (currentPuzzle.difficulty || 1) ? `0 0 4px ${stageColor}` : 'none'
                  }}/>
              ))}
            </div>
          </div>

          {/* Bottom spacer for mobile */}
          <div className="h-4 sm:h-0"/>
        </div>

        {/* ─── DESKTOP RIGHT SIDEBAR ─── */}
        <div className="hidden sm:flex w-48 flex-col flex-shrink-0"
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderLeft: `1px solid ${stageColor}18`,
            backdropFilter: 'blur(10px)'
          }}>

          {/* Chicken */}
          <div className="p-3 flex justify-center border-b" style={{ borderColor: `${stageColor}18` }}>
            <div className="w-28 h-28 flex-shrink-0">
              <ChickenCharacter stage={chickenStage} compact />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            <div className="text-xs tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>ДЕЙСТВИЯ</div>

            <GameButton onClick={handleUseHint} variant="ghost"
              disabled={hints === 0 || showResult} className="w-full justify-start" size="sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="mr-2"
                style={{ color: hints > 0 ? '#ffd700' : 'currentColor' }}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7 Q14 7 14 10 Q14 12.5 12 13" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
              ПОДСКАЗКА ({hints})
            </GameButton>

            <GameButton onClick={() => setShowSkipConfirm(true)} variant="ghost"
              disabled={showResult} className="w-full justify-start" size="sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="mr-2">
                <path d="M5 4 L15 12 L5 20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              ПРОПУСТИТЬ
            </GameButton>
          </div>

          {/* Difficulty + solved counter */}
          <div className="mt-auto p-4 border-t" style={{ borderColor: `${stageColor}18` }}>
            <div className="text-xs mb-2 tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>СЛОЖНОСТЬ</div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex-1 h-1 rounded-sm"
                  style={{
                    background: i < (currentPuzzle.difficulty || 1) ? stageColor : 'rgba(255,255,255,0.08)',
                    boxShadow: i < (currentPuzzle.difficulty || 1) ? `0 0 4px ${stageColor}` : 'none'
                  }}/>
              ))}
            </div>
            <div className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              РЕШЕНО: <span style={{ color: stageColor }}>{solvedCount}</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/{requiredPuzzles}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE SLIDE-DOWN PANEL ─── */}
      {showSidebar && (
        <div className="sm:hidden absolute inset-0 z-40" onClick={() => setShowSidebar(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }}/>
          <div className="absolute top-12 right-0 w-48 rounded-bl-sm"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(5,5,20,0.97)',
              border: `1px solid ${stageColor}33`,
              backdropFilter: 'blur(10px)'
            }}>
            <div className="p-3 flex justify-center border-b" style={{ borderColor: `${stageColor}22` }}>
              <div className="w-24 h-24">
                <ChickenCharacter stage={chickenStage} compact />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={() => { handleUseHint(); setShowSidebar(false); }}
                disabled={hints === 0 || showResult}
                className="w-full py-2.5 rounded-sm text-xs font-bold tracking-widest text-left px-3"
                style={{
                  border: `1px solid ${hints > 0 ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  background: 'rgba(0,0,0,0.4)',
                  color: hints > 0 ? '#ffd700' : '#444',
                  opacity: hints === 0 ? 0.5 : 1
                }}>
                ? ПОДСКАЗКА ({hints})
              </button>
              <button onClick={() => { setShowSkipConfirm(true); setShowSidebar(false); }}
                disabled={showResult}
                className="w-full py-2.5 rounded-sm text-xs font-bold tracking-widest text-left px-3"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'rgba(255,255,255,0.5)'
                }}>
                ▶| ПРОПУСТИТЬ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULT OVERLAY ─── */}
      {showResult && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}/>
          <div className="relative px-8 py-7 rounded-sm text-center mx-4"
            style={{
              background: 'rgba(5,5,20,0.97)',
              border: `2px solid ${lastResult === 'correct' ? '#00ff88' : '#ff3366'}`,
              boxShadow: `0 0 40px ${lastResult === 'correct' ? 'rgba(0,255,136,0.4)' : 'rgba(255,51,102,0.4)'}`
            }}>
            <div className="w-14 h-14 mx-auto mb-3">
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
            <div className="text-xl font-black tracking-widest mb-2"
              style={{
                color: lastResult === 'correct' ? '#00ff88' : '#ff3366',
                textShadow: `0 0 15px ${lastResult === 'correct' ? '#00ff88' : '#ff3366'}`
              }}>
              {lastResult === 'correct' ? 'ВЕРНО!' : 'ОШИБКА'}
            </div>
            {lastResult === 'correct' && earnedNeurons > 0 && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-mono font-bold" style={{ color: '#a78bfa' }}>
                  +{earnedNeurons} НЕЙРОНОВ
                </span>
              </div>
            )}
            {lastResult === 'incorrect' && (
              <p className="text-xs" style={{ color: 'rgba(255,51,102,0.6)' }}>Следующая задача...</p>
            )}
          </div>
        </div>
      )}

      {/* ─── STAGE COMPLETE OVERLAY ─── */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}/>
          <div className="relative px-10 py-9 rounded-sm text-center mx-4"
            style={{
              background: 'rgba(5,5,20,0.97)',
              border: `2px solid ${stageColor}`,
              boxShadow: `0 0 60px ${stageColor}44`
            }}>
            <div className="text-2xl sm:text-3xl font-black tracking-widest mb-3"
              style={{ color: stageColor, textShadow: `0 0 20px ${stageColor}` }}>
              ЭТАП ЗАВЕРШЁН!
            </div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Возврат в главное меню...
            </div>
          </div>
        </div>
      )}

      {/* Skip Confirmation Modal */}
      <GameModal isOpen={showSkipConfirm} onClose={() => setShowSkipConfirm(false)}
        title="ПРОПУСТИТЬ ЗАДАЧУ?" accentColor="red">
        <div className="text-center py-4">
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Вы потеряете нейроны за эту задачу.
          </p>
          <div className="flex justify-center gap-3">
            <GameButton onClick={() => setShowSkipConfirm(false)} variant="secondary">ОТМЕНА</GameButton>
            <GameButton onClick={handleSkip} variant="danger">ПРОПУСТИТЬ</GameButton>
          </div>
        </div>
      </GameModal>
    </div>
  );
}
