import { useEffect, useMemo, useState } from "react";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import { getSuspicionScore } from "@/services/anticheat";
import { pickBalancedOpponent } from "@/services/matchmaking";

export default function ArenaScreen() {
  const pvp = useIQritsaStore((s) => s.pvp);
  const league = useIQritsaStore((s) => s.league);
  const socialShelf = useIQritsaStore((s) => s.socialShelf);
  const grains = useIQritsaStore((s) => s.resources.neurograins);
  const playProfessorDuel = useIQritsaStore((s) => s.playProfessorDuel);
  const playEggArena = useIQritsaStore((s) => s.playEggArena);
  const onlineMatch = useIQritsaStore((s) => s.onlineMatch);
  const queueForServerPvp = useIQritsaStore((s) => s.queueForServerPvp);
  const pollServerMatch = useIQritsaStore((s) => s.pollServerMatch);
  const submitServerRoundAnswer = useIQritsaStore((s) => s.submitServerRoundAnswer);
  const finishServerMatch = useIQritsaStore((s) => s.finishServerMatch);
  const leaveServerQueue = useIQritsaStore((s) => s.leaveServerQueue);
  const pvpHistory = useIQritsaStore((s) => s.pvpHistory);
  const [duelAnswer, setDuelAnswer] = useState("");
  const [eggArenaAnswer, setEggArenaAnswer] = useState("");
  const [serverAnswers, setServerAnswers] = useState<Record<string, string>>({});

  const duelChallenge = useMemo(() => ({ text: "Сколько будет 7 + 5 × 2?", answer: "17" }), []);
  const eggArenaChallenge = useMemo(() => ({ text: "Продолжи ряд: 3, 6, 12, ?", answer: "24" }), []);
  const opponent = useMemo(
    () => pickBalancedOpponent(league.mmr, socialShelf.map((p) => ({ id: p.id, mmr: 900 + p.duelWins * 8, league: p.title }))),
    [league.mmr, socialShelf]
  );

  useEffect(() => {
    if (!onlineMatch || onlineMatch.status !== "active") return;
    const id = setInterval(() => void pollServerMatch(), 2000);
    return () => clearInterval(id);
  }, [onlineMatch, pollServerMatch]);

  const leagueRanks = ["Цыплёнок", "Несушка", "Академик Курятника", "Гений Инкубатора", "Золотой Мозг"];
  const leagueIndex = leagueRanks.indexOf(league.current);

  return (
    <div className="iq-screen-root">
      {/* Player PvP card */}
      <div className="iq-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #5060c0, #3040a0)",
            border: "3px solid #6070d0",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, boxShadow: "0 0 16px rgba(80,100,200,0.5)",
          }}>
            ⚔️
          </div>
          <div>
            <div className="iq-panel-title">Арена</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#a0b0e0" }}>{league.current}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#a0c0ff" }}>{pvp.rating}</div>
            <div style={{ fontSize: 11, color: "#6080c0" }}>рейтинг</div>
          </div>
        </div>

        {/* League progress */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#9a7040" }}>Прогресс лиги</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a0c0ff" }}>
              {pvp.duelWins}В / {pvp.duelLosses}П
            </span>
          </div>
          <div className="iq-progress-shell">
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #6080e0, #4060c0)",
              width: `${Math.min(100, (pvp.rating / 1500) * 100)}%`,
              borderRadius: 999,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button className="iq-cta-button" onClick={() => void queueForServerPvp()} style={{
            background: "linear-gradient(180deg, #6070e0, #4050c0)",
            borderBottomColor: "#2030a0",
            color: "#e0ecff",
            boxShadow: "0 4px 14px rgba(60,80,200,0.4)",
          }}>
            <span>🔍</span> В очередь
          </button>
          <button className="iq-btn" onClick={() => void leaveServerQueue()}>
            ✕ Выйти
          </button>
        </div>
      </div>

      {/* Professor duel */}
      <div className="iq-panel">
        <div className="iq-panel-title" style={{ marginBottom: 4 }}>⚔️ Спор у Профессора</div>
        <div className="iq-panel-sub" style={{ marginBottom: 10 }}>Ставка нейрозёрнами — без premium</div>
        <div className="iq-task-card" style={{ marginBottom: 10 }}>
          <div className="iq-task-card-title">{duelChallenge.text}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            className="iq-input"
            value={duelAnswer}
            onChange={(e) => setDuelAnswer(e.target.value)}
            placeholder="Ответ"
          />
        </div>
        <button
          className="iq-cta-button"
          disabled={grains < 10 || pvp.duelTickets <= 0}
          onClick={() => playProfessorDuel(duelAnswer.trim() === duelChallenge.answer, 10)}
        >
          <span>🎯</span> Дуэль (−10 зёрен)
        </button>
        {(grains < 10 || pvp.duelTickets <= 0) && (
          <div style={{ fontSize: 11, color: "#c04030", marginTop: 6 }}>
            {grains < 10 ? "❌ Нужно 10 нейрозёрен" : "❌ Нет дуэльных билетов"}
          </div>
        )}
      </div>

      {/* Egg arena */}
      <div className="iq-panel">
        <div className="iq-panel-title" style={{ marginBottom: 4 }}>🥚 Яичная арена</div>
        <div className="iq-panel-sub" style={{ marginBottom: 10 }}>Бой слепками — оригиналы не теряются</div>
        <div className="iq-task-card" style={{ marginBottom: 10 }}>
          <div className="iq-task-card-title">{eggArenaChallenge.text}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            className="iq-input"
            value={eggArenaAnswer}
            onChange={(e) => setEggArenaAnswer(e.target.value)}
            placeholder="Ответ"
          />
        </div>
        <button
          className="iq-cta-button"
          disabled={pvp.duelTickets <= 0}
          onClick={() => playEggArena(eggArenaAnswer.trim() === eggArenaChallenge.answer)}
        >
          <span>🥚</span> Бой слепком
        </button>
      </div>

      {/* Active online match */}
      {onlineMatch && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 6 }}>
            🌐 Серверный матч
          </div>
          <div style={{
            display: "inline-block",
            background: onlineMatch.status === "active" ? "rgba(40,120,40,0.3)" : "rgba(120,40,30,0.3)",
            border: "1.5px solid",
            borderColor: onlineMatch.status === "active" ? "#40a030" : "#a03020",
            borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
            color: onlineMatch.status === "active" ? "#80e060" : "#e06050",
            marginBottom: 10,
          }}>
            {onlineMatch.status === "active" ? "● Активный" : "✓ Завершён"}
          </div>
          {onlineMatch.result && (
            <div style={{ fontSize: 13, color: "#c09060", marginBottom: 10 }}>
              {onlineMatch.result.winnerUserId ? `Победитель: ${onlineMatch.result.winnerUserId}` : "Ничья"} |{" "}
              {onlineMatch.result.scoreA}:{onlineMatch.result.scoreB}
            </div>
          )}
          {onlineMatch.rounds.map((round) => (
            <div key={round.id} className="iq-task-card" style={{ marginBottom: 8 }}>
              <div className="iq-task-card-body">{round.question}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  className="iq-input"
                  placeholder="Ответ"
                  value={serverAnswers[round.id] ?? ""}
                  onChange={(e) => setServerAnswers((prev) => ({ ...prev, [round.id]: e.target.value }))}
                />
                <button
                  className="iq-btn gold"
                  onClick={() => {
                    const value = (serverAnswers[round.id] ?? "").trim();
                    if (value) void submitServerRoundAnswer(round.id, value, 3000);
                  }}
                >
                  →
                </button>
              </div>
            </div>
          ))}
          <button className="iq-cta-button" onClick={() => void finishServerMatch()}>
            <span>🏁</span> Завершить матч
          </button>
        </div>
      )}

      {/* History */}
      {pvpHistory.length > 0 && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 10 }}>📜 История матчей</div>
          {pvpHistory.map((row) => (
            <div key={row.matchId} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 0", borderBottom: "1px solid rgba(80,50,20,0.4)",
            }}>
              <div>
                <div style={{ fontSize: 12, color: "#c09060" }}>{row.matchId}</div>
                <div style={{ fontSize: 11, color: "#7a5030" }}>
                  {row.winnerUserId ? `Победитель: ${row.winnerUserId}` : "Ничья"}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#ffe5a0" }}>
                {row.scoreA}:{row.scoreB}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
