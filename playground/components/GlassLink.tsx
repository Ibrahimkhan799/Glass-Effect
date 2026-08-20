import { Glass } from "glass-effect";
import { Link } from "../router";
import type { ReactNode } from "react";

export function GlassLink({
  href,
  children,
  size = "md",
  variant = "regular",
  className,
}: {
  href: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "regular" | "primary" | "ghost";
  className?: string;
}) {
  const radius = size === "sm" ? 18 : size === "lg" ? 26 : 22;
  return (
    <Glass
      asChild
      interactive
      radius={radius}
      material={variant === "primary" ? "tinted" : "regular"}
    >
      <Link
        href={href}
        className={["ag-btn", `ag-btn--${size}`, `ag-btn--${variant}`, className]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </Link>
    </Glass>
  );
}
