export type AppScreen = "barn" | "laboratory" | "incubator" | "collection" | "arena" | "settings";

export type ChickenMood = "idle" | "hungry" | "happy" | "laying";

export type EggRank = "common" | "rare" | "epic" | "genius" | "legendary";

export type EggState = "active" | "sleeping" | "awakened";
export type NeurograinType = "logic" | "memory" | "spatial" | "chaos" | "awakening";

export interface Egg {
  id: string;
  rank: EggRank;
  progress: number;
  state: EggState;
  puzzleType: string;
  title: string;
  createdAt: number;
  awakenedAt?: number;
  miniGameId?: MiniGameId;
}

export type MiniGameId =
  | "memory_shell"
  | "kuro_sokoban"
  | "broken_picture"
  | "lab_wires"
  | "pattern_egg";

export interface PlayerState {
  level: number;
  xp: number;
  barnLevel: number;
  titles: string[];
  dailyStreak: number;
  lastDailySolvedAt?: number;
}

export interface ResourceState {
  neurograins: number;
  premiumCurrency: number;
  grainByType: Record<NeurograinType, number>;
}

export interface ChickenState {
  level: number;
  hungerLevel: number;
  mood: ChickenMood;
  lastFedTime?: number;
  currentEggProgress: number;
  eggRankModifier: number;
}

export interface EggInventoryState {
  inventory: Egg[];
  collected: Egg[];
  lastActivationTime?: number;
}

export interface SettingsState {
  morningAlarmEnabled: boolean;
  alarmTime: string;
  quietMode: boolean;
  weekendMute: boolean;
  snoozeMinutes: number;
  persistentMorningMode: boolean;
}

export interface DailyPuzzleState {
  isAvailable: boolean;
  completedToday: boolean;
  lastCompletedAt?: number;
  recoveryCharges: number;
  morningEggCharge: number;
  absenceDays: number;
  morningMilestonesClaimed: number[];
}

export interface PvpState {
  rating: number;
  league: string;
  duelWins: number;
  duelLosses: number;
  shellCopies: number;
  duelTickets: number;
}

export interface BarnState {
  decorations: string[];
  boardTasks: string[];
  hasKukarekometr: boolean;
  hasShellograph: boolean;
}

export interface StoryState {
  chapter: number;
  chapterProgress: number;
  introCompleted: boolean;
  firstDayCompleted: boolean;
  tutorialStarted: boolean;
  tutorialStage: "lab" | "feed" | "incubator" | "collection" | "done";
}

export interface LabChallengeState {
  id: string;
  type: string;
  text: string;
  hint?: string;
  options?: Array<string | number>;
  answer: string;
}

export interface SeasonState {
  currentSeason: number;
  title: string;
  passLevel: number;
  eventPoints: number;
}

export interface LeagueState {
  current: "Цыплёнок" | "Несушка" | "Академик Курятника" | "Гений Инкубатора" | "Золотой Мозг";
  mmr: number;
}

export interface SocialShelfProfile {
  id: string;
  nickname: string;
  favoriteEggType: string;
  awakenedEggs: number;
  barnLevel: number;
  title: string;
  duelWins: number;
}

export interface ActiveMiniGameState {
  eggId: string;
  gameId: MiniGameId;
  difficulty: number;
  startedAt: number;
}

export interface ServerPvpMatch {
  id: string;
  createdAt: number;
  playerA?: { userId: string; playerName: string };
  playerB?: { userId: string; playerName: string };
  status: "active" | "finished";
  rounds: Array<{ id: string; question: string }>;
  answers: Record<string, Array<{ roundId: string; answer: string; correct: boolean; timeMs: number }>>;
  result?: { winnerUserId: string | null; scoreA: number; scoreB: number };
}

export interface IQritsaStoreState {
  currentScreen: AppScreen;
  player: PlayerState;
  resources: ResourceState;
  chicken: ChickenState;
  eggs: EggInventoryState;
  settings: SettingsState;
  dailyPuzzle: DailyPuzzleState;
  pvp: PvpState;
  barn: BarnState;
  story: StoryState;
  season: SeasonState;
  league: LeagueState;
  socialShelf: SocialShelfProfile[];
  activeMiniGame: ActiveMiniGameState | null;
  onlineMatch: ServerPvpMatch | null;
  pvpHistory: Array<{ matchId: string; winnerUserId: string | null; scoreA: number; scoreB: number; finishedAt: string }>;
  labChallenge: LabChallengeState | null;
  activeLabRoom: "logic" | "memory" | "spatial" | "chaos" | "duel";
  activePuzzleType: string;
  professorMessage: string;
}
