import type { CSSProperties } from "react";
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

  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={svgStyle}
      colorInterpolationFilters="sRGB"
    >
      <defs>
        <filter
          id={id}
          x="0"
          y="0"
          width={width}
          height={height}
          filterUnits="userSpaceOnUse"
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
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={finiteScale(scales.red)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispR"
              />
              <feColorMatrix
                in="dispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="r"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={finiteScale(scales.green)}
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispG"
              />
              <feColorMatrix
                in="dispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="g"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                scale={finiteScale(scales.blue)}
                xChannelSelector="R"
                yChannelSelector="G"
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
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={finiteScale(scales.green)}
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
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

function finiteScale(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

const svgStyle: CSSProperties = {
  position: "absolute",
  width: 0,
  height: 0,
  overflow: "hidden",
  pointerEvents: "none",
};
