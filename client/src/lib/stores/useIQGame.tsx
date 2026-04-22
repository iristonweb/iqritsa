import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "hub" | "puzzle" | "story" | "shop" | "achievements" | "leaderboard" | "multiplayer";

interface IQGameState {
  gameState: GameState;
  isInitialized: boolean;

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
        try {
          const savedState = localStorage.getItem('iq-game-state');
          if (savedState) {
            const parsedState = JSON.parse(savedState);
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
