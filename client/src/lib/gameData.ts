// Stage progression requirements and data
export const STAGE_REQUIREMENTS = [
  {
    puzzlesRequired: 0,
    name: "Зёрнышки",
    description: "Простые логические задачки для разминки"
  },
  {
    puzzlesRequired: 5,
    name: "Цыплячья Тропа",
    description: "Матрицы Равена и простые аналогии"
  },
  {
    puzzlesRequired: 12,
    name: "Гнездо Мудрости",
    description: "Математические задачи и пространственное мышление"
  },
  {
    puzzlesRequired: 22,
    name: "Куриный Университет",
    description: "Сложные матрицы и логические загадки"
  },
  {
    puzzlesRequired: 35,
    name: "Факультет Логики",
    description: "Числовые ряды и криптарифмы"
  },
  {
    puzzlesRequired: 52,
    name: "Лаборатория Гения",
    description: "Вероятность и теория игр"
  },
  {
    puzzlesRequired: 75,
    name: "Космический Интеллект",
    description: "Задачи уровня MENSA"
  },
  {
    puzzlesRequired: 100,
    name: "Абсолютный Разум",
    description: "Самые сложные задачи человечества"
  }
];

// Stage-specific data including available puzzle types
export const STAGE_DATA = [
  {
    stage: 0,
    name: "Зёрнышки",
    puzzleTypes: ["logic_sequence", "analogies"],
    requiredPuzzles: 5,
    bonusHints: 2,
    timeLimit: 180,
    difficulty: 1
  },
  {
    stage: 1,
    name: "Цыплячья Тропа",
    puzzleTypes: ["raven_matrix", "logic_sequence", "analogies"],
    requiredPuzzles: 7,
    bonusHints: 1,
    timeLimit: 150,
    difficulty: 2
  },
  {
    stage: 2,
    name: "Гнездо Мудрости",
    puzzleTypes: ["math_problem", "spatial_thinking", "sudoku"],
    requiredPuzzles: 8,
    bonusHints: 1,
    timeLimit: 120,
    difficulty: 3
  },
  {
    stage: 3,
    name: "Куриный Университет",
    puzzleTypes: ["raven_matrix", "math_problem", "analogies", "sudoku"],
    requiredPuzzles: 10,
    bonusHints: 0,
    timeLimit: 120,
    difficulty: 4
  },
  {
    stage: 4,
    name: "Факультет Логики",
    puzzleTypes: ["logic_sequence", "cryptarithmetic", "spatial_thinking"],
    requiredPuzzles: 12,
    bonusHints: 0,
    timeLimit: 90,
    difficulty: 5
  },
  {
    stage: 5,
    name: "Лаборатория Гения",
    puzzleTypes: ["probability", "cryptarithmetic", "math_problem"],
    requiredPuzzles: 15,
    bonusHints: 0,
    timeLimit: 90,
    difficulty: 6
  },
  {
    stage: 6,
    name: "Космический Интеллект",
    puzzleTypes: ["probability", "raven_matrix", "spatial_thinking", "cryptarithmetic"],
    requiredPuzzles: 18,
    bonusHints: 0,
    timeLimit: 60,
    difficulty: 7
  },
  {
    stage: 7,
    name: "Абсолютный Разум",
    puzzleTypes: ["probability", "cryptarithmetic", "raven_matrix", "math_problem", "spatial_thinking"],
    requiredPuzzles: 20,
    bonusHints: 0,
    timeLimit: 60,
    difficulty: 8
  }
];

// Shop upgrade definitions
export const SHOP_UPGRADES = [
  {
    id: "extra_hints",
    name: "Дополнительные подсказки",
    description: "Получайте +1 подсказку на каждом этапе",
    baseCost: 50,
    costMultiplier: 1.5,
    maxLevel: 5
  },
  {
    id: "time_bonus",
    name: "Бонус времени",
    description: "Увеличивает время на решение задач на 20%",
    baseCost: 75,
    costMultiplier: 2.0,
    maxLevel: 3
  },
  {
    id: "neuron_multiplier",
    name: "Нейронный ускоритель",
    description: "Увеличивает получаемые нейроны на 10%",
    baseCost: 100,
    costMultiplier: 2.5,
    maxLevel: 10
  },
  {
    id: "skip_tokens",
    name: "Токены пропуска",
    description: "Позволяет пропускать сложные задачи без штрафа",
    baseCost: 25,
    costMultiplier: 1.0,
    maxLevel: 999,
    consumable: true
  }
];

// Chicken evolution stages with visual descriptions
export const CHICKEN_EVOLUTION_STAGES = [
  {
    stage: 0,
    name: "Простая Несушка",
    description: "Обычная курица в простом курятнике",
    emoji: "🐓",
    accessories: [],
    environment: "Соломенный курятник",
    iq: 50
  },
  {
    stage: 1,
    name: "Умная Курочка",
    description: "Курица с очками в курятнике с книгами",
    emoji: "🐓",
    accessories: ["👓"],
    environment: "Курятник с книжными полками",
    iq: 75
  },
  {
    stage: 2,
    name: "Мыслящая Птица",
    description: "Курица в лабораторном халате",
    emoji: "🐓",
    accessories: ["👓", "🥼"],
    environment: "Простая научная лаборатория",
    iq: 100
  },
  {
    stage: 3,
    name: "Куриный Студент",
    description: "Курица в университете с дипломом",
    emoji: "🐓",
    accessories: ["👓", "🎓"],
    environment: "Университетская аудитория",
    iq: 125
  },
  {
    stage: 4,
    name: "Птичий Профессор",
    description: "Профессор курица в исследовательском центре",
    emoji: "🐓",
    accessories: ["👓", "🎓", "📚"],
    environment: "Исследовательский центр",
    iq: 150
  },
  {
    stage: 5,
    name: "Гениальная Клепа",
    description: "Курица-гений в высокотехнологичной лаборатории",
    emoji: "🐓",
    accessories: ["👓", "🎓", "🔬"],
    environment: "Высокотехнологичная лаборатория",
    iq: 175
  },
  {
    stage: 6,
    name: "Космический Разум",
    description: "Курица на космической станции",
    emoji: "🐓",
    accessories: ["👓", "🚀", "⚡"],
    environment: "Космическая станция",
    iq: 200
  },
  {
    stage: 7,
    name: "Абсолютный Интеллект",
    description: "Трансцендентная курица с квантовым интерфейсом",
    emoji: "🌟",
    accessories: ["🧠", "⚡", "🔮"],
    environment: "Квантовый нейроинтерфейс",
    iq: 250
  }
];

// Story snippets for each stage transition
export const STAGE_STORIES = [
  {
    stage: 0,
    title: "Начало эксперимента",
    text: "Профессор Пёрышкин вводит экспериментальную сыворотку курице Клепе. 'Это может изменить всё', - шепчет он."
  },
  {
    stage: 1,
    title: "Первые признаки",
    text: "Клепа начинает проявлять любопытство к книгам в лаборатории. Она даже пытается читать!"
  },
  {
    stage: 2,
    title: "Научный прорыв",
    text: "Клепа решает свою первую математическую задачу. Профессор в восторге от результатов."
  },
  {
    stage: 3,
    title: "Университетские годы",
    text: "Клепа поступает в университет. Студенты в шоке от курицы на лекциях по квантовой физике."
  },
  {
    stage: 4,
    title: "Научная карьера",
    text: "Профессор Клепа публикует свою первую научную работу 'Квантовые флуктуации в курятниках'."
  },
  {
    stage: 5,
    title: "Технологический скачок",
    text: "Клепа изобретает революционный метод решения NP-полных задач используя куриные перья."
  },
  {
    stage: 6,
    title: "Космические горизонты",
    text: "Клепа отправляется на орбиту для проведения экспериментов в невесомости. NASA в восхищении."
  },
  {
    stage: 7,
    title: "Трансцендентность",
    text: "Клепа достигает состояния абсолютного разума, превосходящего человеческое понимание реальности."
  }
];
