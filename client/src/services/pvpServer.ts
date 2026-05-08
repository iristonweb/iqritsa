import { authFetch } from "@/lib/api";

export async function joinServerPvpQueue(playerName: string, mmr: number) {
  const res = await authFetch("/api/iq/pvp/queue/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName, mmr }),
  });
  if (!res.ok) throw new Error("Failed to join PvP queue");
  return res.json();
}

export async function leaveServerPvpQueue() {
  await authFetch("/api/iq/pvp/queue/leave", { method: "POST" });
}

export async function getServerPvpMatch(matchId: string) {
  const res = await authFetch(`/api/iq/pvp/match/${matchId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function submitServerPvpAnswer(matchId: string, roundId: string, answer: string, timeMs: number) {
  const res = await authFetch(`/api/iq/pvp/match/${matchId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roundId, answer, timeMs }),
  });
  if (!res.ok) throw new Error("Failed to submit PvP answer");
  return res.json();
}

export async function finishServerPvpMatch(matchId: string) {
  const res = await authFetch(`/api/iq/pvp/match/${matchId}/finish`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to finish PvP match");
  return res.json();
}

export async function getServerPvpHistory(limit = 20) {
  const res = await authFetch(`/api/iq/pvp/history?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}
