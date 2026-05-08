import { useEffect } from "react";
import "@fontsource/inter";
import BottomTabs from "@/components/iq/BottomTabs";
import OnboardingFlow from "@/components/iq/OnboardingFlow";
import BarnScreen from "@/screens/BarnScreen";
import LaboratoryScreen from "@/screens/LaboratoryScreen";
import IncubatorScreen from "@/screens/IncubatorScreen";
import CollectionScreen from "@/screens/CollectionScreen";
import ArenaScreen from "@/screens/ArenaScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { professorPhrases } from "@/content/lore";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import "./index.css";

function App() {
  const currentScreen = useIQritsaStore((s) => s.currentScreen);
  const message = useIQritsaStore((s) => s.professorMessage);
  const load = useIQritsaStore((s) => s.load);
  const save = useIQritsaStore((s) => s.save);
  const registerSessionHeartbeat = useIQritsaStore((s) => s.registerSessionHeartbeat);
  const rolloverDay = useIQritsaStore((s) => s.rolloverDay);
  const syncProfileFromCloud = useIQritsaStore((s) => s.syncProfileFromCloud);
  const syncProfileToCloud = useIQritsaStore((s) => s.syncProfileToCloud);
  const refreshSocialShelf = useIQritsaStore((s) => s.refreshSocialShelf);

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
  }, [save, syncProfileToCloud, currentScreen, message]);

  return (
    <div className="iq-app-shell">
      <header className="iq-header">
        <h1 className="iq-main-title">IQюрица</h1>
        <p className="iq-subtitle">{professorPhrases.greeting}</p>
      </header>

      <main className="iq-main">
        {currentScreen === "barn" && <BarnScreen />}
        {currentScreen === "laboratory" && <LaboratoryScreen />}
        {currentScreen === "incubator" && <IncubatorScreen />}
        {currentScreen === "collection" && <CollectionScreen />}
        {currentScreen === "arena" && <ArenaScreen />}
        {currentScreen === "settings" && <SettingsScreen />}
      </main>

      <div className="iq-professor-line">{message}</div>
      <BottomTabs />
      <OnboardingFlow />
    </div>
  );
}

export default App;
