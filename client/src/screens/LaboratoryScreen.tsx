import { useEffect, useState } from "react";
import { useIQritsaStore } from "@/store/useIQritsaStore";

const rooms = [
  { id: "logic", label: "🧩 Логика" },
  { id: "memory", label: "🧠 Память" },
  { id: "spatial", label: "🗺️ Простр." },
  { id: "chaos", label: "🌀 Хаос" },
  { id: "duel", label: "⚔️ Дуэль" },
] as const;

export default function LaboratoryScreen() {
  const room = useIQritsaStore((s) => s.activeLabRoom);
  const message = useIQritsaStore((s) => s.professorMessage);
  const setRoom = useIQritsaStore((s) => s.setLabRoom);
  const submitLabAnswer = useIQritsaStore((s) => s.submitLabAnswer);
  const playProfessorDuel = useIQritsaStore((s) => s.playProfessorDuel);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const grainByType = useIQritsaStore((s) => s.resources.grainByType);
  const labChallenge = useIQritsaStore((s) => s.labChallenge);
  const neurograins = useIQritsaStore((s) => s.resources.neurograins);
  const [answerInput, setAnswerInput] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    setAnswerInput("");
    setAnswerFeedback(null);
    setFeedbackType(null);
  }, [room, labChallenge?.id]);

  const handleSubmit = () => {
    const success = submitLabAnswer(answerInput);
    if (success) {
      setAnswerFeedback("✅ Верно! Нейрозёрна начислены.");
      setFeedbackType("success");
    } else {
      setAnswerFeedback("❌ Почти. Попробуй ещё одну задачу.");
      setFeedbackType("error");
    }
  };

  const grainTypes = [
    { key: "logic", label: "Логика", icon: "🧩", value: grainByType.logic },
    { key: "memory", label: "Память", icon: "🧠", value: grainByType.memory },
    { key: "spatial", label: "Простр.", icon: "🗺️", value: grainByType.spatial },
    { key: "chaos", label: "Хаос", icon: "🌀", value: grainByType.chaos },
  ];

  return (
    <div className="iq-screen-root">
      {/* Header panel */}
      <div className="iq-panel">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48,
            background: "linear-gradient(135deg, #0a1a2a, #0d2035)",
            border: "3px solid #2a6090",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>🔬</div>
          <div>
            <div className="iq-panel-title">Лаборатория №9</div>
            <div className="iq-panel-sub">Профессор Клюв Перышкин ждёт</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#c09060" }}>Нейрозёрна</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#ffe5a0" }}>🥚 {neurograins}</div>
          </div>
        </div>

        {/* Room selector pills */}
        <div className="lab-room-pills">
          {rooms.map((item) => (
            <button
              key={item.id}
              className={`lab-pill ${room === item.id ? "active" : ""}`}
              onClick={() => setRoom(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge panel */}
      {room !== "duel" && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 10 }}>
            Задача #{labChallenge?.type ?? "logic_sequence"}
          </div>

          <div className="iq-task-card" style={{ marginBottom: 12 }}>
            <div className="iq-task-card-title">
              {labChallenge?.text ?? "Разгадай закономерность"}
            </div>
            {labChallenge?.hint && (
              <div style={{ fontSize: 12, color: "#9a7040", marginTop: 4 }}>
                💡 {labChallenge.hint}
              </div>
            )}
            {labChallenge?.options && labChallenge.options.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {labChallenge.options.slice(0, 6).map((opt) => (
                  <button
                    key={String(opt)}
                    className={`iq-filter-btn ${answerInput === String(opt) ? "active" : ""}`}
                    onClick={() => setAnswerInput(String(opt))}
                  >
                    {String(opt)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Answer input */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              className="iq-input"
              placeholder="Введите ответ..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Feedback */}
          {answerFeedback && (
            <div style={{
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
              background: feedbackType === "success" ? "rgba(40,120,40,0.25)" : "rgba(120,30,20,0.25)",
              border: `1.5px solid ${feedbackType === "success" ? "#40a030" : "#a03020"}`,
              color: feedbackType === "success" ? "#80e060" : "#e06050",
            }}>
              {answerFeedback}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="iq-cta-button" style={{ flex: 1 }} onClick={handleSubmit}>
              <span>🥚</span> Ответить
            </button>
            <button className="iq-btn" onClick={() => setScreen("barn")}>
              ← Сарай
            </button>
          </div>
        </div>
      )}

      {/* Duel panel */}
      {room === "duel" && (
        <div className="iq-panel">
          <div className="iq-panel-title" style={{ marginBottom: 10 }}>⚔️ Спор у Профессора</div>
          <div className="iq-task-card" style={{ marginBottom: 12 }}>
            <div className="iq-task-card-title">
              Какое следующее число после 1, 1, 2, 3, 5, 8?
            </div>
            <div style={{ fontSize: 12, color: "#9a7040", marginTop: 4 }}>
              💡 Числа Фибоначчи
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              className="iq-input"
              placeholder="Ответ"
            />
          </div>
          <button className="iq-cta-button" onClick={() => playProfessorDuel(answerInput.trim() === "13", 8)}>
            <span>⚔️</span> Запустить дуэль
          </button>
        </div>
      )}

      {/* Professor message */}
      {message && (
        <div className="iq-panel">
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28 }}>🦆</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#c8a060", marginBottom: 3 }}>
                Профессор Клюв Перышкин
              </div>
              <div style={{ fontSize: 13, color: "#e0c090", lineHeight: 1.5 }}>{message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Grain stats */}
      <div className="iq-panel">
        <div className="iq-panel-title" style={{ marginBottom: 10 }}>📊 Нейрозёрна по типам</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Логика", icon: "🧩", value: grainByType.logic },
            { label: "Память", icon: "🧠", value: grainByType.memory },
            { label: "Пространство", icon: "🗺️", value: grainByType.spatial },
            { label: "Хаос", icon: "🌀", value: grainByType.chaos },
          ].map((g) => (
            <div key={g.label} style={{
              background: "rgba(255,200,80,0.07)",
              border: "1.5px solid #4a2e14",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "#9a7040" }}>{g.label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#ffe5a0" }}>{g.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
