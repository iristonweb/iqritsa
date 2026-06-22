import type { AppScreen } from "@/store/types";
import { useIQritsaStore } from "@/store/useIQritsaStore";

const tabs: { id: AppScreen; label: string }[] = [
  { id: "barn", label: "Сарай" },
  { id: "laboratory", label: "Лаборатория" },
  { id: "incubator", label: "Инкубатор" },
  { id: "collection", label: "Коллекция" },
  { id: "arena", label: "Арена" },
  { id: "settings", label: "Настройки" },
];

export default function BottomTabs() {
  const current = useIQritsaStore((s) => s.currentScreen);
  const setScreen = useIQritsaStore((s) => s.setScreen);

  return (
    <nav className="iq-bottom-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setScreen(tab.id)}
          className={`iq-tab-btn ${current === tab.id ? "active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
