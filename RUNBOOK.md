# IQritsa Local Runbook

## Recommended daily workflow

1. Start in stable offline mode (no external DB dependency):

```bash
npm run dev:offline
```

2. Run smoke checks in another terminal:

```bash
npm run smoke
```

3. Before each commit, run full verification:

```bash
npm run verify
```

## What each command does

- `npm run dev:offline` - starts frontend + backend on `http://localhost:5000` with in-memory storage.
- `npm run smoke` - checks:
  - `/`
  - `/api/health`
  - `/api/leaderboard`
- `npm run verify` - runs TypeScript checks and production build.

## When you switch to separate backend hosting

Set these environment variables on backend:

- `DATABASE_URL` - production Postgres URL
- `CORS_ORIGINS=https://iqritsa.vercel.app`
- `USE_IN_MEMORY_STORAGE=false`

Set on frontend (Vercel):

- `VITE_API_BASE_URL=https://<your-backend-domain>`

## Quick remote checks

When backend is deployed (Koyeb/any server), validate it with the same smoke script:

```powershell
$env:SMOKE_BASE_URL='https://<your-backend-domain>'
npm run smoke
```

For local checks again:

```powershell
Remove-Item Env:SMOKE_BASE_URL -ErrorAction SilentlyContinue
npm run smoke
```

For Vercel same-origin backend, just verify:

```powershell
$env:SMOKE_BASE_URL='https://iqritsa.vercel.app'
npm run smoke
```
