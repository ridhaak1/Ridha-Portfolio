import { gsap } from "./gsap";
import { FLOAT, PARALLAX } from "./tokens";

/** A layer and how far it travels (px at the viewport edge; negative = opposite way) */
export type DepthLayer = [Element, number];

/**
 * Mouse parallax + a tiny scene tilt (fine pointers). Each layer is lerped with
 * gsap.quickTo; `isActive` lets a section ignore the pointer while offscreen.
 * Returns a cleanup function.
 */
export function createParallax(layers: DepthLayer[], scene: Element | null, isActive: () => boolean = () => true) {
  const opts = { duration: PARALLAX.duration, ease: "power3.out" };
  const moves = layers.map(([el, amount]) => ({
    x: gsap.quickTo(el, "x", opts),
    y: gsap.quickTo(el, "y", opts),
    amount,
  }));
  const tiltX = scene ? gsap.quickTo(scene, "rotationX", opts) : null;
  const tiltY = scene ? gsap.quickTo(scene, "rotationY", opts) : null;

  const onMove = (e: PointerEvent) => {
    if (!isActive()) return;
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    moves.forEach((m) => {
      m.x(nx * m.amount);
      m.y(ny * m.amount * 0.6);
    });
    tiltY?.(nx * PARALLAX.tilt);
    tiltX?.(-ny * PARALLAX.tilt);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}

/** Touch devices: a slow autonomous float instead of parallax (one tween per layer) */
export function createFloat(layers: DepthLayer[]) {
  const tweens = layers.map(([el, amount], i) =>
    gsap.fromTo(
      el,
      { y: -amount },
      { y: amount, duration: FLOAT.period / 2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.6 },
    ),
  );
  return () => tweens.forEach((t) => t.kill());
}
