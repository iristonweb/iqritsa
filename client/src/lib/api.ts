import { ensureSession } from "./supabase";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export function apiUrl(path: string) {
  if (path.startsWith("http")) return path;
  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path}`;
}

export async function authFetch(path: string, init?: RequestInit) {
  const session = await ensureSession();
  const token = session?.access_token;
  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(apiUrl(path), {
    ...init,
    headers,
  });
}
