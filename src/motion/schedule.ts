import { onIntroDone } from "./intro";

type Cleanup = void | (() => void);

const queue: Array<() => void> = [];
const WAKE_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
let armed = false;
let open = false;
let draining = false;

/** One task per turn of the event loop, so a slow phone never sees them as one long freeze */
function drain() {
  const task = queue.shift();
  if (!task) {
    draining = false;
    return;
  }
  draining = true;
  try {
    task();
  } finally {
    setTimeout(drain, 0);
  }
}

function openGate() {
  if (open) return;
  open = true;
  WAKE_EVENTS.forEach((type) => window.removeEventListener(type, openGate));
  if (!draining) drain();
}

function arm() {
  if (armed) return;
  armed = true;
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  // Arriving mid-page (a deep link, a reload, the back button): there's no intro to wait for
  if (window.location.hash || (entry && entry.type !== "navigate")) return openGate();
  WAKE_EVENTS.forEach((type) => window.addEventListener(type, openGate, { passive: true }));
  onIntroDone(() => {
    if (window.requestIdleCallback) window.requestIdleCallback(openGate, { timeout: 800 });
    else setTimeout(openGate, 200);
  });
}

/**
 * Runs non-critical setup once the hero intro has finished and the browser is idle, or at the first
 * sign of the visitor doing something. `init` may return a cleanup; the returned function cancels
 * it or runs that cleanup, so it can be returned straight from an effect.
 */
export function afterIntro(init: () => Cleanup) {
  let cancelled = false;
  let cleanup: Cleanup;
  arm();
  queue.push(() => {
    if (!cancelled) cleanup = init();
  });
  if (open && !draining) drain();
  return () => {
    cancelled = true;
    if (cleanup) cleanup();
  };
}

/**
 * Calls `load` once, when `el` comes within `margin` of the screen (a viewport by default), or at the
 * first Tab, because keyboard focus can jump straight into the section. `load` may return a cleanup;
 * the returned function cancels it or runs that cleanup.
 */
export function whenNear(el: Element, load: () => Cleanup, margin = "100%") {
  let done = false;
  let cleanup: Cleanup;
  const fire = () => {
    if (done) return;
    done = true;
    stop();
    cleanup = load();
  };
  const observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && fire(), {
    rootMargin: `${margin} 0px ${margin} 0px`,
  });
  const onKey = (e: KeyboardEvent) => e.key === "Tab" && fire();
  const stop = () => {
    observer.disconnect();
    window.removeEventListener("keydown", onKey);
  };
  observer.observe(el);
  window.addEventListener("keydown", onKey);
  return () => {
    done = true;
    stop();
    if (cleanup) cleanup();
  };
}

/**
 * Loads a section's animation module when it's near. If the module can't load (offline, say), the
 * section falls back to its plain layout rather than staying hidden.
 */
export function loadMotionWhenNear<T extends { cleanup: () => void }>(
  track: HTMLElement,
  load: () => Promise<(track: HTMLElement) => T>,
  onReady: (motion: T | null) => void,
) {
  let stopped = false;
  let motion: T | null = null;
  const cancel = whenNear(track, () => {
    load()
      .then((init) => {
        if (stopped) return;
        motion = init(track);
        track.setAttribute("data-live", "");
        onReady(motion);
      })
      .catch(() => {
        if (!stopped) track.removeAttribute("data-pinned");
      });
  });
  return () => {
    stopped = true;
    cancel();
    motion?.cleanup();
    track.removeAttribute("data-live");
    onReady(null);
  };
}
