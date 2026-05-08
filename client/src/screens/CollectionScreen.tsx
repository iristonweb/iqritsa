import { useEffect, useMemo, useState } from "react";
import IQPanel from "@/components/iq/IQPanel";
import { eggRankConfig } from "@/theme/tokens";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function CollectionScreen() {
  const collected = useIQritsaStore((s) => s.eggs.collected);
  const titles = useIQritsaStore((s) => s.player.titles);
  const barnLevel = useIQritsaStore((s) => s.player.barnLevel);
  const pvp = useIQritsaStore((s) => s.pvp);
  const socialShelf = useIQritsaStore((s) => s.socialShelf);
  const markTutorialStageDone = useIQritsaStore((s) => s.markTutorialStageDone);
  const [rankFilter, setRankFilter] = useState<"all" | keyof typeof eggRankConfig>("all");

  const filtered = useMemo(
    () => (rankFilter === "all" ? collected : collected.filter((egg) => egg.rank === rankFilter)),
    [collected, rankFilter]
  );

  useEffect(() => {
    markTutorialStageDone("collection");
  }, [markTutorialStageDone]);

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Коллекция IQ-яиц" subtitle="Полка пробуждённых артефактов">
        {collected.length === 0 && <p>Пока ни одно яйцо не пробуждено. Загляни в Инкубатор.</p>}
        <div className="mb-3 flex flex-wrap gap-2">
          <button className="iq-filter-btn" onClick={() => setRankFilter("all")}>Все</button>
          {Object.keys(eggRankConfig).map((rank) => (
            <button className="iq-filter-btn" key={rank} onClick={() => setRankFilter(rank as keyof typeof eggRankConfig)}>
              {eggRankConfig[rank as keyof typeof eggRankConfig].label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {filtered.map((egg) => (
            <article className="iq-task-card" key={egg.id}>
              <p className="font-bold">{egg.title}</p>
              <p style={{ color: eggRankConfig[egg.rank].color }}>Ранг: {eggRankConfig[egg.rank].label}</p>
              <p className="text-xs opacity-70">Пробуждено: {new Date(egg.awakenedAt ?? egg.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </IQPanel>
      <IQPanel title="Профиль хозяина">
        <p>Уровень сарая: {barnLevel}</p>
        <p>PvP лига: {pvp.league}</p>
        <p>PvP рейтинг: {pvp.rating}</p>
        <p className="mt-2">Титулы:</p>
        <ul className="list-disc ml-5">
          {titles.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      </IQPanel>
      <IQPanel title="Социальная полка">
        <div className="grid gap-2">
          {socialShelf.map((profile) => (
            <article key={profile.id} className="iq-task-card">
              <p className="font-semibold">{profile.nickname} — {profile.title}</p>
              <p className="text-sm">Пробуждённых яиц: {profile.awakenedEggs}, Побед: {profile.duelWins}</p>
              <p className="text-xs opacity-75">Любимый тип: {profile.favoriteEggType}</p>
            </article>
          ))}
        </div>
      </IQPanel>
    </div>
  );
}
