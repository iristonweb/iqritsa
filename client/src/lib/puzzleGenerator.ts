import { Puzzle } from "./stores/usePuzzles";

export function generatePuzzle(type: string, stage: number, excludeKey?: string): Puzzle {
  const baseId   = `${type}_${stage}_${Date.now()}`;
  const difficulty = stage + 1;
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
    default: throw new Error(`Unknown puzzle type: ${type}`);
  }
}

function pick<T extends Record<string, any>>(pool: T[], excludeKey?: string, keyField = 'key'): T {
  const filtered = excludeKey ? pool.filter(p => p[keyField] !== excludeKey) : pool;
  const arr = filtered.length > 0 ? filtered : pool;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC SEQUENCE  (number series — IQ-test style)
// ─────────────────────────────────────────────────────────────────────────────
function generateLogicSequence(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    // ── EASY (diff 1) ──────────────────────────────────────────────
    { key:'LS01', seq:[2,4,6,8],        answer:10,   hint:'+2 каждый раз',                   diff:1 },
    { key:'LS02', seq:[1,3,5,7],        answer:9,    hint:'нечётные числа +2',                diff:1 },
    { key:'LS03', seq:[5,10,15,20],     answer:25,   hint:'кратные пяти',                     diff:1 },
    { key:'LS04', seq:[3,6,9,12],       answer:15,   hint:'кратные трём',                     diff:1 },
    { key:'LS05', seq:[10,20,30,40],    answer:50,   hint:'+10 каждый раз',                   diff:1 },
    { key:'LS06', seq:[1,2,3,4,5],      answer:6,    hint:'натуральный ряд',                  diff:1 },
    { key:'LS07', seq:[100,90,80,70],   answer:60,   hint:'-10 каждый раз',                   diff:1 },
    { key:'LS08', seq:[4,8,12,16],      answer:20,   hint:'кратные четырём',                  diff:1 },
    { key:'LS09', seq:[7,14,21,28],     answer:35,   hint:'кратные семи',                     diff:1 },
    { key:'LS10', seq:[50,45,40,35],    answer:30,   hint:'-5 каждый раз',                    diff:1 },
    { key:'LS11', seq:[2,3,4,5,6],      answer:7,    hint:'+1 каждый раз',                    diff:1 },
    { key:'LS12', seq:[8,16,24,32],     answer:40,   hint:'кратные восьми',                   diff:1 },
    { key:'LS13', seq:[6,12,18,24],     answer:30,   hint:'кратные шести',                    diff:1 },
    { key:'LS14', seq:[9,18,27,36],     answer:45,   hint:'кратные девяти',                   diff:1 },
    { key:'LS15', seq:[20,18,16,14],    answer:12,   hint:'-2 каждый раз',                    diff:1 },
    // ── MEDIUM (diff 2) ────────────────────────────────────────────
    { key:'LS16', seq:[2,4,8,16],       answer:32,   hint:'×2 каждый раз',                    diff:2 },
    { key:'LS17', seq:[3,6,12,24],      answer:48,   hint:'×2 каждый раз',                    diff:2 },
    { key:'LS18', seq:[1,3,9,27],       answer:81,   hint:'×3 каждый раз',                    diff:2 },
    { key:'LS19', seq:[1,4,9,16],       answer:25,   hint:'квадраты: 1²,2²,3²...',            diff:2 },
    { key:'LS20', seq:[1,2,4,7,11],     answer:16,   hint:'разности: +1,+2,+3,+4,+5',         diff:2 },
    { key:'LS21', seq:[2,5,10,17,26],   answer:37,   hint:'n²+1: 1+1,2+1,3+1...',             diff:2 },
    { key:'LS22', seq:[3,5,8,12,17],    answer:23,   hint:'разности +2,+3,+4,+5,+6',          diff:2 },
    { key:'LS23', seq:[1,1,2,4,8],      answer:16,   hint:'×2 начиная с позиции 2',            diff:2 },
    { key:'LS24', seq:[2,6,12,20,30],   answer:42,   hint:'n×(n+1)',                           diff:2 },
    { key:'LS25', seq:[10,9,7,4],       answer:0,    hint:'разности -1,-2,-3,-4',              diff:2 },
    { key:'LS26', seq:[4,9,16,25,36],   answer:49,   hint:'чётные квадраты',                   diff:2 },
    { key:'LS27', seq:[1,6,13,22,33],   answer:46,   hint:'разности +5,+7,+9,+11,+13',         diff:2 },
    { key:'LS28', seq:[64,32,16,8],     answer:4,    hint:'÷2 каждый раз',                    diff:2 },
    { key:'LS29', seq:[5,6,8,11,15],    answer:20,   hint:'разности +1,+2,+3,+4,+5',          diff:2 },
    { key:'LS30', seq:[2,3,5,8,13],     answer:21,   hint:'каждый = сумма двух предыдущих',    diff:2 },
    // ── HARD (diff 3) ──────────────────────────────────────────────
    { key:'LS31', seq:[1,1,2,3,5],      answer:8,    hint:'последовательность Фибоначчи',      diff:3 },
    { key:'LS32', seq:[2,1,3,4,7],      answer:11,   hint:'смещённый Фибоначчи',               diff:3 },
    { key:'LS33', seq:[1,8,27,64],      answer:125,  hint:'кубы: 1³,2³,3³...',                diff:3 },
    { key:'LS34', seq:[2,3,5,7,11],     answer:13,   hint:'простые числа',                    diff:3 },
    { key:'LS35', seq:[1,3,7,15,31],    answer:63,   hint:'×2+1 каждый раз',                  diff:3 },
    { key:'LS36', seq:[3,7,13,21,31],   answer:43,   hint:'разности +4,+6,+8,+10,+12',         diff:3 },
    { key:'LS37', seq:[1,5,14,30,55],   answer:91,   hint:'разности 4,9,16,25,36 — квадраты', diff:3 },
    { key:'LS38', seq:[2,5,11,23,47],   answer:95,   hint:'×2+1 каждый раз',                  diff:3 },
    { key:'LS39', seq:[0,1,3,6,10,15],  answer:21,   hint:'треугольные числа',                 diff:3 },
    { key:'LS40', seq:[1,2,6,24,120],   answer:720,  hint:'факториал n!',                     diff:3 },
    { key:'LS41', seq:[4,6,9,13,18],    answer:24,   hint:'разности +2,+3,+4,+5,+6',          diff:3 },
    { key:'LS42', seq:[7,11,16,22,29],  answer:37,   hint:'разности +4,+5,+6,+7,+8',          diff:3 },
    { key:'LS43', seq:[2,6,18,54,162],  answer:486,  hint:'×3 каждый раз',                    diff:3 },
    { key:'LS44', seq:[100,81,64,49],   answer:36,   hint:'убывающие квадраты 10²,9²...',      diff:3 },
    { key:'LS45', seq:[1,2,4,8,16,32],  answer:64,   hint:'×2 каждый раз',                    diff:3 },
    // ── EXPERT (diff 4) ────────────────────────────────────────────
    { key:'LS46', seq:[2,3,5,7,11,13],  answer:17,   hint:'простые числа',                    diff:4 },
    { key:'LS47', seq:[1,3,6,10,15,21], answer:28,   hint:'треугольные числа',                 diff:4 },
    { key:'LS48', seq:[1,4,10,20,35],   answer:56,   hint:'тетраэдральные числа',              diff:4 },
    { key:'LS49', seq:[3,5,9,17,33],    answer:65,   hint:'×2-1 каждый раз',                  diff:4 },
    { key:'LS50', seq:[1,2,6,24,120,720],answer:5040,hint:'n! факториал',                     diff:4 },
    { key:'LS51', seq:[2,8,18,32,50],   answer:72,   hint:'2n²',                              diff:4 },
    { key:'LS52', seq:[1,3,7,13,21,31], answer:43,   hint:'разности +2,+4,+6,+8,+10,+12',     diff:4 },
    { key:'LS53', seq:[6,10,16,24,34],  answer:46,   hint:'разности +4,+6,+8,+10,+12',         diff:4 },
    { key:'LS54', seq:[256,64,16,4],    answer:1,    hint:'÷4 каждый раз',                    diff:4 },
    { key:'LS55', seq:[1,5,14,30,55,91],answer:140,  hint:'сумма квадратов',                  diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'logic_sequence', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, sequence:s.seq, label:'Найдите следующий элемент' },
    answer:s.answer,
    hint:s.hint
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// RAVEN MATRIX
// ─────────────────────────────────────────────────────────────────────────────
function generateRavenMatrix(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    { key:'RM01', matrix:[['○','□','△'],['□','△','○'],['△','○','?']],
      options:['□','○','△','◇'], correct:0, rule:'циклическая ротация трёх фигур' },
    { key:'RM02', matrix:[['●','○','●'],['○','●','○'],['●','○','?']],
      options:['●','○','□','△'], correct:0, rule:'чередование ● и ○' },
    { key:'RM03', matrix:[['◇','○','□'],['○','□','◇'],['□','◇','?']],
      options:['◇','□','○','△'], correct:2, rule:'ротация ◇→○→□' },
    { key:'RM04', matrix:[['▲','◇','●'],['◇','●','▲'],['●','▲','?']],
      options:['▲','◇','●','○'], correct:1, rule:'ротация ▲→◇→●' },
    { key:'RM05', matrix:[['■','□','■'],['□','■','□'],['■','□','?']],
      options:['□','■','◇','○'], correct:1, rule:'шахматный паттерн ■/□' },
    { key:'RM06', matrix:[['▲','▲','○'],['▲','○','○'],['○','○','?']],
      options:['▲','○','□','◇'], correct:1, rule:'▲ убывает по диагонали, ○ растёт' },
    { key:'RM07', matrix:[['★','○','★'],['○','★','○'],['★','○','?']],
      options:['○','★','□','◇'], correct:1, rule:'чередование ★ и ○' },
    { key:'RM08', matrix:[['◇','■','◇'],['■','◇','■'],['◇','■','?']],
      options:['◇','■','○','▲'], correct:0, rule:'чередование ◇ и ■' },
    { key:'RM09', matrix:[['△','△','●'],['△','●','●'],['●','●','?']],
      options:['△','●','□','★'], correct:1, rule:'△ убывает, ● растёт — строка вниз' },
    { key:'RM10', matrix:[['□','○','□'],['○','□','○'],['□','○','?']],
      options:['□','○','▲','◇'], correct:0, rule:'чередование □ и ○' },
    { key:'RM11', matrix:[['▲','■','○'],['■','○','▲'],['○','▲','?']],
      options:['■','○','▲','□'], correct:0, rule:'ротация ▲→■→○' },
    { key:'RM12', matrix:[['●','◇','★'],['◇','★','●'],['★','●','?']],
      options:['◇','★','●','□'], correct:0, rule:'ротация ●→◇→★' },
    { key:'RM13', matrix:[['□','□','■'],['□','■','■'],['■','■','?']],
      options:['■','□','○','◇'], correct:0, rule:'■ растёт слева направо' },
    { key:'RM14', matrix:[['○','○','○'],['○','●','○'],['○','○','?']],
      options:['●','○','□','★'], correct:1, rule:'центр другой, остальные ○' },
    { key:'RM15', matrix:[['▲','▲','▲'],['○','○','○'],['□','□','?']],
      options:['□','▲','○','◇'], correct:0, rule:'каждая строка — своя фигура' },
  ];

  const s = pick(ALL, ex);
  return {
    id, type:'raven_matrix', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, matrix:s.matrix, options:s.options, label:s.rule },
    answer:s.correct,
    hint:`Закономерность: ${s.rule}`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MATH PROBLEM  (IQ-style задачи на числовое мышление)
// ─────────────────────────────────────────────────────────────────────────────
function generateMathProblem(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    // diff 1 ──────────────────────────────────────────────────────────────
    { key:'MP01', text:'5 × 6 + 3 = ?',                                             answer:33,   diff:1 },
    { key:'MP02', text:'48 ÷ 6 + 4 = ?',                                            answer:12,   diff:1 },
    { key:'MP03', text:'Периметр квадрата со стороной 7 = ?',                        answer:28,   diff:1 },
    { key:'MP04', text:'17 + 28 − 15 = ?',                                          answer:30,   diff:1 },
    { key:'MP05', text:'Число между 15 и 17?',                                       answer:16,   diff:1 },
    { key:'MP06', text:'3² + 4² = ?',                                               answer:25,   diff:1 },
    { key:'MP07', text:'8 × 9 = ?',                                                  answer:72,   diff:1 },
    { key:'MP08', text:'Сколько секунд в 2 минутах?',                               answer:120,  diff:1 },
    { key:'MP09', text:'100 − 37 = ?',                                              answer:63,   diff:1 },
    { key:'MP10', text:'7 × 7 + 1 = ?',                                             answer:50,   diff:1 },
    { key:'MP11', text:'Если x = 4, найдите 3x + 2',                               answer:14,   diff:1 },
    { key:'MP12', text:'Сколько часов в 3 сутках?',                                 answer:72,   diff:1 },
    { key:'MP13', text:'56 ÷ 8 = ?',                                                answer:7,    diff:1 },
    { key:'MP14', text:'6 + 7 × 3 = ?',                                             answer:27,   diff:1 },
    { key:'MP15', text:'Площадь прямоугольника 5×9 = ?',                            answer:45,   diff:1 },
    // diff 2 ──────────────────────────────────────────────────────────────
    { key:'MP16', text:'Найдите x: 2x + 7 = 19',                                    answer:6,    diff:2 },
    { key:'MP17', text:'Найдите x: 3x − 5 = 16',                                   answer:7,    diff:2 },
    { key:'MP18', text:'15% от 80 = ?',                                             answer:12,   diff:2 },
    { key:'MP19', text:'25% от 160 = ?',                                            answer:40,   diff:2 },
    { key:'MP20', text:'17 × 13 = ?',                                               answer:221,  diff:2 },
    { key:'MP21', text:'12² − 8² = ?',                                              answer:80,   diff:2 },
    { key:'MP22', text:'Сумма чисел от 1 до 10 = ?',                                answer:55,   diff:2 },
    { key:'MP23', text:'Если 3 рабочих делают 3 детали за 3 часа, сколько деталей сделают 6 рабочих за 6 часов?', answer:12, diff:2 },
    { key:'MP24', text:'Площадь треугольника с основанием 10 и высотой 8 = ?',      answer:40,   diff:2 },
    { key:'MP25', text:'Найдите x: 5x + 3 = 3x + 11',                              answer:4,    diff:2 },
    { key:'MP26', text:'В поезде 350 мест. Заполнено 70%. Сколько свободных?',       answer:105,  diff:2 },
    { key:'MP27', text:'Какое число на 30% больше числа 50?',                        answer:65,   diff:2 },
    { key:'MP28', text:'(4 + 6) × (8 − 3) = ?',                                    answer:50,   diff:2 },
    { key:'MP29', text:'√144 + √81 = ?',                                            answer:21,   diff:2 },
    { key:'MP30', text:'Сумма чисел от 1 до 20 = ?',                                answer:210,  diff:2 },
    // diff 3 ──────────────────────────────────────────────────────────────
    { key:'MP31', text:'Если 5 машин производят 5 изделий за 5 минут, сколько минут нужно 100 машинам для 100 изделий?', answer:5, diff:3 },
    { key:'MP32', text:'(−3)² + 4² = ?',                                            answer:25,   diff:3 },
    { key:'MP33', text:'Найдите x: 4x − 3 = 2x + 9',                              answer:6,    diff:3 },
    { key:'MP34', text:'Среднее арифметическое чисел 12, 18, 24, 30 = ?',           answer:21,   diff:3 },
    { key:'MP35', text:'Число увеличили на 20%, затем на 25%. На сколько % итого?', answer:50,   diff:3 },
    { key:'MP36', text:'Периметр равностороннего треугольника со стороной 13 = ?',  answer:39,   diff:3 },
    { key:'MP37', text:'Чему равно 2⁸?',                                            answer:256,  diff:3 },
    { key:'MP38', text:'Сумма углов пятиугольника = ?°',                            answer:540,  diff:3 },
    { key:'MP39', text:'Через 7 лет Анне будет вдвое больше лет, чем сейчас. Сколько ей сейчас?', answer:7, diff:3 },
    { key:'MP40', text:'Если a = 3 и b = 4, найдите √(a² + b²)',                   answer:5,    diff:3 },
    { key:'MP41', text:'40% от 40% равно скольким процентам?',                      answer:16,   diff:3 },
    { key:'MP42', text:'Двое рабочих красят дом за 6 дней. Трое покрасят за сколько дней?', answer:4, diff:3 },
    { key:'MP43', text:'Сумма первых 5 нечётных чисел = ?',                         answer:25,   diff:3 },
    { key:'MP44', text:'5! (пять факториал) = ?',                                   answer:120,  diff:3 },
    { key:'MP45', text:'Найдите x: x/3 + x/6 = 5',                                 answer:10,   diff:3 },
    // diff 4 ──────────────────────────────────────────────────────────────
    { key:'MP46', text:'log₂(128) = ?',                                             answer:7,    diff:4 },
    { key:'MP47', text:'Сколько способов выбрать 3 из 7 предметов? C(7,3) = ?',    answer:35,   diff:4 },
    { key:'MP48', text:'Решите: 2^x = 64',                                          answer:6,    diff:4 },
    { key:'MP49', text:'Число делится на 3 и на 7. Наименьшее такое трёхзначное число?', answer:105, diff:4 },
    { key:'MP50', text:'Сумма первых n натуральных чисел = 300. Найдите n.',        answer:24,   diff:4 },
    { key:'MP51', text:'Решите: x² − 5x + 6 = 0. Большее x = ?',                  answer:3,    diff:4 },
    { key:'MP52', text:'Площадь круга с радиусом 5 (используйте π ≈ 3). Ответ = ?', answer:75,  diff:4 },
    { key:'MP53', text:'Поезд идёт 120 км/ч. За 90 минут преодолеет сколько км?',  answer:180,  diff:4 },
    { key:'MP54', text:'C(10,2) = количество пар из 10 = ?',                        answer:45,   diff:4 },
    { key:'MP55', text:'Прогрессия 2,6,18,54... Сумма 5 первых членов = ?',        answer:242,  diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'math_problem', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text },
    answer:s.answer,
    hint:'Разбейте задачу на шаги и следуйте условию'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUDOKU (4×4)
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
// ANALOGIES  (вербальные и концептуальные)
// ─────────────────────────────────────────────────────────────────────────────
function generateAnalogies(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    // diff 1 ──────────────────────────────────────────────────────────────
    { key:'AN01', text:'Курица → яйцо, как дерево → ___?',           options:['лист','плод','корень','ветка'],           correct:1, diff:1 },
    { key:'AN02', text:'Нож → резать, как кисть → ___?',             options:['рисовать','мести','ткать','строить'],     correct:0, diff:1 },
    { key:'AN03', text:'Рыба → вода, как птица → ___?',              options:['земля','дерево','воздух','клетка'],       correct:2, diff:1 },
    { key:'AN04', text:'Пчела → мёд, как корова → ___?',             options:['рога','молоко','пастбище','поле'],        correct:1, diff:1 },
    { key:'AN05', text:'Солнце → день, как луна → ___?',             options:['свет','ночь','звёзды','небо'],            correct:1, diff:1 },
    { key:'AN06', text:'Молоток → гвоздь, как отвёртка → ___?',      options:['винт','доска','металл','рукоять'],        correct:0, diff:1 },
    { key:'AN07', text:'Рука → палец, как нога → ___?',              options:['колено','ступня','палец ноги','голень'],  correct:2, diff:1 },
    { key:'AN08', text:'Горячий → холодный, как быстрый → ___?',     options:['тёплый','медленный','лёгкий','тихий'],   correct:1, diff:1 },
    { key:'AN09', text:'Врач → больница, как учитель → ___?',        options:['ученик','школа','книга','доска'],         correct:1, diff:1 },
    { key:'AN10', text:'Кот → котёнок, как собака → ___?',           options:['кошка','щенок','пёс','лапа'],            correct:1, diff:1 },
    { key:'AN11', text:'Письмо → конверт, как деньги → ___?',        options:['монета','бумажник','магазин','банк'],     correct:1, diff:1 },
    { key:'AN12', text:'Глаз → видеть, как ухо → ___?',              options:['слышать','чувствовать','думать','петь'], correct:0, diff:1 },
    { key:'AN13', text:'Зима → снег, как лето → ___?',               options:['жара','дождь','листья','солнце'],        correct:3, diff:1 },
    { key:'AN14', text:'Художник → кисть, как писатель → ___?',      options:['книга','перо','слово','мысль'],           correct:1, diff:1 },
    { key:'AN15', text:'Лед → вода, как вода → ___?',                options:['лёд','пар','река','снег'],               correct:1, diff:1 },
    // diff 2 ──────────────────────────────────────────────────────────────
    { key:'AN16', text:'Книга → библиотека, как картина → ___?',     options:['музей','краска','художник','рама'],       correct:0, diff:2 },
    { key:'AN17', text:'Слово → предложение, как нота → ___?',       options:['звук','мелодия','скрипка','пауза'],       correct:1, diff:2 },
    { key:'AN18', text:'Начало → конец, как рассвет → ___?',         options:['утро','закат','день','вечер'],            correct:1, diff:2 },
    { key:'AN19', text:'Скрипка → оркестр, как солдат → ___?',       options:['оружие','битва','армия','полк'],          correct:2, diff:2 },
    { key:'AN20', text:'Король → трон, как капитан → ___?',          options:['флот','мостик','море','корабль'],         correct:1, diff:2 },
    { key:'AN21', text:'Зерно → мука, как виноград → ___?',          options:['сок','вино','изюм','сад'],               correct:1, diff:2 },
    { key:'AN22', text:'Планета → Солнечная система, как клетка → ___?', options:['ДНК','орган','организм','ткань'],    correct:3, diff:2 },
    { key:'AN23', text:'Школа → знания, как спортзал → ___?',        options:['усталость','мускулы','форма','тренер'],   correct:1, diff:2 },
    { key:'AN24', text:'Песня → слова, как картина → ___?',          options:['цвета','краски','холст','рама'],          correct:1, diff:2 },
    { key:'AN25', text:'Причина → следствие, как вопрос → ___?',     options:['задача','ответ','загадка','знание'],       correct:1, diff:2 },
    { key:'AN26', text:'Тень → свет, как ошибка → ___?',             options:['наказание','знание','истина','исправление'], correct:3, diff:2 },
    { key:'AN27', text:'Слух → ухо, как обоняние → ___?',            options:['рот','нос','глаза','кожа'],              correct:1, diff:2 },
    { key:'AN28', text:'Рождение → смерть, как начало → ___?',       options:['жизнь','продолжение','конец','пауза'],    correct:2, diff:2 },
    { key:'AN29', text:'Генерал → армия, как дирижёр → ___?',        options:['музыка','палочка','оркестр','нота'],       correct:2, diff:2 },
    { key:'AN30', text:'Слепой → зрение, как глухой → ___?',         options:['речь','слух','разум','память'],           correct:1, diff:2 },
    // diff 3 ──────────────────────────────────────────────────────────────
    { key:'AN31', text:'Сон → явь, как вымысел → ___?',              options:['ложь','правда','история','мечта'],        correct:1, diff:3 },
    { key:'AN32', text:'Атом → молекула, как клетка → ___?',         options:['орган','ДНК','ткань','организм'],         correct:2, diff:3 },
    { key:'AN33', text:'Гипотеза → теория, как эскиз → ___?',        options:['набросок','картина','проект','мысль'],    correct:1, diff:3 },
    { key:'AN34', text:'Слово → язык, как нота → ___?',              options:['голос','музыка','звук','ритм'],           correct:1, diff:3 },
    { key:'AN35', text:'Иммунитет → болезнь, как замок → ___?',      options:['ключ','вор','дверь','взлом'],             correct:1, diff:3 },
    { key:'AN36', text:'Климат → погода, как характер → ___?',       options:['настроение','эмоция','черта','личность'], correct:0, diff:3 },
    { key:'AN37', text:'Мозг → мысль, как сердце → ___?',            options:['кровь','любовь','удар','чувство'],        correct:0, diff:3 },
    { key:'AN38', text:'Компас → направление, как весы → ___?',      options:['время','вес','масса','равновесие'],       correct:1, diff:3 },
    { key:'AN39', text:'Импульс → действие, как стимул → ___?',      options:['рефлекс','реакция','желание','поступок'], correct:1, diff:3 },
    { key:'AN40', text:'Эволюция → виды, как история → ___?',        options:['события','эпохи','люди','цивилизация'],   correct:0, diff:3 },
    // diff 4 ──────────────────────────────────────────────────────────────
    { key:'AN41', text:'Хаос → порядок, как энтропия → ___?',        options:['тепло','информация','структура','энергия'], correct:2, diff:4 },
    { key:'AN42', text:'Синтез → анализ, как дедукция → ___?',       options:['логика','аксиома','индукция','вывод'],    correct:2, diff:4 },
    { key:'AN43', text:'Аксиома → теорема, как факт → ___?',         options:['данные','закон','вывод','наблюдение'],    correct:2, diff:4 },
    { key:'AN44', text:'Алгоритм → программа, как ДНК → ___?',       options:['клетка','ген','организм','белок'],        correct:2, diff:4 },
    { key:'AN45', text:'Парадокс → логика, как диссонанс → ___?',    options:['звук','гармония','ритм','мелодия'],       correct:1, diff:4 },
    { key:'AN46', text:'Аналогия → сходство, как антитеза → ___?',   options:['контраст','симметрия','образ','ритм'],    correct:0, diff:4 },
    { key:'AN47', text:'Катализатор → реакция, как триггер → ___?',  options:['процесс','взрыв','событие','импульс'],    correct:2, diff:4 },
    { key:'AN48', text:'Парадигма → мышление, как система → ___?',   options:['принципы','процессы','связи','элементы'], correct:0, diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'analogies', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text, options:s.options },
    answer:s.correct,
    hint:'Определите тип отношения между первой парой и примените ко второй'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SPATIAL THINKING
// ─────────────────────────────────────────────────────────────────────────────
function generateSpatialThinking(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    // diff 1
    { key:'SP01', desc:'Сколько граней у куба?',                                         options:['4','6','8','12'],       correct:1, diff:1 },
    { key:'SP02', desc:'Сколько рёбер у куба?',                                          options:['8','10','12','16'],     correct:2, diff:1 },
    { key:'SP03', desc:'Сколько вершин у куба?',                                         options:['6','7','8','10'],       correct:2, diff:1 },
    { key:'SP04', desc:'Сколько граней у тетраэдра?',                                    options:['3','4','5','6'],        correct:1, diff:1 },
    { key:'SP05', desc:'Квадрат повернули на 90°. Как он выглядит?',                     options:['квадрат','ромб','прямоугольник','трапеция'], correct:0, diff:1 },
    { key:'SP06', desc:'Сколько углов у пятиугольника?',                                 options:['4','5','6','7'],        correct:1, diff:1 },
    { key:'SP07', desc:'Треугольник отразили. Число углов стало?',                       options:['2','3','4','6'],        correct:1, diff:1 },
    { key:'SP08', desc:'Сколько осей симметрии у квадрата?',                             options:['2','3','4','8'],        correct:2, diff:1 },
    // diff 2
    { key:'SP09', desc:'Куб со стороной 3. Его объём?',                                  options:['9','18','27','36'],     correct:2, diff:2 },
    { key:'SP10', desc:'Пирамида с квадратным основанием. Сколько граней?',              options:['3','4','5','6'],        correct:2, diff:2 },
    { key:'SP11', desc:'Стрелка ▶ повёрнута на 90° по часовой. Результат?',             options:['▼','◀','▲','▶'],       correct:0, diff:2 },
    { key:'SP12', desc:'Сколько треугольников в квадрате, разбитом диагоналями?',        options:['2','3','4','6'],        correct:2, diff:2 },
    { key:'SP13', desc:'Сколько граней у октаэдра?',                                     options:['6','7','8','10'],       correct:2, diff:2 },
    { key:'SP14', desc:'Призма с треугольным основанием. Число граней = ?',              options:['3','4','5','6'],        correct:2, diff:2 },
    { key:'SP15', desc:'Конус. Сколько вершин?',                                         options:['0','1','2','3'],        correct:1, diff:2 },
    { key:'SP16', desc:'Цилиндр. Сколько рёбер?',                                        options:['0','1','2','3'],        correct:2, diff:2 },
    // diff 3
    { key:'SP17', desc:'Куб разрезан на 27 кубиков. Покрашены с 3 сторон — сколько?',   options:['2','4','6','8'],        correct:3, diff:3 },
    { key:'SP18', desc:'Сколько вершин у октаэдра?',                                     options:['4','6','8','12'],       correct:1, diff:3 },
    { key:'SP19', desc:'Сколько граней у икосаэдра?',                                    options:['12','16','20','24'],    correct:2, diff:3 },
    { key:'SP20', desc:'Куб 2×2×2 разрезан на 8 единичных кубиков. Покрашены с 3 сторон — сколько?', options:['0','4','8','6'], correct:2, diff:3 },
    { key:'SP21', desc:'Тень куба при освещении сверху — какая фигура?',                 options:['треугольник','квадрат','круг','ромб'], correct:1, diff:3 },
    { key:'SP22', desc:'Правильный шестиугольник. Число осей симметрии?',                options:['3','4','6','12'],       correct:2, diff:3 },
    { key:'SP23', desc:'Пространственное тело с 6 вершинами, 12 рёбрами — что это?',    options:['куб','октаэдр','призма','пирамида'], correct:1, diff:3 },
    { key:'SP24', desc:'Бумагу сложили вдвое 5 раз. Сколько слоёв?',                    options:['10','16','32','64'],    correct:2, diff:3 },
    // diff 4
    { key:'SP25', desc:'Куб разрезан на 8 частей. Суммарная площадь поверхности в разах больше исходной?', options:['1','2','3','4'], correct:1, diff:4 },
    { key:'SP26', desc:'Правильный додекаэдр. Сколько граней?',                          options:['10','12','20','24'],    correct:1, diff:4 },
    { key:'SP27', desc:'V − E + F = 2. Куб: V=8, E=12, F=?',                           options:['4','6','8','10'],       correct:1, diff:4 },
    { key:'SP28', desc:'Тор (бублик). Число дыр (родов поверхности)?',                  options:['0','1','2','3'],        correct:1, diff:4 },
    { key:'SP29', desc:'Сечение куба плоскостью через 3 вершины — какая фигура?',        options:['квадрат','прямоугольник','треугольник','шестиугольник'], correct:2, diff:4 },
    { key:'SP30', desc:'Антикуб (квадратная антипризма) имеет сколько граней?',          options:['8','10','12','16'],     correct:1, diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'spatial_thinking', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, desc:s.desc, options:s.options },
    answer:s.correct,
    hint:'Представьте фигуру мысленно в трёх измерениях'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CRYPTARITHMETIC
// ─────────────────────────────────────────────────────────────────────────────
function generateCryptarithmetic(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    { key:'CR01', eq:'123 + 456 = ?',                                    answer:579,  diff:1 },
    { key:'CR02', eq:'98 + 76 = ?',                                      answer:174,  diff:1 },
    { key:'CR03', eq:'256 − 128 = ?',                                    answer:128,  diff:1 },
    { key:'CR04', eq:'15 × 4 + 20 = ?',                                  answer:80,   diff:1 },
    { key:'CR05', eq:'200 − 75 − 25 = ?',                                answer:100,  diff:1 },
    { key:'CR06', eq:'A=3, B=7. A×B + A = ?',                            answer:24,   diff:2 },
    { key:'CR07', eq:'КОТ: K=2, O=5, T=8. К×100+O×10+T = ?',           answer:258,  diff:2 },
    { key:'CR08', eq:'A=5, B=3. A² + B² = ?',                           answer:34,   diff:2 },
    { key:'CR09', eq:'ABBA: A=1, B=2. A×1000+B×100+B×10+A = ?',        answer:1221, diff:2 },
    { key:'CR10', eq:'ДОМ: Д=4, О=7, М=1. Д×100+О×10+М = ?',           answer:471,  diff:2 },
    { key:'CR11', eq:'АВ + ВА = 121. A+B < 10. Найдите АВ (большее).',  answer:65,   diff:3 },
    { key:'CR12', eq:'THREE: T=3,H=4,R=5,E=6. T+H+R+E+E = ?',          answer:24,   diff:3 },
    { key:'CR13', eq:'A + B = 14, A − B = 4. A = ?',                    answer:9,    diff:3 },
    { key:'CR14', eq:'2A + B = 17, A + 2B = 13. A = ?',                 answer:7,    diff:3 },
    { key:'CR15', eq:'ABC: A=2, B=4, C=8. A×B×C = ?',                   answer:64,   diff:3 },
    { key:'CR16', eq:'SEND+MORE=MONEY. M=1. Найдите M×1000.',           answer:1000, diff:4 },
    { key:'CR17', eq:'A×B = 72, A+B = 17. Большее из A,B = ?',         answer:9,    diff:4 },
    { key:'CR18', eq:'X²+Y²=25, X+Y=7. XY = ?',                        answer:12,   diff:4 },
    { key:'CR19', eq:'(A+B)²=81, A×B=14. A²+B²= ?',                    answer:53,   diff:4 },
    { key:'CR20', eq:'ABCBA: A=1,B=2,C=3. Пятизначное число = ?',      answer:12321,diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'cryptarithmetic', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, eq:s.eq, desc:'Найдите числовой ответ' },
    answer:s.answer,
    hint:'Подставляйте значения букв последовательно'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROBABILITY
// ─────────────────────────────────────────────────────────────────────────────
function generateProbability(id: string, stage: number, diff: number, tl: number, ex?: string): Puzzle {
  const ALL = [
    // diff 1
    { key:'PR01', text:'6 белых и 4 коричневых яйца. Вероятность вытащить белое?',           options:['0.3','0.4','0.6','0.7'],      correct:2, diff:1 },
    { key:'PR02', text:'Кубик 1–6. Вероятность чётного числа?',                              options:['1/6','1/4','1/3','1/2'],      correct:3, diff:1 },
    { key:'PR03', text:'Кубик 1–6. Вероятность числа > 4?',                                  options:['1/6','1/3','1/2','2/3'],      correct:1, diff:1 },
    { key:'PR04', text:'10 шаров: 3 красных, 7 синих. Вероятность синего?',                  options:['0.3','0.5','0.7','0.9'],      correct:2, diff:1 },
    { key:'PR05', text:'Монету бросают. Вероятность орла?',                                   options:['1/4','1/3','1/2','2/3'],      correct:2, diff:1 },
    { key:'PR06', text:'Кубик 1–6. P(число ≤ 3)?',                                          options:['1/6','1/4','1/3','1/2'],      correct:3, diff:1 },
    { key:'PR07', text:'5 карточек: 1,2,3,4,5. P(нечётное)?',                               options:['2/5','1/2','3/5','3/4'],      correct:2, diff:1 },
    // diff 2
    { key:'PR08', text:'Монету бросают дважды. P(два орла)?',                                 options:['0.1','0.25','0.5','0.75'],    correct:1, diff:2 },
    { key:'PR09', text:'52 карты, 4 туза. P(туз)?',                                          options:['1/52','1/26','1/13','1/4'],   correct:2, diff:2 },
    { key:'PR10', text:'5 красных, 3 синих. P(красный за 1 попытку)?',                       options:['3/8','5/8','1/2','5/7'],      correct:1, diff:2 },
    { key:'PR11', text:'Две монеты. P(хотя бы один орёл)?',                                  options:['1/4','1/2','3/4','1'],        correct:2, diff:2 },
    { key:'PR12', text:'Бросают кубик. P(не 6)?',                                            options:['1/6','1/3','1/2','5/6'],      correct:3, diff:2 },
    { key:'PR13', text:'Мешок: 2 красных, 3 синих, 5 зелёных. P(зелёный)?',                 options:['1/5','1/4','1/3','1/2'],      correct:3, diff:2 },
    { key:'PR14', text:'Кубик бросают дважды. P(сумма = 7)?',                               options:['1/12','1/9','1/8','1/6'],     correct:3, diff:2 },
    // diff 3
    { key:'PR15', text:'Монету бросают 3 раза. P(три орла)?',                                options:['1/4','1/6','1/8','1/12'],     correct:2, diff:3 },
    { key:'PR16', text:'5 красных, 3 синих (без возврата). P(оба красных за 2 попытки)?',    options:['5/14','10/56','5/7','2/7'],   correct:0, diff:3 },
    { key:'PR17', text:'4 карточки АБВГ, берут 2. P(А и Б вместе)?',                        options:['1/6','1/4','1/3','1/2'],      correct:0, diff:3 },
    { key:'PR18', text:'P(A)=0.4, P(B)=0.3, независимые. P(A∩B)?',                         options:['0.07','0.12','0.7','0.1'],    correct:1, diff:3 },
    { key:'PR19', text:'P(A)=0.5, P(B|A)=0.4. P(A∩B) = ?',                                 options:['0.1','0.2','0.4','0.9'],      correct:1, diff:3 },
    { key:'PR20', text:'Кубик бросают дважды. P(сумма = 2)?',                               options:['1/6','1/12','1/18','1/36'],   correct:3, diff:3 },
    // diff 4
    { key:'PR21', text:'P(A)=0.3, P(B)=0.4. P(A∪B) если независимые = ?',                  options:['0.58','0.7','0.12','0.5'],    correct:0, diff:4 },
    { key:'PR22', text:'Из 10 билетов 3 выигрышных. P(ни одного за 2 попытки без возврата)?', options:['7/15','7/18','7/20','49/90'], correct:0, diff:4 },
    { key:'PR23', text:'P(A)=0.6, P(B)=0.5, P(A∩B)=0.3. P(A|B) = ?',                      options:['0.3','0.5','0.6','0.9'],      correct:2, diff:4 },
    { key:'PR24', text:'6 людей, 4 стула. Сколько способов рассадить (порядок важен)?',      options:['15','120','360','720'],       correct:2, diff:4 },
    { key:'PR25', text:'P(оба рождены в одном месяце из 12)? ≈',                             options:['1/12','1/144','1/6','1/24'], correct:0, diff:4 },
  ];

  const pool = ALL.filter(x => x.diff <= Math.min(diff, 4));
  const s    = pick(pool, ex);
  return {
    id, type:'probability', stage, difficulty:diff, timeLimit:tl, generatedAt:Date.now(),
    question:{ key:s.key, text:s.text, options:s.options },
    answer:s.correct,
    hint:'P = (благоприятные исходы) / (все исходы)'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
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
      return false;
  }
}
