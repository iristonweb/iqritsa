import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "hub" | "puzzle" | "story" | "shop" | "achievements";

interface IQGameState {
  gameState: GameState;
  isInitialized: boolean;
  
  // Actions
  setGameState: (state: GameState) => void;
  initializeGame: () => void;
}

export const useIQGame = create<IQGameState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "hub",
    isInitialized: false,
    
    setGameState: (gameState: GameState) => {
      set({ gameState });
    },
    
    initializeGame: () => {
      if (!get().isInitialized) {
        // Load saved data from localStorage
        try {
          const savedState = localStorage.getItem('iq-game-state');
          if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Apply any saved game state
            console.log('Loaded game state:', parsedState);
          }
        } catch (error) {
          console.error('Failed to load game state:', error);
        }
        
        set({ isInitialized: true });
      }
    }
  }))
);
