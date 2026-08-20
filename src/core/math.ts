export function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, finiteNumber(value, min)));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mix(a: number, b: number, t: number): number {
  return lerp(a, b, t);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Signed distance to a rounded rectangle centered at the origin.
 * Negative inside, zero on the border, positive outside.
 */
export function sdfRoundedBox(
  px: number,
  py: number,
  halfWidth: number,
  halfHeight: number,
  radius: number,
): number {
  const r = Math.min(Math.max(radius, 0), halfWidth, halfHeight);
  const qx = Math.abs(px) - (halfWidth - r);
  const qy = Math.abs(py) - (halfHeight - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - r;
}

/**
 * Apple-style squircle convex bevel height.
 * `t = 0` at the rim, `t = 1` at the inner edge of the bevel.
 */
export function squircleHeight(t: number): number {
  const x = clamp(t, 0, 1);
  return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
}

/**
 * Displacement strength from the squircle profile.
 * Strongest at the rim, smoothly falling to 0 where the bevel meets the flat face.
 */
export function bevelMagnitude(t: number): number {
  return 1 - squircleHeight(t);
}

/** Map the public 0–100 refraction control to an SVG displacement scale. */
export function refractionToScale(refraction: number): number {
  return -lerp(0, 118, clamp(refraction, 0, 100) / 100);
}

/** Map the public 0–100 dispersion control to per-channel scale spread. */
export function dispersionToSpread(dispersion: number): number {
  return lerp(0, 22, clamp(dispersion, 0, 100) / 100);
}

/** Map the public 0–100 frost control to CSS blur pixels. */
export function frostToBlur(frost: number): number {
  return lerp(0, 22, clamp(frost, 0, 100) / 100);
}

export function depthToBevel(depth: number, minDimension: number): number {
  const t = clamp(depth, 0, 100) / 100;
  return lerp(Math.max(4, minDimension * 0.06), minDimension * 0.48, t);
}

export function resolveRadius(
  radius: number | "pill" | "circle",
  width: number,
  height: number,
): number {
  if (radius === "circle" || radius === "pill") {
    return Math.min(width, height) / 2;
  }
  return Math.min(radius, width / 2, height / 2);
}

export function chromaticScales(
  refraction: number,
  dispersion: number,
): { red: number; green: number; blue: number } {
  const scale = refractionToScale(refraction);
  const spread = dispersionToSpread(dispersion);
  return {
    red: scale - spread,
    green: scale,
    blue: scale + spread,
  };
}

/**
 * Extra objectBoundingBox padding so feDisplacementMap can sample past the
 * element's edge instead of clipping a hard slab on the right/bottom.
 */
export function filterRegionPad(scale: number, size: number): number {
  return Math.min(0.5, Math.max(0.12, Math.abs(scale) / Math.max(size, 1)));
}
