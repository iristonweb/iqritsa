import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";
import { STAGE_REQUIREMENTS } from "../gameData";
import { ACHIEVEMENTS } from "../achievements";

export type ChickenMood = 'neutral' | 'happy' | 'thinking' | 'confused' | 'excited';

interface ChickenState {
  // Core progression
  chickenStage: number; // 0-7 representing the 8 stages
  currentStageProgress: number; // 0-1 progress in current stage
  totalSolved: number; // Total puzzles solved across all stages
  neurons: number; // Currency for upgrades
  
  // Current state
  mood: ChickenMood;
  unlockedStages: number; // Highest stage unlocked
  
  // Stats and achievements
  achievements: string[];
  stats: {
    averageTime: number;
    fastestSolve: number;
    totalHintsUsed: number;
    perfectSolves: number; // Solved without hints
    streakRecord: number;
    currentStreak: number;
  };
  
  // Upgrades and boosts
  upgrades: {
    extraHints: number; // Additional hints per stage
    timeBonus: number; // Extra time multiplier
    neuronMultiplier: number; // Multiplier for earned neurons
  };
  
  // Actions
  setMood: (mood: ChickenMood) => void;
  addNeurons: (amount: number) => void;
  spendNeurons: (amount: number) => boolean;
  solvePuzzle: (timeSpent: number, hintsUsed: number) => void;
  checkAchievements: () => void;
  purchaseUpgrade: (upgradeType: string, cost: number) => boolean;
  resetProgress: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const INITIAL_STATE = {
  chickenStage: 0,
  currentStageProgress: 0,
  totalSolved: 0,
  neurons: 0,
  mood: 'neutral' as ChickenMood,
  unlockedStages: 0,
  achievements: [],
  stats: {
    averageTime: 0,
    fastestSolve: 999,
    totalHintsUsed: 0,
    perfectSolves: 0,
    streakRecord: 0,
    currentStreak: 0,
  },
  upgrades: {
    extraHints: 0,
    timeBonus: 0,
    neuronMultiplier: 0,
  }
};

export const useChicken = create<ChickenState>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,
    
    setMood: (mood: ChickenMood) => {
      set({ mood });
      console.log(`Klepa's mood changed to: ${mood}`);
    },
    
    addNeurons: (amount: number) => {
      const state = get();
      const multiplier = 1 + (state.upgrades.neuronMultiplier * 0.1);
      const finalAmount = Math.floor(amount * multiplier);
      
      set({ neurons: state.neurons + finalAmount });
      console.log(`Added ${finalAmount} neurons (${amount} base * ${multiplier.toFixed(1)} multiplier)`);
      
      get().saveToStorage();
    },
    
    spendNeurons: (amount: number) => {
      const state = get();
      if (state.neurons >= amount) {
        set({ neurons: state.neurons - amount });
        get().saveToStorage();
        console.log(`Spent ${amount} neurons, ${state.neurons - amount} remaining`);
        return true;
      }
      console.log(`Not enough neurons: need ${amount}, have ${state.neurons}`);
      return false;
    },
    
    solvePuzzle: (timeSpent: number, hintsUsed: number) => {
      const state = get();
      const newTotalSolved = state.totalSolved + 1;
      const currentStageReq = STAGE_REQUIREMENTS[state.chickenStage];
      
      // Update stats
      const newStats = {
        ...state.stats,
        averageTime: ((state.stats.averageTime * state.totalSolved) + timeSpent) / newTotalSolved,
        fastestSolve: Math.min(state.stats.fastestSolve, timeSpent),
        totalHintsUsed: state.stats.totalHintsUsed + hintsUsed,
        perfectSolves: state.stats.perfectSolves + (hintsUsed === 0 ? 1 : 0),
        currentStreak: hintsUsed === 0 ? state.stats.currentStreak + 1 : 0,
        streakRecord: Math.max(state.stats.streakRecord, hintsUsed === 0 ? state.stats.currentStreak + 1 : 0)
      };
      
      // Calculate stage progress
      const puzzlesInCurrentStage = newTotalSolved - (currentStageReq?.puzzlesRequired || 0);
      const nextStageReq = STAGE_REQUIREMENTS[state.chickenStage + 1];
      const puzzlesNeededForNext = nextStageReq ? nextStageReq.puzzlesRequired - (currentStageReq?.puzzlesRequired || 0) : 999;
      const newStageProgress = Math.min(1, puzzlesInCurrentStage / puzzlesNeededForNext);
      
      // Check for stage advancement
      let newChickenStage = state.chickenStage;
      let newUnlockedStages = state.unlockedStages;
      
      if (nextStageReq && newTotalSolved >= nextStageReq.puzzlesRequired && state.chickenStage < 7) {
        newChickenStage = state.chickenStage + 1;
        newUnlockedStages = Math.max(newUnlockedStages, newChickenStage);
        console.log(`Stage advanced! Now at stage ${newChickenStage + 1}`);
        
        // Bonus neurons for stage advancement
        get().addNeurons(50 * (newChickenStage + 1));
        get().setMood('excited');
        
        setTimeout(() => get().setMood('neutral'), 3000);
      }
      
      set({
        totalSolved: newTotalSolved,
        currentStageProgress: newStageProgress,
        chickenStage: newChickenStage,
        unlockedStages: newUnlockedStages,
        stats: newStats
      });
      
      // Check for new achievements
      get().checkAchievements();
      get().saveToStorage();
      
      console.log(`Puzzle solved! Total: ${newTotalSolved}, Stage: ${newChickenStage + 1}, Progress: ${(newStageProgress * 100).toFixed(1)}%`);
    },
    
    checkAchievements: () => {
      const state = get();
      const newAchievements: string[] = [];
      
      ACHIEVEMENTS.forEach(achievement => {
        if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
          newAchievements.push(achievement.id);
          console.log(`Achievement unlocked: ${achievement.name}`);
          
          // Award neurons for achievement
          get().addNeurons(achievement.reward);
        }
      });
      
      if (newAchievements.length > 0) {
        set({ achievements: [...state.achievements, ...newAchievements] });
        get().setMood('excited');
        setTimeout(() => get().setMood('neutral'), 2000);
      }
    },
    
    purchaseUpgrade: (upgradeType: string, cost: number) => {
      const state = get();
      
      if (!get().spendNeurons(cost)) {
        return false;
      }
      
      const newUpgrades = { ...state.upgrades };
      switch (upgradeType) {
        case 'extraHints':
          newUpgrades.extraHints += 1;
          break;
        case 'timeBonus':
          newUpgrades.timeBonus += 1;
          break;
        case 'neuronMultiplier':
          newUpgrades.neuronMultiplier += 1;
          break;
      }
      
      set({ upgrades: newUpgrades });
      console.log(`Purchased upgrade: ${upgradeType} for ${cost} neurons`);
      return true;
    },
    
    resetProgress: () => {
      set(INITIAL_STATE);
      localStorage.removeItem('klepa-progress');
      console.log('Progress reset!');
    },
    
    saveToStorage: () => {
      const state = get();
      const saveData = {
        chickenStage: state.chickenStage,
        currentStageProgress: state.currentStageProgress,
        totalSolved: state.totalSolved,
        neurons: state.neurons,
        unlockedStages: state.unlockedStages,
        achievements: state.achievements,
        stats: state.stats,
        upgrades: state.upgrades,
        savedAt: Date.now()
      };
      
      setLocalStorage('klepa-progress', saveData);
    },
    
    loadFromStorage: () => {
      const savedData = getLocalStorage('klepa-progress');
      
      if (savedData) {
        console.log('Loading Klepa progress from storage');
        set({
          chickenStage: savedData.chickenStage || 0,
          currentStageProgress: savedData.currentStageProgress || 0,
          totalSolved: savedData.totalSolved || 0,
          neurons: savedData.neurons || 0,
          unlockedStages: savedData.unlockedStages || 0,
          achievements: savedData.achievements || [],
          stats: savedData.stats || INITIAL_STATE.stats,
          upgrades: savedData.upgrades || INITIAL_STATE.upgrades
        });
      }
    }
  }))
);

// Auto-save on state changes
useChicken.subscribe((state) => {
  state.saveToStorage();
});
