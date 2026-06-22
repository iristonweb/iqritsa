import type { AppScreen } from "@/store/types";

export interface ComicScreenArt {
  image: string;
  kicker: string;
  title: string;
  subtitle: string;
}

export const comicScreenArt: Record<AppScreen, ComicScreenArt> = {
  barn: {
    image: "/ui/scenarios/barn/default.svg",
    kicker: "Сюжетный хаб",
    title: "Сарай IQюрицы",
    subtitle: "Кормление, прогресс яйца и задания профессора в едином комикс-стиле.",
  },
  laboratory: {
    image: "/ui/scenarios/laboratory/default.svg",
    kicker: "Крыло задач",
    title: "Лаборатория №9",
    subtitle: "Комнаты логики, памяти, пространства, хаоса и дуэльный режим.",
  },
  incubator: {
    image: "/ui/scenarios/incubator/default.svg",
    kicker: "Пробуждение",
    title: "Инкубатор",
    subtitle: "Яйца, мини-игры и шкала пробуждения в отдельной сцене.",
  },
  collection: {
    image: "/ui/scenarios/collection/default.svg",
    kicker: "Полка трофеев",
    title: "Коллекция IQ-яиц",
    subtitle: "Артефакты, профиль хозяина и социальная полка в общем арт-нарративе.",
  },
  arena: {
    image: "/ui/scenarios/arena/default.svg",
    kicker: "PvP узел",
    title: "Арена испытаний",
    subtitle: "Серверные матчи, спор профессора и яичные дуэли в боевой сцене.",
  },
  settings: {
    image: "/ui/scenarios/settings/default.svg",
    kicker: "Пульт управления",
    title: "Командный центр",
    subtitle: "Будильник, режимы и сервисные параметры в том же визуале.",
  },
};
