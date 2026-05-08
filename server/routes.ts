import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, storageMode } from "./storage";
import {
  insertLeaderboardSchema,
  insertRaceResultSchema,
  insertIqProfileSchema,
  insertAntiCheatEventSchema,
} from "@shared/schema";
import { z } from "zod";
import { requireAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      storage: storageMode,
      env: process.env.NODE_ENV || "development",
      uptimeSec: Math.round(process.uptime()),
    });
  });

  const joinQueueSchema = z.object({
    playerName: z.string().min(1).max(40),
    mmr: z.number().int().min(0).max(5000).default(1000),
  });

  const answerSchema = z.object({
    roundId: z.string().min(1),
    answer: z.string().min(1).max(200),
    timeMs: z.number().int().min(0).max(120000),
  });

  const sanitizeMatch = (match: any) => ({
    ...match,
    rounds: Array.isArray(match?.rounds)
      ? match.rounds.map((r: any) => ({ id: r.id, question: r.question }))
      : [],
  });

  // ── Leaderboard ─────────────────────────────────────────────────────────
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 200);
      const entries = await storage.getLeaderboard(limit);
      res.json(entries);
    } catch (err) {
      console.error('[leaderboard] failed:', err);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.post('/api/leaderboard', requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const data = insertLeaderboardSchema.parse({
        ...req.body,
        userId: auth?.userId,
      });
      const entry = await storage.upsertLeaderboardEntry(data);
      res.json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: 'Failed to save score' });
    }
  });

  app.get('/api/leaderboard/player/:name', async (req, res) => {
    try {
      const entry = await storage.getLeaderboardByPlayer(req.params.name);
      if (!entry) return res.status(404).json({ error: 'Player not found' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch player' });
    }
  });

  // ── Race results ─────────────────────────────────────────────────────────
  app.get('/api/race/:raceId/results', async (req, res) => {
    try {
      const results = await storage.getRaceResults(req.params.raceId);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch race results' });
    }
  });

  app.post("/api/race/result", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const data = insertRaceResultSchema.parse({
        ...req.body,
        userId: auth?.userId,
      });
      const saved = await storage.saveRaceResult(data);
      res.json(saved);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: "Failed to save race result" });
    }
  });

  // ── IQ Profile cloud sync ────────────────────────────────────────────────
  app.get("/api/iq/profile", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const profile = await storage.getIqProfile(auth!.userId);
      res.json(profile ?? null);
    } catch {
      res.status(500).json({ error: "Failed to load profile" });
    }
  });

  app.put("/api/iq/profile", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const data = insertIqProfileSchema.parse({
        ...req.body,
        userId: auth?.userId,
      });
      const profile = await storage.upsertIqProfile(data);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.get("/api/iq/social-shelf", async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const shelf = await storage.getSocialShelf(limit);
      res.json(shelf);
    } catch {
      res.status(500).json({ error: "Failed to fetch social shelf" });
    }
  });

  // ── Anti-cheat telemetry ─────────────────────────────────────────────────
  app.post("/api/iq/anticheat-event", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const data = insertAntiCheatEventSchema.parse({
        ...req.body,
        userId: auth?.userId,
      });
      const saved = await storage.saveAntiCheatEvent(data);
      res.json(saved);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: "Failed to save anti-cheat event" });
    }
  });

  // ── Authoritative PvP queue and match ────────────────────────────────────
  app.post("/api/iq/pvp/queue/join", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const body = joinQueueSchema.parse(req.body);
      const result = await storage.joinPvpQueue({
        userId: auth!.userId,
        playerName: body.playerName,
        mmr: body.mmr,
        joinedAt: Date.now(),
      });
      res.json({ ...result, match: result.match ? sanitizeMatch(result.match) : null });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: "Failed to join queue" });
    }
  });

  app.post("/api/iq/pvp/queue/leave", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      await storage.leavePvpQueue(auth!.userId);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "Failed to leave queue" });
    }
  });

  app.get("/api/iq/pvp/match/:matchId", requireAuth, async (req, res) => {
    try {
      const match = await storage.getPvpMatch(req.params.matchId);
      if (!match) return res.status(404).json({ error: "Match not found" });
      res.json(sanitizeMatch(match));
    } catch {
      res.status(500).json({ error: "Failed to fetch match" });
    }
  });

  app.post("/api/iq/pvp/match/:matchId/answer", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const body = answerSchema.parse(req.body);
      const match = await storage.submitPvpAnswer({
        matchId: req.params.matchId,
        userId: auth!.userId,
        roundId: body.roundId,
        answer: body.answer,
        timeMs: body.timeMs,
      });
      if (!match) return res.status(404).json({ error: "Match not found" });
      res.json(sanitizeMatch(match));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  app.post("/api/iq/pvp/match/:matchId/finish", requireAuth, async (req, res) => {
    try {
      const match = await storage.finishPvpMatch(req.params.matchId);
      if (!match) return res.status(404).json({ error: "Match not found" });
      res.json(sanitizeMatch(match));
    } catch {
      res.status(500).json({ error: "Failed to finish match" });
    }
  });

  app.get("/api/iq/pvp/history", requireAuth, async (req, res) => {
    try {
      const auth = (req as typeof req & { auth?: { userId: string } }).auth;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const history = await storage.getPvpHistory(auth!.userId, limit);
      res.json(history);
    } catch {
      res.status(500).json({ error: "Failed to fetch PvP history" });
    }
  });

  return createServer(app);
}
