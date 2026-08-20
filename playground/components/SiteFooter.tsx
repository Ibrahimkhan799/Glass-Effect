import { Link } from "../router";

const GITHUB = "https://github.com/Ibrahimkhan799/Glass-Effect";
const NPM = "https://www.npmjs.com/package/glass-effect";

export function SiteFooter() {
  return (
    <footer className="foot">
      <p>Apple-inspired Liquid Glass · real SVG refraction · MIT</p>
      <p className="foot-links">
        <Link href="/docs">Docs</Link>
        <Link href="/playground">Playground</Link>
        <Link href={GITHUB}>GitHub</Link>
        <Link href={NPM}>npm</Link>
      </p>
    </footer>
  );
}
