import { describe, expect, it } from "vitest";
import { generateDisplacementBuffer } from "./displacement";
import { sdfRoundedBox } from "./math";

describe("generateDisplacementBuffer", () => {
  const buffer = generateDisplacementBuffer({
    width: 64,
    height: 40,
    radius: 12,
    depth: 10,
    magnify: 0,
  });

  it("fills every pixel with an opaque RG displacement sample", () => {
    expect(buffer.width).toBe(64);
    expect(buffer.height).toBe(40);
    expect(buffer.data.length).toBe(64 * 40 * 4);
    expect(buffer.data[3]).toBe(255);
  });

  it("keeps the flat interior near neutral grey", () => {
    const x = 32;
    const y = 20;
    const i = (y * 64 + x) * 4;
    expect(buffer.data[i]).toBeGreaterThan(110);
    expect(buffer.data[i]).toBeLessThan(146);
    expect(buffer.data[i + 1]).toBeGreaterThan(110);
    expect(buffer.data[i + 1]).toBeLessThan(146);
  });

  it("bends pixels along the surface normal at the rim", () => {
    const x = 63;
    const y = 20;
    const i = (y * 64 + x) * 4;
    const sdf = sdfRoundedBox(x - 31.5, y - 19.5, 32, 20, 12);
    if (sdf <= 0) {
      expect(Math.abs(buffer.data[i] - 128)).toBeGreaterThan(8);
    }
  });

  it("keeps left and right rim offsets opposite, not a one-sided slab", () => {
    const y = 20;
    const left = buffer.data[(y * 64 + 0) * 4];
    const right = buffer.data[(y * 64 + 63) * 4];
    expect(left).toBeLessThan(128);
    expect(right).toBeGreaterThan(128);
    expect(Math.abs(128 - left - (right - 128))).toBeLessThan(12);
  });
});
