import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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
  const [isBlinking, setIsBlinking] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Blink animation for low time
  useEffect(() => {
    if (showWarning && timeLeft <= warningThreshold && timeLeft > 0) {
      setIsBlinking(true);
      const interval = setInterval(() => {
        setIsBlinking(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setIsBlinking(false);
    }
  }, [timeLeft, showWarning, warningThreshold]);

  const getTimerColor = () => {
    if (timeLeft <= 0) return 'text-gray-400';
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= warningThreshold) return 'text-orange-500';
    return 'text-green-600';
  };

  const getBackgroundColor = () => {
    if (timeLeft <= 0) return 'bg-gray-100';
    if (timeLeft <= 10) return 'bg-red-50';
    if (timeLeft <= warningThreshold) return 'bg-orange-50';
    return 'bg-green-50';
  };

  const getBorderColor = () => {
    if (timeLeft <= 0) return 'border-gray-300';
    if (timeLeft <= 10) return 'border-red-300';
    if (timeLeft <= warningThreshold) return 'border-orange-300';
    return 'border-green-300';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
      getBackgroundColor()
    } ${
      getBorderColor()
    } ${
      isBlinking ? 'animate-pulse' : ''
    }`}>
      <Clock 
        size={18} 
        className={getTimerColor()} 
      />
      
      <span className={`font-mono font-bold text-lg ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
      
      {/* Visual progress indicator */}
      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            timeLeft <= 10 ? 'bg-red-500' : 
            timeLeft <= warningThreshold ? 'bg-orange-500' : 
            'bg-green-500'
          }`}
          style={{
            width: `${Math.max(0, (timeLeft / 120) * 100)}%` // Assuming max 2 minutes
          }}
        />
      </div>
      
      {timeLeft <= 0 && (
        <span className="text-xs text-gray-500 ml-1">
          Время вышло!
        </span>
      )}
    </div>
  );
}
