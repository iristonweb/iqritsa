import { Puzzle } from "./stores/usePuzzles";

export function generatePuzzle(type: string, stage: number): Puzzle {
  const baseId = `${type}_${stage}_${Date.now()}`;
  const difficulty = stage + 1;
  const timeLimit = Math.max(60, 180 - (stage * 15));

  switch (type) {
    case 'logic_sequence': return generateLogicSequence(baseId, stage, difficulty, timeLimit);
    case 'raven_matrix':   return generateRavenMatrix(baseId, stage, difficulty, timeLimit);
    case 'math_problem':   return generateMathProblem(baseId, stage, difficulty, timeLimit);
    case 'sudoku':         return generateSudoku(baseId, stage, difficulty, timeLimit);
    case 'analogies':      return generateAnalogies(baseId, stage, difficulty, timeLimit);
    case 'spatial_thinking': return generateSpatialThinking(baseId, stage, difficulty, timeLimit);
    case 'cryptarithmetic': return generateCryptarithmetic(baseId, stage, difficulty, timeLimit);
    case 'probability':    return generateProbability(baseId, stage, difficulty, timeLimit);
    default: throw new Error(`Unknown puzzle type: ${type}`);
  }
}

function generateLogicSequence(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  const sequences = [
    { seq: [2, 4, 6, 8], answer: 10, label: "Арифметическая прогрессия (+2)" },
    { seq: [1, 3, 5, 7], answer: 9, label: "Нечётные числа (+2)" },
    { seq: [5, 10, 15, 20], answer: 25, label: "Прогрессия (+5)" },
    { seq: [2, 4, 8, 16], answer: 32, label: "Геометрическая прогрессия (×2)" },
    { seq: [3, 6, 12, 24], answer: 48, label: "Прогрессия (×2)" },
    { seq: [1, 3, 9, 27], answer: 81, label: "Прогрессия (×3)" },
    { seq: [1, 1, 2, 3, 5], answer: 8, label: "Числа Фибоначчи" },
    { seq: [1, 4, 9, 16], answer: 25, label: "Квадраты чисел" },
    { seq: [1, 8, 27, 64], answer: 125, label: "Кубы чисел" },
    { seq: [2, 3, 5, 7, 11], answer: 13, label: "Простые числа" },
  ];
  const max = stage <= 1 ? 3 : stage <= 3 ? 7 : sequences.length;
  const pool = sequences.slice(0, max);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'logic_sequence', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { sequence: selected.seq, label: selected.label },
    answer: selected.answer
  };
}

function generateRavenMatrix(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  // All options as indices. answer = correctIndex into options array.
  const patterns = [
    {
      matrix: [['○','□','△'],['□','△','○'],['△','○','?']],
      answer: '□',
      options: ['□','○','△','◇'],
      correctIndex: 0,
      label: "Циклическая ротация фигур"
    },
    {
      matrix: [['●','○','●'],['○','●','○'],['●','○','?']],
      answer: '●',
      options: ['○','●','□','△'],
      correctIndex: 1,
      label: "Чередование заполнения"
    },
    {
      matrix: [['◇','○','□'],['○','□','◇'],['□','◇','?']],
      answer: '○',
      options: ['◇','□','○','△'],
      correctIndex: 2,
      label: "Смещение на одну позицию"
    },
  ];
  const selected = patterns[Math.floor(Math.random() * patterns.length)];
  return {
    id, type: 'raven_matrix', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { matrix: selected.matrix, options: selected.options, label: selected.label },
    answer: selected.correctIndex
  };
}

function generateMathProblem(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  const problems = [
    { text: "Если 3 курицы несут 3 яйца за 3 дня, сколько яиц снесут 6 куриц за 6 дней?", answer: 12, diff: 1 },
    { text: "В курятнике 15 куриц. 5 из них ушли гулять. Сколько осталось?", answer: 10, diff: 1 },
    { text: "Найдите x: 2x + 5 = 13", answer: 4, diff: 3 },
    { text: "Решите уравнение: 3x − 7 = 2x + 8", answer: 15, diff: 3 },
    { text: "Прямоугольник 8×6. Какова его площадь?", answer: 48, diff: 2 },
    { text: "17 × 13 = ?", answer: 221, diff: 2 },
    { text: "Чему равно 15% от 200?", answer: 30, diff: 2 },
    { text: "Сколько способов выбрать 3 из 7 предметов?", answer: 35, diff: 6 },
    { text: "Найдите сумму чисел от 1 до 20", answer: 210, diff: 4 },
  ];
  const pool = problems.filter(p => p.diff <= difficulty + 1);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'math_problem', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text },
    answer: selected.answer
  };
}

function generateSudoku(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  // Full solution grid (4x4)
  const solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
  const grid = solution.map(row => [...row]);

  // Remove some cells
  const toRemove = Math.min(8, 4 + difficulty);
  const positions: [number,number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) positions.push([r,c]);
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

  // Ask for the FIRST removed cell, store its answer as a number
  const [targetRow, targetCol] = removed[0];
  const targetAnswer = solution[targetRow][targetCol];

  return {
    id, type: 'sudoku', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: {
      grid,
      targetRow,
      targetCol,
      question: `Какое число стоит в строке ${targetRow + 1}, столбце ${targetCol + 1}?`
    },
    answer: targetAnswer  // single number
  };
}

function generateAnalogies(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  const analogies = [
    { text: "Курица → яйцо, как дерево → ___?", options: ["листу","плоду","корню","ветке"], correct: 1, diff: 1 },
    { text: "Врач → больница, как учитель → ___?", options: ["ученику","школе","книге","доске"], correct: 1, diff: 1 },
    { text: "Молоток → гвоздь, как отвёртка → ___?", options: ["винту","доске","металлу","рукоятке"], correct: 0, diff: 2 },
    { text: "Начало → конец, как рассвет → ___?", options: ["утру","закату","дню","вечеру"], correct: 1, diff: 3 },
    { text: "Книга → библиотека, как картина → ___?", options: ["музею","краске","художнику","раме"], correct: 0, diff: 4 },
    { text: "Слово → предложение, как нота → ___?", options: ["звуку","мелодии","скрипке","паузе"], correct: 1, diff: 3 },
    { text: "Рука → палец, как нога → ___?", options: ["колену","ступне","пальцу ноги","голени"], correct: 2, diff: 2 },
  ];
  const pool = analogies.filter(a => a.diff <= difficulty + 1);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'analogies', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text, options: selected.options },
    answer: selected.correct  // index
  };
}

function generateSpatialThinking(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  const tasks = [
    { desc: "Сколько граней у куба?", options: ["4","6","8","12"], correct: 1, diff: 1 },
    { desc: "Какая фигура получится при повороте ▶ на 90° по часовой?", options: ["▼","◀","▲","▶"], correct: 0, diff: 2 },
    { desc: "Какая фигура является зеркальным отражением ◥ по вертикали?", options: ["◤","◢","◣","◥"], correct: 0, diff: 2 },
    { desc: "Сколько треугольников в большом треугольнике, разделённом на 4?", options: ["3","4","5","6"], correct: 2, diff: 3 },
    { desc: "Куб со стороной 3 — его объём?", options: ["9","18","27","36"], correct: 2, diff: 3 },
    { desc: "Сколько вершин у октаэдра?", options: ["4","6","8","12"], correct: 1, diff: 4 },
  ];
  const pool = tasks.filter(t => t.diff <= difficulty + 1);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'spatial_thinking', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { desc: selected.desc, options: selected.options },
    answer: selected.correct  // index
  };
}

function generateCryptarithmetic(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  // Simple: show equation and ask for the result as a number
  const problems = [
    { eq: "123 + 456 = ?", answer: 579, diff: 1 },
    { eq: "98 + 76 = ?", answer: 174, diff: 1 },
    { eq: "АББА = 4-значное число, где А=1, Б=2. Найдите АББА.", answer: 1221, diff: 3 },
    { eq: "TWO+TWO=FOUR. Если T=7,W=3,O=4 — найдите FOUR.", answer: 1468, diff: 5 },
    { eq: "Найдите число: АВ + ВА = 121, где А и В — цифры.", answer: 56, diff: 4 },
  ];
  const pool = problems.filter(p => p.diff <= difficulty);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'cryptarithmetic', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { eq: selected.eq, desc: "Найдите числовое значение выражения" },
    answer: selected.answer  // number
  };
}

function generateProbability(id: string, stage: number, difficulty: number, timeLimit: number): Puzzle {
  // Answer stored as option index (like analogies)
  const problems = [
    {
      text: "В корзине 6 белых и 4 коричневых яйца. Вероятность вытащить белое?",
      options: ["0.3","0.4","0.6","0.7"], correct: 2, diff: 1
    },
    {
      text: "Монету бросают дважды. Вероятность двух орлов?",
      options: ["0.1","0.25","0.5","0.75"], correct: 1, diff: 2
    },
    {
      text: "Кубик 1-6. Вероятность выпадения числа > 4?",
      options: ["1/6","1/3","1/2","2/3"], correct: 1, diff: 2
    },
    {
      text: "52 карты, 4 туза. Вероятность вытащить туза?",
      options: ["1/52","1/26","1/13","1/4"], correct: 2, diff: 3
    },
    {
      text: "5 красных, 3 синих шара. Вытащить красный (без возврата, 1 попытка)?",
      options: ["3/8","5/8","1/2","5/7"], correct: 1, diff: 3
    },
  ];
  const pool = problems.filter(p => p.diff <= difficulty + 1);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return {
    id, type: 'probability', stage, difficulty, timeLimit, generatedAt: Date.now(),
    question: { text: selected.text, options: selected.options },
    answer: selected.correct  // index
  };
}

// Validation
export async function validateAnswer(puzzle: Puzzle, userAnswer: any): Promise<boolean> {
  const tolerance = 0.5;

  switch (puzzle.type) {
    case 'logic_sequence':
    case 'math_problem':
    case 'cryptarithmetic':
    case 'sudoku':
      return Math.abs(Number(userAnswer) - Number(puzzle.answer)) < tolerance;

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
