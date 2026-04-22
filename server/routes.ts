import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertLeaderboardSchema, insertRaceResultSchema } from "@shared/schema";
import { z } from "zod";

// ── Active race rooms ──────────────────────────────────────────────────────
interface RacePlayer {
  ws: WebSocket;
  name: string;
  score: number;
  solved: number;
  ready: boolean;
  finished: boolean;
}

interface RaceRoom {
  id: string;
  stage: number;
  players: Map<string, RacePlayer>;
  started: boolean;
  startTime: number;
  totalQuestions: number;
}

const rooms = new Map<string, RaceRoom>();

function broadcast(room: RaceRoom, msg: object, excludeId?: string) {
  const json = JSON.stringify(msg);
  room.players.forEach((p, id) => {
    if (id !== excludeId && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(json);
    }
  });
}

function roomState(room: RaceRoom) {
  const players = Array.from(room.players.entries()).map(([id, p]) => ({
    id, name: p.name, score: p.score, solved: p.solved, finished: p.finished, ready: p.ready,
  }));
  return { type: 'room_state', roomId: room.id, stage: room.stage, started: room.started, players };
}

function cleanupRoom(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  let open = 0;
  room.players.forEach(p => { if (p.ws.readyState === WebSocket.OPEN) open++; });
  if (open === 0) rooms.delete(roomId);
}

export async function registerRoutes(app: Express): Promise<Server> {

  // ── Leaderboard ─────────────────────────────────────────────────────────
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 200);
      const entries = await storage.getLeaderboard(limit);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.post('/api/leaderboard', async (req, res) => {
    try {
      const data = insertLeaderboardSchema.parse(req.body);
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

  // ── HTTP server + WebSocket ──────────────────────────────────────────────
  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    let currentRoomId: string | null = null;
    let playerId: string | null = null;

    ws.on('message', async (raw) => {
      let msg: any;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      switch (msg.type) {

        case 'join_room': {
          const roomId   = String(msg.roomId || 'global');
          const pName    = String(msg.playerName || 'Аноним').slice(0, 20);
          const stage    = Number(msg.stage ?? 0);
          playerId       = `${pName}_${Date.now()}`;
          currentRoomId  = roomId;

          if (!rooms.has(roomId)) {
            rooms.set(roomId, {
              id: roomId, stage,
              players: new Map(),
              started: false, startTime: 0, totalQuestions: 10
            });
          }
          const room = rooms.get(roomId)!;
          room.players.set(playerId, { ws, name: pName, score: 0, solved: 0, ready: false, finished: false });

          ws.send(JSON.stringify({ type: 'joined', playerId, roomId }));
          broadcast(room, { type: 'player_joined', name: pName, playerId });
          broadcast(room, roomState(room));
          break;
        }

        case 'ready': {
          if (!currentRoomId || !playerId) break;
          const room = rooms.get(currentRoomId);
          if (!room) break;
          const p = room.players.get(playerId);
          if (!p) break;
          p.ready = true;

          broadcast(room, { type: 'player_ready', playerId, name: p.name });

          // Auto-start when all players ready (≥2) or after 30s with at least 1
          const all  = Array.from(room.players.values());
          const readyCount = all.filter(x => x.ready).length;
          if (!room.started && readyCount >= 1 && readyCount === all.length) {
            room.started   = true;
            room.startTime = Date.now();
            broadcast(room, { type: 'race_start', stage: room.stage, totalQuestions: room.totalQuestions });
          }
          break;
        }

        case 'answer': {
          if (!currentRoomId || !playerId) break;
          const room = rooms.get(currentRoomId);
          if (!room || !room.started) break;
          const p = room.players.get(playerId);
          if (!p || p.finished) break;

          const correct = Boolean(msg.correct);
          if (correct) {
            p.score  += Number(msg.points ?? 100);
            p.solved += 1;
          }
          broadcast(room, { type: 'score_update', playerId, name: p.name, score: p.score, solved: p.solved });
          break;
        }

        case 'finish': {
          if (!currentRoomId || !playerId) break;
          const room = rooms.get(currentRoomId);
          if (!room) break;
          const p = room.players.get(playerId);
          if (!p) break;
          p.finished = true;

          const elapsed = Date.now() - room.startTime;
          await storage.saveRaceResult({
            raceId: currentRoomId,
            playerName: p.name,
            score: p.score,
            solved: p.solved,
            totalQuestions: room.totalQuestions,
            timeMs: elapsed,
            stage: room.stage,
          });

          broadcast(room, { type: 'player_finished', playerId, name: p.name, score: p.score, solved: p.solved });

          // All finished?
          const all = Array.from(room.players.values());
          if (all.every(x => x.finished)) {
            const results = all.map(x => ({ name: x.name, score: x.score, solved: x.solved }))
              .sort((a, b) => b.score - a.score);
            broadcast(room, { type: 'race_over', results });
          }
          break;
        }

        case 'chat': {
          if (!currentRoomId || !playerId) break;
          const room = rooms.get(currentRoomId);
          if (!room) break;
          const p = room.players.get(playerId);
          if (!p) break;
          const text = String(msg.text || '').slice(0, 120);
          broadcast(room, { type: 'chat', from: p.name, text }, playerId);
          break;
        }
      }
    });

    ws.on('close', () => {
      if (currentRoomId && playerId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          const p = room.players.get(playerId);
          if (p) broadcast(room, { type: 'player_left', playerId, name: p.name });
          room.players.delete(playerId);
        }
        cleanupRoom(currentRoomId);
      }
    });
  });

  return httpServer;
}
