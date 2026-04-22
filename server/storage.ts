import { users, leaderboard, raceResults, type User, type InsertUser, type LeaderboardEntry, type InsertLeaderboardEntry, type RaceResult, type InsertRaceResult } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  upsertLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getLeaderboardByPlayer(playerName: string): Promise<LeaderboardEntry | undefined>;

  // Race results
  saveRaceResult(result: InsertRaceResult): Promise<RaceResult>;
  getRaceResults(raceId: string): Promise<RaceResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardData: Map<string, LeaderboardEntry>;
  private raceData: Map<string, RaceResult[]>;
  currentUserId: number;
  currentLeaderboardId: number;
  currentRaceId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardData = new Map();
    this.raceData = new Map();
    this.currentUserId = 1;
    this.currentLeaderboardId = 1;
    this.currentRaceId = 1;

    // Seed some bot entries so leaderboard looks populated
    this._seedLeaderboard();
  }

  private _seedLeaderboard() {
    const bots: InsertLeaderboardEntry[] = [
      { playerName: 'КвантКлепа', score: 9840, stage: 7, totalSolved: 312, accuracy: 0.94, avgTime: 28, country: 'RU' },
      { playerName: 'НейроПтица', score: 8210, stage: 6, totalSolved: 278, accuracy: 0.91, avgTime: 31, country: 'RU' },
      { playerName: 'AlphaChick', score: 7650, stage: 6, totalSolved: 255, accuracy: 0.89, avgTime: 35, country: 'US' },
      { playerName: 'ГениусКур', score: 6990, stage: 5, totalSolved: 230, accuracy: 0.88, avgTime: 38, country: 'RU' },
      { playerName: 'ИнтеллектЯйцо', score: 6120, stage: 5, totalSolved: 198, accuracy: 0.86, avgTime: 42, country: 'RU' },
      { playerName: 'CyberHen42', score: 5540, stage: 4, totalSolved: 176, accuracy: 0.84, avgTime: 45, country: 'DE' },
      { playerName: 'МозгоКлепа', score: 4870, stage: 4, totalSolved: 154, accuracy: 0.82, avgTime: 49, country: 'RU' },
      { playerName: 'LogicBird', score: 4230, stage: 3, totalSolved: 132, accuracy: 0.80, avgTime: 53, country: 'GB' },
      { playerName: 'ПрофКурица', score: 3680, stage: 3, totalSolved: 112, accuracy: 0.78, avgTime: 57, country: 'RU' },
      { playerName: 'IQRunner99', score: 3100, stage: 2, totalSolved: 94, accuracy: 0.76, avgTime: 61, country: 'FR' },
    ];

    const baseDate = new Date('2026-04-01T10:00:00Z');
    bots.forEach((bot, i) => {
      const id = this.currentLeaderboardId++;
      const entry: LeaderboardEntry = {
        id,
        playerName: bot.playerName,
        score:       bot.score       ?? 0,
        stage:       bot.stage       ?? 0,
        totalSolved: bot.totalSolved ?? 0,
        accuracy:    bot.accuracy    ?? 0,
        avgTime:     bot.avgTime     ?? 0,
        country:     bot.country     ?? '',
        createdAt: new Date(baseDate.getTime() - i * 3600000),
        updatedAt: new Date(baseDate.getTime() - i * 3600000),
      };
      this.leaderboardData.set(bot.playerName, entry);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    return Array.from(this.leaderboardData.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async upsertLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const existing = this.leaderboardData.get(entry.playerName);
    const now = new Date();
    if (existing) {
      const updated: LeaderboardEntry = {
        id:          existing.id,
        playerName:  existing.playerName,
        score:       Math.max(existing.score,       entry.score       ?? 0),
        stage:       Math.max(existing.stage,       entry.stage       ?? 0),
        totalSolved: Math.max(existing.totalSolved, entry.totalSolved ?? 0),
        accuracy:    entry.accuracy    ?? existing.accuracy,
        avgTime:     entry.avgTime     ?? existing.avgTime,
        country:     entry.country     ?? existing.country,
        createdAt:   existing.createdAt,
        updatedAt:   now,
      };
      this.leaderboardData.set(entry.playerName, updated);
      return updated;
    } else {
      const id = this.currentLeaderboardId++;
      const newEntry: LeaderboardEntry = {
        id,
        playerName:  entry.playerName,
        score:       entry.score       ?? 0,
        stage:       entry.stage       ?? 0,
        totalSolved: entry.totalSolved ?? 0,
        accuracy:    entry.accuracy    ?? 0,
        avgTime:     entry.avgTime     ?? 0,
        country:     entry.country     ?? '',
        createdAt:   now,
        updatedAt:   now,
      };
      this.leaderboardData.set(entry.playerName, newEntry);
      return newEntry;
    }
  }

  async getLeaderboardByPlayer(playerName: string): Promise<LeaderboardEntry | undefined> {
    return this.leaderboardData.get(playerName);
  }

  async saveRaceResult(result: InsertRaceResult): Promise<RaceResult> {
    const id = this.currentRaceId++;
    const row: RaceResult = {
      id,
      raceId:         result.raceId,
      playerName:     result.playerName,
      score:          result.score          ?? 0,
      solved:         result.solved         ?? 0,
      totalQuestions: result.totalQuestions ?? 0,
      timeMs:         result.timeMs         ?? 0,
      stage:          result.stage          ?? 0,
      finishedAt:     new Date(),
    };
    const existing = this.raceData.get(result.raceId) ?? [];
    existing.push(row);
    this.raceData.set(result.raceId, existing);
    return row;
  }

  async getRaceResults(raceId: string): Promise<RaceResult[]> {
    return (this.raceData.get(raceId) ?? []).sort((a, b) => b.score - a.score);
  }
}

export const storage = new MemStorage();
