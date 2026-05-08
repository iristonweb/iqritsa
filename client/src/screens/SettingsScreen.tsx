import { useState } from "react";
import IQButton from "@/components/iq/IQButton";
import IQPanel from "@/components/iq/IQPanel";
import { scheduleMorningRooster } from "@/services/notifications/morningRooster";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function SettingsScreen() {
  const settings = useIQritsaStore((s) => s.settings);
  const setAlarmEnabled = useIQritsaStore((s) => s.setAlarmEnabled);
  const setAlarmTime = useIQritsaStore((s) => s.setAlarmTime);
  const setQuietMode = useIQritsaStore((s) => s.setQuietMode);
  const setWeekendMute = useIQritsaStore((s) => s.setWeekendMute);
  const setPersistentMorningMode = useIQritsaStore((s) => s.setPersistentMorningMode);
  const setSnoozeMinutes = useIQritsaStore((s) => s.setSnoozeMinutes);
  const restoreDemoProgress = useIQritsaStore((s) => s.restoreDemoProgress);
  const isDev = import.meta.env.DEV;
  const [notificationStatus, setNotificationStatus] = useState("");

  const onSchedule = async () => {
    const msg = await scheduleMorningRooster(
      settings.alarmTime,
      settings.persistentMorningMode ? "persistent" : "soft",
      settings.snoozeMinutes
    );
    setNotificationStatus(msg);
  };

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Настройки" subtitle="Утренний кукарек и комфорт игры">
        <label className="iq-setting-row">
          <span>Утренний кукарек</span>
          <input type="checkbox" checked={settings.morningAlarmEnabled} onChange={(e) => setAlarmEnabled(e.target.checked)} />
        </label>
        <label className="iq-setting-row">
          <span>Время будильника</span>
          <input type="time" value={settings.alarmTime} onChange={(e) => setAlarmTime(e.target.value)} />
        </label>
        <label className="iq-setting-row">
          <span>Тихий режим</span>
          <input type="checkbox" checked={settings.quietMode} onChange={(e) => setQuietMode(e.target.checked)} />
        </label>
        <label className="iq-setting-row">
          <span>Выходные без звука</span>
          <input type="checkbox" checked={settings.weekendMute} onChange={(e) => setWeekendMute(e.target.checked)} />
        </label>
        <label className="iq-setting-row">
          <span>Режим «Клювом в окно»</span>
          <input
            type="checkbox"
            checked={settings.persistentMorningMode}
            onChange={(e) => setPersistentMorningMode(e.target.checked)}
          />
        </label>
        <label className="iq-setting-row">
          <span>Повтор через (мин)</span>
          <input
            type="number"
            min={10}
            max={60}
            value={settings.snoozeMinutes}
            onChange={(e) => setSnoozeMinutes(Number(e.target.value))}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <IQButton variant="gold" onClick={onSchedule}>
            Проверить уведомления
          </IQButton>
          {isDev && <IQButton onClick={restoreDemoProgress}>Загрузить демо-прогресс</IQButton>}
        </div>
        {notificationStatus && <p className="mt-2 text-sm">{notificationStatus}</p>}
      </IQPanel>
    </div>
  );
}
