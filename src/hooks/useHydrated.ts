import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during prerender and hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
