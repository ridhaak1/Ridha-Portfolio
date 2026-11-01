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

/** Isometric stack: gap (share of plane width) and tight gap (px), hover lift and dimming, mouse
 * tilt (deg), and the still hold after phase 3 (share of the story, so hover has time to matter) */
export const STACK = { gap: 0.16, tightGap: 8, lift: 36, dim: 0.35, tilt: 4, hold: 0.12 } as const;

/**
 * Contact's 3D corridor, all z in px. Mirrors `perspective` in Contact.module.css.
 * passAt → goneAt is the range where a word fades, scales and blurs past the camera.
 */
export const CORRIDOR = {
  perspective: 1000,
  travel: 4200,
  nearZ: -600,
  farZ: -4000,
  planeZ: -4200,
  passAt: -300,
  goneAt: 150,
  blur: 6,
  passScale: 1.3,
  farOpacity: 0.15,
  plateStart: 1,
  plateEnd: 0.45,
  /** Hairline frames along the corridor: how many, from where to where (the deepest ones are
   *  behind the plate, still showing on arrival), how bright up close */
  gateCount: 11,
  gateNear: -350,
  gateFar: -6800,
  gateOpacity: 0.32,
  /** The plane fades in over this stretch of the approach */
  planeFrom: -900,
  planeTo: -100,
  /** Still hold after arriving, as a share of the flight */
  hold: 0.14,
  /** Mouse steering: px at the viewport edge, degrees */
  steer: 40,
  tilt: 3,
  /** Max pull of the email line, px */
  magnetic: 10,
  /** Phones: seconds to play the flight */
  autoplay: 2.5,
} as const;
