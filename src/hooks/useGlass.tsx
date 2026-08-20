import { type CSSProperties, type ReactElement } from "react";
import { GlassFilterSvg } from "../components/GlassFilterSvg";
import { resolveOptics } from "../presets";
import type { GlassMaterial, GlassOptics, GlassRadius } from "../types";
import { cx, mergeStyles } from "../utils/compose";
import { useGlassFilter } from "./useGlassFilter";

export interface UseGlassOptions extends Partial<GlassOptics> {
  radius?: GlassRadius;
  material?: GlassMaterial;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  inheritRadius?: boolean;
}

export interface GlassBind {
  /** Spread onto your existing element. */
  props: {
    ref: (node: HTMLElement | null) => void;
    className: string;
    style: CSSProperties;
  };
  /** Render as a child of that same element. */
  filter: ReactElement | null;
}

export function useGlass(options: UseGlassOptions = {}): GlassBind {
  const {
    radius,
    material = "regular",
    interactive = false,
    className,
    style,
    refraction,
    depth,
    dispersion,
    frost,
    magnify,
    saturation,
    tint,
    lightAngle,
    lightIntensity,
    inheritRadius = false,
  } = options;

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

  const resolvedRadius = filter.radius;
  const radiusCss =
    resolvedRadius === "pill" || resolvedRadius === "circle"
      ? 9999
      : resolvedRadius;
  const fallbackBlur = Math.max(filter.frostBlur, filter.canRefract ? 2 : 14);
  const backdrop =
    filter.canRefract && filter.mapUrl
      ? `blur(${fallbackBlur}px) saturate(${optics.saturation}) brightness(1.06) url(#${filter.filterId})`
      : `blur(${fallbackBlur}px) saturate(${optics.saturation}) brightness(1.08)`;

  const skipRadiusVar =
    inheritRadius && radius === undefined && filter.measuredRadius == null;

  const cssVars = {
    "--ag-tint": optics.tint,
    "--ag-light-angle": `${optics.lightAngle}deg`,
    "--ag-light": String(optics.lightIntensity),
    "--ag-backdrop": backdrop,
    ...(skipRadiusVar ? {} : { "--ag-radius": `${radiusCss}px` }),
  } as CSSProperties;

  const svg =
    filter.canRefract && filter.mapUrl ? (
      <GlassFilterSvg
        id={filter.filterId}
        mapUrl={filter.mapUrl}
        width={filter.elementWidth}
        height={filter.elementHeight}
        scales={filter.scales}
        frostBlur={filter.frostBlur}
      />
    ) : null;

  return {
    props: {
      ref: filter.setNode,
      className: cx(
        "ag-glass",
        interactive && "ag-glass--interactive",
        className,
      ),
      style: mergeStyles(cssVars, style),
    },
    filter: svg,
  };
}
