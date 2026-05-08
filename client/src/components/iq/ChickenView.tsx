import chickenImage from "@/assets/characters/iq-chicken-main.png";
import { chickenReactions } from "@/content/lore";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function ChickenView() {
  const mood = useIQritsaStore((s) => s.chicken.mood);
  const hungerLevel = useIQritsaStore((s) => s.chicken.hungerLevel);
  const eggProgress = useIQritsaStore((s) => s.chicken.currentEggProgress);
  const reaction = chickenReactions[mood];

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={chickenImage}
        alt="IQюрица"
        className={`h-56 w-auto object-contain ${mood === "laying" ? "egg-vibe" : "chicken-bob"}`}
      />
      <p className="iq-subtitle text-center">{reaction}</p>
      <div className="w-full max-w-md">
        <p className="text-sm text-[#5f3a1e] mb-1">Голод: {hungerLevel}%</p>
        <div className="iq-progress-shell">
          <div className="iq-progress-fill" style={{ width: `${100 - hungerLevel}%` }} />
        </div>
      </div>
      <div className="w-full max-w-md">
        <p className="text-sm text-[#5f3a1e] mb-1">Прогресс яйца: {Math.round(eggProgress * 100)}%</p>
        <div className="iq-progress-shell">
          <div className="iq-progress-gold" style={{ width: `${Math.round(eggProgress * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
