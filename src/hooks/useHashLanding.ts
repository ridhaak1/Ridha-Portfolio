import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router";
import { ScrollTrigger } from "@/motion/gsap";
import { jumpToSection, jumpToY } from "@/motion/lenis";

const SAVED_SCROLL = "home-scroll";
/** A plain page load: nothing to restore, even if this tab was here earlier */
let freshLoad = true;

function savedScroll(): number | null {
  try {
    const saved = sessionStorage.getItem(SAVED_SCROLL);
    return saved === null ? null : Number(saved);
  } catch {
    return null;
  }
}

/**
 * Lands on the section in the URL's hash, or back where the visitor was after a reload or the back
 * button. The router's own restoration can't: pinned sections set their height from effects, so at
 * that moment the page is too short. It waits for those, fonts and ScrollTrigger.refresh. Call it
 * after useLenis. Once the visitor scrolls, it leaves them alone.
 */
export function useHashLanding() {
  const { hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isPlainLoad = freshLoad && entry?.type === "navigate";
    freshLoad = false;

    const target = hash ? document.getElementById(hash.slice(1)) : null;
    const y = !hash && navigationType === "POP" && !isPlainLoad ? savedScroll() : null;
    if (!target && !y) return;

    let done = false;
    const land = () => {
      if (done) return;
      ScrollTrigger.refresh();
      if (target) jumpToSection(target);
      else if (y) jumpToY(y);
      ScrollTrigger.update();
    };
    const whenFontsAreIn = () => {
      void document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(land)));
    };
    const stop = () => (done = true);

    whenFontsAreIn();
    if (document.readyState !== "complete") window.addEventListener("load", whenFontsAreIn, { once: true });
    const inputs = ["wheel", "touchstart", "keydown"] as const;
    inputs.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true }));

    return () => {
      stop();
      window.removeEventListener("load", whenFontsAreIn);
      inputs.forEach((type) => window.removeEventListener(type, stop));
    };
  }, [hash, navigationType]);

  // Remembered continuously: by the time the page unmounts, the next route has replaced it
  useEffect(() => {
    let y = window.scrollY;
    const onScroll = () => (y = window.scrollY);
    const save = () => {
      try {
        sessionStorage.setItem(SAVED_SCROLL, String(y));
      } catch {
        // Storage blocked: a reload just starts from the top
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      save();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
    };
  }, []);
}
