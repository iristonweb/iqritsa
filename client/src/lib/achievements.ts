import { ChickenState } from "./stores/useChicken";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number; // Neurons awarded
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (state: ChickenState) => boolean;
  hidden?: boolean; // Hidden until unlocked
}

export const ACHIEVEMENTS: Achievement[] = [
  // Early progression achievements
  {
    id: 'first_solve',
    name: 'Первое зёрнышко',
    description: 'Решите свою первую задачу',
    icon: '🌾',
    reward: 10,
    rarity: 'common',
    condition: (state) => state.totalSolved >= 1
  },
  
  {
    id: 'five_solves',
    name: 'Растущий разум',
    description: 'Решите 5 задач',
    icon: '🧠',
    reward: 25,
    rarity: 'common',
    condition: (state) => state.totalSolved >= 5
  },
  
  {
    id: 'first_stage',
    name: 'Умная курочка',
    description: 'Достигните 2-го этапа развития',
    icon: '👓',
    reward: 50,
    rarity: 'common',
    condition: (state) => state.chickenStage >= 1
  },
  
  // Speed and efficiency achievements
  {
    id: 'speed_demon',
    name: 'Скорость мысли',
    description: 'Решите задачу менее чем за 30 секунд',
    icon: '⚡',
    reward: 30,
    rarity: 'rare',
    condition: (state) => state.stats.fastestSolve < 30
  },
  
  {
    id: 'no_hints',
    name: 'Самостоятельность',
    description: 'Решите 10 задач подряд без подсказок',
    icon: '🎯',
    reward: 75,
    rarity: 'rare',
    condition: (state) => state.stats.perfectSolves >= 10
  },
  
  {
    id: 'streak_master',
    name: 'Серийный решатель',
    description: 'Решите 15 задач подряд без ошибок',
    icon: '🔥',
    reward: 100,
    rarity: 'epic',
    condition: (state) => state.stats.streakRecord >= 15
  },
  
  // Stage progression achievements
  {
    id: 'university_graduate',
    name: 'Выпускник университета',
    description: 'Достигните этапа "Куриный Университет"',
    icon: '🎓',
    reward: 100,
    rarity: 'rare',
    condition: (state) => state.chickenStage >= 3
  },
  
  {
    id: 'professor',
    name: 'Профессор Клепа',
    description: 'Достигните этапа "Птичий Профессор"',
    icon: '📚',
    reward: 150,
    rarity: 'epic',
    condition: (state) => state.chickenStage >= 4
  },
  
  {
    id: 'genius',
    name: 'Гений среди куриц',
    description: 'Достигните этапа "Гениальная Клепа"',
    icon: '🔬',
    reward: 200,
    rarity: 'epic',
    condition: (state) => state.chickenStage >= 5
  },
  
  {
    id: 'cosmic_mind',
    name: 'Космический разум',
    description: 'Достигните этапа "Космический Интеллект"',
    icon: '🚀',
    reward: 300,
    rarity: 'legendary',
    condition: (state) => state.chickenStage >= 6
  },
  
  {
    id: 'absolute_intelligence',
    name: 'Абсолютный интеллект',
    description: 'Достигните максимального этапа развития',
    icon: '🌟',
    reward: 500,
    rarity: 'legendary',
    condition: (state) => state.chickenStage >= 7
  },
  
  // Collection and completion achievements
  {
    id: 'century_solver',
    name: 'Сотня решений',
    description: 'Решите 100 задач',
    icon: '💯',
    reward: 200,
    rarity: 'epic',
    condition: (state) => state.totalSolved >= 100
  },
  
  {
    id: 'neuron_collector',
    name: 'Коллекционер нейронов',
    description: 'Накопите 1000 нейронов',
    icon: '🧠',
    reward: 100,
    rarity: 'rare',
    condition: (state) => state.neurons >= 1000
  },
  
  {
    id: 'all_stages',
    name: 'Мастер всех этапов',
    description: 'Разблокируйте все этапы',
    icon: '🗝️',
    reward: 250,
    rarity: 'epic',
    condition: (state) => state.unlockedStages >= 7
  },
  
  // Special and hidden achievements
  {
    id: 'perfectionist',
    name: 'Перфекционист',
    description: 'Решите 50 задач без использования подсказок',
    icon: '✨',
    reward: 150,
    rarity: 'epic',
    condition: (state) => state.stats.perfectSolves >= 50,
    hidden: true
  },
  
  {
    id: 'marathon_runner',
    name: 'Марафонец',
    description: 'Проведите в игре более 2 часов суммарно',
    icon: '🏃‍♀️',
    reward: 100,
    rarity: 'rare',
    condition: (state) => state.stats.averageTime * state.totalSolved > 7200, // 2 hours in seconds
    hidden: true
  },
  
  {
    id: 'hint_master',
    name: 'Мастер подсказок',
    description: 'Используйте 100 подсказок',
    icon: '💡',
    reward: 75,
    rarity: 'rare',
    condition: (state) => state.stats.totalHintsUsed >= 100,
    hidden: true
  },
  
  {
    id: 'quick_thinker',
    name: 'Молниеносная мысль',
    description: 'Решите задачу менее чем за 10 секунд',
    icon: '⚡',
    reward: 200,
    rarity: 'legendary',
    condition: (state) => state.stats.fastestSolve < 10,
    hidden: true
  },
  
  // Fun achievements
  {
    id: 'night_owl',
    name: 'Полуночная сова',
    description: 'Решите задачу после полуночи',
    icon: '🦉',
    reward: 25,
    rarity: 'common',
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 6;
    }
  },
  
  {
    id: 'early_bird',
    name: 'Ранняя пташка',
    description: 'Решите задачу до 6 утра',
    icon: '🐦',
    reward: 25,
    rarity: 'common',
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 5 && hour < 8;
    }
  },
  
  {
    id: 'persistent',
    name: 'Упорство',
    description: 'Вернитесь в игру на следующий день',
    icon: '📅',
    reward: 50,
    rarity: 'rare',
    condition: () => {
      const lastPlayed = localStorage.getItem('last-played-date');
      const today = new Date().toDateString();
      return Boolean(lastPlayed) && lastPlayed !== today;
    }
  }
];

// Utility functions for achievements
export function getUnlockedAchievements(state: ChickenState): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => 
    state.achievements.includes(achievement.id)
  );
}

export function getAvailableAchievements(state: ChickenState): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => 
    !state.achievements.includes(achievement.id) && 
    !achievement.hidden
  );
}

export function getHiddenAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.hidden);
}

export function checkNewAchievements(state: ChickenState): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
}

export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity);
}

export function getTotalPossibleRewards(): number {
  return ACHIEVEMENTS.reduce((total, achievement) => total + achievement.reward, 0);
}

export function getProgressToNextAchievement(state: ChickenState): { achievement: Achievement; progress: number } | null {
  // Find the closest achievement the player hasn't unlocked yet
  const availableAchievements = ACHIEVEMENTS.filter(achievement => 
    !state.achievements.includes(achievement.id)
  );
  
  // For simplicity, we'll track progress for numeric achievements
  const trackableAchievements = availableAchievements.filter(achievement => {
    return achievement.id.includes('solve') || 
           achievement.id.includes('stage') || 
           achievement.id.includes('neuron');
  });
  
  if (trackableAchievements.length === 0) return null;
  
  // Return the first trackable achievement (this could be made smarter)
  const nextAchievement = trackableAchievements[0];
  
  let progress = 0;
  if (nextAchievement.id === 'five_solves') {
    progress = state.totalSolved / 5;
  } else if (nextAchievement.id === 'century_solver') {
    progress = state.totalSolved / 100;
  } else if (nextAchievement.id === 'neuron_collector') {
    progress = state.neurons / 1000;
  }
  
  return {
    achievement: nextAchievement,
    progress: Math.min(1, progress)
  };
}
