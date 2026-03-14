import { useEffect, useRef } from "react";
import "@fontsource/inter";
import GameHub from "./components/game/GameHub";
import PuzzleArea from "./components/game/PuzzleArea";
import { useIQGame } from "./lib/stores/useIQGame";
import { useGameAudio } from "./hooks/useGameAudio";
import "./index.css";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ['#00ffff', '#8b5cf6', '#00ff88', '#ff3366'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function App() {
  const { gameState, initializeGame } = useIQGame();
  const { initializeAudio } = useGameAudio();

  useEffect(() => {
    initializeGame();
    initializeAudio();
  }, [initializeGame, initializeAudio]);

  return (
    <div className="w-screen h-screen circuit-bg overflow-hidden relative"
      style={{ background: '#050510' }}>
      {/* Animated particle field */}
      <ParticleField />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="animate-scan absolute inset-x-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,0.03), transparent)',
            top: 0
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-2 left-2 w-8 h-0.5 bg-cyan-400" style={{ boxShadow: '0 0 8px #00ffff' }} />
        <div className="absolute top-2 left-2 w-0.5 h-8 bg-cyan-400" style={{ boxShadow: '0 0 8px #00ffff' }} />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-2 right-2 w-8 h-0.5 bg-purple-400" style={{ boxShadow: '0 0 8px #8b5cf6' }} />
        <div className="absolute top-2 right-2 w-0.5 h-8 bg-purple-400" style={{ boxShadow: '0 0 8px #8b5cf6' }} />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute bottom-2 left-2 w-8 h-0.5 bg-green-400" style={{ boxShadow: '0 0 8px #00ff88' }} />
        <div className="absolute bottom-2 left-2 w-0.5 h-8 bg-green-400" style={{ boxShadow: '0 0 8px #00ff88' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute bottom-2 right-2 w-8 h-0.5 bg-cyan-400" style={{ boxShadow: '0 0 8px #00ffff' }} />
        <div className="absolute bottom-2 right-2 w-0.5 h-8 bg-cyan-400" style={{ boxShadow: '0 0 8px #00ffff' }} />
      </div>

      {/* Main Game UI */}
      <div className="relative w-full h-full" style={{ zIndex: 10 }}>
        {gameState === 'hub' && <GameHub />}
        {gameState === 'puzzle' && <PuzzleArea />}
      </div>
    </div>
  );
}

export default App;
