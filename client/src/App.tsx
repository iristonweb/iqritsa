import { useEffect } from "react";
import BottomTabs from "@/components/iq/BottomTabs";
import OnboardingFlow from "@/components/iq/OnboardingFlow";
import BarnScreen from "@/screens/BarnScreen";
import LaboratoryScreen from "@/screens/LaboratoryScreen";
import IncubatorScreen from "@/screens/IncubatorScreen";
import CollectionScreen from "@/screens/CollectionScreen";
import ArenaScreen from "@/screens/ArenaScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import "./index.css";
import { Settings } from "lucide-react";

function App() {
  const currentScreen = useIQritsaStore((s) => s.currentScreen);
  const load = useIQritsaStore((s) => s.load);
  const save = useIQritsaStore((s) => s.save);
  const registerSessionHeartbeat = useIQritsaStore((s) => s.registerSessionHeartbeat);
  const rolloverDay = useIQritsaStore((s) => s.rolloverDay);
  const syncProfileFromCloud = useIQritsaStore((s) => s.syncProfileFromCloud);
  const syncProfileToCloud = useIQritsaStore((s) => s.syncProfileToCloud);
  const refreshSocialShelf = useIQritsaStore((s) => s.refreshSocialShelf);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const level = useIQritsaStore((s) => s.player.level);
  const xp = useIQritsaStore((s) => s.player.xp);
  const neurograins = useIQritsaStore((s) => s.resources.neurograins);

  useEffect(() => {
    load();
    registerSessionHeartbeat();
    rolloverDay();
    void syncProfileFromCloud();
    void refreshSocialShelf();
  }, [load, registerSessionHeartbeat, rolloverDay, syncProfileFromCloud, refreshSocialShelf]);

  useEffect(() => {
    save();
    void syncProfileToCloud();
  }, [save, syncProfileToCloud, currentScreen]);

  const xpPercent = Math.min(100, ((xp % 100) / 100) * 100);

  return (
    <div className="iq-app-shell">
      {/* TOP HEADER */}
      <header className="iq-header">
        <div className="iq-header-level">
          <span>🐔</span>
          <div>
            <div>Ур.{level}</div>
            <div className="iq-header-xp-bar" style={{ width: 40 }}>
              <div className="iq-header-xp-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        <h1 className="iq-main-title">Сарайчик</h1>

        <div className="iq-header-currency">
          <div className="iq-currency-group">
            <span>🥚</span>
            <span>{neurograins}</span>
          </div>
          <div className="iq-currency-plus">+</div>
          <button className="iq-settings-btn" onClick={() => setScreen("settings")}>
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="iq-main">
        {currentScreen === "barn" && <BarnScreen />}
        {currentScreen === "laboratory" && <LaboratoryScreen />}
        {currentScreen === "incubator" && <IncubatorScreen />}
        {currentScreen === "collection" && <CollectionScreen />}
        {currentScreen === "arena" && <ArenaScreen />}
        {currentScreen === "settings" && <SettingsScreen />}
      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomTabs />

      {/* ONBOARDING */}
      <OnboardingFlow />
    </div>
  );
}

export default App;
