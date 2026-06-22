import { useMemo, useState, useEffect } from "react";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import { eggRankConfig } from "@/theme/tokens";

const rankColors: Record<string, string> = {
  common: "#d9a673",
  rare: "#6cb8ff",
  epic: "#b57dff",
  genius: "#ff6eb7",
  legendary: "#f2bb2f",
};

export default function CollectionScreen() {
  const collected = useIQritsaStore((s) => s.eggs.collected);
  const titles = useIQritsaStore((s) => s.player.titles);
  const barnLevel = useIQritsaStore((s) => s.player.barnLevel);
  const pvp = useIQritsaStore((s) => s.pvp);
  const socialShelf = useIQritsaStore((s) => s.socialShelf);
  const markTutorialStageDone = useIQritsaStore((s) => s.markTutorialStageDone);
  const [rankFilter, setRankFilter] = useState<"all" | keyof typeof eggRankConfig>("all");

  const filtered = useMemo(
    () => rankFilter === "all" ? collected : collected.filter((egg) => egg.rank === rankFilter),
    [collected, rankFilter]
  );

  useEffect(() => {
    markTutorialStageDone("collection");
  }, [markTutorialStageDone]);

  return (
    <div className="iq-screen-root">
      {/* Profile card */}
      <div className="iq-panel">
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #c8a050, #8a6020)",
            border: "3px solid #f2bb2f",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
            boxShadow: "0 0 20px rgba(200,160,30,0.5)",
          }}>
            🏆
          </div>
          <div>
            <div className="iq-panel-title">Коллекция IQ-яиц</div>
            <div className="iq-panel-sub">Уровень сарая {barnLevel} · Лига: {pvp.league}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f2bb2f" }}>{collected.length}</div>
            <div style={{ fontSize: 11, color: "#c09060" }}>яиц</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 4 }}>
          {[
            { label: "Рейтинг PvP", value: pvp.rating, icon: "⚔️" },
            { label: "Победы", value: pvp.duelWins, icon: "🏅" },
            { label: "Скорлупы", value: pvp.shellCopies, icon: "🥚" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,200,80,0.07)",
              border: "1.5px solid #4a2e14",
              borderRadius: 12,
              padding: "8px 10px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 16 }}>{stat.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#ffe5a0" }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: "#9a7040" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {titles.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {titles.map((title) => (
              <div key={title} style={{
                background: "linear-gradient(90deg, rgba(200,160,30,0.2), rgba(200,160,30,0.1))",
                border: "1.5px solid #a07820",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#f2c040",
              }}>
                ✨ {title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter pills */}
      <div className="iq-scroll" style={{ display: "flex", gap: 6, padding: "0 0 4px" }}>
        <button
          className={`iq-filter-btn ${rankFilter === "all" ? "active" : ""}`}
          onClick={() => setRankFilter("all")}
        >
          Все ({collected.length})
        </button>
        {Object.entries(eggRankConfig).map(([rank, cfg]) => {
          const count = collected.filter((e) => e.rank === rank).length;
          return (
            <button
              key={rank}
              className={`iq-filter-btn ${rankFilter === rank ? "active" : ""}`}
              onClick={() => setRankFilter(rank as keyof typeof eggRankConfig)}
              style={{ color: count > 0 ? rankColors[rank] : undefined }}
            >
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Egg grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "linear-gradient(180deg, #2e1c0c, #201408)",
          border: "2px solid #4a2a10",
          borderRadius: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🥚</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#ffe5a0", marginBottom: 6 }}>
            Пока ни одно яйцо не пробуждено
          </div>
          <div style={{ fontSize: 12, color: "#c09060" }}>Загляни в Инкубатор</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map((egg) => (
            <div key={egg.id} style={{
              background: "linear-gradient(180deg, #2e1c0c, #201408)",
              border: `2px solid ${rankColors[egg.rank]}40`,
              borderRadius: 16,
              padding: 14,
              textAlign: "center",
            }}>
              <div style={{
                width: 48, height: 48,
                background: `radial-gradient(circle at 40% 35%, ${rankColors[egg.rank]}80, ${rankColors[egg.rank]}20)`,
                border: `2px solid ${rankColors[egg.rank]}`,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
                margin: "0 auto 8px",
                boxShadow: `0 0 12px ${rankColors[egg.rank]}40`,
              }}>
                🥚
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#ffe5a0", marginBottom: 3 }}>
                {egg.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: rankColors[egg.rank] }}>
                {eggRankConfig[egg.rank].label}
              </div>
              <div style={{ fontSize: 10, color: "#7a5030", marginTop: 4 }}>
                {new Date(egg.awakenedAt ?? egg.createdAt).toLocaleDateString("ru-RU")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social shelf */}
      {socialShelf.length > 0 && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 10 }}>🌐 Социальная полка</div>
          {socialShelf.map((profile) => (
            <div key={profile.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid rgba(80,50,20,0.4)",
            }}>
              <div style={{
                width: 38, height: 38,
                background: "linear-gradient(135deg, #3a2010, #251408)",
                border: "2px solid #5a3018",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>
                🐔
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#ffe5a0" }}>
                  {profile.nickname}
                </div>
                <div style={{ fontSize: 11, color: "#9a7040" }}>{profile.title}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f2c040" }}>
                  🏅 {profile.duelWins}
                </div>
                <div style={{ fontSize: 10, color: "#9a7040" }}>побед</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
