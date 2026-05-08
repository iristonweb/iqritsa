import { authFetch } from "@/lib/api";

export async function loadCloudProfile() {
  const res = await authFetch("/api/iq/profile");
  if (!res.ok) return null;
  return res.json();
}

export async function saveCloudProfile(playerName: string, profileData: unknown) {
  const res = await authFetch("/api/iq/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName, profileData }),
  });
  if (!res.ok) throw new Error("Failed to sync profile");
  return res.json();
}

export async function loadSocialShelf(limit = 20) {
  const res = await authFetch(`/api/iq/social-shelf?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}
