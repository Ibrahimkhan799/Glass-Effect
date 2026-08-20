import type { InputHTMLAttributes, ReactNode } from "react";
import { Glass } from "./Glass";

export interface GlassInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  icon?: ReactNode;
}

export function GlassInput({ icon, className, ...rest }: GlassInputProps) {
  return (
    <Glass
      radius="pill"
      material="regular"
      className={["ag-input", className].filter(Boolean).join(" ")}
    >
      {icon}
      <input {...rest} />
    </Glass>
  );
}
