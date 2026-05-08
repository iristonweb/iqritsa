# IQritsa on Vercel (No Card)

## What this setup does

- Frontend is served as static Vite build (`dist/public`).
- Backend runs as Vercel Function in `api/[...route].ts`.
- Both are on one domain, so API works via `/api/*` without separate backend hosting.

## One-time Vercel project settings

In Vercel Project -> Settings -> Environment Variables, add:

- `DATABASE_URL`
- `SUPABASE_JWKS_URL`
- `SUPABASE_ISSUER`
- `SUPABASE_AUDIENCE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `USE_IN_MEMORY_STORAGE=false`
- `CORS_ORIGINS=https://iqritsa.vercel.app`

For same-origin API, set:

- `VITE_API_BASE_URL` = empty string

## Deploy flow

1. Push changes to `main`.
2. Wait until Vercel finishes deployment.
3. Verify:
   - `https://iqritsa.vercel.app/`
   - `https://iqritsa.vercel.app/api/health`
   - `https://iqritsa.vercel.app/api/leaderboard`

## Notes

- In-memory PvP queue/match data is not durable in serverless.
- For reliable PvP state, move queue/match state to shared storage (Redis/Postgres).
