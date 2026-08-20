import type { DisplacementBuffer, DisplacementParams } from "../types";
import { bevelMagnitude, clamp, sdfRoundedBox } from "./math";

const MAX_MAP_EDGE = 280;
const mapCache = new Map<string, DisplacementBuffer>();
const CACHE_LIMIT = 48;

export function displacementCacheKey(params: DisplacementParams): string {
  return [
    Math.round(params.width),
    Math.round(params.height),
    Math.round(params.radius * 10),
    Math.round(params.depth * 10),
    Math.round(params.magnify * 100),
  ].join("|");
}

/**
 * Paint a red/green displacement map for a rounded-rect glass surface.
 *
 * Red = X offset, green = Y offset, 128 = no movement. The rim follows the
 * gradient of a rounded-box SDF so corners refract along the true surface
 * normal — the same optical idea as Apple's Liquid Glass bevel.
 */
export function generateDisplacementBuffer(
  params: DisplacementParams,
): DisplacementBuffer {
  const width = Math.max(2, Math.round(params.width));
  const height = Math.max(2, Math.round(params.height));
  const radius = Math.max(0, params.radius);
  const depth = Math.max(1, params.depth);
  const magnify = clamp(params.magnify, 0, 1);

  const data = new Uint8ClampedArray(width * height * 4);
  const hw = width / 2;
  const hh = height / 2;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  const epsilon = 0.65;
  const maxInside = Math.min(hw, hh);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const px = x - cx;
      const py = y - cy;
      const sdf = sdfRoundedBox(px, py, hw, hh, radius);

      const gx =
        sdfRoundedBox(px + epsilon, py, hw, hh, radius) -
        sdfRoundedBox(px - epsilon, py, hw, hh, radius);
      const gy =
        sdfRoundedBox(px, py + epsilon, hw, hh, radius) -
        sdfRoundedBox(px, py - epsilon, hw, hh, radius);
      const glen = Math.hypot(gx, gy) || 1;
      const nx = gx / glen;
      const ny = gy / glen;

      const distInside = Math.max(0, -sdf);
      const t = distInside / depth;
      let magnitude = sdf > 0 || t >= 1 ? 0 : bevelMagnitude(t);

      if (magnify > 0 && sdf <= 0) {
        const radial = clamp(distInside / maxInside, 0, 1);
        magnitude = Math.min(1, magnitude + magnify * 0.28 * (1 - radial) ** 2);
      }

      const dx = nx * magnitude;
      const dy = ny * magnitude;
      const i = (y * width + x) * 4;
      data[i] = clamp(Math.round(128 + dx * 127), 0, 255);
      data[i + 1] = clamp(Math.round(128 + dy * 127), 0, 255);
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  return { data, width, height };
}

export function getDisplacementBuffer(
  params: DisplacementParams,
): DisplacementBuffer {
  const fitted = fitMapSize(params);
  const key = displacementCacheKey(fitted);
  const cached = mapCache.get(key);
  if (cached) return cached;

  const buffer = generateDisplacementBuffer(fitted);
  if (mapCache.size >= CACHE_LIMIT) {
    const first = mapCache.keys().next().value;
    if (first) mapCache.delete(first);
  }
  mapCache.set(key, buffer);
  return buffer;
}

export function fitMapSize(params: DisplacementParams): DisplacementParams {
  const longest = Math.max(params.width, params.height, 1);
  const scale = Math.min(1, MAX_MAP_EDGE / longest);
  return {
    width: Math.max(2, Math.round(params.width * scale)),
    height: Math.max(2, Math.round(params.height * scale)),
    radius: params.radius * scale,
    depth: Math.max(1, params.depth * scale),
    magnify: params.magnify,
  };
}

export function displacementToDataUrl(buffer: DisplacementBuffer): string {
  const canvas = document.createElement("canvas");
  canvas.width = buffer.width;
  canvas.height = buffer.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const image = ctx.createImageData(buffer.width, buffer.height);
  image.data.set(buffer.data);
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function clearDisplacementCache(): void {
  mapCache.clear();
}
