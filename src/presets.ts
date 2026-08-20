import type { GlassMaterial, GlassOptics } from "./types";

export const GLASS_PRESETS: Record<GlassMaterial, GlassOptics> = {
  regular: {
    refraction: 74,
    depth: 56,
    dispersion: 26,
    frost: 38,
    magnify: 4,
    saturation: 1.55,
    tint: "rgba(255, 255, 255, 0.14)",
    lightAngle: -38,
    lightIntensity: 0.72,
  },
  clear: {
    refraction: 90,
    depth: 64,
    dispersion: 44,
    frost: 6,
    magnify: 10,
    saturation: 1.35,
    tint: "rgba(255, 255, 255, 0.05)",
    lightAngle: -42,
    lightIntensity: 0.8,
  },
  tinted: {
    refraction: 70,
    depth: 52,
    dispersion: 22,
    frost: 44,
    magnify: 2,
    saturation: 1.7,
    tint: "rgba(47, 128, 255, 0.34)",
    lightAngle: -36,
    lightIntensity: 0.68,
  },
  lens: {
    refraction: 100,
    depth: 82,
    dispersion: 78,
    frost: 0,
    magnify: 38,
    saturation: 1.15,
    tint: "rgba(255, 255, 255, 0.06)",
    lightAngle: -50,
    lightIntensity: 0.9,
  },
};

export function resolveOptics(
  material: GlassMaterial | undefined,
  overrides: Partial<GlassOptics>,
): GlassOptics {
  const preset = GLASS_PRESETS[material ?? "regular"];
  const next = { ...preset };
  (Object.keys(overrides) as (keyof GlassOptics)[]).forEach((key) => {
    const value = overrides[key];
    if (value !== undefined) {
      (next[key] as typeof value) = value;
    }
  });
  return next;
}
