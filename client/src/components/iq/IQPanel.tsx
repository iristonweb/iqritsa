import type { PropsWithChildren } from "react";
import { panelStyle } from "@/theme/components";

interface IQPanelProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function IQPanel({ title, subtitle, className, children }: IQPanelProps) {
  return (
    <section style={panelStyle} className={`p-4 md:p-5 ${className ?? ""}`}>
      {title && <h3 className="iq-title text-lg md:text-xl">{title}</h3>}
      {subtitle && <p className="iq-subtitle mb-3">{subtitle}</p>}
      {children}
    </section>
  );
}
