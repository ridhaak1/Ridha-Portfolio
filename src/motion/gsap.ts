import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { EASE, EASE_BEZIER } from "./tokens";

// Import GSAP from here so plugins and the shared ease are always registered.
// Guarded because route modules are also evaluated during prerendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  // The address bar showing or hiding on phones mustn't recalculate every pin
  ScrollTrigger.config({
    ignoreMobileResize: true,
    // Not "load": it's a full recalculation mid-startup, and pin heights don't depend on images.
    // Fonts can move text, so Hero refreshes once they're in.
    autoRefreshEvents: "visibilitychange,DOMContentLoaded",
  });
  const [x1, y1, x2, y2] = EASE_BEZIER;
  CustomEase.create(EASE, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
}

export { gsap, ScrollTrigger, SplitText };
