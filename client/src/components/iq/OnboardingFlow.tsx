import IQButton from "./IQButton";
import IQPanel from "./IQPanel";
import { useIQritsaStore } from "@/store/useIQritsaStore";

export default function OnboardingFlow() {
  const story = useIQritsaStore((s) => s.story);
  const startTutorial = useIQritsaStore((s) => s.startTutorial);
  const markTutorialStageDone = useIQritsaStore((s) => s.markTutorialStageDone);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const stage = story.tutorialStage;

  if (story.introCompleted && stage === "done") return null;

  const stageHint =
    stage === "lab"
      ? "Шаг 1/4: Реши задачу в Лаборатории."
      : stage === "feed"
        ? "Шаг 2/4: Вернись в Сарай и покорми IQюрицу."
        : stage === "incubator"
          ? "Шаг 3/4: Перейди в Инкубатор и пробуди яйцо."
          : stage === "collection"
            ? "Шаг 4/4: Открой Коллекцию и проверь трофей."
            : "Туториал завершен.";

  return (
    <div className="iq-overlay">
      <IQPanel title="Первый день с IQюрицей" subtitle="Короткий туториал: задача -> зерно -> кормление -> яйцо">
        <p className="mb-2 text-sm">
          Ночью из лаборатории №9 сбежала мутировавшая курица-гений. Профессор Клюв Перышкин выдаёт нейрозёрна только за решённые задачи.
        </p>
        <ol className="list-decimal ml-5 text-sm">
          <li>Сходи в Лабораторию и реши задачу.</li>
          <li>Накорми IQюрицу в Сарае.</li>
          <li>Разбуди яйцо в Инкубаторе.</li>
          <li>Проверь трофей в Коллекции.</li>
        </ol>
        <p className="mt-2 text-sm font-semibold">{stageHint}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <IQButton
            variant="gold"
            onClick={() => {
              if (!story.tutorialStarted) {
                startTutorial();
                setScreen("laboratory");
                return;
              }
              if (stage === "feed") setScreen("barn");
              if (stage === "incubator") setScreen("incubator");
              if (stage === "collection") setScreen("collection");
              if (stage === "done") markTutorialStageDone("done");
            }}
          >
            {story.tutorialStarted ? "Перейти к текущему шагу" : "Начать первый день"}
          </IQButton>
        </div>
      </IQPanel>
    </div>
  );
}
