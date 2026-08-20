import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
} from "react";
import { Glass } from "./Glass";
import { clamp } from "../core/math";

export interface GlassSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function GlassSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  className,
}: GlassSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const percent = ((value - min) / (max - min || 1)) * 100;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const t = clamp((clientX - rect.left) / rect.width, 0, 1);
      onChange?.(min + t * (max - min));
    },
    [max, min, onChange],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setFromClientX(event.clientX);
  };

  return (
    <div
      className={["ag-slider", className].filter(Boolean).join(" ")}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div className="ag-slider__track" ref={trackRef}>
        <div className="ag-slider__fill" style={{ width: `${percent}%` }} />
      </div>
      <Glass
        radius="circle"
        material="clear"
        className="ag-slider__thumb"
        style={{ left: `${percent}%` }}
        refraction={86}
        frost={4}
      />
    </div>
  );
}
