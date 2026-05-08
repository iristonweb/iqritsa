import IQButton from "@/components/iq/IQButton";
import IQPanel from "@/components/iq/IQPanel";
import MiniGameRenderer from "@/components/minigames/MiniGameRenderer";
import { eggRankConfig } from "@/theme/tokens";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function IncubatorScreen() {
  const inventory = useIQritsaStore((s) => s.eggs.inventory);
  const activeMiniGame = useIQritsaStore((s) => s.activeMiniGame);
  const rubEgg = useIQritsaStore((s) => s.rubEgg);
  const startEggMiniGame = useIQritsaStore((s) => s.startEggMiniGame);
  const finishActiveMiniGame = useIQritsaStore((s) => s.finishActiveMiniGame);

  const miniGameLabel = (type: string) => {
    if (type.includes("analog")) return "Скорлупа памяти";
    if (type.includes("spatial") || type.includes("sudoku")) return "Куро-Сокобан";
    return "Разбитая картинка";
  };

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Инкубатор" subtitle="Потри яйцо, чтобы запустить мини-игру">
        {inventory.length === 0 && <p>Пока пусто. Накорми IQюрицу в Сарае.</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {inventory.map((egg) => (
            <div key={egg.id} className="iq-task-card">
              <p className="font-bold">🥚 {egg.title}</p>
              <p className="text-sm" style={{ color: eggRankConfig[egg.rank].color }}>
                Ранг: {eggRankConfig[egg.rank].label}
              </p>
              <p className="text-sm">Состояние: {egg.state === "sleeping" ? "Спящее" : "Активное"}</p>
              <p className="text-sm">Мини-игра: {miniGameLabel(egg.puzzleType)}</p>
              <div className="iq-progress-shell mt-2">
                <div className="iq-progress-gold" style={{ width: `${Math.round(egg.progress * 100)}%` }} />
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                <IQButton variant="gold" onClick={() => rubEgg(egg.id, 0.35)}>
                  Потереть скорлупу
                </IQButton>
                <IQButton onClick={() => startEggMiniGame(egg.id)}>
                  Пробудить мини-игру
                </IQButton>
              </div>
            </div>
          ))}
        </div>
      </IQPanel>
      {activeMiniGame && (
        <IQPanel title="Пробуждение Скорлупы" subtitle="Мини-игра из активного яйца">
          <MiniGameRenderer
            gameId={activeMiniGame.gameId}
            difficulty={activeMiniGame.difficulty}
            onComplete={finishActiveMiniGame}
          />
          <div className="mt-2">
            <IQButton onClick={() => finishActiveMiniGame(false)}>Сдаться</IQButton>
          </div>
        </IQPanel>
      )}
    </div>
  );
}
