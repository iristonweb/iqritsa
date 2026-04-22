import { create } from "zustand";

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

  ws: WebSocket | null;

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
  ws: null,

  setPlayerName: (name) => {
    localStorage.setItem('mp-player-name', name);
    set({ playerName: name });
  },

  setRaceStage: (s) => set({ raceStage: s }),

  fetchLeaderboard: async () => {
    set({ leaderboardLoading: true });
    try {
      const res = await fetch('/api/leaderboard?limit=50');
      const data: LeaderboardEntry[] = await res.json();
      set({ leaderboard: data, leaderboardLoading: false });
    } catch {
      set({ leaderboardLoading: false });
    }
  },

  submitScore: async (entry) => {
    try {
      const res = await fetch('/api/leaderboard', {
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
    const { ws: existing } = get();
    if (existing) existing.close();

    const proto  = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl  = `${proto}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join_room', roomId, playerName, stage }));
    };

    socket.onmessage = (ev) => {
      let msg: any;
      try { msg = JSON.parse(ev.data); } catch { return; }

      switch (msg.type) {
        case 'joined':
          set({ playerId: msg.playerId, roomId: msg.roomId, racePhase: 'lobby' });
          break;
        case 'room_state':
          set({ players: msg.players ?? [] });
          break;
        case 'player_joined':
        case 'player_ready':
        case 'score_update':
        case 'player_finished':
          set(s => {
            const players = [...s.players];
            const idx = players.findIndex(p => p.id === msg.playerId);
            if (idx >= 0) {
              players[idx] = {
                ...players[idx],
                score:    msg.score    ?? players[idx].score,
                solved:   msg.solved   ?? players[idx].solved,
                finished: msg.type === 'player_finished' ? true : players[idx].finished,
                ready:    msg.type === 'player_ready'    ? true : players[idx].ready,
              };
            } else if (msg.type === 'player_joined') {
              players.push({ id: msg.playerId, name: msg.name, score: 0, solved: 0, finished: false, ready: false });
            }
            return { players };
          });
          break;
        case 'player_left':
          set(s => ({ players: s.players.filter(p => p.id !== msg.playerId) }));
          break;
        case 'race_start':
          set({ racePhase: 'racing' });
          break;
        case 'race_over':
          set({ racePhase: 'results', raceResults: msg.results ?? [] });
          break;
        case 'chat':
          set(s => ({
            chatMessages: [...s.chatMessages.slice(-49), { from: msg.from, text: msg.text }]
          }));
          break;
      }
    };

    socket.onclose = () => {
      set(s => s.racePhase === 'racing' ? { racePhase: 'results' } : {});
    };

    set({ ws: socket, raceStage: stage, roomId, playerName, chatMessages: [], raceResults: [] });
  },

  setReady: () => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ready' }));
  },

  sendAnswer: (correct, points) => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'answer', correct, points }));
  },

  sendFinish: () => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'finish' }));
  },

  sendChat: (text) => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'chat', text }));
  },

  leaveRace: () => {
    const { ws } = get();
    if (ws) ws.close();
    set({ ws: null, racePhase: 'idle', players: [], chatMessages: [], raceResults: [] });
  },
}));
