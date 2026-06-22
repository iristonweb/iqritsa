import type { AppScreen, StoryState } from "@/store/types";

export interface ComicSlide {
  id: string;
  title: string;
  text: string;
  image: string;
}

export interface StoryBeat {
  title: string;
  text: string;
  frames: string[];
}

export const comicSlides: ComicSlide[] = [
  {
    id: "origin-lab",
    title: "Глава 1: Побег из лаборатории",
    text: "Профессор Клюв Першкин создал IQюрицу, но однажды ночью она сбежала из Лаборатории №9.",
    image: "/comics/story-page-1.png",
  },
  {
    id: "origin-barn",
    title: "Глава 2: Встреча в сарае",
    text: "Утром в старом сарае появляется новый хозяин. Чтобы кормить IQюрицу, придётся зарабатывать золотые нейрозёрна умом.",
    image: "/comics/story-page-2.png",
  },
  {
    id: "oath",
    title: "Твоя роль в истории",
    text: "Ты становишься проводником IQюрицы: решай задачи, пробуждай яйца и продвигай сюжет по главам.",
    image: "/comics/hero-chicken.png",
  },
];

const screenBeat: Record<AppScreen, StoryBeat> = {
  barn: {
    title: "Сарай: штаб истории",
    text: "Здесь начинается путь хозяина и IQюрицы: кормление превращает ум в энергию для новых глав.",
    frames: ["/comics/stages/barn/frame-1.png", "/comics/stages/barn/frame-2.png"],
  },
  laboratory: {
    title: "Лаборатория №9",
    text: "Каждая решённая задача возвращает контроль над наследием проекта IQ-37.",
    frames: ["/comics/stages/laboratory/frame-1.png", "/comics/stages/laboratory/frame-2.png"],
  },
  incubator: {
    title: "Инкубатор пробуждения",
    text: "Пробуждённые яйца раскрывают эволюцию IQюрицы и двигают сюжет к следующему акту.",
    frames: ["/comics/stages/incubator/frame-1.png", "/comics/stages/incubator/frame-2.png"],
  },
  collection: {
    title: "Коллекция трофеев",
    text: "Артефакты подтверждают, как далеко продвинулась ваша история со времени побега.",
    frames: ["/comics/stages/collection/frame-1.png", "/comics/stages/collection/frame-2.png"],
  },
  arena: {
    title: "Арена испытаний",
    text: "В дуэлях история получает напряжение: докажи, что хозяин и IQюрица достойны легенды.",
    frames: ["/comics/stages/arena/frame-1.png", "/comics/stages/arena/frame-2.png"],
  },
  settings: {
    title: "Командный центр",
    text: "Даже настройки влияют на ритм истории: утренние задачи подпитывают сюжетную линию.",
    frames: ["/comics/stages/settings/frame-1.png", "/comics/stages/settings/frame-2.png"],
  },
};

const tutorialBeatText: Record<StoryState["tutorialStage"], string> = {
  lab: "Сейчас цель — решить первую задачу и получить стартовое нейрозерно.",
  feed: "Сейчас цель — накормить IQюрицу в сарае и укрепить союз с хозяином.",
  incubator: "Сейчас цель — перейти в инкубатор и разбудить первое яйцо.",
  collection: "Сейчас цель — зафиксировать прогресс на полке коллекции.",
  done: "Пролог завершён: основная история продолжается через главы, сезоны и арены.",
};

export function getStoryBeat(screen: AppScreen, story: StoryState): StoryBeat {
  const base = screenBeat[screen];
  const chapterLabel = `Глава ${story.chapter} · ${Math.round(story.chapterProgress * 100)}%`;
  return {
    title: `${chapterLabel} — ${base.title}`,
    text: `${base.text} ${tutorialBeatText[story.tutorialStage]}`,
    frames: base.frames,
  };
}
