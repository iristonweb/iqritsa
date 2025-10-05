import { useState, useEffect, useCallback } from "react";

// Type-safe localStorage hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  
  // Get value from localStorage or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter function that updates both state and localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Hook for syncing state with localStorage across tabs
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T,
  onUpdate?: (newValue: T) => void
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setValue(newValue);
          
          // Call optional update callback
          if (onUpdate) {
            onUpdate(newValue);
          }
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, setValue, onUpdate]);

  return [value, setValue, removeValue];
}

// Specialized hooks for game data
export function useGameProgress() {
  return useLocalStorage('iq-game-progress', {
    stage: 0,
    totalSolved: 0,
    neurons: 0,
    achievements: [],
    lastPlayed: Date.now()
  });
}

export function useGameSettings() {
  return useLocalStorage('iq-game-settings', {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal',
    autoSave: true,
    showHints: true
  });
}

export function usePlayerStats() {
  return useLocalStorage('iq-game-stats', {
    totalPlayTime: 0,
    puzzlesSolved: 0,
    averageTime: 0,
    bestStreak: 0,
    favoriteCategory: '',
    totalHintsUsed: 0
  });
}

// Utility functions for localStorage management
export const localStorageUtils = {
  // Check if localStorage is available
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  // Get all game-related keys
  getGameKeys: (): string[] => {
    if (!localStorageUtils.isAvailable()) return [];
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('iq-game-') || key.startsWith('klepa-'))) {
        keys.push(key);
      }
    }
    return keys;
  },

  // Clear all game data
  clearGameData: (): void => {
    const gameKeys = localStorageUtils.getGameKeys();
    gameKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All game data cleared from localStorage');
  },

  // Export game data for backup
  exportGameData: (): string => {
    const gameKeys = localStorageUtils.getGameKeys();
    const gameData: Record<string, any> = {};
    
    gameKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          gameData[key] = JSON.parse(value);
        }
      } catch (error) {
        console.error(`Failed to export data for key ${key}:`, error);
      }
    });

    return JSON.stringify({
      exportedAt: Date.now(),
      gameData
    }, null, 2);
  },

  // Import game data from backup
  importGameData: (jsonString: string): boolean => {
    try {
      const { gameData } = JSON.parse(jsonString);
      
      Object.entries(gameData).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      console.log('Game data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import game data:', error);
      return false;
    }
  },

  // Get storage usage info
  getStorageInfo: () => {
    if (!localStorageUtils.isAvailable()) {
      return { available: false, usage: 0, total: 0 };
    }

    let totalSize = 0;
    const gameKeys = localStorageUtils.getGameKeys();
    
    gameKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    });

    return {
      available: true,
      usage: totalSize,
      total: 5 * 1024 * 1024, // 5MB typical limit
      percentage: (totalSize / (5 * 1024 * 1024)) * 100
    };
  }
};

// React hook for localStorage usage monitoring
export function useStorageMonitor() {
  const [storageInfo, setStorageInfo] = useState(localStorageUtils.getStorageInfo());

  const updateStorageInfo = useCallback(() => {
    setStorageInfo(localStorageUtils.getStorageInfo());
  }, []);

  useEffect(() => {
    // Update storage info when component mounts
    updateStorageInfo();

    // Listen for storage events
    const handleStorageChange = () => {
      updateStorageInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Update periodically (for same-tab changes)
    const interval = setInterval(updateStorageInfo, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [updateStorageInfo]);

  return {
    storageInfo,
    updateStorageInfo,
    clearGameData: localStorageUtils.clearGameData,
    exportGameData: localStorageUtils.exportGameData,
    importGameData: localStorageUtils.importGameData
  };
}
