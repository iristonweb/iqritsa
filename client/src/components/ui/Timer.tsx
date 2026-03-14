import { useEffect, useState } from "react";

interface TimerProps {
  timeLeft: number;
  showWarning?: boolean;
  warningThreshold?: number;
}

export default function Timer({
  timeLeft,
  showWarning = true,
  warningThreshold = 30
}: TimerProps) {
  const [blink, setBlink] = useState(false);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = timeLeft <= warningThreshold && timeLeft > 0;
  const isDanger = timeLeft <= 10;

  useEffect(() => {
    if (isDanger) {
      const interval = setInterval(() => setBlink(b => !b), 500);
      return () => clearInterval(interval);
    }
    setBlink(false);
  }, [isDanger]);

  const color = isDanger ? '#ff3366' : isWarning ? '#ff9900' : '#00ffff';
  const progressPct = Math.max(0, (timeLeft / 120) * 100);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-sm relative"
      style={{
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${color}55`,
        boxShadow: `0 0 10px ${color}33`
      }}>

      {/* Timer icon - animated ring */}
      <div className="relative w-6 h-6">
        <svg viewBox="0 0 24 24" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="12" cy="12" r="10" stroke={color + '22'} strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="10"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 10}`}
            strokeDashoffset={`${2 * Math.PI * 10 * (1 - progressPct / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
      </div>

      {/* Time display */}
      <span
        className="font-mono font-bold text-base tracking-widest"
        style={{
          color,
          textShadow: `0 0 10px ${color}`,
          opacity: isDanger && blink ? 0.3 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        {timeLeft <= 0 ? '00:00' : formatted}
      </span>

      {/* Label */}
      <span className="text-xs tracking-widest uppercase" style={{ color: color + '88' }}>
        {timeLeft <= 0 ? 'TIMEOUT' : 'TIME'}
      </span>
    </div>
  );
}
