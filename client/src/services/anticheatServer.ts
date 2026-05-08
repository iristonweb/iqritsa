import { authFetch } from "@/lib/api";

export async function sendAntiCheatEvent(sessionId: string, suspicionScore: number, payload: unknown) {
  await authFetch("/api/iq/anticheat-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, suspicionScore, payload }),
  });
}
