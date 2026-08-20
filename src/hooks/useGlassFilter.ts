import { useCallback, useId, useLayoutEffect, useState } from "react";
import {
  displacementToDataUrl,
  getDisplacementBuffer,
} from "../core/displacement";
import {
  chromaticScales,
  depthToBevel,
  frostToBlur,
  resolveRadius,
} from "../core/math";
import { supportsSvgBackdropFilter } from "../core/support";
import type { FilterScales, GlassRadius } from "../types";

export interface UseGlassFilterOptions {
  radius: GlassRadius;
  refraction: number;
  depth: number;
  dispersion: number;
  frost: number;
  magnify: number;
}

export interface GlassFilterState {
  filterId: string;
  mapUrl: string;
  mapWidth: number;
  mapHeight: number;
  elementWidth: number;
  elementHeight: number;
  scales: FilterScales;
  frostBlur: number;
  canRefract: boolean;
  setNode: (node: HTMLElement | null) => void;
}

export function useGlassFilter(options: UseGlassFilterOptions): GlassFilterState {
  const reactId = useId().replace(/:/g, "");
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [mapUrl, setMapUrl] = useState("");
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [generation, setGeneration] = useState(0);

  const canRefract = typeof window !== "undefined" && supportsSvgBackdropFilter();
  const scales = chromaticScales(options.refraction, options.dispersion);
  const frostBlur = frostToBlur(options.frost);
  const magnify = options.magnify / 100;

  const rebuild = useCallback(
    (width: number, height: number) => {
      if (!canRefract || width < 2 || height < 2) return;
      const buffer = getDisplacementBuffer({
        width,
        height,
        radius: resolveRadius(options.radius, width, height),
        depth: depthToBevel(options.depth, Math.min(width, height)),
        magnify,
      });
      setMapUrl(displacementToDataUrl(buffer));
      setMapSize({ width: buffer.width, height: buffer.height });
      setGeneration((g) => g + 1);
    },
    [canRefract, magnify, options.depth, options.radius],
  );

  useLayoutEffect(() => {
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { width, height },
      );
    });

    observer.observe(node);
    const rect = node.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
    return () => observer.disconnect();
  }, [node]);

  useLayoutEffect(() => {
    rebuild(size.width, size.height);
  }, [rebuild, size.height, size.width]);

  return {
    filterId: `ag-glass-${reactId}-${generation}`,
    mapUrl,
    mapWidth: mapSize.width,
    mapHeight: mapSize.height,
    elementWidth: size.width,
    elementHeight: size.height,
    scales,
    frostBlur,
    canRefract,
    setNode,
  };
}
