import { useEffect, useRef, useState, Component, ErrorInfo, ReactNode } from "react";

interface BrainVisualizationProps {
  stage: number;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.log('Brain 3D error:', error); }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function NeuralBrainCanvas({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = 200;
    const H = canvas.height = 200;
    const cx = W / 2, cy = H / 2;

    const iq = 50 + stage * 25;
    const neuronCount = 5 + stage * 4;
    const colors = ['#00ffff', '#8b5cf6', '#00ff88', '#ff3366', '#ffd700'];
    const stageColor = colors[Math.min(stage, colors.length - 1)];

    // Pre-calculate neuron positions
    const neurons = Array.from({ length: neuronCount }, (_, i) => {
      const angle = (i / neuronCount) * Math.PI * 2;
      const r = 30 + Math.random() * 50;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        r: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    let animId: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.02;

      // Draw brain shape (two lobes)
      const brainSize = 55 + stage * 4;
      const gradient = ctx.createRadialGradient(cx - 10, cy - 5, 0, cx, cy, brainSize);
      gradient.addColorStop(0, stageColor + '33');
      gradient.addColorStop(0.6, stageColor + '11');
      gradient.addColorStop(1, 'transparent');

      // Left lobe
      ctx.beginPath();
      ctx.ellipse(cx - 15, cy, brainSize * 0.65, brainSize * 0.75, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = stageColor + '55';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right lobe
      ctx.beginPath();
      ctx.ellipse(cx + 15, cy, brainSize * 0.65, brainSize * 0.75, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = stageColor + '44';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Brain fold lines
      const folds = [
        [cx - 30, cy - 20, cx - 10, cy + 10],
        [cx - 40, cy + 5, cx - 20, cy + 25],
        [cx + 10, cy - 20, cx + 30, cy + 10],
        [cx + 20, cy + 5, cx + 40, cy + 25],
        [cx - 5, cy - 40, cx + 5, cy + 40],
      ];
      folds.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo((x1 + x2) / 2 + 10, (y1 + y2) / 2, x2, y2);
        ctx.strokeStyle = stageColor + '33';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw connections between neurons
      neurons.forEach((n1, i) => {
        neurons.slice(i + 1).forEach(n2 => {
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            const pulse = (Math.sin(t * 2 + n1.phase) + 1) / 2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = stageColor + Math.floor(pulse * 80 + 20).toString(16).padStart(2, '0');
            ctx.lineWidth = pulse * 1.5;
            ctx.stroke();
          }
        });
      });

      // Draw neurons
      neurons.forEach(n => {
        const pulse = (Math.sin(t * n.speed + n.phase) + 1) / 2;
        const r = n.r * (0.7 + pulse * 0.5);

        const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
        ng.addColorStop(0, n.color + 'cc');
        ng.addColorStop(0.4, n.color + '66');
        ng.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = ng;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      // Center pulse
      const centralPulse = (Math.sin(t * 1.5) + 1) / 2;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15 + centralPulse * 10);
      cg.addColorStop(0, stageColor + 'cc');
      cg.addColorStop(0.5, stageColor + '44');
      cg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 15 + centralPulse * 10, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      // IQ text
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = stageColor;
      ctx.textAlign = 'center';
      ctx.shadowColor = stageColor;
      ctx.shadowBlur = 10;
      ctx.fillText(`IQ: ${iq}`, cx, H - 8);
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="w-full h-full"
    />
  );
}

export default function BrainVisualization({ stage }: BrainVisualizationProps) {
  return (
    <ErrorBoundary fallback={<NeuralBrainCanvas stage={stage} />}>
      <NeuralBrainCanvas stage={stage} />
    </ErrorBoundary>
  );
}
