export type {
  DisplacementBuffer,
  DisplacementParams,
  FilterScales,
  GlassMaterial,
  GlassOptics,
  GlassRadius,
} from "./types";

export {
  bevelMagnitude,
  chromaticScales,
  clamp,
  depthToBevel,
  dispersionToSpread,
  finiteNumber,
  frostToBlur,
  lerp,
  refractionToScale,
  resolveRadius,
  sdfRoundedBox,
  squircleHeight,
} from "./core/math";

export {
  clearDisplacementCache,
  displacementCacheKey,
  displacementToDataUrl,
  fitMapSize,
  generateDisplacementBuffer,
  getDisplacementBuffer,
} from "./core/displacement";

export { supportsSvgBackdropFilter } from "./core/support";
export { GLASS_PRESETS, resolveOptics } from "./presets";
export { useGlassFilter } from "./hooks/useGlassFilter";

export { Glass, type GlassProps } from "./components/Glass";
export { GlassButton, type GlassButtonProps } from "./components/GlassButton";
export {
  GlassIconButton,
  type GlassIconButtonProps,
} from "./components/GlassIconButton";
export { GlassCard, type GlassCardProps } from "./components/GlassCard";
export { GlassSwitch, type GlassSwitchProps } from "./components/GlassSwitch";
export { GlassSlider, type GlassSliderProps } from "./components/GlassSlider";
export {
  GlassSegmented,
  type GlassSegmentedProps,
} from "./components/GlassSegmented";
export { GlassDock, type GlassDockProps } from "./components/GlassDock";
export { GlassModal, type GlassModalProps } from "./components/GlassModal";
export { GlassPanel, type GlassPanelProps } from "./components/GlassPanel";
export { GlassBadge, type GlassBadgeProps } from "./components/GlassBadge";
export { GlassMenu, type GlassMenuProps } from "./components/GlassMenu";
export { GlassInput, type GlassInputProps } from "./components/GlassInput";
