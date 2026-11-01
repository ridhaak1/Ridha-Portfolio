import { useLayoutEffect, type RefObject } from "react";

/**
 * Keeps an attribute on an element in step with a media query, from the first commit. Pinned sections
 * set their height this way, without waiting for their animation code, so the page never changes
 * length under the visitor and anchors land right. Without a ref, it goes on <html>.
 */
export function useMediaAttribute(ref: RefObject<HTMLElement | null> | null, attribute: string, query: string) {
  useLayoutEffect(() => {
    const el = ref ? ref.current : document.documentElement;
    if (!el) return;
    const mql = window.matchMedia(query);
    const apply = () => el.toggleAttribute(attribute, mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => {
      mql.removeEventListener("change", apply);
      el.removeAttribute(attribute);
    };
  }, [ref, attribute, query]);
}
