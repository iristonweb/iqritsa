import { useMemo, useState } from "react";
import IQButton from "@/components/iq/IQButton";
import IQPanel from "@/components/iq/IQPanel";
import ChickenView from "@/components/iq/ChickenView";
import { absenceStageMessages } from "@/content/lore";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function BarnScreen() {
  const feedChicken = useIQritsaStore((s) => s.feedChicken);
  const neurograins = useIQritsaStore((s) => s.resources.neurograins);
  const level = useIQritsaStore((s) => s.player.level);
  const barnLevel = useIQritsaStore((s) => s.player.barnLevel);
  const dailyPuzzle = useIQritsaStore((s) => s.dailyPuzzle);
  const streak = useIQritsaStore((s) => s.player.dailyStreak);
  const grainByType = useIQritsaStore((s) => s.resources.grainByType);
  const absenceDays = useIQritsaStore((s) => s.dailyPuzzle.absenceDays);
  const barn = useIQritsaStore((s) => s.barn);
  const story = useIQritsaStore((s) => s.story);
  const season = useIQritsaStore((s) => s.season);
  const claimMorningMilestone = useIQritsaStore((s) => s.claimMorningMilestone);
  const buyBarnDecoration = useIQritsaStore((s) => s.buyBarnDecoration);
  const completeDailyPuzzle = useIQritsaStore((s) => s.completeDailyPuzzle);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const [dailyAnswer, setDailyAnswer] = useState("");
  const [dailyFeedback, setDailyFeedback] = useState<string | null>(null);
  const morningTask = useMemo(() => {
    const d = new Date().getDate();
    return { text: `Продолжи ряд: ${d}, ${d + 2}, ${d + 4}, ?`, answer: String(d + 6) };
  }, []);

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Сарай IQюрицы" subtitle="Хаб, где нейрозёрна превращаются в золотые идеи">
        <ChickenView />
        <div className="mt-4 flex flex-wrap gap-2">
          <IQButton variant="gold" onClick={feedChicken} disabled={neurograins < 5}>
            Покормить за 5 нейрозёрен
          </IQButton>
          <IQButton onClick={() => setScreen("laboratory")}>В Лабораторию</IQButton>
        </div>
      </IQPanel>

      <IQPanel title="Статус хозяина">
        <p>Уровень игрока: {level}</p>
        <p>Уровень сарая: {barnLevel}</p>
        <p>Нейрозёрна: {neurograins}</p>
        <p>Серия Утреннего Кукарека: {streak}</p>
        <p>Логозёрна: {grainByType.logic} | Мемозёрна: {grainByType.memory}</p>
        <p>Геозёрна: {grainByType.spatial} | Хаос-зёрна: {grainByType.chaos}</p>
        <p>Зёрна пробуждения: {grainByType.awakening}</p>
        {absenceDays > 0 && (
          <p className="mt-2 text-sm">
            {absenceStageMessages[Math.min(absenceStageMessages.length - 1, Math.floor(absenceDays / 3))]}
          </p>
        )}
        <div className="mt-3 flex gap-2 flex-wrap">
          <IQButton
            variant="gold"
            disabled={!dailyPuzzle.isAvailable || dailyAnswer.trim() !== morningTask.answer}
            onClick={() => {
              completeDailyPuzzle(true);
              setDailyFeedback("Утренний Кукарек засчитан. Зерно пробуждения получено.");
            }}
          >
            Засчитать утреннюю задачу
          </IQButton>
          <IQButton disabled={!dailyPuzzle.isAvailable} onClick={() => setScreen("laboratory")}>Перейти к задачам</IQButton>
        </div>
        <div className="mt-2">
          <p className="text-sm">{morningTask.text}</p>
          <input
            className="iq-input mt-1"
            value={dailyAnswer}
            onChange={(e) => {
              setDailyAnswer(e.target.value);
              if (e.target.value.trim() === morningTask.answer) {
                setDailyFeedback("Ответ верный. Можно забрать награду.");
              } else {
                setDailyFeedback(null);
              }
            }}
            placeholder="Ответ"
          />
          {dailyFeedback && <p className="text-sm mt-1">{dailyFeedback}</p>}
        </div>
      </IQPanel>

      <IQPanel title="База в сарае" subtitle="Кукарекометр, доска профессора и декор">
        <p>Кукарекометр: {barn.hasKukarekometr ? "установлен" : "не установлен"}</p>
        <p>Скорлупограф: {barn.hasShellograph ? "готов к дуэлям" : "отсутствует"}</p>
        <p>Декор: {barn.decorations.length}</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          <IQButton onClick={() => buyBarnDecoration("professor_mug", 12)}>Купить кружку Профессора (12)</IQButton>
          <IQButton onClick={() => buyBarnDecoration("sunny_bedding", 20)}>Солнечная подстилка (20)</IQButton>
        </div>
      </IQPanel>

      <IQPanel title="Сюжет и сезон">
        <p>Глава: {story.chapter} ({Math.round(story.chapterProgress * 100)}%)</p>
        <p>Сезон {season.currentSeason}: {season.title}</p>
        <p>Season pass: {season.passLevel} ур., очки {season.eventPoints}</p>
        <p className="text-sm mt-2">Сезонный прогресс повышается за задачи, дуэли и пробуждённые яйца.</p>
      </IQPanel>

      <IQPanel title="Доска Профессора">
        <ul className="list-disc ml-5">
          {barn.boardTasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
        <div className="mt-2 flex gap-2 flex-wrap">
          <IQButton disabled={streak < 3} onClick={() => claimMorningMilestone(3)}>Забрать награду 3 дня</IQButton>
          <IQButton disabled={streak < 7} onClick={() => claimMorningMilestone(7)}>Забрать награду 7 дней</IQButton>
          <IQButton disabled={streak < 14} onClick={() => claimMorningMilestone(14)}>Забрать титул 14 дней</IQButton>
          <IQButton disabled={streak < 30} onClick={() => claimMorningMilestone(30)}>Забрать 30 дней</IQButton>
        </div>
      </IQPanel>
    </div>
  );
}
