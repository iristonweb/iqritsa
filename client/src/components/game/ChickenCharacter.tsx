import { useEffect, useState } from "react";
import { useChicken } from "../../lib/stores/useChicken";

interface ChickenCharacterProps {
  stage: number;
}

export default function ChickenCharacter({ stage }: ChickenCharacterProps) {
  const { mood } = useChicken();
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when mood changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [mood]);

  const getChickenStyle = (stage: number, mood: string) => {
    const baseSize = 120 + (stage * 20); // Grows with intelligence
    let transform = `scale(${1 + stage * 0.1})`;
    let filter = 'none';

    // Mood animations
    if (isAnimating) {
      switch (mood) {
        case 'happy':
          transform += ' rotate(5deg)';
          filter = 'drop-shadow(0 0 10px gold)';
          break;
        case 'thinking':
          transform += ' rotate(-2deg)';
          filter = 'drop-shadow(0 0 8px blue)';
          break;
        case 'confused':
          transform += ' rotate(1deg) scale(0.95)';
          filter = 'drop-shadow(0 0 6px red)';
          break;
      }
    }

    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      transform,
      filter,
      transition: 'all 0.3s ease-in-out'
    };
  };

  const getChickenEmoji = (stage: number) => {
    const chickens = ['🐣', '🐤', '🐥', '🐓', '🦅', '🧠🐓', '👽🐓', '🌟🧠🐓'];
    return chickens[Math.min(stage, chickens.length - 1)];
  };

  const getAccessories = (stage: number) => {
    const accessories = [];
    
    if (stage >= 1) accessories.push('👓'); // Glasses
    if (stage >= 3) accessories.push('🎓'); // Graduation cap
    if (stage >= 5) accessories.push('🔬'); // Science equipment
    if (stage >= 6) accessories.push('🚀'); // Rocket/space theme
    if (stage >= 7) accessories.push('⚡'); // Energy/power
    
    return accessories;
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Chicken Character */}
      <div 
        className="relative text-8xl cursor-pointer hover:scale-105 transition-transform"
        style={getChickenStyle(stage, mood)}
        title={`Клепа - Стадия ${stage + 1}`}
      >
        {getChickenEmoji(stage)}
      </div>

      {/* Accessories */}
      <div className="absolute -top-4 -right-4 flex space-x-1">
        {getAccessories(stage).map((accessory, index) => (
          <span key={index} className="text-2xl animate-bounce" style={{
            animationDelay: `${index * 0.2}s`
          }}>
            {accessory}
          </span>
        ))}
      </div>

      {/* Mood Indicator */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Настроение:</div>
        <div className="flex items-center justify-center space-x-2">
          {mood === 'happy' && <span className="text-2xl animate-bounce">😄</span>}
          {mood === 'thinking' && <span className="text-2xl animate-pulse">🤔</span>}
          {mood === 'confused' && <span className="text-2xl animate-spin">😵‍💫</span>}
          {mood === 'excited' && <span className="text-2xl animate-bounce">🤩</span>}
          {mood === 'neutral' && <span className="text-2xl">😐</span>}
        </div>
      </div>

      {/* Speech Bubble for Story/Hints */}
      {isAnimating && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 border-2 border-gray-300 shadow-lg animate-fade-in-out">
          <div className="text-sm text-center">
            {mood === 'happy' && "Отлично!"}
            {mood === 'thinking' && "Размышляю..."}
            {mood === 'confused' && "Хм, сложно..."}
            {mood === 'excited' && "Новый уровень!"}
          </div>
          {/* Speech bubble tail */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300"></div>
        </div>
      )}
    </div>
  );
}
