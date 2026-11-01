/* Motion tokens — mirrored as CSS variables in styles/design-tokens.css */

/** cubic-bezier(0.16, 1, 0.3, 1), registered as a GSAP ease in motion/gsap.ts */
export const EASE = "expo-out";
export const EASE_BEZIER = [0.16, 1, 0.3, 1] as const;

export const DUR = { fast: 0.6, base: 0.9, slow: 1.2 } as const;

/*
 * The hero intro is pure CSS (it runs from first paint, before hydration):
 * its timings live as --intro-* custom properties in styles/design-tokens.css.
 */

/** Mouse parallax, px at the viewport edge (cutout moves opposite to the plate) */
export const PARALLAX = {
  plate: 6,
  name: 14,
  cutout: 24,
  /** Scene tilt, degrees */
  tilt: 2,
  /** Lerp time for every layer */
  duration: 0.8,
} as const;

/** Touch devices: gentle autonomous float instead of parallax */
export const FLOAT = { amplitude: 5, period: 7 } as const;

/** Repeat visits and reduced motion: everything just fades in */
export const FADE = { duration: 0.4 } as const;

/** Internship notice appears this long after the intro finishes */
export const NOTICE_DELAY = 2;
