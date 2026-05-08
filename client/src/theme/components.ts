import type { CSSProperties } from "react";
import { iqTheme } from "./tokens";

export const panelStyle: CSSProperties = {
  background: `linear-gradient(180deg, ${iqTheme.colors.panel}, #f8eacf)`,
  border: `2px solid ${iqTheme.colors.wood}`,
  borderRadius: iqTheme.radius.card,
  boxShadow: iqTheme.shadows.card,
};

export const woodButtonStyle: CSSProperties = {
  background: `linear-gradient(180deg, #a87543, ${iqTheme.colors.wood})`,
  color: "#fff7e8",
  border: `2px solid ${iqTheme.colors.woodDark}`,
  borderRadius: iqTheme.radius.button,
  boxShadow: iqTheme.shadows.soft,
};

export const goldButtonStyle: CSSProperties = {
  background: `linear-gradient(180deg, #ffe07d, ${iqTheme.colors.gold})`,
  color: iqTheme.colors.ink,
  border: "2px solid #c08114",
  borderRadius: iqTheme.radius.button,
  boxShadow: iqTheme.shadows.glowGold,
};
