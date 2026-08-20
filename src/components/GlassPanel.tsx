import type { HTMLAttributes, ReactNode } from "react";
import { Glass } from "./Glass";
import type { GlassMaterial, GlassRadius } from "../types";

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  radius?: GlassRadius;
  material?: GlassMaterial;
}

export function GlassPanel({
  children,
  className,
  radius = 24,
  material = "regular",
  ...rest
}: GlassPanelProps) {
  return (
    <Glass
      material={material}
      radius={radius}
      className={["ag-panel", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Glass>
  );
}
