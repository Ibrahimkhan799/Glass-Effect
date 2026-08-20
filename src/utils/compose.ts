import {
  type CSSProperties,
  type ReactElement,
  type Ref,
  type RefCallback,
} from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function mergeStyles(
  ...styles: Array<CSSProperties | undefined>
): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

export function getElementRef(element: ReactElement): Ref<HTMLElement> | undefined {
  const fromProps = (element.props as { ref?: Ref<HTMLElement> }).ref;
  const fromElement = (element as { ref?: Ref<HTMLElement> }).ref;
  return fromProps ?? fromElement;
}
