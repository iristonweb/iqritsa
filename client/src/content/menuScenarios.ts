import type { AppScreen } from "@/store/types";

export type MenuActionType = "screen" | "storyPrev" | "storyNext" | "frameToggle" | "progressChapter";
export type StoryMenuButtonId = AppScreen | "home" | "achievements" | "friends";
export type MenuZoneShape = "card" | "tab" | "pill" | "panel";

export interface MenuZoneAction {
  type: MenuActionType;
  targetScreen?: AppScreen;
  chapterStep?: number;
}

export interface MenuZoneSpec {
  id: StoryMenuButtonId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  shape: MenuZoneShape;
  action: MenuZoneAction;
  activeArt: string;
  verify: string;
}

export interface StoryMenuConfig {
  mode: "story";
  baseWidth: number;
  baseHeight: number;
  imageByFrame: Record<0 | 1, string>;
  zones: MenuZoneSpec[];
}

export const storyScreenCycle: AppScreen[] = ["laboratory", "barn", "incubator", "collection", "arena", "settings"];

export const storyMenuConfig: StoryMenuConfig = {
  mode: "story",
  baseWidth: 1024,
  baseHeight: 682,
  imageByFrame: {
    0: "/ui/menu/story/default.png",
    1: "/ui/menu/story/frame-2.png",
  },
  zones: [
    {
      id: "laboratory",
      label: "Лаборатория №9",
      x: 5,
      y: 17.8,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "screen", targetScreen: "laboratory" },
      activeArt: "/ui/menu/story/active/laboratory.png",
      verify: "Открывает Лабораторию и задачу.",
    },
    {
      id: "barn",
      label: "Старый сарай",
      x: 36.5,
      y: 17.8,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "screen", targetScreen: "barn" },
      activeArt: "/ui/menu/story/active/barn.png",
      verify: "Открывает Сарай и кормление.",
    },
    {
      id: "incubator",
      label: "Золотое яйцо",
      x: 68,
      y: 17.8,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "screen", targetScreen: "incubator" },
      activeArt: "/ui/menu/story/active/incubator.png",
      verify: "Открывает Инкубатор и мини-игры.",
    },
    {
      id: "collection",
      label: "Полка трофеев",
      x: 5,
      y: 55.1,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "screen", targetScreen: "collection" },
      activeArt: "/ui/menu/story/active/collection.png",
      verify: "Открывает Коллекцию и фильтры.",
    },
    {
      id: "arena",
      label: "Арена IQ",
      x: 36.5,
      y: 55.1,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "screen", targetScreen: "arena" },
      activeArt: "/ui/menu/story/active/arena.png",
      verify: "Открывает дуэли и PvP.",
    },
    {
      id: "settings",
      label: "Новая глава",
      x: 68,
      y: 55.1,
      w: 27.1,
      h: 30.8,
      radius: 2.1,
      shape: "card",
      action: { type: "progressChapter", chapterStep: 0.2, targetScreen: "settings" },
      activeArt: "/ui/menu/story/active/settings.png",
      verify: "Продвигает главу и открывает Командный центр.",
    },
    {
      id: "home",
      label: "Предыдущий",
      x: 28.2,
      y: 90.7,
      w: 7,
      h: 6.8,
      radius: 1.3,
      shape: "tab",
      action: { type: "storyPrev" },
      activeArt: "/ui/menu/story/active/home.png",
      verify: "Переключает на предыдущий сценарный экран.",
    },
    {
      id: "achievements",
      label: "Кадр 1 / Кадр 2",
      x: 39,
      y: 90.2,
      w: 22,
      h: 7.6,
      radius: 1.3,
      shape: "tab",
      action: { type: "frameToggle" },
      activeArt: "/ui/menu/story/active/achievements.png",
      verify: "Переключает сюжетный кадр текущего экрана.",
    },
    {
      id: "friends",
      label: "Следующий",
      x: 65,
      y: 90.7,
      w: 7,
      h: 6.8,
      radius: 1.3,
      shape: "tab",
      action: { type: "storyNext" },
      activeArt: "/ui/menu/story/active/friends.png",
      verify: "Переключает на следующий сценарный экран.",
    },
  ],
};

export function getStoryNeighborScreen(current: AppScreen, delta: -1 | 1): AppScreen {
  const currentIndex = storyScreenCycle.indexOf(current);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + delta + storyScreenCycle.length) % storyScreenCycle.length;
  return storyScreenCycle[nextIndex];
}
