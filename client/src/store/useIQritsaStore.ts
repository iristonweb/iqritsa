import { create } from "zustand";
import { generatePuzzle } from "@/lib/puzzleGenerator";
import { loadCloudProfile, loadSocialShelf, saveCloudProfile } from "@/services/cloudSync";
import {
  finishServerPvpMatch,
  getServerPvpHistory,
  getServerPvpMatch,
  joinServerPvpQueue,
  leaveServerPvpQueue,
  submitServerPvpAnswer,
} from "@/services/pvpServer";
import { sendAntiCheatEvent } from "@/services/anticheatServer";
import type {
  Egg,
  EggRank,
  IQritsaStoreState,
  AppScreen,
  NeurograinType,
  MiniGameId,
  SocialShelfProfile,
} from "./types";

interface IQritsaStoreActions {
  setScreen: (screen: AppScreen) => void;
  setLabRoom: (room: IQritsaStoreState["activeLabRoom"]) => void;
  submitLabAnswer: (answer: string) => boolean;
  solveLabPuzzle: (success: boolean) => void;
  feedChicken: () => void;
  rubEgg: (eggId: string, delta?: number) => void;
  resolveEggMiniGame: (eggId: string, success: boolean) => void;
  startEggMiniGame: (eggId: string) => void;
  finishActiveMiniGame: (success: boolean) => void;
  setAlarmEnabled: (enabled: boolean) => void;
  setAlarmTime: (time: string) => void;
  setQuietMode: (enabled: boolean) => void;
  setWeekendMute: (enabled: boolean) => void;
  setPersistentMorningMode: (enabled: boolean) => void;
  setSnoozeMinutes: (minutes: number) => void;
  claimMorningMilestone: (milestone: number) => void;
  buyBarnDecoration: (decorationId: string, cost: number) => void;
  restoreDemoProgress: () => void;
  completeDailyPuzzle: (success: boolean) => void;
  playProfessorDuel: (win: boolean, wager: number) => void;
  playEggArena: (win: boolean) => void;
  registerSessionHeartbeat: () => void;
  progressSeason: (points: number) => void;
  completeStoryStep: (step: number) => void;
  startTutorial: () => void;
  markTutorialStageDone: (stage: IQritsaStoreState["story"]["tutorialStage"]) => void;
  rolloverDay: () => void;
  syncProfileFromCloud: () => Promise<void>;
  syncProfileToCloud: () => Promise<void>;
  refreshSocialShelf: () => Promise<void>;
  queueForServerPvp: () => Promise<boolean>;
  pollServerMatch: () => Promise<void>;
  submitServerRoundAnswer: (roundId: string, answer: string, timeMs: number) => Promise<void>;
  finishServerMatch: () => Promise<void>;
  leaveServerQueue: () => Promise<void>;
  load: () => void;
  save: () => void;
}

const STORAGE_KEY = "iqyuritsa-v1";

const rankByProgress = (progress: number): EggRank => {
  if (progress > 0.9) return "legendary";
  if (progress > 0.75) return "genius";
  if (progress > 0.55) return "epic";
  if (progress > 0.35) return "rare";
  return "common";
};

const titleByRank: Record<EggRank, string> = {
  common: "Начинающий куровод мыслей",
  rare: "Смотритель нейрогнезда",
  epic: "Архитектор сарайной логики",
  genius: "Повелитель золотой скорлупы",
  legendary: "Легенда лаборатории №9",
};

const grainForRoom: Record<IQritsaStoreState["activeLabRoom"], NeurograinType> = {
  logic: "logic",
  memory: "memory",
  spatial: "spatial",
  chaos: "chaos",
  duel: "logic",
};

const createEgg = (progress: number, puzzleType: string): Egg => {
  const rank = rankByProgress(progress);
  const now = Date.now();
  return {
    id: `egg-${now}-${Math.floor(Math.random() * 9999)}`,
    rank,
    progress: 0,
    state: "active",
    puzzleType,
    title: `IQ-Яйцо ${rank.toUpperCase()}`,
    createdAt: now,
    miniGameId: puzzleTypeToMiniGame(puzzleType),
  };
};

const puzzleTypeToMiniGame = (puzzleType: string): MiniGameId => {
  if (puzzleType.includes("analog") || puzzleType.includes("verbal")) return "memory_shell";
  if (puzzleType.includes("spatial") || puzzleType.includes("sudoku")) return "kuro_sokoban";
  if (puzzleType.includes("raven")) return "lab_wires";
  if (puzzleType.includes("logic")) return "pattern_egg";
  return "broken_picture";
};

const toLabChallenge = (puzzle: ReturnType<typeof generatePuzzle>) => {
  const rawAnswer = puzzle.answer;
  const normalizedAnswer = Array.isArray(rawAnswer) ? rawAnswer.join(",") : String(rawAnswer);
  const text = puzzle.question?.label ?? puzzle.question?.text ?? puzzle.question?.question ?? "Разгадай закономерность";
  const options = puzzle.question?.options as Array<string | number> | undefined;
  return {
    id: puzzle.id,
    type: puzzle.type,
    text,
    hint: puzzle.hint,
    options,
    answer: normalizedAnswer.trim().toLowerCase(),
  };
};

const socialMock: SocialShelfProfile[] = [
  {
    id: "rival-1",
    nickname: "KokoMind",
    favoriteEggType: "Яйцо Логики",
    awakenedEggs: 24,
    barnLevel: 5,
    title: "Магистр Скорлупы",
    duelWins: 37,
  },
  {
    id: "rival-2",
    nickname: "BrainHen",
    favoriteEggType: "Яйцо Памяти",
    awakenedEggs: 17,
    barnLevel: 4,
    title: "Кормилец Разума",
    duelWins: 21,
  },
];

const initialState: IQritsaStoreState = {
  currentScreen: "barn",
  player: {
    level: 3,
    xp: 220,
    barnLevel: 2,
    titles: ["Студент Першкина"],
    dailyStreak: 2,
  },
  resources: {
    neurograins: 35,
    premiumCurrency: 0,
    grainByType: {
      logic: 6,
      memory: 5,
      spatial: 4,
      chaos: 2,
      awakening: 1,
    },
  },
  chicken: {
    level: 2,
    hungerLevel: 60,
    mood: "hungry",
    currentEggProgress: 0.2,
    eggRankModifier: 0.15,
  },
  eggs: {
    inventory: [],
    collected: [],
  },
  settings: {
    morningAlarmEnabled: true,
    alarmTime: "08:00",
    quietMode: false,
    weekendMute: false,
    snoozeMinutes: 20,
    persistentMorningMode: false,
  },
  dailyPuzzle: {
    isAvailable: true,
    completedToday: false,
    recoveryCharges: 1,
    morningEggCharge: 0,
    absenceDays: 0,
    morningMilestonesClaimed: [],
  },
  pvp: {
    rating: 1000,
    league: "Цыплёнок Мысли",
    duelWins: 0,
    duelLosses: 0,
    shellCopies: 0,
    duelTickets: 3,
  },
  barn: {
    decorations: ["wooden_feedbox"],
    boardTasks: ["Реши 1 задачу в Лаборатории", "Покорми IQюрицу 1 раз"],
    hasKukarekometr: true,
    hasShellograph: true,
  },
  story: {
    chapter: 1,
    chapterProgress: 0.2,
    introCompleted: false,
    firstDayCompleted: false,
    tutorialStarted: false,
    tutorialStage: "lab",
  },
  season: {
    currentSeason: 1,
    title: "Побег из Лаборатории",
    passLevel: 1,
    eventPoints: 0,
  },
  league: {
    current: "Цыплёнок",
    mmr: 1000,
  },
  socialShelf: socialMock,
  activeMiniGame: null,
  onlineMatch: null,
  pvpHistory: [],
  labChallenge: toLabChallenge(generatePuzzle("logic_sequence", 0)),
  activeLabRoom: "logic",
  activePuzzleType: "logic_sequence",
  professorMessage: "Ко-ко-коллега, пора разбудить нейроны!",
};

export const useIQritsaStore = create<IQritsaStoreState & IQritsaStoreActions>((set, get) => ({
  ...initialState,

  setScreen: (screen) => set({ currentScreen: screen }),

  setLabRoom: (room) => {
    const roomToType = {
      logic: "raven_matrix",
      memory: "analogies",
      spatial: "spatial_thinking",
      chaos: "probability",
      duel: "logic_sequence",
    } as const;
    const challenge = toLabChallenge(generatePuzzle(roomToType[room], Math.max(get().player.level - 1, 0)));
    set({
      activeLabRoom: room,
      activePuzzleType: roomToType[room],
      labChallenge: challenge,
      professorMessage:
        room === "chaos"
          ? "В комнате Хаоса даже курица спорит сама с собой."
          : room === "duel"
            ? "Комната дуэлей активна. Здесь спорят мозгом, не кошельком."
          : "Отлично. Подберу задачу, чтобы мозг приятно хрустнул.",
    });
  },

  submitLabAnswer: (answer) => {
    const state = get();
    if (!state.labChallenge) return false;
    const normalized = answer.trim().toLowerCase();
    const success = normalized === state.labChallenge.answer;
    get().solveLabPuzzle(success);
    return success;
  },

  solveLabPuzzle: (success) => {
    const state = get();
    const puzzle = generatePuzzle(state.activePuzzleType, Math.max(state.player.level - 1, 0));
    const reward = success ? Math.max(6, 10 + state.player.level * 2) : 2;
    const nextGrains = state.resources.neurograins + reward;
    const nextXp = state.player.xp + (success ? 18 : 5);
    const nextLevel = Math.max(1, Math.floor(nextXp / 100) + 1);
    const earnedType = grainForRoom[state.activeLabRoom];
    set({
      player: { ...state.player, xp: nextXp, level: nextLevel },
      professorMessage: success
        ? `Верно! +${reward} нейрозёрен. Следующая задача будет острее клюва.`
        : "Почти! Ошибка - это тоже топливо для умной курицы.",
      activePuzzleType: puzzle.type,
      labChallenge: toLabChallenge(puzzle),
      chicken: {
        ...state.chicken,
        level: Math.max(1, Math.floor(nextXp / 160) + 1),
        mood: success ? "happy" : "hungry",
        hungerLevel: Math.min(100, state.chicken.hungerLevel + 5),
      },
      resources: {
        ...state.resources,
        neurograins: nextGrains,
        grainByType: {
          ...state.resources.grainByType,
          [earnedType]: state.resources.grainByType[earnedType] + (success ? 2 : 1),
        },
      },
      story:
        success && state.story.tutorialStarted && state.story.tutorialStage === "lab"
          ? { ...state.story, tutorialStage: "feed" }
          : state.story,
    });
    get().save();
  },

  feedChicken: () => {
    const state = get();
    if (state.resources.neurograins <= 0) return;
    const spend = 5;
    const typedBonus =
      state.resources.grainByType.logic * 0.002 +
      state.resources.grainByType.memory * 0.002 +
      state.resources.grainByType.spatial * 0.002 +
      state.resources.grainByType.chaos * 0.004 +
      state.resources.grainByType.awakening * 0.01;
    const filled = Math.min(1, state.chicken.currentEggProgress + 0.22 + state.chicken.eggRankModifier + typedBonus);
    const shouldLay = filled >= 1;
    const newEgg = shouldLay ? createEgg(filled, state.activePuzzleType) : null;
    set({
      resources: {
        ...state.resources,
        neurograins: Math.max(0, state.resources.neurograins - spend),
        grainByType: {
          logic: Math.max(0, state.resources.grainByType.logic - 1),
          memory: Math.max(0, state.resources.grainByType.memory - 1),
          spatial: Math.max(0, state.resources.grainByType.spatial - 1),
          chaos: state.resources.grainByType.chaos,
          awakening: state.resources.grainByType.awakening,
        },
      },
      chicken: {
        ...state.chicken,
        hungerLevel: Math.max(0, state.chicken.hungerLevel - 25),
        mood: shouldLay ? "laying" : "happy",
        lastFedTime: Date.now(),
        currentEggProgress: shouldLay ? 0 : filled,
      },
      eggs: shouldLay
        ? { ...state.eggs, inventory: [newEgg!, ...state.eggs.inventory], lastActivationTime: Date.now() }
        : state.eggs,
      professorMessage: shouldLay
        ? "Блестяще! Курица снесла новое IQ-яйцо. В инкубатор, быстрее!"
        : "Курица сыта и размышляет. Ещё немного корма до нового яйца.",
      player: {
        ...state.player,
        barnLevel: shouldLay && state.player.barnLevel < 6 ? state.player.barnLevel + 1 : state.player.barnLevel,
      },
      story:
        state.story.tutorialStarted && state.story.tutorialStage === "feed"
          ? { ...state.story, tutorialStage: "incubator" }
          : state.story,
    });
    get().save();
  },

  rubEgg: (eggId, delta = 0.2) => {
    const state = get();
    const inventory = state.eggs.inventory.map((egg) =>
      egg.id === eggId ? { ...egg, progress: Math.min(1, egg.progress + delta), state: "active" as const } : egg
    );
    set({
      eggs: { ...state.eggs, inventory },
      professorMessage: "Сильнее трите скорлупу, там уже слышно умное ко-ко!",
    });
    get().save();
  },

  resolveEggMiniGame: (eggId, success) => {
    const state = get();
    const egg = state.eggs.inventory.find((item) => item.id === eggId);
    if (!egg) return;

    if (!success) {
      set({
        eggs: {
          ...state.eggs,
          inventory: state.eggs.inventory.map((item) =>
            item.id === eggId ? { ...item, state: "sleeping", progress: 0.5 } : item
          ),
        },
        professorMessage: "Яйцо задремало. Ничего страшного, позже разбудим подсказкой.",
      });
      get().save();
      return;
    }

    const awakenedEgg: Egg = { ...egg, state: "awakened", awakenedAt: Date.now() };
    const rankTitle = titleByRank[egg.rank];
    const newTitles = state.player.titles.includes(rankTitle)
      ? state.player.titles
      : [...state.player.titles, rankTitle];
    set({
      eggs: {
        ...state.eggs,
        inventory: state.eggs.inventory.filter((item) => item.id !== eggId),
        collected: [awakenedEgg, ...state.eggs.collected],
      },
      player: {
        ...state.player,
        xp: state.player.xp + 30,
        level: Math.max(1, Math.floor((state.player.xp + 30) / 100) + 1),
        titles: newTitles,
      },
      professorMessage: "Пробуждение успешно! Яйцо добавлено в коллекцию.",
      story:
        state.story.tutorialStarted && state.story.tutorialStage === "incubator"
          ? { ...state.story, tutorialStage: "collection" }
          : state.story,
    });
    get().save();
  },

  startEggMiniGame: (eggId) => {
    const state = get();
    const egg = state.eggs.inventory.find((e) => e.id === eggId);
    if (!egg) return;
    const difficulty = Math.max(1, Math.floor((state.player.level + state.chicken.level) / 2));
    set({
      activeMiniGame: {
        eggId,
        gameId: egg.miniGameId ?? puzzleTypeToMiniGame(egg.puzzleType),
        difficulty,
        startedAt: Date.now(),
      },
      professorMessage: "Скорлупа проснулась. Начинается мини-испытание!",
    });
  },

  finishActiveMiniGame: (success) => {
    const state = get();
    if (!state.activeMiniGame) return;
    const eggId = state.activeMiniGame.eggId;
    set({ activeMiniGame: null });
    get().resolveEggMiniGame(eggId, success);
  },

  setAlarmEnabled: (enabled) => set((s) => ({ settings: { ...s.settings, morningAlarmEnabled: enabled } })),
  setAlarmTime: (time) => set((s) => ({ settings: { ...s.settings, alarmTime: time } })),
  setQuietMode: (enabled) => set((s) => ({ settings: { ...s.settings, quietMode: enabled } })),
  setWeekendMute: (enabled) => set((s) => ({ settings: { ...s.settings, weekendMute: enabled } })),
  setPersistentMorningMode: (enabled) => set((s) => ({ settings: { ...s.settings, persistentMorningMode: enabled } })),
  setSnoozeMinutes: (minutes) => set((s) => ({ settings: { ...s.settings, snoozeMinutes: minutes } })),

  claimMorningMilestone: (milestone) => {
    const state = get();
    if (state.dailyPuzzle.morningMilestonesClaimed.includes(milestone)) return;
    if (state.player.dailyStreak < milestone) return;
    const reward = milestone === 30 ? 120 : milestone === 14 ? 60 : milestone === 7 ? 30 : 12;
    const title =
      milestone === 14
        ? "Ранний Клюв"
        : milestone === 30
          ? "Легенда Первого Кукарека"
          : `Кукарек x${milestone}`;
    set({
      dailyPuzzle: {
        ...state.dailyPuzzle,
        morningMilestonesClaimed: [...state.dailyPuzzle.morningMilestonesClaimed, milestone],
      },
      resources: {
        ...state.resources,
        neurograins: state.resources.neurograins + reward,
      },
      player: {
        ...state.player,
        titles: state.player.titles.includes(title) ? state.player.titles : [...state.player.titles, title],
      },
      professorMessage: `Награда за утреннюю серию ${milestone} дней получена.`,
    });
    get().save();
  },

  buyBarnDecoration: (decorationId, cost) => {
    const state = get();
    if (state.resources.neurograins < cost) return;
    if (state.barn.decorations.includes(decorationId)) return;
    set({
      resources: { ...state.resources, neurograins: state.resources.neurograins - cost },
      barn: { ...state.barn, decorations: [...state.barn.decorations, decorationId] },
      professorMessage: "Сарай стал ещё уютнее. IQюрица одобряет апгрейд.",
    });
    get().save();
  },

  restoreDemoProgress: () => {
    const state = get();
    const demoEgg: Egg = {
      id: "egg-demo-legendary",
      rank: "legendary",
      progress: 1,
      state: "awakened",
      puzzleType: "raven_matrix",
      title: "Легендарное IQ-Яйцо",
      createdAt: Date.now() - 86400000,
      awakenedAt: Date.now() - 86000000,
    };
    set({
      ...initialState,
      player: {
        ...state.player,
        level: 6,
        xp: 580,
        barnLevel: 4,
        titles: ["Легенда лаборатории №9", "Куратор Нейрозёрен"],
        dailyStreak: 7,
      },
      resources: {
        neurograins: 120,
        premiumCurrency: 5,
        grainByType: { logic: 14, memory: 11, spatial: 9, chaos: 6, awakening: 4 },
      },
      chicken: { ...state.chicken, mood: "happy", hungerLevel: 30, currentEggProgress: 0.66 },
      eggs: {
        inventory: [createEgg(0.82, "analogies"), createEgg(0.57, "spatial_thinking")],
        collected: [demoEgg],
        lastActivationTime: Date.now() - 120000,
      },
      dailyPuzzle: {
        isAvailable: true,
        completedToday: false,
        recoveryCharges: 2,
        morningEggCharge: 2,
        absenceDays: 0,
        morningMilestonesClaimed: [3],
      },
      pvp: { rating: 1160, league: "Академик Курятника", duelWins: 18, duelLosses: 9, shellCopies: 7, duelTickets: 3 },
      story: {
        chapter: 2,
        chapterProgress: 0.5,
        introCompleted: true,
        firstDayCompleted: true,
        tutorialStarted: true,
        tutorialStage: "done",
      },
      season: { currentSeason: 1, title: "Побег из Лаборатории", passLevel: 7, eventPoints: 240 },
      league: { current: "Академик Курятника", mmr: 1160 },
    });
    get().save();
  },

  completeDailyPuzzle: (success) => {
    const state = get();
    const now = Date.now();
    const today = new Date(now).toDateString();
    const previousDay = state.player.lastDailySolvedAt
      ? new Date(state.player.lastDailySolvedAt).toDateString()
      : undefined;

    let nextStreak = state.player.dailyStreak;
    if (success) {
      if (!previousDay) {
        nextStreak = 1;
      } else if (previousDay === today) {
        nextStreak = state.player.dailyStreak;
      } else {
        nextStreak = state.player.dailyStreak + 1;
      }
    }

    const recovery = success
      ? state.dailyPuzzle.recoveryCharges
      : Math.max(0, state.dailyPuzzle.recoveryCharges - 1);

    set({
      dailyPuzzle: {
        ...state.dailyPuzzle,
        completedToday: success,
        isAvailable: !success,
        lastCompletedAt: success ? now : state.dailyPuzzle.lastCompletedAt,
        recoveryCharges: recovery,
        morningEggCharge: success ? state.dailyPuzzle.morningEggCharge + 1 : state.dailyPuzzle.morningEggCharge,
        absenceDays: 0,
      },
      player: {
        ...state.player,
        dailyStreak: nextStreak,
        lastDailySolvedAt: success ? now : state.player.lastDailySolvedAt,
      },
      resources: {
        ...state.resources,
        neurograins: state.resources.neurograins + (success ? 12 : 0),
        grainByType: {
          ...state.resources.grainByType,
          awakening: state.resources.grainByType.awakening + (success ? 1 : 0),
        },
      },
      professorMessage: success
        ? "Утренний Кукарек пройден. Получено Зерно Пробуждения!"
        : "Можно мягко восстановить серию завтра дополнительной задачей.",
      story: {
        ...state.story,
        firstDayCompleted: state.story.firstDayCompleted || success,
        introCompleted: state.story.introCompleted,
      },
    });
    get().save();
  },

  playProfessorDuel: (win, wager) => {
    const state = get();
    const safeWager = Math.max(0, Math.min(wager, state.resources.neurograins));
    const delta = win ? safeWager : -safeWager;
    const nextRating = Math.max(700, state.pvp.rating + (win ? 22 : -14));
    set({
      resources: { ...state.resources, neurograins: Math.max(0, state.resources.neurograins + delta) },
      pvp: {
        ...state.pvp,
        rating: nextRating,
        duelWins: state.pvp.duelWins + (win ? 1 : 0),
        duelLosses: state.pvp.duelLosses + (win ? 0 : 1),
        league: nextRating >= 1200 ? "Гений Инкубатора" : nextRating >= 1050 ? "Несушка" : "Цыплёнок Мысли",
        duelTickets: Math.max(0, state.pvp.duelTickets - 1),
      },
      league: {
        current: nextRating >= 1250 ? "Золотой Мозг" : nextRating >= 1200 ? "Гений Инкубатора" : nextRating >= 1050 ? "Несушка" : "Цыплёнок",
        mmr: nextRating,
      },
      professorMessage: win
        ? "Победа в споре у профессора! Банк нейрозёрен ваш."
        : "Почти победа. Профессор дуется, но уважает ваш стиль.",
    });
    get().save();
  },

  playEggArena: (win) => {
    const state = get();
    set({
      pvp: {
        ...state.pvp,
        shellCopies: state.pvp.shellCopies + (win ? 1 : 0),
        duelWins: state.pvp.duelWins + (win ? 1 : 0),
        duelLosses: state.pvp.duelLosses + (win ? 0 : 1),
        duelTickets: Math.max(0, state.pvp.duelTickets - 1),
      },
      professorMessage: win
        ? "Скорлупограф зафиксировал победу. Получен трофейный слепок яйца!"
        : "Слепок утрачен, но оригинал яйца в безопасности.",
    });
    get().save();
  },

  registerSessionHeartbeat: () => {
    const state = get();
    const now = Date.now();
    const last = state.player.lastDailySolvedAt ?? now;
    const elapsedDays = Math.floor((now - last) / 86400000);
    set({
      dailyPuzzle: {
        ...state.dailyPuzzle,
        absenceDays: Math.max(state.dailyPuzzle.absenceDays, elapsedDays),
      },
      pvp: {
        ...state.pvp,
        duelTickets: Math.min(5, state.pvp.duelTickets + (elapsedDays > 0 ? 1 : 0)),
      },
    });
  },

  progressSeason: (points) => {
    const state = get();
    const nextPoints = state.season.eventPoints + points;
    const nextPassLevel = Math.floor(nextPoints / 80) + 1;
    set({
      season: {
        ...state.season,
        eventPoints: nextPoints,
        passLevel: nextPassLevel,
      },
      professorMessage: `Сезонный прогресс +${points}. Уровень пропуска: ${nextPassLevel}.`,
    });
  },

  completeStoryStep: (step) => {
    const state = get();
    const nextProgress = Math.min(1, state.story.chapterProgress + step);
    const nextChapter = nextProgress >= 1 ? state.story.chapter + 1 : state.story.chapter;
    set({
      story: {
        ...state.story,
        chapter: nextChapter,
        chapterProgress: nextProgress >= 1 ? 0 : nextProgress,
        introCompleted: state.story.introCompleted,
      },
      professorMessage: nextProgress >= 1 ? "Новая сюжетная глава открыта!" : "Лор продвинут. Профессор что-то скрывает...",
    });
    get().save();
  },

  startTutorial: () => {
    const state = get();
    set({
      story: {
        ...state.story,
        tutorialStarted: true,
        introCompleted: false,
        tutorialStage: "lab",
      },
    });
  },

  markTutorialStageDone: (stage) => {
    const state = get();
    if (!state.story.tutorialStarted) return;
    if (stage !== state.story.tutorialStage) return;
    const next =
      stage === "lab"
        ? "feed"
        : stage === "feed"
          ? "incubator"
          : stage === "incubator"
            ? "collection"
            : "done";
    set({
      story: {
        ...state.story,
        tutorialStage: next,
        introCompleted: next === "done",
        firstDayCompleted: next === "done" || state.story.firstDayCompleted,
      },
    });
  },

  rolloverDay: () => {
    const state = get();
    const today = new Date().toDateString();
    const last = state.dailyPuzzle.lastCompletedAt ? new Date(state.dailyPuzzle.lastCompletedAt).toDateString() : "";
    if (today === last) return;
    const recovered = state.dailyPuzzle.recoveryCharges > 0;
    set({
      dailyPuzzle: {
        ...state.dailyPuzzle,
        isAvailable: true,
        completedToday: false,
        recoveryCharges: recovered ? state.dailyPuzzle.recoveryCharges : 1,
      },
      professorMessage: recovered
        ? "Новый день. Курица ждёт утреннюю загадку."
        : "Новая попытка доступна. Кукарек дня начался.",
    });
  },

  syncProfileFromCloud: async () => {
    const state = get();
    try {
      const profile = await loadCloudProfile();
      if (!profile?.profileData) return;
      const cloud = profile.profileData as Partial<IQritsaStoreState>;
      set({
        ...state,
        ...cloud,
        currentScreen: state.currentScreen,
        professorMessage: "Профессор синхронизировал ваш прогресс из облака.",
      });
    } catch {
      set({ professorMessage: "Облачная синхронизация недоступна. Работаем локально." });
    }
  },

  syncProfileToCloud: async () => {
    const state = get();
    try {
      await saveCloudProfile("IQPlayer", {
        player: state.player,
        resources: state.resources,
        chicken: state.chicken,
        eggs: state.eggs,
        settings: state.settings,
        dailyPuzzle: state.dailyPuzzle,
        pvp: state.pvp,
        barn: state.barn,
        story: state.story,
        season: state.season,
        league: state.league,
      });
    } catch {
      // Silent fallback to local save.
    }
  },

  refreshSocialShelf: async () => {
    try {
      const shelf = await loadSocialShelf(20);
      if (Array.isArray(shelf) && shelf.length > 0) {
        set({
          socialShelf: shelf.map((item: any, idx: number) => ({
            id: item.userId ?? `cloud-${idx}`,
            nickname: item.playerName ?? "IQPlayer",
            favoriteEggType: "IQ-яйца",
            awakenedEggs: Number(item.profileData?.eggs?.collected?.length ?? 0),
            barnLevel: Number(item.profileData?.player?.barnLevel ?? 1),
            title: String(item.profileData?.player?.titles?.[0] ?? "Кормилец Разума"),
            duelWins: Number(item.profileData?.pvp?.duelWins ?? 0),
          })),
        });
      }
    } catch {
      // Keep local mock shelf.
    }
    try {
      const history = await getServerPvpHistory(20);
      if (Array.isArray(history)) {
        set({
          pvpHistory: history.map((row: any) => ({
            matchId: String(row.matchId),
            winnerUserId: row.winnerUserId ?? null,
            scoreA: Number(row.scoreA ?? 0),
            scoreB: Number(row.scoreB ?? 0),
            finishedAt: String(row.finishedAt ?? new Date().toISOString()),
          })),
        });
      }
    } catch {
      // Keep local history.
    }
  },

  queueForServerPvp: async () => {
    const state = get();
    try {
      const joined = await joinServerPvpQueue("IQPlayer", state.league.mmr);
      if (joined.match) {
        set({
          onlineMatch: joined.match,
          professorMessage: "Серверная дуэль найдена. Раунд начался!",
        });
        return true;
      }
      set({ professorMessage: "Вы в очереди PvP. Ждём соперника..." });
      return false;
    } catch {
      set({ professorMessage: "Сервер PvP недоступен. Используйте локальную арену." });
      return false;
    }
  },

  pollServerMatch: async () => {
    const state = get();
    if (!state.onlineMatch) return;
    try {
      const match = await getServerPvpMatch(state.onlineMatch.id);
      if (match) {
        set({ onlineMatch: match });
      }
    } catch {
      // transient poll failure
    }
  },

  submitServerRoundAnswer: async (roundId, answer, timeMs) => {
    const state = get();
    if (!state.onlineMatch) return;
    try {
      const match = await submitServerPvpAnswer(state.onlineMatch.id, roundId, answer, timeMs);
      set({ onlineMatch: match });
      await sendAntiCheatEvent(state.onlineMatch.id, Math.max(0, 100 - Math.floor(timeMs / 50)), {
        roundId,
        answerLength: answer.length,
        timeMs,
      });
    } catch {
      set({ professorMessage: "Не удалось отправить ответ на серверный раунд." });
    }
  },

  finishServerMatch: async () => {
    const state = get();
    if (!state.onlineMatch) return;
    try {
      const match = await finishServerPvpMatch(state.onlineMatch.id);
      set({
        onlineMatch: match,
        professorMessage: "Серверная дуэль завершена. Результаты зафиксированы.",
      });
      const history = await getServerPvpHistory(20);
      if (Array.isArray(history)) {
        set({
          pvpHistory: history.map((row: any) => ({
            matchId: String(row.matchId),
            winnerUserId: row.winnerUserId ?? null,
            scoreA: Number(row.scoreA ?? 0),
            scoreB: Number(row.scoreB ?? 0),
            finishedAt: String(row.finishedAt ?? new Date().toISOString()),
          })),
        });
      }
    } catch {
      set({ professorMessage: "Не удалось завершить серверный матч." });
    }
  },

  leaveServerQueue: async () => {
    await leaveServerPvpQueue();
  },

  load: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<IQritsaStoreState>;
      set({
        ...initialState,
        ...parsed,
        player: { ...initialState.player, ...(parsed.player ?? {}) },
        resources: {
          ...initialState.resources,
          ...(parsed.resources ?? {}),
          grainByType: {
            ...initialState.resources.grainByType,
            ...(parsed.resources?.grainByType ?? {}),
          },
        },
        chicken: { ...initialState.chicken, ...(parsed.chicken ?? {}) },
        eggs: { ...initialState.eggs, ...(parsed.eggs ?? {}) },
        settings: { ...initialState.settings, ...(parsed.settings ?? {}) },
        dailyPuzzle: { ...initialState.dailyPuzzle, ...(parsed.dailyPuzzle ?? {}) },
        pvp: { ...initialState.pvp, ...(parsed.pvp ?? {}) },
        barn: { ...initialState.barn, ...(parsed.barn ?? {}) },
        story: { ...initialState.story, ...(parsed.story ?? {}) },
        season: { ...initialState.season, ...(parsed.season ?? {}) },
        league: { ...initialState.league, ...(parsed.league ?? {}) },
        socialShelf: parsed.socialShelf ?? initialState.socialShelf,
        activeMiniGame: parsed.activeMiniGame ?? null,
      });
      get().rolloverDay();
    } catch (error) {
      console.error("Не удалось загрузить прогресс IQюрица:", error);
    }
  },

  save: () => {
    const { currentScreen, ...state } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, currentScreen }));
  },
}));
