import { useState } from "react";
import ChickenCharacter from "./ChickenCharacter";
import BrainVisualization from "./BrainVisualization";
import ProgressSystem from "./ProgressSystem";
import StageSelection from "./StageSelection";
import AchievementsPanel from "./AchievementsPanel";
import ShopPanel from "./ShopPanel";
import { useChicken } from "../../lib/stores/useChicken";
import { usePuzzles } from "../../lib/stores/usePuzzles";
import { useIQGame } from "../../lib/stores/useIQGame";
import { useGameAudio } from "../../hooks/useGameAudio";
import GameButton from "../ui/GameButton";

export default function GameHub() {
  const { chickenStage, neurons, totalSolved } = useChicken();
  const { setGameState } = useIQGame();
  const { setCurrentStage } = usePuzzles();
  const { isMuted, toggleMute } = useGameAudio();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const startTraining = () => {
    // Initialize the current stage so puzzles are generated before showing PuzzleArea
    setCurrentStage(chickenStage);
    setGameState('puzzle');
  };

  const stageColors = ['#ffd700', '#c0c0c0', '#4a9eff', '#9b59b6', '#1abc9c', '#e74c3c', '#00d4ff', '#ff00ff'];
  const currentColor = stageColors[Math.min(chickenStage, stageColors.length - 1)];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-3 relative"
        style={{
          background: 'rgba(0,0,0,0.7)',
          borderBottom: '1px solid rgba(0,255,255,0.15)',
          backdropFilter: 'blur(10px)'
        }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-6 rounded-sm" style={{ background: '#00ffff', boxShadow: '0 0 8px #00ffff' }}/>
            <div className="w-2 h-4 mt-1 rounded-sm" style={{ background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }}/>
            <div className="w-2 h-5 mt-0.5 rounded-sm" style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }}/>
          </div>
          <div>
            <div className="text-lg font-black tracking-widest uppercase text-glow-cyan"
              style={{ color: '#00ffff', letterSpacing: '0.15em' }}>
              IQ-РИЦА
            </div>
            <div className="text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.4)' }}>
              ЭВОЛЮЦИЯ ИНТЕЛЛЕКТА · v2.0
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="flex items-center gap-4">
          {/* Neurons counter */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow: '0 0 10px rgba(139,92,246,0.2)'
            }}>
            <div className="relative w-5 h-5">
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#8b5cf6" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="3" fill="#8b5cf6" style={{ filter: 'drop-shadow(0 0 4px #8b5cf6)' }}/>
                {[0, 60, 120, 180, 240, 300].map((a, i) => {
                  const rad = (a * Math.PI) / 180;
                  return <line key={i}
                    x1={10 + 3.5 * Math.cos(rad)} y1={10 + 3.5 * Math.sin(rad)}
                    x2={10 + 6.5 * Math.cos(rad)} y2={10 + 6.5 * Math.sin(rad)}
                    stroke="#8b5cf6" strokeWidth="1" opacity="0.7"/>;
                })}
              </svg>
            </div>
            <span className="font-bold font-mono text-sm text-glow-purple" style={{ color: '#a78bfa' }}>
              {neurons.toLocaleString()}
            </span>
            <span className="text-xs tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>NRN</span>
          </div>

          {/* Sound toggle */}
          <button onClick={toggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-sm transition-all"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${isMuted ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.3)'}`,
              color: isMuted ? '#444' : '#00ffff'
            }}>
            {isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Character Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

          {/* Stage badge */}
          <div className="mb-4 px-6 py-2 rounded-sm flex items-center gap-3"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: `1px solid ${currentColor}44`,
              boxShadow: `0 0 20px ${currentColor}22`
            }}>
            <div className="w-2 h-2 rounded-full animate-neon-pulse"
              style={{ background: currentColor, boxShadow: `0 0 8px ${currentColor}` }}/>
            <span className="text-xs font-bold tracking-widest uppercase"
              style={{ color: currentColor }}>
              ЭТАП {chickenStage + 1} из 8 · УРОВЕНЬ АКТИВЕН
            </span>
            <div className="w-2 h-2 rounded-full animate-neon-pulse"
              style={{ background: currentColor, boxShadow: `0 0 8px ${currentColor}`, animationDelay: '0.5s' }}/>
          </div>

          {/* Chicken + Brain layout */}
          <div className="relative flex items-center gap-6 mb-6">
            {/* Brain visualization */}
            <div className="w-36 h-36 rounded-full overflow-hidden relative flex-shrink-0"
              style={{
                border: `1px solid ${currentColor}44`,
                boxShadow: `0 0 20px ${currentColor}22`
              }}>
              <BrainVisualization stage={chickenStage} />
            </div>

            {/* Main chicken */}
            <div className="flex-shrink-0">
              <ChickenCharacter stage={chickenStage} />
            </div>

            {/* Stats floating cards */}
            <div className="flex flex-col gap-3">
              <div className="px-4 py-3 rounded-sm text-center"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(0,255,255,0.2)',
                  minWidth: '100px'
                }}>
                <div className="text-2xl font-black font-mono text-glow-cyan" style={{ color: '#00ffff' }}>
                  {totalSolved}
                </div>
                <div className="text-xs tracking-widest mt-1" style={{ color: 'rgba(0,255,255,0.5)' }}>
                  РЕШЕНО
                </div>
              </div>

              <div className="px-4 py-3 rounded-sm text-center"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${currentColor}33`,
                  minWidth: '100px'
                }}>
                <div className="text-2xl font-black font-mono" style={{ color: currentColor, textShadow: `0 0 10px ${currentColor}` }}>
                  {50 + chickenStage * 25}
                </div>
                <div className="text-xs tracking-widest mt-1" style={{ color: currentColor + '66' }}>
                  IQ КЛЕПЫ
                </div>
              </div>

              <div className="px-4 py-3 rounded-sm text-center"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  minWidth: '100px'
                }}>
                <div className="text-2xl font-black font-mono text-glow-purple" style={{ color: '#a78bfa' }}>
                  {neurons}
                </div>
                <div className="text-xs tracking-widest mt-1" style={{ color: 'rgba(139,92,246,0.5)' }}>
                  НЕЙРОНЫ
                </div>
              </div>
            </div>
          </div>

          {/* Story text */}
          <div className="max-w-xl text-center px-6 py-3 rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(0,255,255,0.1)',
            }}>
            <p className="text-xs tracking-wide leading-relaxed" style={{ color: 'rgba(0,255,255,0.5)' }}>
              <span style={{ color: '#00ffff' }}>&gt;&gt;</span>{' '}
              После секретного эксперимента профессора Пёрышкина интеллект Клепы начал стремительно расти.
              Помогите ей пройти Поляну Испытаний и достичь абсолютного разума!
            </p>
          </div>

          {/* Main CTA */}
          <div className="mt-6">
            <GameButton
              onClick={startTraining}
              size="lg"
              className="px-12"
            >
              ▶ НАЧАТЬ ТРЕНИРОВКУ
            </GameButton>
          </div>
        </div>

        {/* Right Panel - Progress and Controls */}
        <div className="w-72 flex flex-col"
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderLeft: '1px solid rgba(0,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>

          {/* Section: Progress */}
          <div className="p-5 border-b" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 rounded-sm" style={{ background: '#00ffff', boxShadow: '0 0 6px #00ffff' }}/>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#00ffff' }}>
                ПРОГРЕСС ЭВОЛЮЦИИ
              </span>
            </div>
            <ProgressSystem />
          </div>

          {/* Section: Stages */}
          <div className="flex-1 overflow-hidden flex flex-col p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 rounded-sm" style={{ background: '#8b5cf6', boxShadow: '0 0 6px #8b5cf6' }}/>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8b5cf6' }}>
                ВЫБОР ЭТАПА
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <StageSelection />
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-5 border-t space-y-2" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <GameButton
              onClick={() => setShowShop(true)}
              variant="secondary"
              className="w-full"
            >
              ◈ МАГАЗИН УЛУЧШЕНИЙ
            </GameButton>
            <GameButton
              onClick={() => setShowAchievements(true)}
              variant="ghost"
              className="w-full"
            >
              ◆ ДОСТИЖЕНИЯ
            </GameButton>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAchievements && <AchievementsPanel onClose={() => setShowAchievements(false)} />}
      {showShop && <ShopPanel onClose={() => setShowShop(false)} />}
    </div>
  );
}
