import {
  users,
  leaderboard,
  raceResults,
  iqProfiles,
  antiCheatEvents,
  pvpMatches,
  type User,
  type InsertUser,
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
  type RaceResult,
  type InsertRaceResult,
  type IqProfile,
  type InsertIqProfile,
  type AntiCheatEvent,
  type InsertAntiCheatEvent,
  type PvpMatchRow,
  type InsertPvpMatch,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { desc, eq, or } from "drizzle-orm";

export interface PvpQueueEntry {
  userId: string;
  playerName: string;
  mmr: number;
  joinedAt: number;
}

export interface PvpRound {
  id: string;
  question: string;
  answer: string;
}

export interface PvpMatch {
  id: string;
  createdAt: number;
  playerA: PvpQueueEntry;
  playerB: PvpQueueEntry;
  rounds: PvpRound[];
  answers: Record<string, { roundId: string; answer: string; correct: boolean; timeMs: number }[]>;
  status: "active" | "finished";
  result?: {
    winnerUserId: string | null;
    scoreA: number;
    scoreB: number;
  };
}

function createPvpRounds(): PvpRound[] {
  return [
    { id: "r1", question: "Продолжи ряд: 2, 4, 8, 16, ?", answer: "32" },
    { id: "r2", question: "Сколько будет 7 + 5 * 2?", answer: "17" },
    { id: "r3", question: "Следующее число Фибоначчи после 13?", answer: "21" },
  ];
}

function calculateMatchResult(match: PvpMatch) {
  const aAnswers = match.answers[match.playerA.userId] ?? [];
  const bAnswers = match.answers[match.playerB.userId] ?? [];
  const scoreFrom = (answers: typeof aAnswers) =>
    answers.reduce((acc, item) => acc + (item.correct ? 10 : 0) - Math.floor(item.timeMs / 10000), 0);
  const scoreA = scoreFrom(aAnswers);
  const scoreB = scoreFrom(bAnswers);
  const winnerUserId = scoreA === scoreB ? null : scoreA > scoreB ? match.playerA.userId : match.playerB.userId;
  return { winnerUserId, scoreA, scoreB };
}

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

  // IQ profile cloud sync
  upsertIqProfile(profile: InsertIqProfile): Promise<IqProfile>;
  getIqProfile(userId: string): Promise<IqProfile | undefined>;
  getSocialShelf(limit?: number): Promise<IqProfile[]>;

  // Anti-cheat
  saveAntiCheatEvent(event: InsertAntiCheatEvent): Promise<AntiCheatEvent>;

  // Authoritative PvP
  joinPvpQueue(entry: PvpQueueEntry): Promise<{ match: PvpMatch | null; queued: boolean }>;
  leavePvpQueue(userId: string): Promise<void>;
  getPvpMatch(matchId: string): Promise<PvpMatch | undefined>;
  submitPvpAnswer(args: { matchId: string; userId: string; roundId: string; answer: string; timeMs: number }): Promise<PvpMatch | undefined>;
  finishPvpMatch(matchId: string): Promise<PvpMatch | undefined>;
  savePvpMatchHistory(row: InsertPvpMatch): Promise<PvpMatchRow>;
  getPvpHistory(userId: string, limit?: number): Promise<PvpMatchRow[]>;
}

class PgStorage implements IStorage {
  private db;
  private pvpQueue: PvpQueueEntry[] = [];
  private pvpMatches: Map<string, PvpMatch> = new Map();

  constructor(databaseUrl: string) {
    // Supabase transaction pooler (port 6543) does not support prepared
    // statements, so disable them. SSL flag is taken from the connection URL.
    const client = postgres(databaseUrl, { prepare: false });
    this.db = drizzle(client);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return row;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [row] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return row;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await this.db.insert(users).values(user).returning();
    return created;
  }

  async getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    return this.db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.score), desc(leaderboard.updatedAt))
      .limit(limit);
  }

  async upsertLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [existing] = await this.db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.playerName, entry.playerName))
      .limit(1);

    if (existing) {
      const [updated] = await this.db
        .update(leaderboard)
        .set({
          userId: entry.userId ?? existing.userId,
          score: Math.max(existing.score, entry.score ?? 0),
          stage: Math.max(existing.stage, entry.stage ?? 0),
          totalSolved: Math.max(existing.totalSolved, entry.totalSolved ?? 0),
          accuracy: entry.accuracy ?? existing.accuracy,
          avgTime: entry.avgTime ?? existing.avgTime,
          country: entry.country ?? existing.country,
          updatedAt: new Date(),
        })
        .where(eq(leaderboard.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db
      .insert(leaderboard)
      .values({
        playerName: entry.playerName,
        userId: entry.userId ?? null,
        score: entry.score ?? 0,
        stage: entry.stage ?? 0,
        totalSolved: entry.totalSolved ?? 0,
        accuracy: entry.accuracy ?? 0,
        avgTime: entry.avgTime ?? 0,
        country: entry.country ?? "",
      })
      .returning();
    return created;
  }

  async getLeaderboardByPlayer(playerName: string): Promise<LeaderboardEntry | undefined> {
    const [row] = await this.db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.playerName, playerName))
      .limit(1);
    return row;
  }

  async saveRaceResult(result: InsertRaceResult): Promise<RaceResult> {
    const [created] = await this.db
      .insert(raceResults)
      .values({
        raceId: result.raceId,
        userId: result.userId ?? null,
        playerName: result.playerName,
        score: result.score ?? 0,
        solved: result.solved ?? 0,
        totalQuestions: result.totalQuestions ?? 0,
        timeMs: result.timeMs ?? 0,
        stage: result.stage ?? 0,
      })
      .returning();
    return created;
  }

  async getRaceResults(raceId: string): Promise<RaceResult[]> {
    return this.db
      .select()
      .from(raceResults)
      .where(eq(raceResults.raceId, raceId))
      .orderBy(desc(raceResults.score), raceResults.timeMs);
  }

  async upsertIqProfile(profile: InsertIqProfile): Promise<IqProfile> {
    const [existing] = await this.db.select().from(iqProfiles).where(eq(iqProfiles.userId, profile.userId)).limit(1);
    if (existing) {
      const [updated] = await this.db
        .update(iqProfiles)
        .set({
          playerName: profile.playerName ?? existing.playerName,
          profileData: profile.profileData ?? existing.profileData,
          updatedAt: new Date(),
        })
        .where(eq(iqProfiles.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(iqProfiles)
      .values({
        userId: profile.userId,
        playerName: profile.playerName ?? "IQPlayer",
        profileData: profile.profileData ?? {},
      })
      .returning();
    return created;
  }

  async getIqProfile(userId: string): Promise<IqProfile | undefined> {
    const [row] = await this.db.select().from(iqProfiles).where(eq(iqProfiles.userId, userId)).limit(1);
    return row;
  }

  async getSocialShelf(limit = 20): Promise<IqProfile[]> {
    return this.db.select().from(iqProfiles).orderBy(desc(iqProfiles.updatedAt)).limit(limit);
  }

  async saveAntiCheatEvent(event: InsertAntiCheatEvent): Promise<AntiCheatEvent> {
    const [created] = await this.db
      .insert(antiCheatEvents)
      .values({
        userId: event.userId,
        sessionId: event.sessionId,
        suspicionScore: event.suspicionScore ?? 0,
        payload: event.payload ?? {},
      })
      .returning();
    return created;
  }

  async joinPvpQueue(entry: PvpQueueEntry): Promise<{ match: PvpMatch | null; queued: boolean }> {
    this.pvpQueue = this.pvpQueue.filter((q) => q.userId !== entry.userId);
    this.pvpQueue.push(entry);
    if (this.pvpQueue.length < 2) return { match: null, queued: true };
    const [a, b] = this.pvpQueue.splice(0, 2);
    const match: PvpMatch = {
      id: `match_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      createdAt: Date.now(),
      playerA: a,
      playerB: b,
      rounds: createPvpRounds(),
      answers: { [a.userId]: [], [b.userId]: [] },
      status: "active",
    };
    this.pvpMatches.set(match.id, match);
    return { match, queued: false };
  }

  async leavePvpQueue(userId: string): Promise<void> {
    this.pvpQueue = this.pvpQueue.filter((q) => q.userId !== userId);
  }

  async getPvpMatch(matchId: string): Promise<PvpMatch | undefined> {
    return this.pvpMatches.get(matchId);
  }

  async submitPvpAnswer(args: { matchId: string; userId: string; roundId: string; answer: string; timeMs: number }): Promise<PvpMatch | undefined> {
    const match = this.pvpMatches.get(args.matchId);
    if (!match || match.status !== "active") return match;
    const round = match.rounds.find((r) => r.id === args.roundId);
    if (!round) return match;
    const target = match.answers[args.userId];
    if (!target) return match;
    const already = target.some((a) => a.roundId === args.roundId);
    if (already) return match;
    target.push({
      roundId: args.roundId,
      answer: args.answer,
      correct: args.answer.trim().toLowerCase() === round.answer.trim().toLowerCase(),
      timeMs: args.timeMs,
    });
    return match;
  }

  async finishPvpMatch(matchId: string): Promise<PvpMatch | undefined> {
    const match = this.pvpMatches.get(matchId);
    if (!match) return match;
    match.status = "finished";
    match.result = calculateMatchResult(match);
    this.pvpMatches.set(matchId, match);
    await this.savePvpMatchHistory({
      matchId: match.id,
      winnerUserId: match.result.winnerUserId,
      playerAUserId: match.playerA.userId,
      playerBUserId: match.playerB.userId,
      scoreA: match.result.scoreA,
      scoreB: match.result.scoreB,
      payload: match,
    });
    return match;
  }

  async savePvpMatchHistory(row: InsertPvpMatch): Promise<PvpMatchRow> {
    const [existing] = await this.db.select().from(pvpMatches).where(eq(pvpMatches.matchId, row.matchId)).limit(1);
    if (existing) {
      const [updated] = await this.db
        .update(pvpMatches)
        .set({
          winnerUserId: row.winnerUserId ?? null,
          scoreA: row.scoreA ?? existing.scoreA,
          scoreB: row.scoreB ?? existing.scoreB,
          payload: row.payload ?? existing.payload,
          finishedAt: new Date(),
        })
        .where(eq(pvpMatches.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(pvpMatches)
      .values({
        matchId: row.matchId,
        winnerUserId: row.winnerUserId ?? null,
        playerAUserId: row.playerAUserId,
        playerBUserId: row.playerBUserId,
        scoreA: row.scoreA ?? 0,
        scoreB: row.scoreB ?? 0,
        payload: row.payload ?? {},
      })
      .returning();
    return created;
  }

  async getPvpHistory(userId: string, limit = 20): Promise<PvpMatchRow[]> {
    return this.db
      .select()
      .from(pvpMatches)
      .where(or(eq(pvpMatches.playerAUserId, userId), eq(pvpMatches.playerBUserId, userId)))
      .orderBy(desc(pvpMatches.finishedAt))
      .limit(limit);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaderboardData: Map<string, LeaderboardEntry>;
  private raceData: Map<string, RaceResult[]>;
  private profileData: Map<string, IqProfile>;
  private antiCheatData: AntiCheatEvent[];
  private pvpQueue: PvpQueueEntry[];
  private pvpMatches: Map<string, PvpMatch>;
  private pvpHistoryData: PvpMatchRow[];
  currentUserId: number;
  currentLeaderboardId: number;
  currentRaceId: number;
  currentProfileId: number;
  currentAntiCheatId: number;
  currentPvpHistoryId: number;

  constructor() {
    this.users = new Map();
    this.leaderboardData = new Map();
    this.raceData = new Map();
    this.profileData = new Map();
    this.antiCheatData = [];
    this.pvpQueue = [];
    this.pvpMatches = new Map();
    this.pvpHistoryData = [];
    this.currentUserId = 1;
    this.currentLeaderboardId = 1;
    this.currentRaceId = 1;
    this.currentProfileId = 1;
    this.currentAntiCheatId = 1;
    this.currentPvpHistoryId = 1;

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
        userId: null,
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
        userId:      entry.userId ?? existing.userId,
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
        userId:      entry.userId ?? null,
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
      userId:         result.userId ?? null,
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

  async upsertIqProfile(profile: InsertIqProfile): Promise<IqProfile> {
    const existing = this.profileData.get(profile.userId);
    if (existing) {
      const updated: IqProfile = {
        ...existing,
        playerName: profile.playerName ?? existing.playerName,
        profileData: profile.profileData ?? existing.profileData,
        updatedAt: new Date(),
      };
      this.profileData.set(profile.userId, updated);
      return updated;
    }
    const created: IqProfile = {
      id: this.currentProfileId++,
      userId: profile.userId,
      playerName: profile.playerName ?? "IQPlayer",
      profileData: profile.profileData ?? {},
      updatedAt: new Date(),
    };
    this.profileData.set(profile.userId, created);
    return created;
  }

  async getIqProfile(userId: string): Promise<IqProfile | undefined> {
    return this.profileData.get(userId);
  }

  async getSocialShelf(limit = 20): Promise<IqProfile[]> {
    return Array.from(this.profileData.values())
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
      .slice(0, limit);
  }

  async saveAntiCheatEvent(event: InsertAntiCheatEvent): Promise<AntiCheatEvent> {
    const created: AntiCheatEvent = {
      id: this.currentAntiCheatId++,
      userId: event.userId,
      sessionId: event.sessionId,
      suspicionScore: event.suspicionScore ?? 0,
      payload: event.payload ?? {},
      createdAt: new Date(),
    };
    this.antiCheatData.push(created);
    return created;
  }

  async joinPvpQueue(entry: PvpQueueEntry): Promise<{ match: PvpMatch | null; queued: boolean }> {
    this.pvpQueue = this.pvpQueue.filter((q) => q.userId !== entry.userId);
    this.pvpQueue.push(entry);
    if (this.pvpQueue.length < 2) return { match: null, queued: true };
    const [a, b] = this.pvpQueue.splice(0, 2);
    const match: PvpMatch = {
      id: `match_${Date.now()}_${Math.floor(Math.random() * 9999)}`,
      createdAt: Date.now(),
      playerA: a,
      playerB: b,
      rounds: createPvpRounds(),
      answers: { [a.userId]: [], [b.userId]: [] },
      status: "active",
    };
    this.pvpMatches.set(match.id, match);
    return { match, queued: false };
  }

  async leavePvpQueue(userId: string): Promise<void> {
    this.pvpQueue = this.pvpQueue.filter((q) => q.userId !== userId);
  }

  async getPvpMatch(matchId: string): Promise<PvpMatch | undefined> {
    return this.pvpMatches.get(matchId);
  }

  async submitPvpAnswer(args: { matchId: string; userId: string; roundId: string; answer: string; timeMs: number }): Promise<PvpMatch | undefined> {
    const match = this.pvpMatches.get(args.matchId);
    if (!match || match.status !== "active") return match;
    const round = match.rounds.find((r) => r.id === args.roundId);
    if (!round) return match;
    const target = match.answers[args.userId];
    if (!target) return match;
    if (target.some((a) => a.roundId === args.roundId)) return match;
    target.push({
      roundId: args.roundId,
      answer: args.answer,
      correct: args.answer.trim().toLowerCase() === round.answer.trim().toLowerCase(),
      timeMs: args.timeMs,
    });
    return match;
  }

  async finishPvpMatch(matchId: string): Promise<PvpMatch | undefined> {
    const match = this.pvpMatches.get(matchId);
    if (!match) return match;
    match.status = "finished";
    match.result = calculateMatchResult(match);
    this.pvpMatches.set(matchId, match);
    await this.savePvpMatchHistory({
      matchId: match.id,
      winnerUserId: match.result.winnerUserId,
      playerAUserId: match.playerA.userId,
      playerBUserId: match.playerB.userId,
      scoreA: match.result.scoreA,
      scoreB: match.result.scoreB,
      payload: match,
    });
    return match;
  }

  async savePvpMatchHistory(row: InsertPvpMatch): Promise<PvpMatchRow> {
    const existing = this.pvpHistoryData.find((item) => item.matchId === row.matchId);
    if (existing) {
      existing.winnerUserId = row.winnerUserId ?? null;
      existing.scoreA = row.scoreA ?? existing.scoreA;
      existing.scoreB = row.scoreB ?? existing.scoreB;
      existing.payload = row.payload ?? existing.payload;
      existing.finishedAt = new Date();
      return existing;
    }
    const created: PvpMatchRow = {
      id: this.currentPvpHistoryId++,
      matchId: row.matchId,
      winnerUserId: row.winnerUserId ?? null,
      playerAUserId: row.playerAUserId,
      playerBUserId: row.playerBUserId,
      scoreA: row.scoreA ?? 0,
      scoreB: row.scoreB ?? 0,
      payload: row.payload ?? {},
      finishedAt: new Date(),
    };
    this.pvpHistoryData.push(created);
    return created;
  }

  async getPvpHistory(userId: string, limit = 20): Promise<PvpMatchRow[]> {
    return this.pvpHistoryData
      .filter((row) => row.playerAUserId === userId || row.playerBUserId === userId)
      .sort((a, b) => +new Date(b.finishedAt) - +new Date(a.finishedAt))
      .slice(0, limit);
  }
}

const forceMemoryStorage = String(process.env.USE_IN_MEMORY_STORAGE || "").toLowerCase() === "true";
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export const storageMode: "postgres" | "memory" = hasDatabaseUrl && !forceMemoryStorage ? "postgres" : "memory";

export const storage: IStorage = storageMode === "postgres"
  ? new PgStorage(process.env.DATABASE_URL!)
  : new MemStorage();
