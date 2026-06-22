import { useState } from "react";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import { scheduleMorningRooster } from "@/services/notifications/morningRooster";

export default function SettingsScreen() {
  const settings = useIQritsaStore((s) => s.settings);
  const setAlarmEnabled = useIQritsaStore((s) => s.setAlarmEnabled);
  const setAlarmTime = useIQritsaStore((s) => s.setAlarmTime);
  const setQuietMode = useIQritsaStore((s) => s.setQuietMode);
  const setWeekendMute = useIQritsaStore((s) => s.setWeekendMute);
  const setPersistentMorningMode = useIQritsaStore((s) => s.setPersistentMorningMode);
  const setSnoozeMinutes = useIQritsaStore((s) => s.setSnoozeMinutes);
  const restoreDemoProgress = useIQritsaStore((s) => s.restoreDemoProgress);
  const level = useIQritsaStore((s) => s.player.level);
  const streak = useIQritsaStore((s) => s.player.dailyStreak);
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

  const settingRows = [
    {
      label: "🐓 Утренний кукарек",
      desc: "Будильник для ежедневной задачи",
      control: (
        <input
          type="checkbox"
          checked={settings.morningAlarmEnabled}
          onChange={(e) => setAlarmEnabled(e.target.checked)}
        />
      ),
    },
    {
      label: "⏰ Время будильника",
      desc: null,
      control: (
        <input
          type="time"
          value={settings.alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
        />
      ),
    },
    {
      label: "🔇 Тихий режим",
      desc: "Без звуков во время игры",
      control: (
        <input
          type="checkbox"
          checked={settings.quietMode}
          onChange={(e) => setQuietMode(e.target.checked)}
        />
      ),
    },
    {
      label: "📅 Выходные без звука",
      desc: "Суббота и воскресенье тихо",
      control: (
        <input
          type="checkbox"
          checked={settings.weekendMute}
          onChange={(e) => setWeekendMute(e.target.checked)}
        />
      ),
    },
    {
      label: "🌅 Режим «Клювом в окно»",
      desc: "Настойчивые утренние уведомления",
      control: (
        <input
          type="checkbox"
          checked={settings.persistentMorningMode}
          onChange={(e) => setPersistentMorningMode(e.target.checked)}
        />
      ),
    },
    {
      label: "⏱️ Повтор через (мин)",
      desc: null,
      control: (
        <input
          type="number"
          min={10}
          max={60}
          value={settings.snoozeMinutes}
          onChange={(e) => setSnoozeMinutes(Number(e.target.value))}
        />
      ),
    },
  ];

  return (
    <div className="iq-screen-root">
      {/* Profile summary */}
      <div className="iq-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 52, height: 52,
            background: "linear-gradient(135deg, #3a2010, #251408)",
            border: "3px solid #c8a050",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, boxShadow: "0 0 12px rgba(200,160,30,0.4)",
          }}>
            🐔
          </div>
          <div>
            <div className="iq-panel-title">Профиль хозяина</div>
            <div className="iq-panel-sub">Уровень {level} · Серия: {streak} дней</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="iq-panel">
        <div className="iq-panel-title" style={{ marginBottom: 12 }}>⚙️ Настройки</div>
        {settingRows.map((row) => (
          <div key={row.label} className="iq-setting-row">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e0c090" }}>{row.label}</div>
              {row.desc && <div style={{ fontSize: 11, color: "#7a5030", marginTop: 2 }}>{row.desc}</div>}
            </div>
            {row.control}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <button className="iq-cta-button" style={{ flex: 1 }} onClick={onSchedule}>
            <span>🔔</span> Проверить уведомления
          </button>
          {isDev && (
            <button className="iq-btn" onClick={restoreDemoProgress}>
              🔧 Демо
            </button>
          )}
        </div>
        {notificationStatus && (
          <div style={{
            marginTop: 10, padding: "10px 14px",
            background: "rgba(40,120,40,0.2)",
            border: "1.5px solid #40a030",
            borderRadius: 12, fontSize: 13, color: "#80e060",
          }}>
            ✅ {notificationStatus}
          </div>
        )}
      </div>

      {/* About */}
      <div className="iq-panel">
        <div className="iq-panel-title" style={{ marginBottom: 8 }}>ℹ️ О проекте</div>
        <div style={{ fontSize: 13, color: "#c09060", lineHeight: 1.6 }}>
          IQюрица — умная курица-гений, сбежавшая из лаборатории №9 профессора Клюва Перышкина.
          Корми её нейрозёрнами, полученными за решение головоломок, и собирай коллекцию золотых яиц!
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#7a5030" }}>
          Версия 0.1.0 · Проект IQ-37
        </div>
      </div>
    </div>
  );
}
