# IQ-РИЦА: Эволюция Интеллекта

## Обзор
Инкрементальная браузерная игра, в которой игрок помогает курице Клепе эволюционировать через 8 этапов интеллекта, решая IQ-задачи. Тёмный киберпанк/неон UI, CSS/SVG графика, поддержка мобильных и десктоп устройств.

## Архитектура

### Frontend (client/)
- React + TypeScript + Vite
- Zustand для управления состоянием
- TailwindCSS + кастомный CSS (киберпанк стиль)
- Шрифт monospace, нет стандартных emoji

### Backend (server/)
- Express.js + TypeScript
- WebSocket (`ws`) для мультиплеера в реальном времени
- In-memory хранилище (MemStorage) с интерфейсом для PostgreSQL
- Drizzle ORM схема готова для подключения к БД

### Основные файлы
```
client/src/
  App.tsx                         — главный роутинг (hub/puzzle/leaderboard/multiplayer)
  components/game/
    ChickenCharacter.tsx          — SVG-персонаж Клепа (белая курица с VR-очками)
    GameHub.tsx                   — главное меню
    PuzzleArea.tsx                — экран задач
    Leaderboard.tsx               — таблица лидеров
    MultiplayerRace.tsx           — гонка умов (setup/lobby/racing/results)
  lib/
    puzzleGenerator.ts            — генератор задач (8 типов, ~300+ задач)
    stores/
      useChicken.tsx              — прогресс, стадия, нейроны
      usePuzzles.tsx              — текущая задача, таймер, статистика
      useIQGame.tsx               — состояние экрана (hub/puzzle/leaderboard/multiplayer)
      useMultiplayer.tsx          — WebSocket клиент, лидерборд, гонки

server/
  index.ts                        — Express сервер, порт 5000
  routes.ts                       — REST API + WebSocket сервер
  storage.ts                      — MemStorage (+ seed 10 ботов в рейтинге)

shared/
  schema.ts                       — Drizzle схема: users, leaderboard, raceResults
```

## Особенности

### Персонаж
- Белая курица с VR-очками, красным гребнем, золотыми лапами (SVG)
- Эволюционирует визуально через 8 этапов (цвет свечения, HUD в очках, антенны, нимб)
- Анимация плавания + настроение (нейтральный/счастливый/думает/запутан/взволнован)

### Задачи (8 типов)
- `logic_sequence` — числовые ряды (55 задач: Фибоначчи, простые числа, факториалы...)
- `math_problem` — IQ математика (55 задач: уравнения, проценты, комбинаторика...)
- `analogies` — аналогии (48 задач: предметные → концептуальные → абстрактные)
- `spatial_thinking` — пространственное мышление (30 задач)
- `probability` — теория вероятностей (25 задач)
- `raven_matrix` — матрицы Равена (15 задач, паттерн-распознавание)
- `cryptarithmetic` — шифроарифметика (20 задач)
- `sudoku` — судоку 4×4 (процедурная генерация)

Все задачи имеют 4 уровня сложности, фильтруются по этапу игрока.

### Мультиплеер
- WebSocket сервер (`/ws`) с комнатами
- Режим "Гонка Умов": лобби → гонка (10 вопросов, 30с каждый) → результаты
- Авто-старт когда все игроки готовы
- Скоринг: 100 + время × 3 очков за правильный ответ
- Чат в лобби
- Результаты сохраняются в leaderboard автоматически

### REST API
- `GET /api/leaderboard` — топ-50 игроков
- `POST /api/leaderboard` — сохранить/обновить рекорд
- `GET /api/leaderboard/player/:name` — поиск игрока
- `GET /api/race/:raceId/results` — результаты гонки

### Этапы эволюции (8 шт.)
1. Зёрнышки (#ffd700)
2. Цыплячья тропа (#c0c0c0)
3. Гнездо мудрости (#4a9eff)
4. Куриный уни (#9b59b6)
5. Факультет логики (#1abc9c)
6. Лаборатория гения (#e74c3c)
7. Космос интеллект (#00d4ff)
8. Абс. разум (#ff00ff)

## Сохранение
- Прогресс: `klepa-progress`, `puzzle-progress` (localStorage)
- Имя игрока для мультиплеера: `mp-player-name` (localStorage)
- Рейтинг: сервер (in-memory, сбрасывается при рестарте)
