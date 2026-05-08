import { useEffect, useState } from "react";
import IQButton from "@/components/iq/IQButton";
import IQPanel from "@/components/iq/IQPanel";
import { useIQritsaStore } from "@/store/useIQritsaStore";

const rooms = [
  { id: "logic", label: "Логика" },
  { id: "memory", label: "Память" },
  { id: "spatial", label: "Пространство" },
  { id: "chaos", label: "Хаос" },
  { id: "duel", label: "Дуэльная" },
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
  const [answerInput, setAnswerInput] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);

  useEffect(() => {
    setAnswerInput("");
    setAnswerFeedback(null);
  }, [room, labChallenge?.id]);

  return (
    <div className="iq-screen-grid">
      <IQPanel title="Лаборатория №9" subtitle="Профессор Першкин уже подготовил задачу">
        <div className="flex flex-wrap gap-2 mb-4">
          {rooms.map((item) => (
            <IQButton key={item.id} className={room === item.id ? "ring-2 ring-[#f2bb2f]" : ""} onClick={() => setRoom(item.id)}>
              {item.label}
            </IQButton>
          ))}
        </div>
        {room !== "duel" && (
          <>
            <div className="iq-task-card mb-3">
              <p className="font-semibold">Тип: {labChallenge?.type ?? "logic_sequence"}</p>
              <p className="text-sm mt-1">{labChallenge?.text ?? "Разгадай закономерность"}</p>
              <p className="text-xs mt-1 opacity-80">Подсказка: {labChallenge?.hint ?? "Подумай о паттерне."}</p>
              {labChallenge?.options && labChallenge.options.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {labChallenge.options.slice(0, 6).map((opt) => (
                    <button key={String(opt)} className="iq-filter-btn" onClick={() => setAnswerInput(String(opt))}>
                      {String(opt)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                className="iq-input"
                placeholder="Введите ответ"
              />
              <IQButton
                variant="gold"
                onClick={() => {
                  const success = submitLabAnswer(answerInput);
                  setAnswerFeedback(success ? "Верно! Нейрозёрна начислены." : "Почти. Попробуй ещё одну задачу.");
                }}
              >
                Отправить
              </IQButton>
              <IQButton onClick={() => setScreen("barn")}>К Сараю</IQButton>
            </div>
            {answerFeedback && <p className="text-sm mt-2">{answerFeedback}</p>}
          </>
        )}
        {room === "duel" && (
          <div className="iq-task-card">
            <p className="mb-2 text-sm">Спор у Профессора: реши короткую задачу быстрее соперника.</p>
            <p className="text-sm mb-2">Вопрос дуэли: какое следующее число после 1, 1, 2, 3, 5, 8?</p>
            <div className="flex gap-2 flex-wrap items-center">
              <input className="iq-input" value={answerInput} onChange={(e) => setAnswerInput(e.target.value)} placeholder="Ответ" />
              <IQButton variant="gold" onClick={() => playProfessorDuel(answerInput.trim() === "13", 8)}>Запустить дуэль</IQButton>
              <IQButton onClick={() => setScreen("arena")}>К Арене</IQButton>
            </div>
          </div>
        )}
      </IQPanel>

      <IQPanel title="Голограмма профессора">
        <p>{message}</p>
        <p className="mt-2 text-sm">
          Зёрна по типам: Логика {grainByType.logic}, Память {grainByType.memory}, Пространство {grainByType.spatial}, Хаос {grainByType.chaos}
        </p>
      </IQPanel>
    </div>
  );
}
