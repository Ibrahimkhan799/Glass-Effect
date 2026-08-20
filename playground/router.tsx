import {
  forwardRef,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export function usePathname(): string {
  const [path, setPath] = useState(
    () => window.location.pathname.replace(/\/$/, "") || "/",
  );

  useEffect(() => {
    const sync = () =>
      setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return path;
}

export function navigate(to: string): void {
  const url = to.startsWith("#") ? `${window.location.pathname}${to}` : to;
  if (url === `${window.location.pathname}${window.location.hash}`) {
    if (to.startsWith("#")) {
      document.getElementById(to.slice(1))?.scrollIntoView();
    }
    return;
  }
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (to.includes("#")) {
    const id = to.slice(to.indexOf("#") + 1);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  } else {
    window.scrollTo(0, 0);
  }
}

export const Link = forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    className?: string;
    children: ReactNode;
  }
>(function Link({ href, className, children }, ref) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return (
    <a ref={ref} href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
});
