import { describe, expect, it } from "vitest";
import { cx, mergeStyles } from "./compose";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("ag-glass", false, "card", undefined)).toBe("ag-glass card");
  });
});

describe("mergeStyles", () => {
  it("lets the later style win", () => {
    expect(mergeStyles({ color: "red" }, { color: "blue" }).color).toBe("blue");
  });
});
