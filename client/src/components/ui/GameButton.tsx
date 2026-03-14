import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GameButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GameButton({
  children,
  onClick,
  disabled = false,
  variant = 'default',
  size = 'md',
  className = ''
}: GameButtonProps) {

  const base = `
    relative inline-flex items-center justify-center font-semibold
    rounded-lg transition-all duration-200 transform
    focus:outline-none select-none overflow-hidden
    tracking-wider uppercase text-xs
  `;

  const variants = {
    default: disabled
      ? 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
      : `
        bg-transparent border border-cyan-400 text-cyan-400
        hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]
        active:scale-95
        before:absolute before:inset-0 before:bg-cyan-400 before:opacity-0 before:transition-opacity
        hover:before:opacity-10
      `,
    secondary: disabled
      ? 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
      : `
        bg-transparent border border-purple-500 text-purple-400
        hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]
        active:scale-95
      `,
    success: disabled
      ? 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
      : `
        bg-transparent border border-green-400 text-green-400
        hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]
        active:scale-95
      `,
    danger: disabled
      ? 'bg-gray-800 text-gray-600 border border-gray-700 cursor-not-allowed'
      : `
        bg-transparent border border-red-500 text-red-400
        hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,51,102,0.6)]
        active:scale-95
      `,
    ghost: disabled
      ? 'text-gray-600 cursor-not-allowed'
      : `
        bg-transparent text-gray-400
        hover:text-cyan-400 hover:bg-cyan-400/10
        active:scale-95
      `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {/* Glitch lines on hover (only for default) */}
      {!disabled && variant === 'default' && (
        <>
          <span className="absolute top-0 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full" />
          <span className="absolute bottom-0 right-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full" />
        </>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
