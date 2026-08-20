import type { HTMLAttributes, ReactNode } from "react";
import { Glass } from "./Glass";

export interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function GlassBadge({ children, className, ...rest }: GlassBadgeProps) {
  return (
    <Glass
      as="span"
      radius="pill"
      material="tinted"
      className={["ag-badge", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Glass>
  );
}
