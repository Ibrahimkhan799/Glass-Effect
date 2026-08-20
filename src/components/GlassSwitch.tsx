import type { ButtonHTMLAttributes } from "react";
import { Glass } from "./Glass";

export interface GlassSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export function GlassSwitch({
  checked,
  onChange,
  className,
  disabled,
  ...rest
}: GlassSwitchProps) {
  return (
    <Glass
      as="button"
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      radius="pill"
      material={checked ? "tinted" : "regular"}
      className={["ag-switch", checked ? "is-on" : "", className]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onChange?.(!checked)}
      {...rest}
    >
      <Glass
        radius="circle"
        material="clear"
        frost={8}
        refraction={80}
        className="ag-switch__thumb"
      />
    </Glass>
  );
}
