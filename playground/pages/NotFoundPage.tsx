import { GlassLink } from "../components/GlassLink";

export function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page is not in the glass</h1>
      <p className="lede">That URL is not part of the docs or playground.</p>
      <div className="hero-actions">
        <GlassLink href="/" variant="primary">
          Home
        </GlassLink>
        <GlassLink href="/docs">Docs</GlassLink>
      </div>
    </section>
  );
}
