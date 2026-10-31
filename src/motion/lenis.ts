import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";
import { matches, REDUCED_MOTION } from "./media";

let instance: Lenis | null = null;

export const getLenis = () => instance;

/**
 * Smooth scroll for the lifetime of the calling component, driven by GSAP's
 * ticker so ScrollTrigger stays in sync. Mounted by the home route only, so
 * other routes keep native scrolling. Off under reduced motion.
 */
export function useLenis() {
  useEffect(() => {
    if (matches(REDUCED_MOTION)) return;

    const lenis = new Lenis({ autoRaf: false });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);
}

/** Scrolls to an element with Lenis when it's running, natively otherwise */
export function scrollToElement(target: HTMLElement) {
  const lenis = instance;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: matches(REDUCED_MOTION) ? "auto" : "smooth" });
  }
}
