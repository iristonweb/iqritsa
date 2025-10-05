import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface GameButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'danger' | 'success';
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
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'default':
        return disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl';
      case 'secondary':
        return disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50';
      case 'danger':
        return disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl';
      case 'success':
        return disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl';
      default:
        return '';
    }
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-semibold rounded-lg transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50',
        getVariantStyles(variant),
        getSizeStyles(size),
        !disabled && 'hover:scale-105',
        className
      )}
    >
      {children}
    </button>
  );
}
