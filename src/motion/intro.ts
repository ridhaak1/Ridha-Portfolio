/**
 * Once-per-session intro state, shared between the hero (which plays it)
 * and anything that waits for it (the internship notice).
 */

const STORAGE_KEY = "intro-played";

let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  done = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage blocked: the intro simply plays again next visit
  }
  listeners.forEach((listener) => listener());
  listeners.clear();
}

/** Calls back once the intro has finished (immediately if it already has) */
export function onIntroDone(callback: () => void): () => void {
  if (done) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
