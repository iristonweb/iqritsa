import type { PropsWithChildren } from "react";
import type { AppScreen, StoryState } from "@/store/types";
import { comicScreenArt } from "@/content/comicScreenArt";
import StoryArcPanel from "./StoryArcPanel";

interface ComicFunctionFrameProps extends PropsWithChildren {
  screen: AppScreen;
  story: StoryState;
}

export default function ComicFunctionFrame({ screen, story, children }: ComicFunctionFrameProps) {
  const art = comicScreenArt[screen];
  return (
    <section className={`iq-comic-frame iq-comic-frame-${screen}`} aria-label={`${art.title} screen`}>
      <header className="iq-comic-hero">
        <img src={art.image} alt={art.title} className="iq-comic-hero-image" />
        <div className="iq-comic-hero-copy">
          <p className="iq-comic-kicker">{art.kicker}</p>
          <h2 className="iq-comic-hero-title">{art.title}</h2>
          <p className="iq-comic-hero-subtitle">{art.subtitle}</p>
        </div>
      </header>
      <StoryArcPanel currentScreen={screen} story={story} />
      <div className={`iq-comic-frame-content iq-scenario-bg iq-scenario-bg-${screen}`}>{children}</div>
    </section>
  );
}
