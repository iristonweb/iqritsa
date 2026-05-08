import { pgTable, text, serial, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull().default(0),
  stage: integer("stage").notNull().default(0),
  totalSolved: integer("total_solved").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  avgTime: real("avg_time").notNull().default(0),
  country: text("country").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const raceResults = pgTable("race_results", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  raceId: text("race_id").notNull(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull().default(0),
  solved: integer("solved").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  timeMs: integer("time_ms").notNull().default(0),
  stage: integer("stage").notNull().default(0),
  finishedAt: timestamp("finished_at").defaultNow().notNull(),
});

export const iqProfiles = pgTable("iq_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  playerName: text("player_name").notNull().default("IQPlayer"),
  profileData: jsonb("profile_data").notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const antiCheatEvents = pgTable("anti_cheat_events", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  suspicionScore: integer("suspicion_score").notNull().default(0),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pvpMatches = pgTable("pvp_matches", {
  id: serial("id").primaryKey(),
  matchId: text("match_id").notNull().unique(),
  winnerUserId: text("winner_user_id"),
  playerAUserId: text("player_a_user_id").notNull(),
  playerBUserId: text("player_b_user_id").notNull(),
  scoreA: integer("score_a").notNull().default(0),
  scoreB: integer("score_b").notNull().default(0),
  payload: jsonb("payload").notNull().default({}),
  finishedAt: timestamp("finished_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  userId: true,
  playerName: true,
  score: true,
  stage: true,
  totalSolved: true,
  accuracy: true,
  avgTime: true,
  country: true,
});

export const insertRaceResultSchema = createInsertSchema(raceResults).pick({
  userId: true,
  raceId: true,
  playerName: true,
  score: true,
  solved: true,
  totalQuestions: true,
  timeMs: true,
  stage: true,
});

export const insertIqProfileSchema = createInsertSchema(iqProfiles).pick({
  userId: true,
  playerName: true,
  profileData: true,
});

export const insertAntiCheatEventSchema = createInsertSchema(antiCheatEvents).pick({
  userId: true,
  sessionId: true,
  suspicionScore: true,
  payload: true,
});

export const insertPvpMatchSchema = createInsertSchema(pvpMatches).pick({
  matchId: true,
  winnerUserId: true,
  playerAUserId: true,
  playerBUserId: true,
  scoreA: true,
  scoreB: true,
  payload: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;
export type RaceResult = typeof raceResults.$inferSelect;
export type InsertRaceResult = z.infer<typeof insertRaceResultSchema>;
export type IqProfile = typeof iqProfiles.$inferSelect;
export type InsertIqProfile = z.infer<typeof insertIqProfileSchema>;
export type AntiCheatEvent = typeof antiCheatEvents.$inferSelect;
export type InsertAntiCheatEvent = z.infer<typeof insertAntiCheatEventSchema>;
export type PvpMatchRow = typeof pvpMatches.$inferSelect;
export type InsertPvpMatch = z.infer<typeof insertPvpMatchSchema>;
