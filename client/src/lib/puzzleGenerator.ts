import { Puzzle } from "./stores/usePuzzles";
import { LS_ALL } from "./puzzles/sequences";
import { MP_ALL } from "./puzzles/math";
import { AN_ALL } from "./puzzles/analogies";
import { SP_ALL } from "./puzzles/spatial";
import { PR_ALL } from "./puzzles/probability";
import { RM_ALL } from "./puzzles/matrices";
import { CR_ALL } from "./puzzles/crypto";
import { VR_ALL } from "./puzzles/verbal";

export function generatePuzzle(type: string, stage: number, excludeKey?: string): Puzzle {
  const baseId   = `${type}_${stage}_${Date.now()}`;
  const difficulty = Math.min(stage + 1, 4);
  const timeLimit  = Math.max(60, 180 - stage * 15);

  switch (type) {
    case 'logic_sequence':   return generateLogicSequence  (baseId, stage, difficulty, timeLimit, excludeKey);
    case 'raven_matrix':     return generateRavenMatrix    (baseId, stage, difficulty, timeLimit, excludeKey);
    case 'math_problem':     return generateMathProblem    (baseId, stage, difficulty, timeLimit, excludeKey);
    case 'sudoku':           return generateSudoku         (baseId, stage, difficulty, timeLimit);
    case 'analogies':        return generateAnalogies      (baseId, stage, difficulty, timeLimit, excludeKey);
    case 'spatial_thinking': return generateSpatialThinking(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'cryptarithmetic':  return generateCryptarithmetic(baseId, stage, difficulty, timeLimit, excludeKey);
    case 'probability':      return generateProbability    (baseId, stage, difficulty, timeLimit, excludeKey);
    case 'verbal_reasoning': return generateVerbalReasoning(baseId, stage, difficulty, timeLimit, excludeKey);
    default: throw new Error(`Unknown puzzle type: ${type}`);
  }
}

export function validateAnswer(puzzle: Puzzle, userAnswer: any): boolean {
  if (puzzle.type === 'raven_matrix') return Number(userAnswer) === Number(puzzle.answer);
  if (puzzle.type === 'analogies')    return Number(userAnswer) === Number(puzzle.answer);
  if (puzzle.type === 'spatial_thinking') return Number(userAnswer) === Number(puzzle.answer);
  if (puzzle.type === 'probability')  return Number(userAnswer) === Number(puzzle.answer);
  if (puzzle.type === 'verbal_reasoning') return Number(userAnswer) === Number(puzzle.answer);
  return Number(userAnswer) === Number(puzzle.answer);
}

function pick<T extends Record<string, any>>(pool: T[], excludeKey?: string, keyField = 'key'): T {
  const filtered = excludeKey ? pool.filter(p => p[keyField] !== excludeKey) : pool;
  const arr = filtered.length > 0 ? filtered : pool;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC SEQUENCE — 200 задач из sequences.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateLogicSequence(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = LS_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'logic_sequence', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, sequence:s.seq, label:'Найдите следующий элемент ряда' },
    answer:s.answer,
    hint:s.hint
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RAVEN MATRIX — 150 задач из matrices.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateRavenMatrix(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = RM_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'raven_matrix', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, matrix:s.matrix, options:s.options, label:'Найдите недостающий элемент матрицы' },
    answer:s.correct,
    hint:`Закономерность: ${s.rule}`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MATH PROBLEM — 250 задач из math.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateMathProblem(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = MP_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'math_problem', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text },
    answer:s.answer,
    hint:'Разбейте задачу на шаги и следуйте условию'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUDOKU (4×4) — процедурная генерация
// ─────────────────────────────────────────────────────────────────────────────
function generateSudoku(id: string, stage: number, diff: number, tl: number): Puzzle {
  const GRIDS = [
    { sol:[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]] },
    { sol:[[1,3,2,4],[2,4,1,3],[3,1,4,2],[4,2,3,1]] },
    { sol:[[2,1,4,3],[3,4,2,1],[1,2,3,4],[4,3,1,2]] },
    { sol:[[1,2,3,4],[4,3,2,1],[2,4,1,3],[3,1,4,2]] },
    { sol:[[3,1,4,2],[2,4,1,3],[1,3,2,4],[4,2,3,1]] },
    { sol:[[4,1,2,3],[2,3,4,1],[1,4,3,2],[3,2,1,4]] },
    { sol:[[2,3,1,4],[4,1,3,2],[3,4,2,1],[1,2,4,3]] },
    { sol:[[3,4,1,2],[1,2,3,4],[4,3,2,1],[2,1,4,3]] },
    { sol:[[1,4,2,3],[3,2,4,1],[4,1,3,2],[2,3,1,4]] },
    { sol:[[2,4,1,3],[1,3,2,4],[4,2,3,1],[3,1,4,2]] },
  ];

  const { sol: solution } = GRIDS[Math.floor(Math.random() * GRIDS.length)];
  const grid = solution.map((r: number[]) => [...r]);

  const toRemove = Math.min(12, 4 + diff);
  const positions: [number,number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) positions.push([r,c]);
  for (let i = positions.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [positions[i],positions[j]] = [positions[j],positions[i]];
  }
  for (let i = 0; i < toRemove; i++) {
    const [r,c] = positions[i];
    grid[r][c] = 0;
  }

  const [targetRow,targetCol] = positions[0];
  const targetAnswer = solution[targetRow][targetCol];

  return {
    id, type:'sudoku', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ grid, targetRow, targetCol,
      question:`Какое число должно стоять в строке ${targetRow+1}, столбце ${targetCol+1}?` },
    answer:targetAnswer,
    hint:'Проверьте числа 1–4 в строке, столбце и квадранте 2×2'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALOGIES — 250 задач из analogies.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateAnalogies(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = AN_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'analogies', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text, options:s.options },
    answer:s.correct,
    hint:'Определите тип отношений между первой парой и примените к второй'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SPATIAL THINKING — 200 задач из spatial.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateSpatialThinking(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = SP_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'spatial_thinking', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, desc:s.desc, options:s.options },
    answer:s.correct,
    hint:'Представьте объект мысленно и проверьте все варианты'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CRYPTARITHMETIC — 150 задач из crypto.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateCryptarithmetic(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = CR_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'cryptarithmetic', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, equation:s.eq },
    answer:s.answer,
    hint:'Подставьте значения букв и вычислите'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBABILITY — 150 задач из probability.ts
// ─────────────────────────────────────────────────────────────────────────────
function generateProbability(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = PR_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'probability', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text, options:s.options },
    answer:s.correct,
    hint:'Используйте формулы теории вероятностей'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VERBAL REASONING — 200 задач из verbal.ts (НОВЫЙ ТИП)
// ─────────────────────────────────────────────────────────────────────────────
function generateVerbalReasoning(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const pool = VR_ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'verbal_reasoning', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{
      key: s.key,
      subtype: s.subtype,
      text: s.question,
      options: s.options,
      explanation: s.explanation
    },
    answer: s.correct,
    hint: s.explanation
  };
}
