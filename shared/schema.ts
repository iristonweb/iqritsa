import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
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
  raceId: text("race_id").notNull(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull().default(0),
  solved: integer("solved").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  timeMs: integer("time_ms").notNull().default(0),
  stage: integer("stage").notNull().default(0),
  finishedAt: timestamp("finished_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  playerName: true,
  score: true,
  stage: true,
  totalSolved: true,
  accuracy: true,
  avgTime: true,
  country: true,
});

export const insertRaceResultSchema = createInsertSchema(raceResults).pick({
  raceId: true,
  playerName: true,
  score: true,
  solved: true,
  totalQuestions: true,
  timeMs: true,
  stage: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardSchema>;
export type RaceResult = typeof raceResults.$inferSelect;
export type InsertRaceResult = z.infer<typeof insertRaceResultSchema>;
