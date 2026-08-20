import { describe, expect, it } from "vitest";
import {
  bevelMagnitude,
  chromaticScales,
  clamp,
  depthToBevel,
  frostToBlur,
  refractionToScale,
  resolveRadius,
  sdfRoundedBox,
  squircleHeight,
} from "./math";

describe("sdfRoundedBox", () => {
  it("is negative at the center of the shape", () => {
    expect(sdfRoundedBox(0, 0, 50, 30, 12)).toBeLessThan(0);
  });

  it("is positive outside the shape", () => {
    expect(sdfRoundedBox(80, 0, 50, 30, 12)).toBeGreaterThan(0);
    expect(sdfRoundedBox(0, 80, 50, 30, 12)).toBeGreaterThan(0);
  });

  it("is roughly zero on the midpoint of a flat edge", () => {
    expect(sdfRoundedBox(50, 0, 50, 30, 12)).toBeCloseTo(0, 5);
  });
});

describe("squircle bevel", () => {
  it("is 0 at the rim and 1 at the inner bevel", () => {
    expect(squircleHeight(0)).toBeCloseTo(0, 5);
    expect(squircleHeight(1)).toBeCloseTo(1, 5);
  });

  it("produces strongest displacement at the rim", () => {
    expect(bevelMagnitude(0)).toBeCloseTo(1, 5);
    expect(bevelMagnitude(1)).toBeCloseTo(0, 5);
    expect(bevelMagnitude(0.2)).toBeGreaterThan(bevelMagnitude(0.8));
  });
});

describe("control mapping", () => {
  it("maps refraction to a negative magnifying scale", () => {
    expect(refractionToScale(0)).toBeCloseTo(0);
    expect(refractionToScale(100)).toBeLessThan(-100);
  });

  it("spreads chromatic channels around the base scale", () => {
    const scales = chromaticScales(80, 50);
    expect(scales.red).toBeLessThan(scales.green);
    expect(scales.blue).toBeGreaterThan(scales.green);
  });

  it("maps frost and depth into positive pixel values", () => {
    expect(frostToBlur(0)).toBe(0);
    expect(frostToBlur(100)).toBeGreaterThan(10);
    expect(depthToBevel(50, 80)).toBeGreaterThan(4);
  });

  it("resolves pill and circle radii to half the short side", () => {
    expect(resolveRadius("pill", 200, 48)).toBe(24);
    expect(resolveRadius("circle", 64, 64)).toBe(32);
    expect(resolveRadius(12, 100, 40)).toBe(12);
  });

  it("keeps finite displacement scales when inputs are not numbers", () => {
    const scales = chromaticScales(Number.NaN, Number.NaN);
    expect(Number.isFinite(scales.red)).toBe(true);
    expect(Number.isFinite(scales.green)).toBe(true);
    expect(Number.isFinite(scales.blue)).toBe(true);
  });

  it("clamps to the requested range", () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-4, 0, 10)).toBe(0);
  });
});
