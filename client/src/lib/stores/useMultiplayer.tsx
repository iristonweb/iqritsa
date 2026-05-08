import { create } from "zustand";
import { apiUrl, authFetch } from "../api";
import { supabase } from "../supabase";

export interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  stage: number;
  totalSolved: number;
  accuracy: number;
  avgTime: number;
  country: string;
  updatedAt: string;
}

export interface RacePlayer {
  id: string;
  name: string;
  score: number;
  solved: number;
  finished: boolean;
  ready: boolean;
}

export type RacePhase = 'idle' | 'lobby' | 'racing' | 'results';

interface MultiplayerState {
  // leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  myEntry: LeaderboardEntry | null;

  // race
  racePhase: RacePhase;
  roomId: string;
  playerId: string;
  playerName: string;
  players: RacePlayer[];
  raceStage: number;
  chatMessages: { from: string; text: string }[];
  raceResults: { name: string; score: number; solved: number }[];

  channel: any | null;

  // actions
  fetchLeaderboard: () => Promise<void>;
  submitScore: (entry: Omit<LeaderboardEntry, 'id' | 'updatedAt'>) => Promise<void>;
  joinRace: (roomId: string, playerName: string, stage: number) => void;
  setReady: () => void;
  sendAnswer: (correct: boolean, points: number) => void;
  sendFinish: () => void;
  sendChat: (text: string) => void;
  leaveRace: () => void;
  setPlayerName: (name: string) => void;
  setRaceStage: (s: number) => void;
}

export const useMultiplayer = create<MultiplayerState>((set, get) => ({
  leaderboard: [],
  leaderboardLoading: false,
  myEntry: null,

  racePhase: 'idle',
  roomId: '',
  playerId: '',
  playerName: localStorage.getItem('mp-player-name') || '',
  players: [],
  raceStage: 0,
  chatMessages: [],
  raceResults: [],
  channel: null,

  setPlayerName: (name) => {
    localStorage.setItem('mp-player-name', name);
    set({ playerName: name });
  },

  setRaceStage: (s) => set({ raceStage: s }),

  fetchLeaderboard: async () => {
    set({ leaderboardLoading: true });
    try {
      const res = await fetch(apiUrl('/api/leaderboard?limit=50'));
      const data: LeaderboardEntry[] = await res.json();
      set({ leaderboard: data, leaderboardLoading: false });
    } catch {
      set({ leaderboardLoading: false });
    }
  },

  submitScore: async (entry) => {
    try {
      const res = await authFetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const saved: LeaderboardEntry = await res.json();
      set({ myEntry: saved });
      await get().fetchLeaderboard();
    } catch (e) {
      console.error('Failed to submit score', e);
    }
  },

  joinRace: (roomId, playerName, stage) => {
    if (!navigator.onLine) {
      console.warn("Multiplayer unavailable offline");
      return;
    }
    const { channel: existing } = get();
    if (existing && supabase) {
      supabase.removeChannel(existing);
    }

    if (!supabase) {
      console.warn("Supabase is not configured, multiplayer is disabled");
      return;
    }

    const playerId = `${playerName}_${Date.now()}`;
    const channelName = `${import.meta.env.VITE_REALTIME_ROOM_PREFIX || "iqritsa"}:${roomId}`;
    const channel = supabase.channel(channelName);

    channel.on("broadcast", { event: "message" }, ({ payload }) => {
      const msg = payload as any;
      switch (msg.type) {
        case "player_joined":
        case "player_ready":
        case "score_update":
        case "player_finished":
          set((s) => {
            const players = [...s.players];
            const idx = players.findIndex((p) => p.id === msg.playerId);
            if (idx >= 0) {
              players[idx] = {
                ...players[idx],
                score: msg.score ?? players[idx].score,
                solved: msg.solved ?? players[idx].solved,
                finished: msg.type === "player_finished" ? true : players[idx].finished,
                ready: msg.type === "player_ready" ? true : players[idx].ready,
              };
            } else if (msg.type === "player_joined") {
              players.push({
                id: msg.playerId,
                name: msg.name,
                score: 0,
                solved: 0,
                finished: false,
                ready: false,
              });
            }
            return { players };
          });
          break;
        case "race_start":
          set({ racePhase: "racing" });
          break;
        case "race_over":
          set({ racePhase: "results", raceResults: msg.results ?? [] });
          break;
        case "chat":
          set((s) => ({
            chatMessages: [...s.chatMessages.slice(-49), { from: msg.from, text: msg.text }],
          }));
          break;
      }
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        void channel.send({
          type: "broadcast",
          event: "message",
          payload: { type: "player_joined", playerId, name: playerName },
        });
      }
    });

    set({
      channel,
      playerId,
      racePhase: "lobby",
      raceStage: stage,
      roomId,
      playerName,
      chatMessages: [],
      raceResults: [],
      players: [{ id: playerId, name: playerName, score: 0, solved: 0, finished: false, ready: false }],
    });
  },

  setReady: () => {
    const { channel, playerId, playerName } = get();
    if (!channel) return;
    void channel.send({
      type: "broadcast",
      event: "message",
      payload: { type: "player_ready", playerId, name: playerName },
    });
    void channel.send({
      type: "broadcast",
      event: "message",
      payload: { type: "race_start" },
    });
  },

  sendAnswer: (correct, points) => {
    const { channel, playerId, playerName, players } = get();
    if (!channel) return;
    const me = players.find((p) => p.id === playerId);
    const score = (me?.score ?? 0) + (correct ? points : 0);
    const solved = (me?.solved ?? 0) + (correct ? 1 : 0);
    void channel.send({
      type: "broadcast",
      event: "message",
      payload: { type: "score_update", playerId, name: playerName, score, solved },
    });
  },

  sendFinish: () => {
    const { channel, playerId, playerName, players, roomId, raceStage } = get();
    if (!channel) return;
    const me = players.find((p) => p.id === playerId);
    void channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        type: "player_finished",
        playerId,
        name: playerName,
        score: me?.score ?? 0,
        solved: me?.solved ?? 0,
      },
    });
    void authFetch("/api/race/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raceId: roomId,
        playerName,
        score: me?.score ?? 0,
        solved: me?.solved ?? 0,
        totalQuestions: 10,
        timeMs: 0,
        stage: raceStage,
      }),
    });
  },

  sendChat: (text) => {
    const { channel, playerName } = get();
    if (!channel) return;
    void channel.send({
      type: "broadcast",
      event: "message",
      payload: { type: "chat", from: playerName, text: text.slice(0, 120) },
    });
  },

  leaveRace: () => {
    const { channel } = get();
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
    set({ channel: null, racePhase: 'idle', players: [], chatMessages: [], raceResults: [] });
  },
}));
