import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { useGlass, type UseGlassOptions } from "../hooks/useGlass";
import type { GlassMaterial, GlassOptics, GlassRadius } from "../types";
import { cx, getElementRef, mergeRefs, mergeStyles } from "../utils/compose";

export interface GlassProps
  extends Omit<ButtonHTMLAttributes<HTMLElement>, "color">,
    Partial<GlassOptics> {
  as?: ElementType;
  /**
   * Merge the glass material onto your existing element instead of wrapping.
   * The child must be a single element that can take a ref (a DOM node or a
   * `forwardRef` component).
   */
  asChild?: boolean;
  children?: ReactNode;
  radius?: GlassRadius;
  material?: GlassMaterial;
  interactive?: boolean;
}

export function Glass({
  as: Component = "div",
  asChild = false,
  children,
  className,
  style,
  radius,
  material,
  interactive,
  refraction,
  depth,
  dispersion,
  frost,
  magnify,
  saturation,
  tint,
  lightAngle,
  lightIntensity,
  ...rest
}: GlassProps) {
  const glass = useGlass({
    radius,
    material,
    interactive,
    className,
    style,
    refraction,
    depth,
    dispersion,
    frost,
    magnify,
    saturation,
    tint,
    lightAngle,
    lightIntensity,
    inheritRadius: asChild,
  } satisfies UseGlassOptions);

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) {
      throw new Error("Glass asChild expects a single React element.");
    }

    const childEl = child as ReactElement<{
      className?: string;
      style?: GlassProps["style"];
      children?: ReactNode;
    }>;

    return cloneElement(childEl, {
      ...rest,
      className: cx(glass.props.className, childEl.props.className),
      style: mergeStyles(glass.props.style, childEl.props.style),
      ref: mergeRefs(glass.props.ref, getElementRef(childEl)),
      children: (
        <>
          {glass.filter}
          {childEl.props.children}
        </>
      ),
    } as never);
  }

  return (
    <Component
      className={glass.props.className}
      style={glass.props.style}
      {...rest}
      ref={glass.props.ref}
    >
      {glass.filter}
      {children}
    </Component>
  );
}
