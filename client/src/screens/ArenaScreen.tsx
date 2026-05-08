import { useEffect, useMemo, useState } from "react";
import IQButton from "@/components/iq/IQButton";
import IQPanel from "@/components/iq/IQPanel";
import { getSuspicionScore } from "@/services/anticheat";
import { pickBalancedOpponent } from "@/services/matchmaking";
import { useIQritsaStore } from "@/store/useIQritsaStore";

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
  const duelChallenge = useMemo(() => ({ text: "Сколько будет 7 + 5 * 2?", answer: "17" }), []);
  const eggArenaChallenge = useMemo(() => ({ text: "Продолжи ряд 3, 6, 12, ?", answer: "24" }), []);

  const opponent = useMemo(
    () =>
      pickBalancedOpponent(league.mmr, socialShelf.map((p) => ({ id: p.id, mmr: 900 + p.duelWins * 8, league: p.title }))),
    [league.mmr, socialShelf]
  );
  const antiCheatScore = getSuspicionScore({ answerTimeMs: 900, mistakes: 1, tapsPerSecond: 4 });

  useEffect(() => {
    if (!onlineMatch || onlineMatch.status !== "active") return;
    const id = setInterval(() => {
      void pollServerMatch();
    }, 2000);
    return () => clearInterval(id);
  }, [onlineMatch, pollServerMatch]);

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Арена" subtitle="PvP без потери оригинальных яиц">
        <p>Лига: {pvp.league}</p>
        <p>Рейтинг: {pvp.rating}</p>
        <p>Победы/поражения: {pvp.duelWins}/{pvp.duelLosses}</p>
        <p>Трофейные слепки: {pvp.shellCopies}</p>
        <p>Дуэльные билеты: {pvp.duelTickets}</p>
        <p>Античит-оценка сессии: {antiCheatScore}%</p>
        <p>Рекомендованный соперник: {opponent?.id ?? "ожидание матчмейкинга"}</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          <IQButton variant="gold" onClick={() => void queueForServerPvp()}>Встать в серверную очередь</IQButton>
          <IQButton onClick={() => void leaveServerQueue()}>Выйти из очереди</IQButton>
        </div>
      </IQPanel>

      <IQPanel title="Спор у Профессора" subtitle="Ставка только нейрозёрнами, без premium-валюты">
        <p className="text-sm mb-2">{duelChallenge.text}</p>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="iq-input" value={duelAnswer} onChange={(e) => setDuelAnswer(e.target.value)} placeholder="Ответ" />
          <IQButton
            variant="gold"
            disabled={grains < 10 || pvp.duelTickets <= 0}
            onClick={() => playProfessorDuel(duelAnswer.trim() === duelChallenge.answer, 10)}
          >
            Запустить дуэль (10)
          </IQButton>
        </div>
      </IQPanel>

      <IQPanel title="Яичная арена" subtitle="Бой идёт слепками, оригиналы яиц не теряются">
        <p className="text-sm mb-2">{eggArenaChallenge.text}</p>
        <div className="flex gap-2 flex-wrap items-center">
          <input className="iq-input" value={eggArenaAnswer} onChange={(e) => setEggArenaAnswer(e.target.value)} placeholder="Ответ" />
          <IQButton
            variant="gold"
            disabled={pvp.duelTickets <= 0}
            onClick={() => playEggArena(eggArenaAnswer.trim() === eggArenaChallenge.answer)}
          >
            Провести бой слепком
          </IQButton>
        </div>
      </IQPanel>

      {onlineMatch && (
        <IQPanel title={`Серверный матч ${onlineMatch.id}`} subtitle={`Статус: ${onlineMatch.status}`}>
          {onlineMatch.result && (
            <p className="mb-2 text-sm">
              Итог: {onlineMatch.result.winnerUserId ? `победитель ${onlineMatch.result.winnerUserId}` : "ничья"} | {onlineMatch.result.scoreA}:{onlineMatch.result.scoreB}
            </p>
          )}
          <div className="grid gap-2">
            {onlineMatch.rounds.map((round) => (
              <div key={round.id} className="iq-task-card">
                <p className="text-sm">{round.id.toUpperCase()}: {round.question}</p>
                <div className="mt-2 flex gap-2 flex-wrap items-center">
                  <input
                    className="iq-input"
                    placeholder="Ответ"
                    value={serverAnswers[round.id] ?? ""}
                    onChange={(e) => setServerAnswers((prev) => ({ ...prev, [round.id]: e.target.value }))}
                  />
                  <IQButton
                    onClick={() => {
                      const value = (serverAnswers[round.id] ?? "").trim();
                      if (value) void submitServerRoundAnswer(round.id, value, 3000);
                    }}
                  >
                    Отправить
                  </IQButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <IQButton variant="gold" onClick={() => void finishServerMatch()}>Завершить серверный матч</IQButton>
          </div>
        </IQPanel>
      )}

      <IQPanel title="История серверных матчей">
        {pvpHistory.length === 0 && <p className="text-sm">История пока пуста.</p>}
        <div className="grid gap-2">
          {pvpHistory.map((row) => (
            <div key={row.matchId} className="iq-task-card">
              <p className="text-sm">{row.matchId} | {row.scoreA}:{row.scoreB}</p>
              <p className="text-xs opacity-70">Победитель: {row.winnerUserId ?? "ничья"}</p>
            </div>
          ))}
        </div>
      </IQPanel>
    </div>
  );
}
