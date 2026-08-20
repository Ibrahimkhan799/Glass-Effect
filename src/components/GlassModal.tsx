import type { ReactNode } from "react";
import { Glass } from "./Glass";
import { GlassButton } from "./GlassButton";

export interface GlassModalProps {
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function GlassModal({
  title,
  children,
  confirmLabel = "Allow",
  cancelLabel = "Don't Allow",
  onConfirm,
  onCancel,
  className,
}: GlassModalProps) {
  return (
    <Glass
      radius={28}
      material="regular"
      className={["ag-modal", className].filter(Boolean).join(" ")}
    >
      <h3 className="ag-modal__title">{title}</h3>
      <p className="ag-modal__body">{children}</p>
      <div className="ag-modal__actions">
        <GlassButton size="sm" material="regular" onClick={onCancel}>
          {cancelLabel}
        </GlassButton>
        <GlassButton size="sm" variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </GlassButton>
      </div>
    </Glass>
  );
}
