import { useMemo, useState } from "react";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import { FlaskConical, GrainIcon } from "lucide-react";
import chickenImage from "@/assets/characters/iq-chicken-main.png";

export default function BarnScreen() {
  const feedChicken = useIQritsaStore((s) => s.feedChicken);
  const neurograins = useIQritsaStore((s) => s.resources.neurograins);
  const level = useIQritsaStore((s) => s.player.level);
  const barnLevel = useIQritsaStore((s) => s.player.barnLevel);
  const dailyPuzzle = useIQritsaStore((s) => s.dailyPuzzle);
  const streak = useIQritsaStore((s) => s.player.dailyStreak);
  const absenceDays = useIQritsaStore((s) => s.dailyPuzzle.absenceDays);
  const barn = useIQritsaStore((s) => s.barn);
  const story = useIQritsaStore((s) => s.story);
  const chicken = useIQritsaStore((s) => s.chicken);
  const eggs = useIQritsaStore((s) => s.eggs);
  const completeDailyPuzzle = useIQritsaStore((s) => s.completeDailyPuzzle);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const claimMorningMilestone = useIQritsaStore((s) => s.claimMorningMilestone);
  const [dailyAnswer, setDailyAnswer] = useState("");
  const [dailyFeedback, setDailyFeedback] = useState<string | null>(null);

  const morningTask = useMemo(() => {
    const d = new Date().getDate();
    return { text: `Продолжи ряд: ${d}, ${d + 2}, ${d + 4}, ?`, answer: String(d + 6) };
  }, []);

  // Determine current game state for UI
  const isFirstVisit = !story.tutorialStarted;
  const isFed = chicken.hungerLevel < 50;
  const hasEggReady = eggs.inventory.length > 0;
  const eggInNest = chicken.currentEggProgress >= 1;

  const grainFillPercent = Math.max(0, 100 - chicken.hungerLevel);
  const eggProgress = Math.round(chicken.currentEggProgress * 100);

  // Professor message based on state
  const professorMsg = isFirstVisit
    ? "Осторожно! Это проект IQ-37.\nОна не ест обычное зерно.\nРеши мою загадку и добудь\nпервое нейрозёрно."
    : chicken.hungerLevel > 70
    ? "IQюрица голодна!\nДобудь нейрозёрна\nв лаборатории, чтобы\nеё накормить."
    : isFed && eggProgress >= 100
    ? "Превосходно! IQюрица\nснесла новое яйцо.\nТеперь потри его, чтобы\nпробудить мини-игру."
    : isFed
    ? "Отлично! Ты добыл\nнейрозёрна. Теперь\nнакорми IQюрицу, и она\nсможет снести новое яйцо."
    : "Профессор Клюв Перышкин\nнаблюдает за прогрессом.\nКо-ко!";

  const chickenSays = chicken.mood === "hungry"
    ? "Ко-ко...\nхочу есть"
    : chicken.mood === "laying"
    ? "Ко-ко!\nЯ снесла яйцо!"
    : chicken.mood === "happy"
    ? "Ко-ко!\nЕсть зёрнышки?"
    : "Ко-ко?";

  // Current quest
  const questTitle = isFirstVisit ? "Первый визит"
    : chicken.hungerLevel > 70 ? "Срочно покормить"
    : eggProgress >= 100 ? "Пробудить яйцо"
    : "Покормить IQюрицу";

  const questDesc = isFirstVisit ? "Получить первое нейрозёрно"
    : chicken.hungerLevel > 70 ? "Добыть 3 нейрозёрна"
    : eggProgress >= 100 ? "Потереть новое яйцо"
    : "Использовать 3 нейрозёрна";

  const questReward = isFirstVisit ? "x1" : eggProgress >= 100 ? "Мини-игра x1" : "x3";
  const rewardIsEgg = isFirstVisit || eggProgress >= 100;

  // CTA button
  const ctaLabel = isFirstVisit ? "Получить первое нейрозёрно"
    : chicken.hungerLevel > 70 ? "В лабораторию"
    : eggProgress >= 100 ? "Потереть яйцо"
    : "Покормить IQюрицу";

  const ctaIsLab = chicken.hungerLevel > 70;
  const ctaIcon = ctaIsLab ? "🔬" : eggProgress >= 100 ? "🥚" : "🌾";

  const handleCTA = () => {
    if (isFirstVisit || ctaIsLab) {
      setScreen("laboratory");
    } else if (eggProgress >= 100) {
      setScreen("incubator");
    } else {
      if (neurograins >= 3) feedChicken();
    }
  };

  const canFeed = neurograins >= 3 && chicken.hungerLevel > 0;
  const grainReadyLabel = neurograins >= 3 ? "Кормушка готова" : "Кормушка пуста";
  const grainReady = neurograins >= 3;

  const showKukarekometr = streak > 0 || isFed;

  return (
    <div className="iq-screen-root">
      {/* BARN SCENE */}
      <div className="barn-scene" style={{ minHeight: 320 }}>
        <div className="barn-scene-bg" />

        {/* Lamp */}
        <div className="barn-lamp">🪔</div>

        {/* Kukarekometr (shown after first feed) */}
        {showKukarekometr && (
          <div className="kukarekometer">
            <div className="kukarekometer-label">Кукарекометр</div>
            <div className="kukarekometer-time">07:00</div>
            <div className="kukarekometer-period">утро</div>
          </div>
        )}

        {/* Professor panel */}
        <div className="professor-box">
          <div className="professor-name-tag">Профессор<br />Клюв Перышкин</div>
          <div className="professor-frame">
            <div style={{
              background: "linear-gradient(180deg, #0a1a2a, #0d2035)",
              borderRadius: 10,
              overflow: "hidden",
              height: 80,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
            }}>
              🦆
            </div>
          </div>
          <div className="professor-speech">
            {professorMsg.split('\n').map((line, i) => (
              <span key={i}>{line}{i < professorMsg.split('\n').length - 1 && <br />}</span>
            ))}
          </div>
        </div>

        {/* Grain bowl / no-grain indicator */}
        <div style={{ position: "absolute", left: 14, bottom: 50, zIndex: 4 }}>
          {grainReady ? (
            <div className="barn-indicator ready" style={{ marginBottom: 6 }}>
              🌾 Кормушка готова
            </div>
          ) : (
            <div className="barn-indicator no-grain" style={{ marginBottom: 6 }}>
              🚫 Кормушка пуста
            </div>
          )}
          <div style={{
            width: 60, height: 40,
            background: grainReady
              ? "radial-gradient(ellipse at 50% 80%, #c8a030, #8a6010)"
              : "linear-gradient(180deg, #3a2a18, #251808)",
            border: "2px solid #5a3a14",
            borderRadius: "50% 50% 40% 40% / 30% 30% 50% 50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: grainReady ? 20 : 12,
            filter: grainReady ? "drop-shadow(0 0 8px rgba(200,150,0,0.6))" : "none",
            animation: grainReady ? "grain-glow 2s ease-in-out infinite" : "none",
          }}>
            {grainReady ? "🌾" : ""}
          </div>
        </div>

        {/* Chicken speech bubble */}
        <div className="chicken-bubble">
          {chickenSays.split('\n').map((line, i) => (
            <span key={i}>{line}{i < chickenSays.split('\n').length - 1 && <br />}</span>
          ))}
        </div>

        {/* Welcome sign */}
        <div className="barn-welcome-sign">
          ДОБРО<br />ПОЖАЛОВАТЬ<br />ДОМОЙ! ♥
        </div>

        {/* Chicken */}
        <div className="chicken-container">
          <img
            src={chickenImage}
            alt="IQюрица"
            className={`chicken-img ${chicken.mood === "laying" ? "egg-vibe" : "chicken-bob"}`}
            style={{ height: 190 }}
          />
        </div>

        {/* Nest */}
        <div className="barn-nest" style={{ bottom: 10, right: 14 }}>
          <div style={{ fontSize: 28, textAlign: "center", marginBottom: 2 }}>
            {eggProgress >= 100 ? "🌟🥚🌟" : ""}
          </div>
          <div className="barn-nest-sign">
            {eggProgress >= 100 ? "ГНЕЗДО —\nновое яйцо готово" : "ГНЕЗДО\n(пока пусто)"}
          </div>
        </div>
      </div>

      {/* CHICKEN STATUS BAR */}
      <div className="chicken-status-bar">
        <div className="status-row">
          <div className="status-icon">🐔</div>
          <div className="status-text" style={{ flex: 1 }}>
            <div className="status-label">
              {chicken.hungerLevel > 70 ? "Курица голодна" : "Можно покормить"}
            </div>
            <div className="status-desc">
              {chicken.hungerLevel > 70
                ? "Накорми IQюрицу, чтобы получить новое яйцо"
                : "У тебя есть нейрозёрна. Накорми IQюрицу, чтобы получить яйцо."}
            </div>
            <div className="status-progress-shell" style={{ marginTop: 5 }}>
              <div
                className={`status-progress-fill ${grainReady ? "grain" : "red"}`}
                style={{ width: `${grainFillPercent}%` }}
              />
            </div>
            <div className="status-count">До яйца: {Math.min(neurograins, 3)}/3</div>
          </div>
        </div>
      </div>

      {/* QUEST CARD */}
      <div className="quest-card">
        <div className="quest-icon">📋</div>
        <div className="quest-info">
          <div className="quest-title">{questTitle}</div>
          <div className="quest-stars">
            <span className="quest-star">⭐</span>
            <span className="quest-star" style={{ opacity: 0.35 }}>⭐</span>
            <span className="quest-star" style={{ opacity: 0.35 }}>⭐</span>
          </div>
          <div className="quest-desc">{questDesc}</div>
        </div>
        <div className="quest-reward">
          <div className="quest-reward-label">Награда:</div>
          <div className="quest-reward-value">
            <span>🥚</span>
            <span>{questReward}</span>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <button
        className={`iq-cta-button ${ctaIsLab ? "lab" : ""}`}
        onClick={handleCTA}
        disabled={!isFirstVisit && !ctaIsLab && eggProgress < 100 && !canFeed}
      >
        <span style={{ fontSize: 22 }}>{ctaIcon}</span>
        <span>{ctaLabel}</span>
      </button>
    </div>
  );
}
