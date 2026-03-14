import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
  glowColor?: string;
}

export default function ProgressBar({
  progress,
  color = "#00ffff",
  height = 6,
  animated = true,
  showPercentage = false,
  glowColor
}: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const percentage = Math.round(animatedProgress * 100);
  const glow = glowColor || color;

  return (
    <div className="w-full">
      <div
        className="w-full rounded-sm relative overflow-hidden"
        style={{ height: `${height}px`, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${glow}11 0px, ${glow}11 1px, transparent 1px, transparent 10px)`,
          }} />

        {/* Progress fill */}
        <div
          className="h-full rounded-sm transition-all duration-700 ease-out relative"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}88, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${glow}, 0 0 16px ${glow}44`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-sm"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'progress-flow 2s linear infinite',
              backgroundSize: '200% 100%'
            }} />
        </div>
      </div>

      {showPercentage && (
        <div className="text-right text-xs mt-1" style={{ color, textShadow: `0 0 6px ${glow}` }}>
          {percentage}%
        </div>
      )}
    </div>
  );
}
