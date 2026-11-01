export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const MOBILE = "(max-width: 899px)";

/** One-off check for use inside effects and event handlers */
export function matches(query: string): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}
