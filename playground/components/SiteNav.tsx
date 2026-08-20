import { Glass } from "glass-effect";
import { Link, usePathname } from "../router";
import { GlassLink } from "./GlassLink";

const GITHUB = "https://github.com/Ibrahimkhan799/Glass-Effect";
const NPM = "https://www.npmjs.com/package/glass-effect";

export function SiteNav() {
  const path = usePathname();

  return (
    <header className="nav">
      <Link href="/" className="nav-brand">
        <Glass radius="pill" className="nav-pill" material="regular">
          <strong>glass-effect</strong>
          <span>React · Liquid Glass</span>
        </Glass>
      </Link>
      <nav className="nav-links">
        <Link href="/docs" className={path.startsWith("/docs") ? "is-active" : ""}>
          Docs
        </Link>
        <Link
          href="/playground"
          className={path.startsWith("/playground") ? "is-active" : ""}
        >
          Playground
        </Link>
        <Link href={GITHUB}>GitHub</Link>
        <Link href={NPM}>npm</Link>
        <GlassLink href="/docs" size="sm" variant="primary">
          Get started
        </GlassLink>
      </nav>
    </header>
  );
}
