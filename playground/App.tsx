import { useEffect } from "react";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { DocsPage } from "./pages/DocsPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { usePathname } from "./router";

const TITLES: Record<string, string> = {
  "/": "glass-effect — Apple Liquid Glass for React",
  "/playground": "Playground — glass-effect",
  "/docs": "Docs — glass-effect",
  "/docs/install": "Installation — glass-effect",
  "/docs/usage": "Usage — glass-effect",
  "/docs/glass": "Glass — glass-effect",
  "/docs/use-glass": "useGlass — glass-effect",
  "/docs/materials": "Materials — glass-effect",
  "/docs/kit": "UI kit — glass-effect",
  "/docs/frameworks": "Frameworks — glass-effect",
  "/docs/browsers": "Browser support — glass-effect",
  "/docs/how-it-works": "How it works — glass-effect",
};

export default function App() {
  const path = usePathname();

  useEffect(() => {
    document.title = TITLES[path] ?? "glass-effect";
  }, [path]);

  let page = <NotFoundPage />;
  if (path === "/") page = <HomePage />;
  else if (path === "/playground") page = <PlaygroundPage />;
  else if (path.startsWith("/docs")) page = <DocsPage path={path} />;

  return (
    <div className="page">
      <SiteNav />
      {page}
      <SiteFooter />
    </div>
  );
}
