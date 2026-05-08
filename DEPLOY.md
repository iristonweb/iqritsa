# Полный деплой IQritsa (фронт + API + БД)

## Вариант без карты (рекомендуется сейчас)

Используйте один проект Vercel:

- фронт как Vite static build
- API как Vercel Function в `api/[...route].ts`

Инструкция: [`VERCEL_SETUP.md`](VERCEL_SETUP.md)

Текущий деплой на `iqritsa.vercel.app` поднимает только статический фронт
(`vercel.json` → `framework: vite`, `outputDirectory: dist/public`),
поэтому все запросы к `/api/*` отвечают `404`. Для full-stack нужно
запустить проект как **единый Node-сервис**: один процесс отдаёт и
собранный фронт, и Express API. Архитектура для этого уже готова в
[`server/index.ts`](server/index.ts) и [`server/vite.ts`](server/vite.ts).

## Минимальный путь — Render.com

1. Закоммитить изменения и запушить ветку в GitHub.
2. На Render создать новый Blueprint, указать репозиторий —
   [`render.yaml`](render.yaml) уже описывает один web-сервис.
3. В UI Render заполнить env vars, помеченные `sync: false`:
   - `DATABASE_URL` (Supabase pooler URL, порт 6543)
   - `SUPABASE_JWKS_URL`, `SUPABASE_ISSUER`, `SUPABASE_AUDIENCE`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy → Render выполнит `npm install --include=dev && npm run build`
   и запустит `npm run start` на присвоенном `PORT`.

После первого деплоя нужно один раз накатить схему БД:

```bash
npm run db:push
```

(если СУБД не принимает обычный TLS, временно `npm run db:push:insecure`).

## Локальная разработка

```bash
npm install
npm run dev
```

Сервер слушает `http://localhost:5000` и сразу отдаёт фронт + `/api/*`.
Если `DATABASE_URL` недоступен из вашей сети, бэкенд всё равно
поднимется, но запросы к БД-роутам вернут `500` — UI продолжит работать
на in-memory сценариях.

## Что было поправлено для запуска

- В [`server/index.ts`](server/index.ts) добавлена загрузка `.env` через
  `dotenv` и убрана опция `reusePort: true` на Windows
  (вызывала `ENOTSUP` локально).
- В [`server/storage.ts`](server/storage.ts) драйвер `@neondatabase/serverless`
  заменён на `postgres` (`drizzle-orm/postgres-js`), потому что
  `DATABASE_URL` в `.env` указывает на Supabase pooler, а не на Neon.
- В [`package.json`](package.json) `start`-скрипт переведён на `cross-env`
  и `cross-env` перенесён в `dependencies`, чтобы прод-сборка работала
  на любом хостинге.

## Альтернатива (фронт остаётся на Vercel)

1. Развернуть бэкенд на Render как выше — получить домен
   вида `https://iqritsa.onrender.com`.
2. На Vercel задать `VITE_API_BASE_URL=https://iqritsa.onrender.com`
   и пересобрать фронт.
3. В Express добавить CORS-разрешение для `https://iqritsa.vercel.app`.

Этот вариант сложнее в обслуживании; рекомендуется, только если домен
`iqritsa.vercel.app` нельзя заменить.

## Рекомендуемая схема сейчас — Vercel (frontend) + Koyeb (backend)

Если нужен деплой без привязки к локальному ПК и без карты, используйте
разделение:

- Vercel: только frontend
- Koyeb: backend (Express API)

### 1) Деплой backend на Koyeb

1. Запушить текущую ветку в GitHub.
2. В Koyeb: `Create Web Service` -> `GitHub` -> выбрать репозиторий.
3. Настроить:
   - Build command: `npm run build`
   - Run command: `npm run start`
   - Instance type: free/shared
4. Добавить env vars:
   - `DATABASE_URL`
   - `SUPABASE_JWKS_URL`
   - `SUPABASE_ISSUER`
   - `SUPABASE_AUDIENCE`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `USE_IN_MEMORY_STORAGE=false`
   - `CORS_ORIGINS=https://iqritsa.vercel.app`
5. После деплоя получить backend URL, например:
   `https://iqritsa-backend-xxx.koyeb.app`

### 2) Привязка frontend на Vercel

В Vercel Project Settings -> Environment Variables:

- `VITE_API_BASE_URL=https://iqritsa-backend-xxx.koyeb.app`

Перезапустить production deploy (redeploy), чтобы Vite собрал фронт с новым API URL.

### 3) Smoke-check после связки

```bash
# local
npm run smoke
```

```powershell
# remote backend
$env:SMOKE_BASE_URL='https://iqritsa-backend-xxx.koyeb.app'
npm run smoke
```

Ожидается:

- `/api/health` -> `ok=true`
- `/api/leaderboard` -> HTTP 200
