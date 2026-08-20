import { describe, expect, it } from "vitest";
import { GLASS_PRESETS, resolveOptics } from "./presets";

describe("resolveOptics", () => {
  it("keeps preset values when overrides are undefined", () => {
    const optics = resolveOptics("regular", {
      refraction: undefined,
      frost: 12,
    });
    expect(optics.refraction).toBe(GLASS_PRESETS.regular.refraction);
    expect(optics.frost).toBe(12);
  });
});
