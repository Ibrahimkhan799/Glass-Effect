import { type ReactNode } from "react";
import { Glass, GlassButton, GlassCard } from "glass-effect";
import { CodeBlock } from "../components/CodeBlock";
import { PropTable } from "../components/PropTable";
import { Link } from "../router";
import { NotFoundPage } from "./NotFoundPage";

const NAV = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/install", label: "Installation" },
  { href: "/docs/usage", label: "Usage" },
  { href: "/docs/glass", label: "Glass" },
  { href: "/docs/use-glass", label: "useGlass" },
  { href: "/docs/materials", label: "Materials & optics" },
  { href: "/docs/kit", label: "UI kit" },
  { href: "/docs/frameworks", label: "Frameworks" },
  { href: "/docs/browsers", label: "Browser support" },
  { href: "/docs/how-it-works", label: "How it works" },
] as const;

function slugFromPath(path: string): string {
  if (path === "/docs") return "";
  return path.replace(/^\/docs\/?/, "");
}

export function DocsPage({ path }: { path: string }) {
  const slug = slugFromPath(path);
  const page = PAGES[slug];

  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <div className="docs">
      <aside className="docs-sidebar">
        <p className="docs-sidebar-label">Documentation</p>
        <nav>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={path === item.href ? "is-active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <details className="docs-mobile-nav">
        <summary>Documentation</summary>
        <nav>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={path === item.href ? "is-active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
      <article className="docs-content">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        {page.body}
      </article>
    </div>
  );
}

const PAGES: Record<
  string,
  { eyebrow: string; title: string; body: ReactNode }
> = {
  "": {
    eyebrow: "glass-effect",
    title: "Apple Liquid Glass for React",
    body: (
      <>
        <p>
          <code>glass-effect</code> is a React library that paints an
          Apple-inspired Liquid Glass material onto components you already have.
          The surface refracts the live backdrop with a signed-distance
          displacement map and chromatic aberration — it is not{" "}
          <code>backdrop-filter: blur()</code> sitting on top of the page.
        </p>
        <div className="docs-callout">
          <Glass radius={24} style={{ padding: 20 }} material="regular">
            <strong>Keep your UI.</strong>
            <p>
              Wrap a node, merge onto an existing element with{" "}
              <code>asChild</code>, or spread <code>useGlass()</code>. The
              optional kit is convenience, not a requirement.
            </p>
          </Glass>
        </div>
        <h2>Start here</h2>
        <ul className="docs-links">
          <li>
            <Link href="/docs/install">Install the package</Link>
          </li>
          <li>
            <Link href="/docs/usage">Apply glass to existing layouts</Link>
          </li>
          <li>
            <Link href="/docs/materials">Tune refraction and frost</Link>
          </li>
          <li>
            <Link href="/playground">Open the live playground</Link>
          </li>
        </ul>
        <h2>What you get</h2>
        <ul>
          <li>
            Real rim refraction and RGB split via SVG{" "}
            <code>feDisplacementMap</code>
          </li>
          <li>Specular highlight, grain, and tint in CSS</li>
          <li>
            Frosted fallback on Safari and Firefox, where{" "}
            <code>url()</code> backdrop-filters are not supported
          </li>
          <li>
            ESM + CJS + TypeScript types, plus{" "}
            <code>glass-effect/styles.css</code>
          </li>
        </ul>
      </>
    ),
  },
  install: {
    eyebrow: "Setup",
    title: "Installation",
    body: (
      <>
        <p>
          <code>react</code> and <code>react-dom</code> 18 or 19 are peer
          dependencies. The package is a client module (
          <code>&quot;use client&quot;</code> on the entry).
        </p>
        <CodeBlock code={`npm install glass-effect`} />
        <CodeBlock code={`pnpm add glass-effect`} />
        <CodeBlock code={`yarn add glass-effect`} />
        <h2>Import the stylesheet once</h2>
        <p>
          The material needs <code>glass-effect/styles.css</code> in the
          bundle. Import it from your app root, a layout, or next to the first
          glass surface.
        </p>
        <CodeBlock
          code={`import { Glass } from "glass-effect";
import "glass-effect/styles.css";`}
        />
        <h2>Minimal example</h2>
        <CodeBlock
          code={`import { Glass } from "glass-effect";
import "glass-effect/styles.css";

export function Panel() {
  return (
    <Glass radius={24} style={{ padding: 20 }}>
      <h2>Account</h2>
      <p>Your existing content.</p>
    </Glass>
  );
}`}
        />
        <p>
          Place glass over something colourful. Refraction only reads if there
          is content behind the surface to bend.
        </p>
      </>
    ),
  },
  usage: {
    eyebrow: "Guide",
    title: "Usage",
    body: (
      <>
        <p>Pick one of three patterns. They all share the same optics.</p>
        <h2>1. Wrap anything</h2>
        <p>
          <code>Glass</code> is a single host node. It does not inject a flex
          wrapper, so padding, grid, and flow stay yours.
        </p>
        <CodeBlock
          code={`<Glass radius={24} style={{ padding: 20 }}>
  <h2>Account</h2>
  <YourExistingForm />
</Glass>`}
        />
        <h2>2. Merge onto an existing element</h2>
        <p>
          <code>asChild</code> copies the material onto the child you already
          render. The child must be a single element that can take a ref — a
          DOM node like <code>div</code> / <code>aside</code> /{" "}
          <code>button</code>, or a <code>forwardRef</code> component.
        </p>
        <CodeBlock
          code={`<Glass asChild>
  <aside className="sidebar">
    <Nav />
  </aside>
</Glass>`}
        />
        <p>
          If that element already has <code>border-radius</code> in CSS, omit{" "}
          <code>radius</code> and the refraction map picks the computed radius
          up automatically (<code>inheritRadius</code>).
        </p>
        <h2>3. Attach with a hook</h2>
        <p>
          Use this when you want the effect on a component you own without
          changing its JSX tree much.
        </p>
        <CodeBlock
          code={`import { useGlass } from "glass-effect";

export function WeatherCard() {
  const glass = useGlass({ radius: 28, material: "regular" });

  return (
    <section {...glass.props}>
      {glass.filter}
      <h2>San Francisco</h2>
      <p>68°</p>
    </section>
  );
}`}
        />
        <p>
          <code>glass.props</code> is <code>{`{ ref, className, style }`}</code>
          . Put <code>glass.filter</code> inside the same element.
        </p>
      </>
    ),
  },
  glass: {
    eyebrow: "API",
    title: "Glass",
    body: (
      <>
        <p>
          The primitive. Every kit component is this node with a radius and a
          material.
        </p>
        <CodeBlock
          code={`<Glass
  as="section"
  material="regular"
  radius={28}
  interactive
  refraction={80}
>
  {children}
</Glass>`}
        />
        <h2>Props</h2>
        <PropTable
          rows={[
            ["as", "ElementType", '"div"', "Host tag when not using asChild."],
            [
              "asChild",
              "boolean",
              "false",
              "Merge onto the single child instead of wrapping.",
            ],
            [
              "material",
              '"regular" | "clear" | "tinted" | "lens"',
              '"regular"',
              "Optics preset. Individual optics override the preset.",
            ],
            [
              "radius",
              "number | \"pill\" | \"circle\"",
              "28",
              "Corner radius in px, or a shape token. Omit with asChild to inherit CSS radius.",
            ],
            [
              "interactive",
              "boolean",
              "false",
              "Hover lift and press scale.",
            ],
            [
              "className / style",
              "standard",
              "—",
              "Merged onto the host. CSS variables drive tint and light.",
            ],
            [
              "...rest",
              "HTML attributes",
              "—",
              "Forwarded to the host (onClick, aria-*, type, …).",
            ],
          ]}
        />
        <p>
          Optics props (<code>refraction</code>, <code>depth</code>,{" "}
          <code>dispersion</code>, <code>frost</code>, <code>magnify</code>,{" "}
          <code>saturation</code>, <code>tint</code>, <code>lightAngle</code>,{" "}
          <code>lightIntensity</code>) are documented on{" "}
          <Link href="/docs/materials">Materials & optics</Link>.
        </p>
        <h2>asChild rules</h2>
        <ul>
          <li>Exactly one React element child.</li>
          <li>
            That element must accept a ref (DOM node or{" "}
            <code>forwardRef</code>).
          </li>
          <li>
            The SVG filter is injected as the first child of that node. Your
            children stay after it and are not displaced.
          </li>
        </ul>
      </>
    ),
  },
  "use-glass": {
    eyebrow: "API",
    title: "useGlass",
    body: (
      <>
        <p>
          Low-level bind for components you own. Returns props to spread and an
          SVG filter node to render inside the same element.
        </p>
        <CodeBlock
          code={`const glass = useGlass({
  material: "clear",
  radius: 20,
  interactive: true,
  className: "toolbar",
});

return (
  <header {...glass.props}>
    {glass.filter}
    {children}
  </header>
);`}
        />
        <h2>Options</h2>
        <p>
          Same optics and <code>material</code> / <code>radius</code> /{" "}
          <code>interactive</code> as <code>Glass</code>, plus:
        </p>
        <PropTable
          rows={[
            [
              "inheritRadius",
              "boolean",
              "false",
              "When radius is omitted, read computed border-radius from the host. Glass sets this for asChild.",
            ],
            ["className", "string", "—", "Merged with ag-glass."],
            ["style", "CSSProperties", "—", "Merged after CSS variables."],
          ]}
        />
        <h2>Return value</h2>
        <PropTable
          columns={["Field", "Type", "Description"]}
          rows={[
            [
              "props.ref",
              "(node) => void",
              "Attach to the host so size and radius can be measured.",
            ],
            [
              "props.className",
              "string",
              "Includes ag-glass and optional ag-glass--interactive.",
            ],
            [
              "props.style",
              "CSSProperties",
              "Tint, light, backdrop-filter, and radius variables.",
            ],
            [
              "filter",
              "ReactElement | null",
              "Hidden SVG filter. Null when the engine cannot refract.",
            ],
          ]}
        />
      </>
    ),
  },
  materials: {
    eyebrow: "Optics",
    title: "Materials & optics",
    body: (
      <>
        <p>
          A material is a named preset of optics. Pass any optic to override
          that field only.
        </p>
        <PropTable
          columns={["material", "Look"]}
          rows={[
            ["regular", "Control Center / menu glass"],
            ["clear", "Thin, almost clear lens"],
            ["tinted", "Colored overlay (default primary buttons)"],
            ["lens", "Strong magnification and dispersion"],
          ]}
        />
        <div className="docs-materials">
          {(["regular", "clear", "tinted", "lens"] as const).map((material) => (
            <div key={material} className="docs-material">
              <div className="stripes docs-material-stage">
                <Glass
                  radius={material === "lens" ? "circle" : 24}
                  material={material}
                  className="docs-material-orb"
                />
              </div>
              <span>{material}</span>
            </div>
          ))}
        </div>
        <h2>Optics</h2>
        <PropTable
          rows={[
            [
              "refraction",
              "number 0–100",
              "preset",
              "How hard the rim bends light.",
            ],
            [
              "depth",
              "number 0–100",
              "preset",
              "How far the bend reaches inward.",
            ],
            [
              "dispersion",
              "number 0–100",
              "preset",
              "Rainbow fringe (chromatic aberration).",
            ],
            [
              "frost",
              "number 0–100",
              "preset",
              "Scatter. 0 is optically clear.",
            ],
            [
              "magnify",
              "number 0–100",
              "preset",
              "Extra center magnification (lens).",
            ],
            [
              "saturation",
              "number",
              "preset",
              "Backdrop saturation multiplier.",
            ],
            ["tint", "CSS color", "preset", "Body fill over the backdrop."],
            [
              "lightAngle",
              "number (deg)",
              "preset",
              "Specular gradient direction.",
            ],
            [
              "lightIntensity",
              "number 0–1",
              "preset",
              "Specular rim strength.",
            ],
          ]}
        />
        <p>
          Tune these live in the{" "}
          <Link href="/playground">playground inspector</Link>.
        </p>
      </>
    ),
  },
  kit: {
    eyebrow: "Components",
    title: "UI kit",
    body: (
      <>
        <p>
          Optional. Every piece is the same <code>Glass</code> primitive. Use
          the kit, or glass your own buttons.
        </p>
        <div className="docs-kit-demo">
          <GlassCard>
            <h3>Notification</h3>
            <p>Cards, buttons, and the rest share one material.</p>
            <div className="kit-row">
              <GlassButton size="sm">Cancel</GlassButton>
              <GlassButton size="sm" variant="primary">
                Continue
              </GlassButton>
            </div>
          </GlassCard>
        </div>
        <h2>GlassButton</h2>
        <CodeBlock
          code={`<GlassButton size="sm" variant="primary" onClick={save}>
  Save
</GlassButton>`}
        />
        <PropTable
          rows={[
            ['size', '"sm" | "md" | "lg"', '"md"', "Height and padding."],
            [
              "variant",
              '"regular" | "primary" | "ghost"',
              '"regular"',
              "primary uses the tinted material.",
            ],
            ["material", "GlassMaterial", "from variant", "Override the preset."],
          ]}
        />
        <h2>GlassIconButton</h2>
        <p>
          Circular control. <code>size</code> is the pixel width and height
          (default 64).
        </p>
        <h2>GlassCard / GlassPanel</h2>
        <p>
          Block surfaces. Card default radius is 32, panel is 24. Both accept{" "}
          <code>material</code> and standard div attributes.
        </p>
        <h2>GlassSwitch</h2>
        <CodeBlock
          code={`<GlassSwitch checked={on} onChange={setOn} />`}
        />
        <h2>GlassSlider</h2>
        <CodeBlock
          code={`<GlassSlider value={volume} min={0} max={100} onChange={setVolume} />`}
        />
        <h2>GlassSegmented</h2>
        <CodeBlock
          code={`<GlassSegmented
  value={tab}
  onChange={setTab}
  options={[
    { value: "music", label: "Music" },
    { value: "photo", label: "Photo" },
  ]}
/>`}
        />
        <h2>GlassDock</h2>
        <CodeBlock
          code={`<GlassDock
  items={[
    { id: "safari", label: "Safari", icon: <SafariIcon />, onClick },
  ]}
/>`}
        />
        <h2>GlassModal</h2>
        <p>
          Presentational panel (not a portal). Title, body, confirm and cancel
          actions.
        </p>
        <CodeBlock
          code={`<GlassModal
  title="Allow camera?"
  confirmLabel="Allow"
  cancelLabel="Don’t Allow"
  onConfirm={allow}
  onCancel={close}
>
  Photos would like to access the camera.
</GlassModal>`}
        />
        <h2>GlassMenu</h2>
        <CodeBlock
          code={`<GlassMenu
  items={[
    { id: "new", label: "New Folder", onSelect },
    { id: "sep", label: "", separator: true },
    { id: "share", label: "Share…", onSelect },
  ]}
/>`}
        />
        <h2>GlassBadge / GlassInput</h2>
        <p>
          Pill badge (tinted) and pill search field.{" "}
          <code>GlassInput</code> accepts an optional <code>icon</code> and
          native input attributes.
        </p>
        <h2>Glass your own control</h2>
        <CodeBlock
          code={`<Glass asChild>
  <button className="save" type="button">Save</button>
</Glass>`}
        />
      </>
    ),
  },
  frameworks: {
    eyebrow: "Setup",
    title: "Frameworks",
    body: (
      <>
        <h2>Vite</h2>
        <p>
          Import the CSS from <code>main.tsx</code>. No extra config.
        </p>
        <CodeBlock
          code={`import { Glass } from "glass-effect";
import "glass-effect/styles.css";`}
        />
        <h2>Next.js App Router</h2>
        <p>
          The package entry is a client module. Use glass inside a Client
          Component. Import CSS from that file or from a client layout.
        </p>
        <CodeBlock
          code={`"use client";

import { Glass } from "glass-effect";
import "glass-effect/styles.css";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <Glass asChild>
      <aside className="sidebar">{children}</aside>
    </Glass>
  );
}`}
        />
        <p>
          Do not render <code>Glass</code> from a Server Component. Wrap it in
          a small client leaf.
        </p>
        <h2>Next.js Pages Router / Remix / CRA</h2>
        <p>
          Same imports as Vite. Ensure the bundler can resolve the{" "}
          <code>glass-effect/styles.css</code> export (supported on modern
          Next, Vite, and webpack 5).
        </p>
      </>
    ),
  },
  browsers: {
    eyebrow: "Support",
    title: "Browser support",
    body: (
      <>
        <p>
          Chromium can apply an SVG filter as a <code>backdrop-filter</code>.
          Safari and Firefox cannot, so they get a high-quality frosted
          fallback (blur, saturate, tint, specular) without the displacement
          warp.
        </p>
        <PropTable
          columns={["Engine", "Refraction", "Frosted fallback"]}
          rows={[
            ["Chrome, Edge, Arc, Brave", "Yes", "Yes"],
            ["Safari", "No (url() backdrop-filters)", "Yes"],
            ["Firefox", "No (url() backdrop-filters)", "Yes"],
          ]}
        />
        <p>
          Detection uses <code>CSS.supports("backdrop-filter", "url(#…)")</code>
          . You can call <code>supportsSvgBackdropFilter()</code> yourself if
          you need to branch UI.
        </p>
        <p>
          Children are never displaced — only the backdrop is — so text stays
          selectable and buttons stay clickable in every engine.
        </p>
      </>
    ),
  },
  "how-it-works": {
    eyebrow: "Internals",
    title: "How it works",
    body: (
      <>
        <ol className="docs-steps">
          <li>
            Measure the host with <code>ResizeObserver</code> (width, height,
            and optionally computed border-radius).
          </li>
          <li>
            Paint a PNG whose <strong>red</strong> channel is the X offset and{" "}
            <strong>green</strong> channel is the Y offset, from a rounded-box
            signed distance field.
          </li>
          <li>
            Run three <code>feDisplacementMap</code> passes (R, G, B) for
            chromatic aberration, then composite specular, grain, and tint in
            CSS.
          </li>
          <li>
            Apply <code>backdrop-filter: url(#filter)</code> in Chromium, with
            a frosted <code>blur()</code> fallback elsewhere.
          </li>
        </ol>
        <p>
          Displacement maps are cached by size and optics. The SVG filter is
          inline and unique per instance so multiple surfaces can sit on one
          page.
        </p>
        <CodeBlock
          code={`import {
  generateDisplacementBuffer,
  supportsSvgBackdropFilter,
  GLASS_PRESETS,
} from "glass-effect";`}
        />
        <p>
          Those low-level helpers are exported if you want to build a custom
          surface. For app UI, prefer <code>Glass</code> or{" "}
          <code>useGlass</code>.
        </p>
      </>
    ),
  },
};
