import { useIQritsaStore } from "@/store/useIQritsaStore";
import MiniGameRenderer from "@/components/minigames/MiniGameRenderer";
import { eggRankConfig } from "@/theme/tokens";

const rankColors: Record<string, string> = {
  common: "#d9a673",
  rare: "#6cb8ff",
  epic: "#b57dff",
  genius: "#ff6eb7",
  legendary: "#f2bb2f",
};

export default function IncubatorScreen() {
  const inventory = useIQritsaStore((s) => s.eggs.inventory);
  const activeMiniGame = useIQritsaStore((s) => s.activeMiniGame);
  const rubEgg = useIQritsaStore((s) => s.rubEgg);
  const startEggMiniGame = useIQritsaStore((s) => s.startEggMiniGame);
  const finishActiveMiniGame = useIQritsaStore((s) => s.finishActiveMiniGame);
  const setScreen = useIQritsaStore((s) => s.setScreen);

  return (
    <div className="iq-screen-root">
      <div className="iq-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🥚</span>
          <div>
            <div className="iq-panel-title">Инкубатор</div>
            <div className="iq-panel-sub">Потри яйцо, чтобы запустить мини-игру</div>
          </div>
        </div>
      </div>

      {inventory.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "linear-gradient(180deg, #2e1c0c, #201408)",
          border: "2px solid #4a2a10",
          borderRadius: 20,
        }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🪺</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#ffe5a0", marginBottom: 6 }}>
            Пусто
          </div>
          <div style={{ fontSize: 13, color: "#c09060", marginBottom: 16 }}>
            Накорми IQюрицу в Сарае, чтобы она снесла яйцо
          </div>
          <button className="iq-cta-button" onClick={() => setScreen("barn")}>
            <span>🐔</span> Вернуться в Сарай
          </button>
        </div>
      )}

      {inventory.map((egg) => (
        <div key={egg.id} className="iq-panel" style={{ border: `2px solid ${rankColors[egg.rank]}40` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52,
              background: `radial-gradient(circle at 40% 35%, ${rankColors[egg.rank]}80, ${rankColors[egg.rank]}20)`,
              border: `2px solid ${rankColors[egg.rank]}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
              boxShadow: `0 0 16px ${rankColors[egg.rank]}50`,
            }}>
              🥚
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#ffe5a0" }}>{egg.title}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: rankColors[egg.rank], marginTop: 2 }}>
                {eggRankConfig[egg.rank].label}
              </div>
              <div style={{ fontSize: 11, color: "#9a7040", marginTop: 1 }}>
                {egg.state === "sleeping" ? "😴 Спящее" : "✨ Активное"}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#9a7040" }}>Прогресс пробуждения</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#ffe5a0" }}>
                {Math.round(egg.progress * 100)}%
              </span>
            </div>
            <div className="iq-progress-shell">
              <div className="iq-progress-gold" style={{ width: `${Math.round(egg.progress * 100)}%` }} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="iq-cta-button"
              style={{ flex: 1 }}
              onClick={() => rubEgg(egg.id, 0.35)}
            >
              <span>✨</span> Потереть скорлупу
            </button>
            <button
              className="iq-btn gold"
              onClick={() => startEggMiniGame(egg.id)}
            >
              🎮 Мини-игра
            </button>
          </div>
        </div>
      ))}

      {/* Active mini game */}
      {activeMiniGame && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 10 }}>🎮 Пробуждение Скорлупы</div>
          <MiniGameRenderer
            gameId={activeMiniGame.gameId}
            difficulty={activeMiniGame.difficulty}
            onComplete={finishActiveMiniGame}
          />
          <div style={{ marginTop: 12 }}>
            <button className="iq-btn" onClick={() => finishActiveMiniGame(false)}>
              ❌ Сдаться
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
