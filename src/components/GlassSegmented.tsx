import type { ReactNode } from "react";
import { Glass } from "./Glass";

export interface GlassSegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface GlassSegmentedProps<T extends string> {
  value: T;
  options: GlassSegmentedOption<T>[];
  onChange?: (value: T) => void;
  className?: string;
}

export function GlassSegmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: GlassSegmentedProps<T>) {
  return (
    <Glass
      radius="pill"
      material="regular"
      className={["ag-segmented", className].filter(Boolean).join(" ")}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={[
            "ag-segmented__item",
            option.value === value ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onChange?.(option.value)}
        >
          {option.label}
        </button>
      ))}
    </Glass>
  );
}
