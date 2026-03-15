import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { generatePuzzle, validateAnswer } from "../puzzleGenerator";
import { STAGE_DATA } from "../gameData";
import { getLocalStorage, setLocalStorage } from "../utils";
import { useChicken } from "./useChicken";

export interface Puzzle {
  id: string;
  type: string;
  stage: number;
  difficulty: number;
  question: any;
  answer: any;
  hint?: string;
  timeLimit: number;
  generatedAt: number;
}

interface PuzzleState {
  // Current session
  currentPuzzle: Puzzle | null;
  currentStage: number;
  puzzleHistory: Puzzle[];
  sessionStats: {
    solved: number;
    failed: number;
    hintsUsed: number;
    totalTime: number;
  };
  
  // Available resources
  hints: number;
  maxHints: number;
  
  // State flags
  isComplete: boolean;
  lastAnswerCorrect: boolean | null;
  
  // Actions
  setCurrentStage: (stage: number) => void;
  generateNewPuzzle: () => void;
  nextPuzzle: () => void;
  submitAnswer: (answer: any) => Promise<boolean>;
  useHint: () => void;
  skipPuzzle: () => void;
  resetSession: () => void;
  saveProgress: () => void;
  loadProgress: () => void;
}

export const usePuzzles = create<PuzzleState>()(
  subscribeWithSelector((set, get) => ({
    currentPuzzle: null,
    currentStage: 0,
    puzzleHistory: [],
    sessionStats: {
      solved: 0,
      failed: 0,
      hintsUsed: 0,
      totalTime: 0
    },
    hints: 3,
    maxHints: 3,
    isComplete: false,
    lastAnswerCorrect: null,
    
    setCurrentStage: (stage: number) => {
      console.log(`Setting current stage to: ${stage + 1}`);
      set({ 
        currentStage: stage,
        isComplete: false,
        sessionStats: { solved: 0, failed: 0, hintsUsed: 0, totalTime: 0 }
      });
      
      // Reset hints based on stage and upgrades (extraHints upgrade adds +1 each level)
      const baseHints = 3;
      const stageData = STAGE_DATA[stage];
      const bonusHints = stageData?.bonusHints || 0;
      const chickenUpgrades = useChicken.getState().upgrades;
      const upgradeHints = chickenUpgrades?.extraHints || 0;
      const totalHints = baseHints + bonusHints + upgradeHints;
      
      set({ 
        hints: totalHints,
        maxHints: totalHints
      });
      
      // Generate first puzzle for this stage
      get().generateNewPuzzle();
    },
    
    generateNewPuzzle: () => {
      const state = get();
      const stageData = STAGE_DATA[state.currentStage];
      
      if (!stageData) {
        console.error(`No stage data for stage ${state.currentStage}`);
        return;
      }
      
      // Select puzzle type based on stage
      const availableTypes = stageData.puzzleTypes;
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      
      try {
        const newPuzzle = generatePuzzle(randomType, state.currentStage);
        
        set({ 
          currentPuzzle: newPuzzle,
          lastAnswerCorrect: null 
        });
        
        console.log(`Generated ${randomType} puzzle for stage ${state.currentStage + 1}:`, newPuzzle);
      } catch (error) {
        console.error('Failed to generate puzzle:', error);
        // Fallback to logic sequence if generation fails
        const fallbackPuzzle = generatePuzzle('logic_sequence', state.currentStage);
        set({ 
          currentPuzzle: fallbackPuzzle,
          lastAnswerCorrect: null 
        });
      }
    },
    
    nextPuzzle: () => {
      const state = get();
      
      // Check if stage is complete (solved enough puzzles)
      const stageData = STAGE_DATA[state.currentStage];
      const requiredPuzzles = stageData?.requiredPuzzles || 5;
      
      if (state.sessionStats.solved >= requiredPuzzles) {
        set({ isComplete: true });
        console.log(`Stage ${state.currentStage + 1} completed!`);
        return;
      }
      
      // Generate next puzzle
      get().generateNewPuzzle();
    },
    
    submitAnswer: async (answer: any): Promise<boolean> => {
      const state = get();
      const puzzle = state.currentPuzzle;
      
      if (!puzzle) {
        console.error('No current puzzle to validate');
        return false;
      }
      
      const startTime = Date.now();
      
      try {
        const isCorrect = await validateAnswer(puzzle, answer);
        
        const endTime = Date.now();
        const timeSpent = endTime - startTime;
        
        // Update session stats
        const newStats = {
          ...state.sessionStats,
          solved: isCorrect ? state.sessionStats.solved + 1 : state.sessionStats.solved,
          failed: !isCorrect ? state.sessionStats.failed + 1 : state.sessionStats.failed,
          totalTime: state.sessionStats.totalTime + timeSpent
        };
        
        // Add to history
        const puzzleRecord = {
          ...puzzle,
          solved: isCorrect,
          timeSpent,
          hintsUsed: state.maxHints - state.hints,
          userAnswer: answer
        };
        
        set({
          lastAnswerCorrect: isCorrect,
          sessionStats: newStats,
          puzzleHistory: [...state.puzzleHistory, puzzleRecord]
        });
        
        console.log(`Answer ${isCorrect ? 'correct' : 'incorrect'} in ${timeSpent}ms`);
        
        get().saveProgress();
        return isCorrect;
      } catch (error) {
        console.error('Error validating answer:', error);
        return false;
      }
    },
    
    useHint: () => {
      const state = get();
      
      if (state.hints <= 0) {
        console.log('No hints remaining');
        return;
      }
      
      if (!state.currentPuzzle) {
        console.log('No current puzzle for hint');
        return;
      }
      
      // Generate hint for current puzzle
      const puzzle = state.currentPuzzle;
      const hintText = generateHintForPuzzle(puzzle);
      
      // Update puzzle with hint
      const puzzleWithHint = {
        ...puzzle,
        hint: hintText
      };
      
      set({
        currentPuzzle: puzzleWithHint,
        hints: state.hints - 1,
        sessionStats: {
          ...state.sessionStats,
          hintsUsed: state.sessionStats.hintsUsed + 1
        }
      });
      
      console.log(`Hint used: ${hintText}. Hints remaining: ${state.hints - 1}`);
    },
    
    skipPuzzle: () => {
      const state = get();
      
      if (!state.currentPuzzle) return;
      
      // Record skipped puzzle
      const skippedRecord = {
        ...state.currentPuzzle,
        solved: false,
        skipped: true,
        timeSpent: 0,
        hintsUsed: 0,
        userAnswer: null
      };
      
      set({
        puzzleHistory: [...state.puzzleHistory, skippedRecord],
        sessionStats: {
          ...state.sessionStats,
          failed: state.sessionStats.failed + 1
        }
      });
      
      console.log('Puzzle skipped');
      
      // Move to next puzzle
      get().nextPuzzle();
      get().saveProgress();
    },
    
    resetSession: () => {
      set({
        currentPuzzle: null,
        puzzleHistory: [],
        sessionStats: {
          solved: 0,
          failed: 0,
          hintsUsed: 0,
          totalTime: 0
        },
        isComplete: false,
        lastAnswerCorrect: null
      });
      
      console.log('Puzzle session reset');
    },
    
    saveProgress: () => {
      const state = get();
      const progressData = {
        currentStage: state.currentStage,
        sessionStats: state.sessionStats,
        puzzleHistory: state.puzzleHistory,
        savedAt: Date.now()
      };
      
      setLocalStorage('puzzle-progress', progressData);
    },
    
    loadProgress: () => {
      const savedProgress = getLocalStorage('puzzle-progress');
      
      if (savedProgress) {
        console.log('Loading puzzle progress from storage');
        set({
          currentStage: savedProgress.currentStage || 0,
          sessionStats: savedProgress.sessionStats || {
            solved: 0,
            failed: 0,
            hintsUsed: 0,
            totalTime: 0
          },
          puzzleHistory: savedProgress.puzzleHistory || []
        });
      }
    }
  }))
);

// Helper function to generate hints
function generateHintForPuzzle(puzzle: Puzzle): string {
  const hints = {
    raven_matrix: "Обратите внимание на изменение формы, цвета или размера элементов по строкам и столбцам",
    logic_sequence: "Найдите математическую закономерность между соседними элементами",
    math_problem: "Разбейте задачу на простые шаги и внимательно читайте условие",
    sudoku: "Начните с клеток, где возможен только один вариант числа",
    analogies: "Определите тип связи между первой парой слов, затем примените к следующей паре",
    spatial_thinking: "Представьте мысленно, как изменится фигура при указанной трансформации",
    cryptarithmetic: "Начните с анализа ограничений: первые буквы не могут быть 0",
    probability: "Определите общее количество возможных исходов и количество благоприятных"
  };
  
  return hints[puzzle.type as keyof typeof hints] || "Внимательно изучите условие задачи";
}

// Auto-save progress when state changes
usePuzzles.subscribe((state) => {
  state.saveProgress();
});
