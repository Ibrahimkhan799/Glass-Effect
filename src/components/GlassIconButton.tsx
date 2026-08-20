import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Glass } from "./Glass";
import type { GlassMaterial } from "../types";

export interface GlassIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  size?: number;
  material?: GlassMaterial;
}

export function GlassIconButton({
  children,
  className,
  size = 64,
  material = "regular",
  style,
  ...rest
}: GlassIconButtonProps) {
  const merged: CSSProperties = {
    width: size,
    height: size,
    ...style,
  };

  return (
    <Glass
      as="button"
      type="button"
      interactive
      material={material}
      radius="circle"
      className={["ag-btn", "ag-icon-btn", className].filter(Boolean).join(" ")}
      style={merged}
      {...rest}
    >
      {children}
    </Glass>
  );
}
