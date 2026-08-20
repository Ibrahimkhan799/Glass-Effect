# glass-effect

Apple-inspired **Liquid Glass** for React. Add it to layouts and components you already have — you do not have to rebuild your UI with our kit.

[![npm](https://img.shields.io/npm/v/glass-effect.svg)](https://www.npmjs.com/package/glass-effect)
[![license](https://img.shields.io/npm/l/glass-effect.svg)](LICENSE)

The material refracts the live backdrop. It is not a `blur()` tint sitting on top of the page.

## Install

```bash
npm install glass-effect
```

```tsx
import { Glass } from "glass-effect";
import "glass-effect/styles.css";
```

Works with Vite, Next.js (App Router: this package is a client module), Remix, and CRA. `react` and `react-dom` >= 18 are peer dependencies.

## Add glass to your own UI

### 1. Wrap anything

`Glass` is a single host node. It does not inject a flex wrapper, so your padding, grid, and flow stay yours.

```tsx
<Glass radius={24} style={{ padding: 20 }}>
  <h2>Account</h2>
  <YourExistingForm />
</Glass>
```

### 2. Merge onto an existing element (`asChild`)

Keep the tag you already render. Glass copies the material onto that node.

```tsx
<Glass asChild>
  <aside className="sidebar">
    <Nav />
  </aside>
</Glass>
```

The child must be a single element that can take a ref — a DOM node like `div` / `aside` / `button`, or a `forwardRef` component.

If that element already has `border-radius` in CSS, the refraction map picks it up automatically.

### 3. Attach with a hook

Use this when you want the effect on a component you own without changing its JSX tree much.

```tsx
import { useGlass } from "glass-effect";

export function WeatherCard() {
  const glass = useGlass({ radius: 28, material: "regular" });

  return (
    <section {...glass.props}>
      {glass.filter}
      <h2>San Francisco</h2>
      <p>68°</p>
    </section>
  );
}
```

`glass.props` is `{ ref, className, style }`. Put `glass.filter` inside the same element.

## Materials

| `material` | Look |
| --- | --- |
| `regular` | Control Center / menu glass |
| `clear` | Thin, almost clear lens |
| `tinted` | Colored overlay |
| `lens` | Strong magnification and dispersion |

Optional optics if you want to tune a surface:

| Prop | Range | What it does |
| --- | --- | --- |
| `refraction` | 0–100 | How hard the rim bends light |
| `depth` | 0–100 | How far the bend reaches inward |
| `dispersion` | 0–100 | Rainbow fringe |
| `frost` | 0–100 | Scatter (`0` is optically clear) |
| `radius` | `number` \| `"pill"` \| `"circle"` | Corner radius |
| `tint` | CSS color | Body fill |
| `interactive` | boolean | Hover / press lift |

Place glass over something colourful. Refraction only reads if there is content behind the surface to bend.

## Optional kit

The kit is convenience, not a requirement. Every piece is the same `Glass` primitive.

`GlassButton` · `GlassIconButton` · `GlassCard` · `GlassPanel` · `GlassSwitch` · `GlassSlider` · `GlassSegmented` · `GlassDock` · `GlassModal` · `GlassMenu` · `GlassBadge` · `GlassInput`

```tsx
<Glass asChild>
  <button className="save" type="button">Save</button>
</Glass>
```

## How it works

1. Measure the host with `ResizeObserver`.
2. Paint a PNG whose **red** channel is X-offset and **green** channel is Y-offset.
3. Run three `feDisplacementMap` passes and composite specular / grain in CSS.
4. Apply `backdrop-filter: url(#filter)` in Chromium, with a frosted fallback elsewhere.

Your children are never displaced — only the backdrop is — so text stays selectable and buttons stay clickable.

## Documentation site

This repo ships a landing page, API docs, and a live playground (Vite app in `playground/`).

| Route | Page |
| --- | --- |
| `/` | Landing |
| `/docs` | Documentation |
| `/playground` | Interactive optics lab and kit |

```bash
npm run dev          # http://localhost:5173
npm run build:site   # writes dist-site/
npm run preview      # preview the production site
```

### Deploy on Vercel

`vercel.json` is already configured (Vite, `npm run build:site`, output `dist-site`, SPA rewrites for `/docs` and `/playground`).

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Keep the detected settings (they come from `vercel.json`).
3. Deploy. The production URL will look like `https://glass-effect.vercel.app`.

From the CLI, after `npx vercel login`:

```bash
npx vercel --yes
npx vercel --prod
```

## Scripts

```bash
npm install
npm run dev          # landing + docs + playground
npm test
npm run build        # library (npm package)
npm run build:site   # documentation site
npm run typecheck
```

## Browser support

| Engine | Refraction | Frosted fallback |
| --- | --- | --- |
| Chrome, Edge, Arc, Brave | Yes | Yes |
| Safari, Firefox | No (`url()` backdrop-filters) | Yes |

## License

MIT

## Publishing

The package name on npm is [`glass-effect`](https://www.npmjs.com/package/glass-effect).

```bash
npm login
npm publish --access public
```

Or create a GitHub Release. The Publish workflow ships to npm with provenance when `NPM_TOKEN` is set in the repository secrets (npm automation token, publish permission).
