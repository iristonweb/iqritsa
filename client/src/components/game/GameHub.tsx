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

type Tab = 'main' | 'progress';

export default function GameHub() {
  const { chickenStage, neurons, totalSolved } = useChicken();
  const { setGameState } = useIQGame();
  const { setCurrentStage } = usePuzzles();
  const { isMuted, toggleMute } = useGameAudio();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('main');

  const startTraining = () => {
    setCurrentStage(chickenStage);
    setGameState('puzzle');
  };

  const stageColors = ['#ffd700','#c0c0c0','#4a9eff','#9b59b6','#1abc9c','#e74c3c','#00d4ff','#ff00ff'];
  const currentColor = stageColors[Math.min(chickenStage, stageColors.length - 1)];

  return (
    <div className="w-full h-full flex flex-col">

      {/* ─── HEADER ─── */}
      <header className="flex-shrink-0 flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3"
        style={{
          background: 'rgba(0,0,0,0.7)',
          borderBottom: '1px solid rgba(0,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          minHeight: '48px'
        }}>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-5 rounded-sm" style={{ background: '#00ffff', boxShadow: '0 0 6px #00ffff' }}/>
            <div className="w-1.5 h-3.5 mt-1 rounded-sm" style={{ background: '#8b5cf6', boxShadow: '0 0 6px #8b5cf6' }}/>
            <div className="w-1.5 h-4 mt-0.5 rounded-sm" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}/>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-widest uppercase"
              style={{ color: '#00ffff', letterSpacing: '0.12em', textShadow: '0 0 10px #00ffff66' }}>
              IQ-РИЦА
            </div>
            <div className="text-xs tracking-widest hidden sm:block" style={{ color: 'rgba(0,255,255,0.4)' }}>
              ЭВОЛЮЦИЯ ИНТЕЛЛЕКТА · v2.0
            </div>
          </div>
        </div>

        {/* Right: neurons + sound */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow: '0 0 10px rgba(139,92,246,0.2)'
            }}>
            <svg viewBox="0 0 20 20" className="w-4 h-4 flex-shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#8b5cf6" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" fill="#8b5cf6"/>
              {[0, 60, 120, 180, 240, 300].map((a, i) => {
                const rad = (a * Math.PI) / 180;
                return <line key={i}
                  x1={10 + 3.5 * Math.cos(rad)} y1={10 + 3.5 * Math.sin(rad)}
                  x2={10 + 6.5 * Math.cos(rad)} y2={10 + 6.5 * Math.sin(rad)}
                  stroke="#8b5cf6" strokeWidth="1" opacity="0.7"/>;
              })}
            </svg>
            <span className="font-bold font-mono text-sm" style={{ color: '#a78bfa' }}>
              {neurons.toLocaleString()}
            </span>
            <span className="text-xs tracking-widest hidden sm:inline" style={{ color: 'rgba(139,92,246,0.5)' }}>NRN</span>
          </div>

          <button onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center rounded-sm"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${isMuted ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.3)'}`,
              color: isMuted ? '#444' : '#00ffff'
            }}>
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ─── MOBILE TABS ─── */}
      <div className="sm:hidden flex flex-shrink-0"
        style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(0,255,255,0.08)' }}>
        {(['main', 'progress'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-all"
            style={{
              color: activeTab === tab ? '#00ffff' : 'rgba(255,255,255,0.3)',
              borderBottom: `2px solid ${activeTab === tab ? '#00ffff' : 'transparent'}`
            }}>
            {tab === 'main' ? 'КЛЕПА' : 'ПРОГРЕСС'}
          </button>
        ))}
      </div>

      {/* ─── MAIN BODY ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left / Main column ── */}
        {/* On mobile: shown when tab=main. On desktop: always shown. */}
        <div className={`
          flex-1 flex flex-col overflow-y-auto
          ${activeTab !== 'main' ? 'hidden sm:flex' : 'flex'}
        `}
          style={{ padding: '12px' }}>

          {/* Stage badge */}
          <div className="flex justify-center mb-3">
            <div className="px-4 py-1.5 rounded-sm flex items-center gap-2"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${currentColor}44`,
                boxShadow: `0 0 16px ${currentColor}22`
              }}>
              <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse"
                style={{ background: currentColor }}/>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: currentColor }}>
                ЭТАП {chickenStage + 1} из 8
              </span>
              <div className="w-1.5 h-1.5 rounded-full animate-neon-pulse"
                style={{ background: currentColor, animationDelay: '0.5s' }}/>
            </div>
          </div>

          {/* Chicken + Brain + Stats */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 flex-wrap sm:flex-nowrap">
            {/* Brain */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0"
              style={{
                border: `1px solid ${currentColor}44`,
                boxShadow: `0 0 16px ${currentColor}22`
              }}>
              <BrainVisualization stage={chickenStage} />
            </div>

            {/* Chicken */}
            <div className="flex-shrink-0">
              <ChickenCharacter stage={chickenStage} />
            </div>

            {/* Stats — horizontal on mobile, vertical on desktop */}
            <div className="flex sm:flex-col gap-2 sm:gap-3 flex-wrap justify-center">
              {[
                { val: totalSolved, label: 'РЕШЕНО', color: '#00ffff' },
                { val: 50 + chickenStage * 25, label: 'IQ КЛЕПЫ', color: currentColor },
                { val: neurons, label: 'НЕЙРОНЫ', color: '#a78bfa' },
              ].map(({ val, label, color }) => (
                <div key={label} className="px-3 py-2 rounded-sm text-center"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: `1px solid ${color}33`,
                    minWidth: '72px'
                  }}>
                  <div className="text-lg sm:text-xl font-black font-mono" style={{ color, textShadow: `0 0 8px ${color}66` }}>
                    {val}
                  </div>
                  <div className="text-xs tracking-widest mt-0.5" style={{ color: color + '66' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Story text */}
          <div className="text-center px-4 py-2.5 rounded-sm mb-4"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,255,0.1)' }}>
            <p className="text-xs tracking-wide leading-relaxed" style={{ color: 'rgba(0,255,255,0.5)' }}>
              <span style={{ color: '#00ffff' }}>&gt;&gt;</span>{' '}
              После секретного эксперимента профессора Пёрышкина интеллект Клепы начал расти.
              Помогите ей пройти Поляну Испытаний и достичь абсолютного разума!
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center mb-3">
            <GameButton onClick={startTraining} size="lg" className="px-10 sm:px-12">
              ▶ НАЧАТЬ ТРЕНИРОВКУ
            </GameButton>
          </div>

          {/* Multiplayer buttons */}
          <div className="flex gap-2 justify-center mb-3">
            <button onClick={() => setGameState('multiplayer')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest rounded transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,255,0.15), rgba(139,92,246,0.15))',
                color: '#00ffff',
                border: '1px solid rgba(0,255,255,0.5)',
                boxShadow: '0 0 16px rgba(0,255,255,0.2)'
              }}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <circle cx="5" cy="5" r="2.5"/>
                <circle cx="11" cy="5" r="2.5"/>
                <path d="M1 13c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4"/>
              </svg>
              ГОНКА УМОВ
            </button>
            <button onClick={() => setGameState('leaderboard')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest rounded transition-all hover:opacity-90"
              style={{
                background: 'rgba(255,215,0,0.1)',
                color: '#ffd700',
                border: '1px solid rgba(255,215,0,0.4)',
                boxShadow: '0 0 12px rgba(255,215,0,0.15)'
              }}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <rect x="2" y="9" width="3" height="5"/>
                <rect x="6.5" y="5" width="3" height="9"/>
                <rect x="11" y="2" width="3" height="12"/>
              </svg>
              РЕЙТИНГ
            </button>
          </div>

          {/* Mobile-only: action buttons */}
          <div className="sm:hidden flex flex-col gap-2 mt-auto">
            <GameButton onClick={() => setShowShop(true)} variant="secondary" className="w-full">
              ◈ МАГАЗИН УЛУЧШЕНИЙ
            </GameButton>
            <GameButton onClick={() => setShowAchievements(true)} variant="ghost" className="w-full">
              ◆ ДОСТИЖЕНИЯ
            </GameButton>
          </div>

          {/* Desktop bottom spacer */}
          <div className="hidden sm:block h-4"/>
        </div>

        {/* ── Right / Progress column ── */}
        {/* On mobile: shown when tab=progress. On desktop: always shown on right. */}
        <div className={`
          sm:w-72 flex flex-col
          ${activeTab !== 'progress' ? 'hidden sm:flex' : 'flex flex-1'}
        `}
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderLeft: '1px solid rgba(0,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>

          {/* Progress */}
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-3.5 rounded-sm" style={{ background: '#00ffff', boxShadow: '0 0 6px #00ffff' }}/>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#00ffff' }}>
                ПРОГРЕСС ЭВОЛЮЦИИ
              </span>
            </div>
            <ProgressSystem />
          </div>

          {/* Stage selection */}
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-3.5 rounded-sm" style={{ background: '#8b5cf6', boxShadow: '0 0 6px #8b5cf6' }}/>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8b5cf6' }}>
                ВЫБОР ЭТАПА
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <StageSelection />
            </div>
          </div>

          {/* Desktop-only: action buttons at bottom */}
          <div className="hidden sm:flex flex-col p-4 border-t gap-2" style={{ borderColor: 'rgba(0,255,255,0.1)' }}>
            <GameButton onClick={() => setShowShop(true)} variant="secondary" className="w-full">
              ◈ МАГАЗИН УЛУЧШЕНИЙ
            </GameButton>
            <GameButton onClick={() => setShowAchievements(true)} variant="ghost" className="w-full">
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
