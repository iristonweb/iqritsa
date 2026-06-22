import type { AppScreen, StoryState } from "@/store/types";
import { getStoryBeat } from "@/content/comicLore";
import { useIQritsaStore } from "@/store/useIQritsaStore";

interface StoryArcPanelProps {
  currentScreen: AppScreen;
  story: StoryState;
}

export default function StoryArcPanel({ currentScreen, story }: StoryArcPanelProps) {
  const beat = getStoryBeat(currentScreen, story);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const setStoryMenuFrame = useIQritsaStore((s) => s.setStoryMenuFrame);
  const frameIndex = useIQritsaStore((s) => s.story.menuFrameIndex);

  const activeFrame = beat.frames[frameIndex] ?? beat.frames[0];

  return (
    <section className="iq-story-arc">
      <div className="iq-story-arc-image-wrap">
        <img src={activeFrame} alt={beat.title} className="iq-story-arc-image" />
      </div>
      <div className="iq-story-arc-content">
        <p className="iq-story-kicker">Глава {story.chapter}</p>
        <p className="iq-story-arc-title">{beat.title}</p>
        <p className="iq-story-arc-text">{beat.text}</p>
        <div className="iq-story-progress">
          <span style={{ width: `${Math.round(story.chapterProgress * 100)}%` }} />
        </div>
        <div className="iq-story-arc-controls">
          <button className="iq-continue-btn" onClick={() => setScreen(currentScreen)} type="button">
            Продолжить ▶
          </button>
          <button
            className="iq-filter-btn"
            onClick={() => setStoryMenuFrame(0)}
            disabled={frameIndex === 0}
            type="button"
          >
            Кадр 1
          </button>
          <button
            className="iq-filter-btn"
            onClick={() => setStoryMenuFrame(1)}
            disabled={frameIndex === 1}
            type="button"
          >
            Кадр 2
          </button>
        </div>
      </div>
    </section>
  );
}
