const required = [
  "VITE_API_BASE_URL",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "DATABASE_URL",
];

const missing = required.filter((name) => !process.env[name] || String(process.env[name]).trim() === "");
if (missing.length > 0) {
  console.error("[env-check] Missing required environment variables:");
  for (const name of missing) console.error(`- ${name}`);
  process.exit(1);
}

if (!String(process.env.DATABASE_URL).startsWith("postgres")) {
  console.error("[env-check] DATABASE_URL must start with postgres");
  process.exit(1);
}

if (!String(process.env.VITE_SUPABASE_URL).startsWith("https://")) {
  console.error("[env-check] VITE_SUPABASE_URL must be an https URL");
  process.exit(1);
}

const baseUrl = process.env.PROD_BASE_URL;
if (baseUrl) {
  try {
    const health = await fetch(`${baseUrl.replace(/\/$/, "")}/api/health`);
    if (!health.ok) {
      console.error(`[env-check] ${baseUrl}/api/health returned ${health.status}`);
      process.exit(1);
    }
    const payload = await health.json();
    console.log(`[env-check] Health OK (env=${payload.env}, storage=${payload.storage})`);
  } catch (error) {
    console.error("[env-check] Failed to reach PROD_BASE_URL health endpoint:", error.message);
    process.exit(1);
  }
}

console.log("[env-check] Production environment variables look valid.");
