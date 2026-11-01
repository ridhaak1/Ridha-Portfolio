import { gsap, ScrollTrigger } from "./gsap";
import { getLenis } from "./lenis";
import { MARQUEE } from "./tokens";

/**
 * An endless strip that drifts slowly, speeds up with Lenis' scroll velocity, follows the
 * scroll direction and skews while moving (easing back to 0). `track` holds `copies`
 * identical phrases. Only ticks while `root` is on screen. Returns a cleanup function.
 */
export function createVelocityMarquee(root: Element, track: Element, copies: number) {
  const wrap = gsap.utils.wrap(-100 / copies, 0);
  const clampSkew = gsap.utils.clamp(-MARQUEE.maxSkew, MARQUEE.maxSkew);
  const setX = gsap.quickSetter(track, "xPercent");
  const toSkew = gsap.quickTo(track, "skewX", { duration: MARQUEE.skewEase, ease: "power3.out" });
  let x = 0;
  let direction = -1;

  const tick = (_time: number, deltaMs: number) => {
    // Read every tick: Lenis starts after this section's effects have run
    const velocity = getLenis()?.velocity ?? 0;
    if (velocity !== 0) direction = velocity > 0 ? -1 : 1;
    const boost = Math.min(Math.abs(velocity) * MARQUEE.boostPerVelocity, MARQUEE.maxBoost);
    x = wrap(x + direction * (MARQUEE.baseSpeed + boost) * (Math.min(deltaMs, 50) / 1000));
    setX(x);
    toSkew(clampSkew(-velocity * MARQUEE.skewPerVelocity));
  };

  const offscreen = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      if (self.isActive) {
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
        toSkew(0);
      }
    },
  });
  if (offscreen.isActive) gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    offscreen.kill();
    gsap.killTweensOf(track);
  };
}
