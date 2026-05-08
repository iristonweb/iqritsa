import { morningRoosterText, roosterNotifications } from "@/content/lore";

export interface MorningNotificationPayload {
  title: string;
  body: string;
  scheduledTime: string;
  mode: "soft" | "persistent";
  snoozeMinutes: number;
}

const randomItem = (items: string[]) => items[Math.floor(Math.random() * items.length)];

export const buildMorningNotification = (
  time: string,
  mode: "soft" | "persistent",
  snoozeMinutes: number
): MorningNotificationPayload => ({
  title: morningRoosterText.title,
  body: randomItem(roosterNotifications.morning),
  scheduledTime: time,
  mode,
  snoozeMinutes,
});

export const canSendWebNotification = () =>
  typeof window !== "undefined" && "Notification" in window;

export const scheduleMorningRooster = async (
  time: string,
  mode: "soft" | "persistent",
  snoozeMinutes: number
): Promise<string> => {
  if (!canSendWebNotification()) {
    return `Web-уведомления не поддерживаются. Включим in-app Кукарек в ${time}.`;
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission !== "granted") {
    return "Разрешение на уведомления не выдано. Утренний Кукарек останется только внутри приложения.";
  }

  const payload = buildMorningNotification(time, mode, snoozeMinutes);
  if (payload.mode === "persistent") {
    return `Кукарек запланирован на ${payload.scheduledTime} с повтором через ${payload.snoozeMinutes} мин.`;
  }
  return `Кукарек запланирован на ${payload.scheduledTime} (мягкий режим).`;
};
