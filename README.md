# glass-effect

Apple-inspired **Liquid Glass** for React. Surfaces refract and chromatic-fringe the live backdrop — they are not a `backdrop-filter: blur()` tint sitting on top of the page.

## Why this is not generic glassmorphism

Apple’s Liquid Glass (iOS 26 / macOS 26 / visionOS) has four optical layers:

1. **Refraction** — a convex squircle bevel bends pixels along the rounded-rect normal.
2. **Dispersion** — red, green and blue are displaced at slightly different scales.
3. **Frost** — optional Gaussian scatter after the bend (0 = optically clear).
4. **Specular** — a rim highlight whose intensity follows a 2D light direction.

This library generates a per-element **signed-distance displacement map**, feeds it to an SVG `feDisplacementMap` graph, and composites Apple-like tint, sheen, grain and shadow in CSS.

Chromium applies the SVG filter as a real `backdrop-filter`. Safari and Firefox fall back to a still-convincing frosted material.

## Install

```bash
npm install glass-effect
```

```tsx
import { Glass, GlassButton, GlassSwitch } from "glass-effect";
import "glass-effect/styles.css";

export function Panel() {
  return (
    <Glass radius={28} material="regular">
      <GlassButton variant="primary">Continue</GlassButton>
      <GlassSwitch checked onChange={() => {}} />
    </Glass>
  );
}
```

Place glass over something colourful. Refraction only reads if there is content behind the surface to bend.

## Materials

| `material` | Look |
| --- | --- |
| `regular` | Control Center / menu glass — mild frost, white tint, rim refraction |
| `clear` | Thin, almost clear lens |
| `tinted` | Colored overlay (the blue tiles in Control Center) |
| `lens` | Clear sphere/pill with strong magnification and dispersion |

Every material can be overridden with optics props:

| Prop | Range | What it does |
| --- | --- | --- |
| `refraction` | 0–100 | How hard the rim bends light |
| `depth` | 0–100 | Bevel thickness — how far the bend reaches inward |
| `dispersion` | 0–100 | Rainbow fringe at high-contrast edges |
| `frost` | 0–100 | Scatter / frosted blur (`0` is optically clear) |
| `magnify` | 0–100 | Extra barrel distortion in the center |
| `tint` | CSS color | Body fill over the refracted backdrop |
| `lightAngle` | degrees | Specular direction |
| `lightIntensity` | 0–1 | Specular strength |
| `radius` | `number` \| `"pill"` \| `"circle"` | Corner radius |

## Components

`Glass` · `GlassButton` · `GlassIconButton` · `GlassCard` · `GlassPanel` · `GlassSwitch` · `GlassSlider` · `GlassSegmented` · `GlassDock` · `GlassModal` · `GlassMenu` · `GlassBadge` · `GlassInput`

```tsx
<GlassIconButton material="tinted" aria-label="Lock">
  <LockIcon />
</GlassIconButton>

<Glass radius="pill">Focus</Glass>
```

## How it works

1. Measure the element with `ResizeObserver`.
2. Paint a PNG whose **red** channel is X-offset and **green** channel is Y-offset. `128` is rest. The rim uses the gradient of a rounded-box SDF and Apple’s squircle convex profile.
3. Run three `feDisplacementMap` passes (R/G/B) and `feBlend` them with `screen`.
4. Apply `backdrop-filter: blur() saturate() url(#filter)` plus CSS specular, noise and drop shadow.

The content inside the glass is never displaced — only the backdrop is — so labels stay sharp and controls stay clickable.

## Scripts

```bash
npm install
npm run dev        # playground
npm test           # SDF + displacement math
npm run build      # library
npm run typecheck
```

## Browser support

| Engine | Refraction | Frosted fallback |
| --- | --- | --- |
| Chrome, Edge, Arc, Brave | Yes | Yes |
| Safari, Firefox | No (`url()` backdrop-filters) | Yes |

## License

MIT
