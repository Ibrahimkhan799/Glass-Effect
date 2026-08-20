import type { ReactNode } from "react";
import { Glass } from "./Glass";

export interface GlassDockItem {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export interface GlassDockProps {
  items: GlassDockItem[];
  className?: string;
}

export function GlassDock({ items, className }: GlassDockProps) {
  return (
    <Glass
      radius={32}
      material="regular"
      className={["ag-dock", className].filter(Boolean).join(" ")}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="ag-dock__item"
          aria-label={item.label}
          onClick={item.onClick}
        >
          {item.icon}
        </button>
      ))}
    </Glass>
  );
}
