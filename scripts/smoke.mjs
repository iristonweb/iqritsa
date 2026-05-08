const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:5000";

async function assertOk(path) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${path} expected 2xx but got ${res.status}`);
  }
  return res;
}

async function run() {
  console.log(`[smoke] Base URL: ${baseUrl}`);

  const home = await assertOk("/");
  const homeBody = await home.text();
  if (!homeBody.includes("<!DOCTYPE html>") && !homeBody.includes("<html")) {
    throw new Error("Home page is not HTML");
  }
  console.log("[smoke] / OK");

  const health = await assertOk("/api/health");
  const healthJson = await health.json();
  if (!healthJson?.ok) {
    throw new Error("/api/health did not return ok=true");
  }
  console.log(`[smoke] /api/health OK (storage=${healthJson.storage}, env=${healthJson.env})`);

  const leaderboard = await assertOk("/api/leaderboard");
  const leaderboardJson = await leaderboard.json();
  if (!Array.isArray(leaderboardJson)) {
    throw new Error("/api/leaderboard did not return an array");
  }
  console.log(`[smoke] /api/leaderboard OK (items=${leaderboardJson.length})`);

  console.log("[smoke] All checks passed");
}

run().catch((error) => {
  console.error("[smoke] FAILED:", error.message);
  process.exit(1);
});
