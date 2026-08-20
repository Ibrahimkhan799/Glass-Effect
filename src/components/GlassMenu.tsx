import type { ReactNode } from "react";
import { Glass } from "./Glass";

export interface GlassMenuItem {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
  separator?: boolean;
}

export interface GlassMenuProps {
  items: GlassMenuItem[];
  className?: string;
}

export function GlassMenu({ items, className }: GlassMenuProps) {
  return (
    <Glass
      radius={22}
      material="regular"
      className={["ag-menu", className].filter(Boolean).join(" ")}
    >
      {items.map((item) =>
        item.separator ? (
          <div key={item.id} className="ag-menu__sep" />
        ) : (
          <button
            key={item.id}
            type="button"
            className="ag-menu__item"
            onClick={item.onSelect}
          >
            {item.label}
          </button>
        ),
      )}
    </Glass>
  );
}
