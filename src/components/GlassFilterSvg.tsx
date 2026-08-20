import type { CSSProperties } from "react";
import { filterRegionPad } from "../core/math";
import type { FilterScales } from "../types";

interface GlassFilterSvgProps {
  id: string;
  mapUrl: string;
  width: number;
  height: number;
  scales: FilterScales;
  frostBlur: number;
}

export function GlassFilterSvg({
  id,
  mapUrl,
  width,
  height,
  scales,
  frostBlur,
}: GlassFilterSvgProps) {
  if (!mapUrl || width < 2 || height < 2) return null;

  const blur = Math.max(0, frostBlur * 0.18);
  const chromatic = Math.abs(scales.red - scales.blue) > 0.4;
  const maxScale = Math.max(
    Math.abs(scales.red),
    Math.abs(scales.green),
    Math.abs(scales.blue),
  );
  const padX = filterRegionPad(maxScale, width);
  const padY = filterRegionPad(maxScale, height);

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      colorInterpolationFilters="sRGB"
      style={svgStyle}
    >
      <defs>
        <filter
          id={id}
          x={-padX}
          y={-padY}
          width={1 + padX * 2}
          height={1 + padY * 2}
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={mapUrl}
            result="map"
            x="0"
            y="0"
            width={width}
            height={height}
            preserveAspectRatio="none"
          />

          {chromatic ? (
            <>
              <Displacement
                scale={scales.red}
                result="dispR"
              />
              <feColorMatrix
                in="dispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="r"
              />
              <Displacement
                scale={scales.green}
                result="dispG"
              />
              <feColorMatrix
                in="dispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="g"
              />
              <Displacement
                scale={scales.blue}
                result="dispB"
              />
              <feColorMatrix
                in="dispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="b"
              />
              <feBlend in="r" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="b" mode="screen" result="refracted" />
            </>
          ) : (
            <Displacement scale={scales.green} result="refracted" />
          )}

          {blur > 0.2 ? (
            <feGaussianBlur
              in="refracted"
              stdDeviation={blur}
              result="frosted"
            />
          ) : null}
        </filter>
      </defs>
    </svg>
  );
}

function Displacement({ scale, result }: { scale: number; result: string }) {
  return (
    <feDisplacementMap
      in="SourceGraphic"
      in2="map"
      scale={finiteScale(scale)}
      xChannelSelector="R"
      yChannelSelector="G"
      edgeMode="none"
      result={result}
    />
  );
}

function finiteScale(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

const svgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "visible",
};
