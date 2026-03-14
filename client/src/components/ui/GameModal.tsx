import { ReactNode, useEffect } from "react";
import GameButton from "./GameButton";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  accentColor?: 'cyan' | 'purple' | 'green' | 'red';
}

export default function GameModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  accentColor = 'cyan'
}: GameModalProps) {

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && showCloseButton) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showCloseButton]);

  if (!isOpen) return null;

  const accentColors = {
    cyan: { border: '#00ffff', glow: 'rgba(0,255,255,0.3)', text: 'text-cyan-400', bg: 'rgba(0,255,255,0.05)' },
    purple: { border: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', text: 'text-purple-400', bg: 'rgba(139,92,246,0.05)' },
    green: { border: '#00ff88', glow: 'rgba(0,255,136,0.3)', text: 'text-green-400', bg: 'rgba(0,255,136,0.05)' },
    red: { border: '#ff3366', glow: 'rgba(255,51,102,0.3)', text: 'text-red-400', bg: 'rgba(255,51,102,0.05)' },
  };

  const accent = accentColors[accentColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={showCloseButton ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(5,5,20,0.95)',
          border: `1px solid ${accent.border}`,
          boxShadow: `0 0 30px ${accent.glow}, 0 0 60px ${accent.glow}33, inset 0 0 30px ${accent.bg}`,
          borderRadius: '4px'
        }}>

        {/* Top scan line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${accent.border}, transparent)` }} />

        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-3 h-3">
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: accent.border }} />
          <div className="absolute top-0 left-0 h-full w-px" style={{ background: accent.border }} />
        </div>
        <div className="absolute top-1 right-1 w-3 h-3">
          <div className="absolute top-0 right-0 w-full h-px" style={{ background: accent.border }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ background: accent.border }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: accent.border + '33' }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-neon-pulse"
              style={{ background: accent.border, boxShadow: `0 0 8px ${accent.border}` }} />
            <h2 className={`text-sm font-bold tracking-widest uppercase ${accent.text}`}
              style={{ textShadow: `0 0 10px ${accent.border}` }}>
              {title}
            </h2>
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Bottom scan line */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${accent.border}44, transparent)` }} />
      </div>
    </div>
  );
}
