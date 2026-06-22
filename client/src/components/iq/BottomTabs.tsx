import { Home, FlaskConical, Egg, BookOpen, Swords, Lock } from "lucide-react";
import type { AppScreen } from "@/store/types";
import { useIQritsaStore } from "@/store/useIQritsaStore";

const tabs: { id: AppScreen; label: string; icon: React.ReactNode; locked?: boolean }[] = [
  { id: "barn", label: "Сарай", icon: <Home size={16} /> },
  { id: "laboratory", label: "Лаборат.", icon: <FlaskConical size={16} /> },
  { id: "incubator", label: "Яйца", icon: <Egg size={16} /> },
  { id: "collection", label: "Коллекция", icon: <BookOpen size={16} />, locked: false },
  { id: "arena", label: "Арена", icon: <Swords size={16} />, locked: false },
];

export default function BottomTabs() {
  const current = useIQritsaStore((s) => s.currentScreen);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const story = useIQritsaStore((s) => s.story);

  const isLocked = (id: AppScreen) => {
    if (!story.tutorialStarted) return id !== "barn" && id !== "laboratory";
    return false;
  };

  return (
    <nav className="iq-bottom-tabs">
      {tabs.map((tab) => {
        const locked = isLocked(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => !locked && setScreen(tab.id)}
            className={`iq-tab ${current === tab.id ? "active" : ""}`}
          >
            <div className="iq-tab-icon">
              {tab.icon}
              {locked && (
                <div className="iq-tab-lock">
                  <Lock size={7} />
                </div>
              )}
            </div>
            <span className="iq-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
