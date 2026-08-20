import { Glass, useGlass } from "glass-effect";
import { CodeBlock } from "../components/CodeBlock";
import { GlassLink } from "../components/GlassLink";
import { ControlCenter } from "../showcase";

const install = `npm install glass-effect`;

const wrapExample = `import { Glass } from "glass-effect";
import "glass-effect/styles.css";

<Glass radius={24} style={{ padding: 20 }}>
  <YourCard />
</Glass>`;

const asChildExample = `<Glass asChild>
  <aside className="sidebar">
    <Nav />
  </aside>
</Glass>`;

const hookExample = `const glass = useGlass({ radius: 28 });

<section {...glass.props}>
  {glass.filter}
  <YourLayout />
</section>`;

export function HomePage() {
  const weather = useGlass({ material: "regular", radius: 28 });

  return (
    <>
      <section className="hero">
        <div className="hero-sky" />
        <div className="hero-copy">
          <p className="eyebrow">iOS 26 / visionOS material</p>
          <h1>Liquid Glass for React</h1>
          <p className="lede">
            Reflects and refracts what’s beneath it in real time — the same
            optical idea as Apple’s Liquid Glass, built with SVG displacement
            maps. Drop it onto layouts you already have.
          </p>
          <div className="hero-actions">
            <GlassLink href="/docs" size="lg" variant="primary">
              Get started
            </GlassLink>
            <GlassLink href="/playground" size="lg">
              Open playground
            </GlassLink>
          </div>
        </div>
        <ControlCenter />
      </section>

      <section className="home-section">
        <div className="lab-copy">
          <p className="eyebrow">Add to existing UI</p>
          <h2>Three ways to apply the material</h2>
          <p>
            <code>Glass</code> is a single host node. It does not inject a flex
            wrapper, so your padding, grid, and flow stay yours.
          </p>
        </div>
        <div className="home-methods">
          <article className="home-method">
            <h3>Wrap</h3>
            <p>Put glass around anything you already render.</p>
            <CodeBlock code={wrapExample} />
          </article>
          <article className="home-method">
            <h3>asChild</h3>
            <p>Paint the tag you already use. Radius is inherited from CSS.</p>
            <div className="home-live">
              <Glass asChild>
                <aside className="your-sidebar">
                  <h3>Your sidebar</h3>
                  <p>Keep the element. Keep the styles.</p>
                </aside>
              </Glass>
            </div>
            <CodeBlock code={asChildExample} />
          </article>
          <article className="home-method">
            <h3>useGlass</h3>
            <p>Spread the material onto a component you own.</p>
            <div
              {...weather.props}
              className={`${weather.props.className} your-weather`}
            >
              {weather.filter}
              <span>San Francisco</span>
              <strong>68°</strong>
              <span>Your widget, this material</span>
            </div>
            <CodeBlock code={hookExample} />
          </article>
        </div>
      </section>

      <section className="home-section home-install">
        <div className="lab-copy">
          <p className="eyebrow">Install</p>
          <h2>One package, one stylesheet</h2>
        </div>
        <CodeBlock code={install} />
        <p className="home-note">
          Works with Vite, Next.js App Router (this package is a client
          module), Remix, and CRA. <code>react</code> and <code>react-dom</code>{" "}
          ≥ 18 are peer dependencies.
        </p>
        <div className="hero-actions">
          <GlassLink href="/docs/install" variant="primary">
            Installation guide
          </GlassLink>
          <GlassLink href="/docs/kit">UI kit reference</GlassLink>
        </div>
      </section>
    </>
  );
}
