import { useEffect, useState } from "react";
import IQButton from "@/components/iq/IQButton";
import { comicSlides } from "@/content/comicLore";

interface ComicIntroOverlayProps {
  open: boolean;
  onComplete: () => void;
}

export default function ComicIntroOverlay({ open, onComplete }: ComicIntroOverlayProps) {
  const [index, setIndex] = useState(0);
  const slide = comicSlides[index];
  const isLast = index === comicSlides.length - 1;

  useEffect(() => {
    if (!open) return;
    setIndex(0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="iq-comic-overlay">
      <div className="iq-comic-modal">
        <p className="iq-comic-kicker">История IQюрицы</p>
        <h2 className="iq-title text-xl">{slide.title}</h2>
        <img src={slide.image} alt={slide.title} className="iq-comic-image" />
        <p className="text-sm mt-3">{slide.text}</p>
        <p className="text-xs mt-2 opacity-75">
          Страница {index + 1} из {comicSlides.length}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <IQButton onClick={onComplete}>Пропустить сюжет</IQButton>
          {index > 0 && <IQButton onClick={() => setIndex((prev) => prev - 1)}>Назад</IQButton>}
          {!isLast && (
            <IQButton variant="gold" onClick={() => setIndex((prev) => prev + 1)}>
              Далее
            </IQButton>
          )}
          {isLast && (
            <IQButton variant="gold" onClick={onComplete}>
              Начать игру
            </IQButton>
          )}
        </div>
      </div>
    </div>
  );
}
