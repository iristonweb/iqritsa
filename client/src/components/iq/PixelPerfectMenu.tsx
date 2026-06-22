import type { AppScreen } from "@/store/types";
import { getStoryNeighborScreen, storyMenuConfig, type MenuZoneShape, type MenuZoneSpec } from "@/content/menuScenarios";
import { useIQritsaStore } from "@/store/useIQritsaStore";
import { useEffect, useMemo, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

interface RenderZone extends MenuZoneSpec {
  key: string;
  points: Point[];
}

function roundedRectPolygon(x: number, y: number, w: number, h: number, radius: number): Point[] {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  const step = Math.PI / 6;
  const points: Point[] = [];
  const arc = (cx: number, cy: number, start: number, end: number) => {
    const dir = start < end ? 1 : -1;
    for (
      let angle = start;
      dir > 0 ? angle <= end + 0.0001 : angle >= end - 0.0001;
      angle = angle + dir * step
    ) {
      points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
  };

  arc(x + r, y + r, Math.PI, Math.PI * 1.5);
  arc(x + w - r, y + r, Math.PI * 1.5, Math.PI * 2);
  arc(x + w - r, y + h - r, 0, Math.PI * 0.5);
  arc(x + r, y + h - r, Math.PI * 0.5, Math.PI);
  return points;
}

function polygonFromZone(zone: MenuZoneSpec): Point[] {
  const { x, y, w, h } = zone;
  const shape: MenuZoneShape = zone.shape;
  if (shape === "pill") return roundedRectPolygon(x, y, w, h, h * 0.5);
  if (shape === "panel") return roundedRectPolygon(x, y, w, h, Math.min(w, h) * 0.22);
  if (shape === "tab") {
    const topInset = w * 0.09;
    const bottomInset = w * 0.03;
    const shoulderY = h * 0.28;
    return [
      { x: x + topInset, y },
      { x: x + w - topInset, y },
      { x: x + w, y: y + shoulderY },
      { x: x + w - bottomInset, y: y + h },
      { x: x + bottomInset, y: y + h },
      { x, y: y + shoulderY },
    ];
  }
  const cut = Math.min(w, h) * 0.18;
  return [
    { x: x + cut, y },
    { x: x + w - cut, y },
    { x: x + w, y: y + cut },
    { x: x + w, y: y + h - cut },
    { x: x + w - cut, y: y + h },
    { x: x + cut, y: y + h },
    { x, y: y + h - cut },
    { x, y: y + cut },
  ];
}

function drawPolygon(ctx: CanvasRenderingContext2D, points: Point[], width: number, height: number) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo((points[0].x / 100) * width, (points[0].y / 100) * height);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo((points[i].x / 100) * width, (points[i].y / 100) * height);
  }
  ctx.closePath();
}

function toClipPath(points: Point[]): string {
  return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(",")})`;
}

export default function PixelPerfectMenu() {
  const currentScreen = useIQritsaStore((s) => s.currentScreen);
  const storyFrameIndex = useIQritsaStore((s) => s.story.menuFrameIndex);
  const setScreen = useIQritsaStore((s) => s.setScreen);
  const completeStoryStep = useIQritsaStore((s) => s.completeStoryStep);
  const toggleStoryMenuFrame = useIQritsaStore((s) => s.toggleStoryMenuFrame);
  const [hoveredZoneKey, setHoveredZoneKey] = useState<string | null>(null);
  const [pressedZoneKey, setPressedZoneKey] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldShowDebugZones =
    typeof window !== "undefined" &&
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("debugHitzones") === "1";
  const imageSrc = storyMenuConfig.imageByFrame[storyFrameIndex] ?? "/ui/pixel-story-menu.png";
  const zones = useMemo<RenderZone[]>(
    () =>
      storyMenuConfig.zones.map((zone, index) => ({
        ...zone,
        key: `story-${zone.id}-${index}`,
        points: polygonFromZone(zone),
      })),
    []
  );

  useEffect(() => {
    const image = new Image();
    image.decoding = "async";
    image.src = imageSrc;
    image.onload = () => setLoadedImage(image);
  }, [imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      if (loadedImage) {
        context.drawImage(loadedImage, 0, 0, width, height);
      } else {
        context.fillStyle = "#120b07";
        context.fillRect(0, 0, width, height);
      }

      for (const zone of zones) {
        const isPressed = pressedZoneKey === zone.key || hoveredZoneKey === zone.key;
        if (!isPressed && !shouldShowDebugZones) continue;
        drawPolygon(context, zone.points, width, height);
        context.fillStyle = shouldShowDebugZones ? "rgba(255, 209, 99, 0.12)" : "rgba(26, 16, 9, 0.24)";
        context.fill();
        if (shouldShowDebugZones) {
          context.strokeStyle = "rgba(255, 224, 141, 0.82)";
          context.lineWidth = 1.2;
          context.stroke();
        }
      }
    };

    render();
    const observer = new ResizeObserver(() => render());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [loadedImage, zones, hoveredZoneKey, pressedZoneKey, shouldShowDebugZones]);

  const runMenuAction = (zone: RenderZone) => {
    const { action } = zone;
    if (action.type === "screen" && action.targetScreen) {
      setScreen(action.targetScreen);
      return;
    }
    if (action.type === "storyPrev") {
      setScreen(getStoryNeighborScreen(currentScreen, -1));
      return;
    }
    if (action.type === "storyNext") {
      setScreen(getStoryNeighborScreen(currentScreen, 1));
      return;
    }
    if (action.type === "frameToggle") {
      toggleStoryMenuFrame();
      return;
    }
    if (action.type === "progressChapter") {
      completeStoryStep(action.chapterStep ?? 0.2);
      if (action.targetScreen) setScreen(action.targetScreen);
    }
  };

  return (
    <section className="iq-pixel-menu story-mode" aria-label="Главное меню IQюрицы">
      <canvas ref={canvasRef} className="iq-pixel-canvas" aria-hidden="true" />
      <div className="iq-pixel-hit-layer" aria-hidden="true">
        {zones.map((zone) => (
          <button
            key={zone.key}
            type="button"
            aria-label={zone.label}
            className="iq-hit-zone iq-hit-zone-contour"
            style={{ clipPath: toClipPath(zone.points), WebkitClipPath: toClipPath(zone.points) }}
            onMouseEnter={() => setHoveredZoneKey(zone.key)}
            onMouseLeave={() => setHoveredZoneKey((current) => (current === zone.key ? null : current))}
            onPointerDown={() => setPressedZoneKey(zone.key)}
            onPointerUp={() => {
              setPressedZoneKey(null);
              runMenuAction(zone);
            }}
          />
        ))}
      </div>
      <nav className="iq-visually-hidden" aria-label="Навигация по сегментам меню">
        {zones.map((zone) => (
          <button key={`a11y-${zone.key}`} type="button" onClick={() => runMenuAction(zone)}>
            {zone.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
