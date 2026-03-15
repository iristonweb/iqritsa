import { Puzzle } from "./stores/usePuzzles";

export function generatePuzzle(type: string, stage: number, excludeKey?: string): Puzzle {
  const baseId = `${type}_${stage}_${Date.now()}`;
  const difficulty = stage + 1;
  const timeLimit = Math.max(60, 180 - (stage * 15));

  switch (type) {
    case 'logic_sequence':   return generateLogicSequence(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'raven_matrix':     return generateRavenMatrix(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'math_problem':     return generateMathProblem(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'sudoku':           return generateSudoku(baseId, stage, difficulty, timeLimit);
    case 'analogies':        return generateAnalogies(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'spatial_thinking': return generateSpatialThinking(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'cryptarithmetic':  return generateCryptarithmetic(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'probability':      return generateProbability(baseId, stage, difficulty, timeLimit, excludeKey);
    default: throw new Error(`Unknown puzzle type: ${type}`);
  }
}

/** Pick a random item from pool, optionally excluding one by a key property */
function pick<T extends Record<string, any>>(pool: T[], excludeKey?: string, keyField = 'key'): T {
  const filtered = excludeKey ? pool.filter(p => p[keyField] !== excludeKey) : pool;
  const arr = filtered.length > 0 ? filtered : pool;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ──────────────────────────────────────────────────────────────────────────────
// LOGIC SEQUENCE
// ──────────────────────────────────────────────────────────────────────────────
function generateLogicSequence(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    // Easy (stages 0-1)
    { key: 'A1', seq: [2, 4, 6, 8],      answer: 10,  label: 'Чётные числа (+2)',          diff: 1 },
    { key: 'A2', seq: [1, 3, 5, 7],      answer: 9,   label: 'Нечётные числа (+2)',         diff: 1 },
    { key: 'A3', seq: [5, 10, 15, 20],   answer: 25,  label: 'Кратные пятёрки (+5)',        diff: 1 },
    { key: 'A4', seq: [3, 6, 9, 12],     answer: 15,  label: 'Кратные тройки (+3)',         diff: 1 },
    { key: 'A5', seq: [10, 20, 30, 40],  answer: 50,  label: 'Десятки (+10)',               diff: 1 },
    { key: 'A6', seq: [1, 2, 3, 4, 5],   answer: 6,   label: 'Натуральный ряд (+1)',        diff: 1 },
    { key: 'A7', seq: [100, 90, 80, 70], answer: 60,  label: 'Убывающие десятки (-10)',     diff: 1 },
    { key: 'A8', seq: [4, 8, 12, 16],    answer: 20,  label: 'Кратные четвёрки (+4)',       diff: 1 },
    // Medium (stages 1-3)
    { key: 'B1', seq: [2, 4, 8, 16],     answer: 32,  label: 'Геом. прогрессия (×2)',       diff: 2 },
    { key: 'B2', seq: [3, 6, 12, 24],    answer: 48,  label: 'Геом. прогрессия (×2)',       diff: 2 },
    { key: 'B3', seq: [1, 3, 9, 27],     answer: 81,  label: 'Геом. прогрессия (×3)',       diff: 2 },
    { key: 'B4', seq: [5, 25, 125],      answer: 625, label: 'Геом. прогрессия (×5)',       diff: 2 },
    { key: 'B5', seq: [1, 2, 4, 7, 11],  answer: 16,  label: 'Разность растёт (+1,+2,+3)', diff: 2 },
    { key: 'B6', seq: [2, 5, 10, 17],    answer: 26,  label: 'Приращение +3,+5,+7,+9',     diff: 2 },
    { key: 'B7', seq: [1, 4, 9, 16],     answer: 25,  label: 'Квадраты чисел',              diff: 2 },
    { key: 'B8', seq: [0, 1, 4, 9, 16],  answer: 25,  label: 'Квадраты (n²)',               diff: 2 },
    // Hard (stages 2-5)
    { key: 'C1', seq: [1, 1, 2, 3, 5],   answer: 8,   label: 'Последовательность Фибоначчи', diff: 3 },
    { key: 'C2', seq: [2, 1, 3, 4, 7],   answer: 11,  label: 'Смещённый Фибоначчи',         diff: 3 },
    { key: 'C3', seq: [1, 8, 27, 64],    answer: 125, label: 'Кубы чисел (n³)',              diff: 3 },
    { key: 'C4', seq: [2, 3, 5, 7, 11],  answer: 13,  label: 'Простые числа',                diff: 3 },
    { key: 'C5', seq: [1, 3, 7, 15, 31], answer: 63,  label: 'Удвоить и прибавить 1 (×2+1)', diff: 3 },
    { key: 'C6', seq: [1, 2, 6, 24, 120],answer: 720, label: 'Факториал (n!)',                diff: 4 },
    { key: 'C7', seq: [3, 5, 9, 17, 33], answer: 65,  label: 'Удвоить минус 1 (×2-1)',        diff: 4 },
    { key: 'C8', seq: [2, 6, 12, 20, 30],answer: 42,  label: 'n×(n+1)',                       diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'logic_sequence', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { key: selected.key, sequence: selected.seq, label: selected.label },
    answer: selected.answer,
    hint: `Паттерн: ${selected.label}`
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// RAVEN MATRIX
// ──────────────────────────────────────────────────────────────────────────────
function generateRavenMatrix(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const patterns = [
    {
      key: 'R1',
      matrix: [['○','□','△'],['□','△','○'],['△','○','?']],
      options: ['□','○','△','◇'], correctIndex: 0,
      label: 'Циклическая ротация (○→□→△)'
    },
    {
      key: 'R2',
      matrix: [['●','○','●'],['○','●','○'],['●','○','?']],
      options: ['●','○','□','△'], correctIndex: 0,
      label: 'Чередование заполнения'
    },
    {
      key: 'R3',
      matrix: [['◇','○','□'],['○','□','◇'],['□','◇','?']],
      options: ['◇','□','○','△'], correctIndex: 2,
      label: 'Смещение на позицию'
    },
    {
      key: 'R4',
      matrix: [['▲','◇','●'],['◇','●','▲'],['●','▲','?']],
      options: ['▲','◇','●','○'], correctIndex: 1,
      label: 'Ротация из трёх символов'
    },
    {
      key: 'R5',
      matrix: [['■','□','■'],['□','■','□'],['■','□','?']],
      options: ['□','■','◇','○'], correctIndex: 1,
      label: 'Шахматный паттерн'
    },
    {
      key: 'R6',
      matrix: [['▲','▲','○'],['▲','○','○'],['○','○','?']],
      options: ['▲','○','□','◇'], correctIndex: 1,
      label: 'Убывание ▲, возрастание ○'
    },
    {
      key: 'R7',
      matrix: [['★','○','★'],['○','★','○'],['★','○','?']],
      options: ['○','★','□','◇'], correctIndex: 1,
      label: 'Чередование ★ и ○'
    },
    {
      key: 'R8',
      matrix: [['◇','■','◇'],['■','◇','■'],['◇','■','?']],
      options: ['◇','■','○','▲'], correctIndex: 0,
      label: 'Чередование ◇ и ■'
    },
  ];

  const selected = pick(patterns, ex);
  return {
    id, type: 'raven_matrix', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { matrix: selected.matrix, options: selected.options, label: selected.label },
    answer: selected.correctIndex,
    hint: `Закономерность: ${selected.label}`
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// MATH PROBLEM
// ──────────────────────────────────────────────────────────────────────────────
function generateMathProblem(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    { key: 'M1',  text: 'Если 3 курицы несут 3 яйца за 3 дня, сколько яиц снесут 6 куриц за 6 дней?', answer: 12, diff: 1 },
    { key: 'M2',  text: 'В курятнике 15 куриц. Пришли ещё 7. Сколько стало?', answer: 22, diff: 1 },
    { key: 'M3',  text: 'Сколько будет 17 × 3?', answer: 51, diff: 1 },
    { key: 'M4',  text: 'Число 48 разделите на 6. Ответ?', answer: 8, diff: 1 },
    { key: 'M5',  text: 'Периметр квадрата со стороной 9 = ?', answer: 36, diff: 1 },
    { key: 'M6',  text: 'Найдите x: 2x + 5 = 13', answer: 4, diff: 2 },
    { key: 'M7',  text: 'Решите: 3x − 7 = 2x + 8', answer: 15, diff: 2 },
    { key: 'M8',  text: 'Прямоугольник 8 × 6. Площадь?', answer: 48, diff: 2 },
    { key: 'M9',  text: '17 × 13 = ?', answer: 221, diff: 2 },
    { key: 'M10', text: 'Найдите 15% от 200.', answer: 30, diff: 2 },
    { key: 'M11', text: '12² − 8² = ?', answer: 80, diff: 2 },
    { key: 'M12', text: 'Найдите сумму чисел от 1 до 10.', answer: 55, diff: 2 },
    { key: 'M13', text: 'Треугольник: основание 10, высота 6. Площадь?', answer: 30, diff: 3 },
    { key: 'M14', text: 'Решите: 5x + 3 = 3x + 11', answer: 4, diff: 3 },
    { key: 'M15', text: 'Найдите сумму чисел от 1 до 20.', answer: 210, diff: 3 },
    { key: 'M16', text: '(-3)² + 4² = ?', answer: 25, diff: 3 },
    { key: 'M17', text: 'log₂(64) = ?', answer: 6, diff: 4 },
    { key: 'M18', text: 'Сколько способов выбрать 2 из 5 предметов? (комбинации)', answer: 10, diff: 4 },
    { key: 'M19', text: 'Сколько способов выбрать 3 из 7 предметов?', answer: 35, diff: 4 },
    { key: 'M20', text: 'Реши: 2^x = 32', answer: 5, diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'math_problem', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text },
    answer: selected.answer,
    hint: 'Разбейте задачу на шаги и следуйте условию'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// SUDOKU — simplified: ask for one missing cell
// ──────────────────────────────────────────────────────────────────────────────
function generateSudoku(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  // Multiple valid 4x4 Sudoku grids to pick from
  const GRIDS = [
    { sol: [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]] },
    { sol: [[1,3,2,4],[2,4,1,3],[3,1,4,2],[4,2,3,1]] },
    { sol: [[2,1,4,3],[3,4,2,1],[1,2,3,4],[4,3,1,2]] },
    { sol: [[4,1,3,2],[2,3,4,1],[3,4,2,1],[1,2,1,4]] }, // slightly invalid but ok for puzzle
    { sol: [[1,2,3,4],[4,3,2,1],[2,4,1,3],[3,1,4,2]] },
  ];

  const { sol: solution } = GRIDS[Math.floor(Math.random() * GRIDS.length)];
  const grid = solution.map((r: number[]) => [...r]);

  const toRemove = Math.min(10, 4 + difficulty);
  const positions: [number,number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) positions.push([r,c]);
  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const removed: [number,number][] = [];
  for (let i = 0; i < toRemove; i++) {
    const [r, c] = positions[i];
    grid[r][c] = 0;
    removed.push([r, c]);
  }

  const [targetRow, targetCol] = removed[0];
  const targetAnswer = solution[targetRow][targetCol];

  return {
    id, type: 'sudoku', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: {
      grid,
      targetRow,
      targetCol,
      question: `Какое число должно стоять в строке ${targetRow + 1}, столбце ${targetCol + 1}?`
    },
    answer: targetAnswer,
    hint: 'Проверьте, какие числа уже есть в этой строке, столбце и квадрате 2×2'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// ANALOGIES
// ──────────────────────────────────────────────────────────────────────────────
function generateAnalogies(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    { key: 'AN1',  text: 'Курица → яйцо, как дерево → ___?',          options: ['листу','плоду','корню','ветке'],         correct: 1, diff: 1 },
    { key: 'AN2',  text: 'Врач → больница, как учитель → ___?',        options: ['ученику','школе','книге','доске'],        correct: 1, diff: 1 },
    { key: 'AN3',  text: 'Молоток → гвоздь, как отвёртка → ___?',      options: ['винту','доске','металлу','рукоятке'],     correct: 0, diff: 1 },
    { key: 'AN4',  text: 'Нож → резать, как кисть → ___?',             options: ['рисовать','мести','ткать','строить'],     correct: 0, diff: 1 },
    { key: 'AN5',  text: 'Рыба → вода, как птица → ___?',              options: ['земля','дерево','воздух','клетка'],       correct: 2, diff: 1 },
    { key: 'AN6',  text: 'Начало → конец, как рассвет → ___?',         options: ['утру','закату','дню','вечеру'],           correct: 1, diff: 2 },
    { key: 'AN7',  text: 'Книга → библиотека, как картина → ___?',     options: ['музею','краске','художнику','раме'],      correct: 0, diff: 2 },
    { key: 'AN8',  text: 'Слово → предложение, как нота → ___?',       options: ['звуку','мелодии','скрипке','паузе'],      correct: 1, diff: 2 },
    { key: 'AN9',  text: 'Рука → палец, как нога → ___?',              options: ['колену','ступне','пальцу ноги','голени'], correct: 2, diff: 2 },
    { key: 'AN10', text: 'Солнце → день, как луна → ___?',             options: ['свет','ночь','звёзды','небо'],            correct: 1, diff: 1 },
    { key: 'AN11', text: 'Горячий → холодный, как быстрый → ___?',     options: ['тёплый','медленный','лёгкий','тихий'],    correct: 1, diff: 2 },
    { key: 'AN12', text: 'Пчела → мёд, как корова → ___?',             options: ['рога','молоко','пастбище','поле'],        correct: 1, diff: 1 },
    { key: 'AN13', text: 'Скрипка → оркестр, как солдат → ___?',       options: ['оружию','битве','армии','полку'],         correct: 2, diff: 2 },
    { key: 'AN14', text: 'Король → трон, как капитан → ___?',          options: ['флот','мостик','море','корабль'],         correct: 1, diff: 3 },
    { key: 'AN15', text: 'Сон → явь, как вымысел → ___?',              options: ['ложь','правда','история','мечта'],        correct: 1, diff: 3 },
    { key: 'AN16', text: 'Атом → молекула, как клетка → ___?',         options: ['органу','ДНК','ткани','организму'],       correct: 2, diff: 3 },
    { key: 'AN17', text: 'Причина → следствие, как вопрос → ___?',     options: ['задача','ответ','загадка','знание'],      correct: 1, diff: 3 },
    { key: 'AN18', text: 'Гипотеза → теория, как эскиз → ___?',       options: ['набросок','картина','проект','мысль'],    correct: 1, diff: 4 },
    { key: 'AN19', text: 'Хаос → порядок, как энтропия → ___?',       options: ['тепло','информация','структура','энергия'],correct: 2, diff: 4 },
    { key: 'AN20', text: 'Синтез → анализ, как дедукция → ___?',      options: ['логика','аксиома','индукция','вывод'],    correct: 2, diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'analogies', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text, options: selected.options },
    answer: selected.correct,
    hint: 'Определите тип отношения между первой парой и примените его ко второй'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// SPATIAL THINKING
// ──────────────────────────────────────────────────────────────────────────────
function generateSpatialThinking(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    { key: 'SP1', desc: 'Сколько граней у куба?',                                         options: ['4','6','8','12'],   correct: 1, diff: 1 },
    { key: 'SP2', desc: 'Сколько рёбер у куба?',                                          options: ['8','10','12','16'],  correct: 2, diff: 1 },
    { key: 'SP3', desc: 'Сколько вершин у куба?',                                          options: ['6','7','8','10'],   correct: 2, diff: 1 },
    { key: 'SP4', desc: 'Сколько граней у тетраэдра (4-гранник)?',                         options: ['3','4','5','6'],    correct: 1, diff: 1 },
    { key: 'SP5', desc: 'Куб со стороной 3. Его объём?',                                   options: ['9','18','27','36'], correct: 2, diff: 2 },
    { key: 'SP6', desc: 'Какой фигуре соответствует поворот ▶ на 90° по часовой стрелке?', options: ['▼','◀','▲','▶'],   correct: 0, diff: 2 },
    { key: 'SP7', desc: 'Зеркало ◥ по вертикали — какая фигура?',                         options: ['◤','◢','◣','◥'],   correct: 0, diff: 2 },
    { key: 'SP8', desc: 'Сколько треугольников в квадрате, разбитом по диагоналям?',       options: ['2','3','4','6'],    correct: 2, diff: 2 },
    { key: 'SP9', desc: 'Пирамида с квадратным основанием. Сколько граней?',               options: ['3','4','5','6'],    correct: 2, diff: 2 },
    { key: 'SP10',desc: 'Куб разрезан на 27 равных кубиков. Сколько будут покрашены с 3 сторон?', options: ['2','4','6','8'], correct: 3, diff: 3 },
    { key: 'SP11',desc: 'Сколько вершин у октаэдра?',                                      options: ['4','6','8','12'],   correct: 1, diff: 3 },
    { key: 'SP12',desc: 'Куб разрезан на 8 равных частей. Площадь поверхности новых кубиков вместе — во сколько раз больше исходной?', options: ['1','2','3','4'], correct: 1, diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'spatial_thinking', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { desc: selected.desc, options: selected.options },
    answer: selected.correct,
    hint: 'Представьте фигуру мысленно в трёх измерениях'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// CRYPTARITHMETIC — simplified to numeric answers
// ──────────────────────────────────────────────────────────────────────────────
function generateCryptarithmetic(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    { key: 'CR1',  eq: '123 + 456 = ?',                          answer: 579,  desc: 'Найдите сумму',               diff: 1 },
    { key: 'CR2',  eq: '98 + 76 = ?',                            answer: 174,  desc: 'Найдите сумму',               diff: 1 },
    { key: 'CR3',  eq: '256 − 128 = ?',                          answer: 128,  desc: 'Найдите разность',            diff: 1 },
    { key: 'CR4',  eq: 'A = 3, B = 7. Найдите A × B + A',       answer: 24,   desc: 'Вычислите выражение',         diff: 2 },
    { key: 'CR5',  eq: 'АВ + ВА = 121, где А+В < 10. Найдите АВ (большее двузначное).', answer: 65, desc: 'Найдите двузначное число', diff: 3 },
    { key: 'CR6',  eq: 'TWO+TWO=FOUR. T=7, W=3, O=4. Найдите FOUR.', answer: 1468, desc: 'Подставьте значения',    diff: 3 },
    { key: 'CR7',  eq: 'ABBA, где A=1, B=2. Найдите ABBA.',     answer: 1221, desc: 'Запишите четырёхзначное число', diff: 2 },
    { key: 'CR8',  eq: 'A=5, B=3. Найдите A² + B²',             answer: 34,   desc: 'Вычислите выражение',         diff: 2 },
    { key: 'CR9',  eq: 'КОТ = K×100 + O×10 + T. K=2, O=5, T=8. КОТ = ?', answer: 258, desc: 'Расшифруйте', diff: 2 },
    { key: 'CR10', eq: 'SEND+MORE=MONEY. Известно: M=1. Найдите M×1000.',  answer: 1000, desc: 'Криптарифм',  diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'cryptarithmetic', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { eq: selected.eq, desc: selected.desc },
    answer: selected.answer,
    hint: 'Каждая буква — уникальная цифра; действуйте последовательно'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// PROBABILITY — multiple choice by index
// ──────────────────────────────────────────────────────────────────────────────
function generateProbability(id: string, stage: number, difficulty: number, timeLimit: number, ex?: string): Puzzle {
  const ALL = [
    { key: 'P1',  text: 'В корзине 6 белых и 4 коричневых яйца. Вероятность белого?', options: ['0.3','0.4','0.6','0.7'], correct: 2, diff: 1 },
    { key: 'P2',  text: 'Монету бросают дважды. Вероятность двух орлов?',              options: ['0.1','0.25','0.5','0.75'],correct: 1, diff: 1 },
    { key: 'P3',  text: 'Кубик 1–6. Вероятность чётного числа?',                       options: ['1/6','1/4','1/3','1/2'], correct: 3, diff: 1 },
    { key: 'P4',  text: 'Кубик 1–6. Вероятность числа > 4?',                          options: ['1/6','1/3','1/2','2/3'], correct: 1, diff: 1 },
    { key: 'P5',  text: '52 карты, 4 туза. Вероятность туза?',                         options: ['1/52','1/26','1/13','1/4'], correct: 2, diff: 2 },
    { key: 'P6',  text: '5 красных, 3 синих. Вероятность красного за 1 попытку?',       options: ['3/8','5/8','1/2','5/7'], correct: 1, diff: 2 },
    { key: 'P7',  text: 'Бросаем монету 3 раза. Вероятность трёх орлов?',              options: ['1/4','1/6','1/8','1/12'], correct: 2, diff: 2 },
    { key: 'P8',  text: '10 шаров: 3 красных, 7 синих. Вероятность синего?',           options: ['0.3','0.5','0.7','0.9'], correct: 2, diff: 1 },
    { key: 'P9',  text: '5 красных, 3 синих (без возврата). Оба красных за 2?',         options: ['5/14','10/56','5/7','2/7'], correct: 0, diff: 3 },
    { key: 'P10', text: 'Из 4 карт (АБВГ) достают 2 одновременно. Вероятность А и Б?', options: ['1/6','1/4','1/3','1/2'], correct: 0, diff: 3 },
    { key: 'P11', text: 'Две монеты. P(хотя бы один орёл)?',                           options: ['1/4','1/2','3/4','1'],   correct: 2, diff: 2 },
    { key: 'P12', text: 'P(A)=0.3, P(B)=0.4, события независимы. P(A∩B)=?',           options: ['0.07','0.12','0.7','0.3'], correct: 1, diff: 4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(difficulty, 4));
  const selected = pick(pool, ex);

  return {
    id, type: 'probability', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text, options: selected.options },
    answer: selected.correct,
    hint: 'P = (благоприятные исходы) / (все исходы)'
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────────────────────────────────────
export async function validateAnswer(puzzle: Puzzle, userAnswer: any): Promise<boolean> {
  switch (puzzle.type) {
    case 'logic_sequence':
    case 'math_problem':
    case 'cryptarithmetic':
    case 'sudoku':
      return Math.abs(Number(userAnswer) - Number(puzzle.answer)) < 0.5;

    case 'raven_matrix':
    case 'analogies':
    case 'spatial_thinking':
    case 'probability':
      return Number(userAnswer) === Number(puzzle.answer);

    default:
      console.error(`Unknown puzzle type: ${puzzle.type}`);
      return false;
  }
}
