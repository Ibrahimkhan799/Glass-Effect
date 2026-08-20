let cached: boolean | null = null;

/**
 * SVG `url()` backdrop-filters currently work in Chromium.
 * Safari and Firefox still get a high-quality frosted fallback.
 */
export function supportsSvgBackdropFilter(): boolean {
  if (cached != null) return cached;
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    cached = false;
    return cached;
  }
  cached =
    CSS.supports("backdrop-filter", "url(#ag-glass-probe)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#ag-glass-probe)");
  return cached;
}

export function resetSupportCache(): void {
  cached = null;
}
