import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { goldButtonStyle, woodButtonStyle } from "@/theme/components";

interface IQButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: "wood" | "gold";
}

export default function IQButton({ variant = "wood", children, className, ...rest }: IQButtonProps) {
  return (
    <button
      {...rest}
      style={variant === "gold" ? goldButtonStyle : woodButtonStyle}
      className={`px-4 py-2 font-bold transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
