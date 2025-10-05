import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

export default function ProgressBar({
  progress,
  color = "#3B82F6",
  height = 8,
  animated = true,
  showPercentage = false
}: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const percentage = Math.round(progress * 100);

  return (
    <div className="w-full">
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            animated ? 'transform-gpu' : ''
          }`}
          style={{
            width: `${animatedProgress * 100}%`,
            backgroundColor: color,
            backgroundImage: animated 
              ? `linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)`
              : undefined,
            backgroundSize: animated ? '30px 30px' : undefined,
            animation: animated ? 'progress-stripe 1s linear infinite' : undefined
          }}
        />
      </div>
      
      {showPercentage && (
        <div className="text-center text-sm text-gray-600 mt-1">
          {percentage}%
        </div>
      )}
      
      <style jsx>{`
        @keyframes progress-stripe {
          from {
            background-position: 30px 0;
          }
          to {
            background-position: 0 0;
          }
        }
      `}</style>
    </div>
  );
}
