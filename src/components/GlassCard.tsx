import type { HTMLAttributes, ReactNode } from "react";
import { Glass } from "./Glass";
import type { GlassMaterial, GlassRadius } from "../types";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  radius?: GlassRadius;
  material?: GlassMaterial;
}

export function GlassCard({
  children,
  className,
  radius = 32,
  material = "regular",
  ...rest
}: GlassCardProps) {
  return (
    <Glass
      material={material}
      radius={radius}
      className={["ag-card", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Glass>
  );
}
