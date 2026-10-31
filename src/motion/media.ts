import { useSyncExternalStore } from "react";

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const MOBILE = "(max-width: 899px)";

/** One-off check for use inside effects and event handlers */
export function matches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

/** Live media query; false during prerendering and hydration */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION);
export const useFinePointer = () => useMediaQuery(FINE_POINTER);
