import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Glass } from "./Glass";
import type { GlassMaterial } from "../types";

export interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "regular" | "primary" | "ghost";
  material?: GlassMaterial;
}

const radiusForSize = { sm: 18, md: 22, lg: 26 } as const;

export function GlassButton({
  children,
  className,
  size = "md",
  variant = "regular",
  material = variant === "primary" ? "tinted" : "regular",
  ...rest
}: GlassButtonProps) {
  return (
    <Glass
      as="button"
      type="button"
      interactive
      material={material}
      radius={radiusForSize[size]}
      className={["ag-btn", `ag-btn--${size}`, `ag-btn--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Glass>
  );
}
