import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function OnboardingFlow() {
  const story = useIQritsaStore((s) => s.story);
  const startTutorial = useIQritsaStore((s) => s.startTutorial);
  const markTutorialStageDone = useIQritsaStore((s) => s.markTutorialStageDone);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const stage = story.tutorialStage;

  if (story.introCompleted && stage === "done") return null;

  const steps = [
    { n: 1, label: "Лаборатория", done: stage !== "lab" },
    { n: 2, label: "Накорми курицу", done: ["incubator", "collection", "done"].includes(stage) },
    { n: 3, label: "Инкубатор", done: ["collection", "done"].includes(stage) },
    { n: 4, label: "Коллекция", done: stage === "done" },
  ];

  const stepHint =
    stage === "lab" ? "Шаг 1/4: Реши задачу в Лаборатории." :
    stage === "feed" ? "Шаг 2/4: Вернись в Сарай и накорми IQюрицу." :
    stage === "incubator" ? "Шаг 3/4: Перейди в Инкубатор и пробуди яйцо." :
    stage === "collection" ? "Шаг 4/4: Открой Коллекцию и проверь трофей." :
    "Туториал завершён!";

  const handleBtn = () => {
    if (!story.tutorialStarted) {
      startTutorial();
      setScreen("laboratory");
      return;
    }
    if (stage === "feed") setScreen("barn");
    if (stage === "incubator") setScreen("incubator");
    if (stage === "collection") setScreen("collection");
    if (stage === "done") markTutorialStageDone("done");
  };

  const btnLabel = story.tutorialStarted ? "Перейти к текущему шагу →" : "🐔 Начать первый день";

  return (
    <div className="iq-overlay">
      <div style={{
        background: "linear-gradient(180deg, #2e1c0c, #1e1208)",
        border: "3px solid #c8a050",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 360,
        boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,160,80,0.2)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐔</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#ffe5a0", marginBottom: 4 }}>
            Первый день с IQюрицей
          </div>
          <div style={{ fontSize: 12, color: "#c09060" }}>
            Задача → зерно → кормление → яйцо
          </div>
        </div>

        {/* Lore */}
        <div style={{
          background: "rgba(255,200,80,0.08)",
          border: "1.5px solid #4a2e14",
          borderRadius: 14,
          padding: "12px 14px",
          fontSize: 13,
          color: "#c09060",
          lineHeight: 1.6,
          marginBottom: 16,
        }}>
          Ночью из лаборатории №9 сбежала мутировавшая курица-гений.
          Профессор Клюв Перышкин выдаёт нейрозёрна только за решённые задачи.
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {steps.map((step) => (
            <div key={step.n} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: step.done ? 0.6 : 1,
            }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: "50%",
                background: step.done
                  ? "linear-gradient(135deg, #40a030, #208010)"
                  : "linear-gradient(135deg, #c8a050, #8a6020)",
                border: "2px solid",
                borderColor: step.done ? "#30a020" : "#f2bb2f",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: "#fff",
                flexShrink: 0,
              }}>
                {step.done ? "✓" : step.n}
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: step.done ? "#60a050" : "#ffe5a0",
                textDecoration: step.done ? "line-through" : "none",
              }}>
                {step.label}
              </div>
            </div>
          ))}
        </div>

        {/* Current hint */}
        <div style={{
          background: "rgba(200,160,30,0.15)",
          border: "1.5px solid #a07820",
          borderRadius: 12,
          padding: "10px 14px",
          fontSize: 13,
          fontWeight: 700,
          color: "#f2c040",
          marginBottom: 16,
        }}>
          📍 {stepHint}
        </div>

        {/* CTA */}
        <button className="iq-cta-button" onClick={handleBtn}>
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
