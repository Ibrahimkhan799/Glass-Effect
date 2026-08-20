import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useGlassFilter } from "../hooks/useGlassFilter";
import { resolveOptics } from "../presets";
import type { GlassMaterial, GlassOptics, GlassRadius } from "../types";
import { GlassFilterSvg } from "./GlassFilterSvg";

export interface GlassProps
  extends Omit<ButtonHTMLAttributes<HTMLElement>, "color">,
    Partial<GlassOptics> {
  as?: ElementType;
  children?: ReactNode;
  radius?: GlassRadius;
  material?: GlassMaterial;
  interactive?: boolean;
}

export function Glass({
  as: Component = "div",
  children,
  className,
  style,
  radius = 28,
  material = "regular",
  interactive = false,
  refraction,
  depth,
  dispersion,
  frost,
  magnify,
  saturation,
  tint,
  lightAngle,
  lightIntensity,
  ...rest
}: GlassProps) {
  const optics = resolveOptics(material, {
    refraction,
    depth,
    dispersion,
    frost,
    magnify,
    saturation,
    tint,
    lightAngle,
    lightIntensity,
  });

  const filter = useGlassFilter({
    radius,
    refraction: optics.refraction,
    depth: optics.depth,
    dispersion: optics.dispersion,
    frost: optics.frost,
    magnify: optics.magnify,
  });

  const radiusCss = radius === "pill" || radius === "circle" ? 9999 : radius;

  const fallbackBlur = Math.max(filter.frostBlur, filter.canRefract ? 2 : 14);
  const backdrop = filter.canRefract && filter.mapUrl
    ? `blur(${fallbackBlur}px) saturate(${optics.saturation}) brightness(1.06) url(#${filter.filterId})`
    : `blur(${fallbackBlur}px) saturate(${optics.saturation}) brightness(1.08)`;

  const cssVars = {
    "--ag-radius": `${radiusCss}px`,
    "--ag-tint": optics.tint,
    "--ag-light-angle": `${optics.lightAngle}deg`,
    "--ag-light": String(optics.lightIntensity),
    "--ag-backdrop": backdrop,
  } as CSSProperties;

  const classes = [
    "ag-glass-wrap",
    interactive ? "ag-glass-wrap--interactive" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      style={{ ...cssVars, ...style }}
      {...rest}
    >
      <div className="ag-glass" ref={filter.setNode}>
        <GlassFilterSvg
          id={filter.filterId}
          mapUrl={filter.mapUrl}
          width={filter.mapWidth}
          height={filter.mapHeight}
          scales={filter.scales}
          frostBlur={filter.frostBlur}
        />
        <span className="ag-glass__specular" aria-hidden="true" />
        <span className="ag-glass__sheen" aria-hidden="true" />
        <span className="ag-glass__noise" aria-hidden="true" />
        <span className="ag-glass__content">{children}</span>
      </div>
    </Component>
  );
}
