export type GlassMaterial = "regular" | "clear" | "tinted" | "lens";

export type GlassRadius = number | "pill" | "circle";

export interface GlassOptics {
  /** Edge bend strength, 0–100. Higher = stronger lensing at the rim. */
  refraction: number;
  /** Bevel thickness, 0–100. Controls how far the bend reaches inward. */
  depth: number;
  /** Chromatic aberration, 0–100. Rainbow fringing at high-contrast edges. */
  dispersion: number;
  /** Frosted scatter, 0–100. 0 is optically clear glass. */
  frost: number;
  /** Extra center magnification, 0–100. Used by the lens material. */
  magnify: number;
  /** Backdrop saturation multiplier. */
  saturation: number;
  /** Semi-transparent fill painted over the refracted backdrop. */
  tint: string;
  /** Light direction in degrees (CSS gradient angle). */
  lightAngle: number;
  /** Specular rim intensity, 0–1. */
  lightIntensity: number;
}

export interface DisplacementParams {
  width: number;
  height: number;
  radius: number;
  /** Bevel width in pixels. */
  depth: number;
  /** Extra barrel magnification in the center, 0–1. */
  magnify: number;
}

export interface DisplacementBuffer {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface FilterScales {
  red: number;
  green: number;
  blue: number;
}
