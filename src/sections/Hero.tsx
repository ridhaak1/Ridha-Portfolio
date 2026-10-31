import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { site } from "@/config/site";
import Hud from "@/components/hero/Hud";
import { HERO_MODE_SCRIPT } from "@/motion/capabilities";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { markIntroDone } from "@/motion/intro";
import { FINE_POINTER, matches, MOBILE, REDUCED_MOTION } from "@/motion/media";
import { FLOAT, PARALLAX } from "@/motion/tokens";
import { fallbackSrc, grainUrl, heroMeta, MOBILE_MEDIA, SIZES, srcSet } from "./heroAssets";
import styles from "./Hero.module.css";

const { desktop, mobile } = heroMeta;

/** Scene geometry from the asset pipeline: aspect ratio and where the head is */
const sceneVars = {
  "--aspect-d": desktop.aspect,
  "--aspect-m": mobile.aspect,
  "--head-x-d": desktop.head.x,
  "--head-y-d": desktop.head.y,
  "--head-x-m": mobile.head.x,
  "--head-y-m": mobile.head.y,
  "--grain": `url(${grainUrl})`,
} as CSSProperties;

function Layer({ layer, alt, priority }: { layer: "plate" | "cutout"; alt: string; priority?: boolean }) {
  const w = Math.round(desktop.widths[0]);
  return (
    <picture>
      <source media={MOBILE_MEDIA} type="image/avif" srcSet={srcSet(layer, "mobile", "avif")} sizes={SIZES.mobile} />
      <source media={MOBILE_MEDIA} type="image/webp" srcSet={srcSet(layer, "mobile", "webp")} sizes={SIZES.mobile} />
      <source type="image/avif" srcSet={srcSet(layer, "desktop", "avif")} sizes={SIZES.desktop} />
      <source type="image/webp" srcSet={srcSet(layer, "desktop", "webp")} sizes={SIZES.desktop} />
      <img
        className={styles.img}
        src={fallbackSrc(layer)}
        width={w}
        height={Math.round(w / desktop.aspect)}
        alt={alt}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
      />
    </picture>
  );
}

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const q = gsap.utils.selector(stage);
    const [scene] = q("[data-scene]");
    const [plateLayer, nameLayer, cutoutLayer, frontLayer] = q("[data-layer]");
    const [plate] = q("[data-plate]");
    const [, cutout] = q("picture");
    const reduced = matches(REDUCED_MOTION);
    const mode = document.documentElement.dataset.hero;

    // Intro is pure CSS; it reports back when the last step (the claim) has played
    let introTimer: ReturnType<typeof setTimeout> | undefined;
    if (mode === "intro") {
      const claim = q("[data-claim]")[0];
      const done = () => markIntroDone();
      claim?.addEventListener("animationend", done, { once: true });
      introTimer = setTimeout(done, 3500); // safety net (e.g. animations disabled)
    } else {
      markIntroDone();
    }

    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      // Depth: mouse parallax + a tiny tilt (fine pointer), or a slow float (touch)
      if (!reduced && matches(FINE_POINTER) && !matches(MOBILE)) {
        const d = PARALLAX.duration;
        const ease = "power3.out";
        const to = (el: Element, prop: string) => gsap.quickTo(el, prop, { duration: d, ease });
        const moves = [
          [plateLayer, -PARALLAX.plate],
          [nameLayer, PARALLAX.name],
          [frontLayer, PARALLAX.name],
          [cutoutLayer, PARALLAX.cutout],
        ].map(([el, amount]) => ({ x: to(el as Element, "x"), y: to(el as Element, "y"), amount: amount as number }));
        const tiltX = to(scene, "rotationX");
        const tiltY = to(scene, "rotationY");

        const onMove = (e: PointerEvent) => {
          if (window.scrollY > window.innerHeight) return; // hero offscreen
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          moves.forEach((m) => {
            m.x(nx * m.amount);
            m.y(ny * m.amount * 0.6);
          });
          tiltY(nx * PARALLAX.tilt);
          tiltX(-ny * PARALLAX.tilt);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      } else if (!reduced) {
        const float = (el: Element, amount: number, phase: number) =>
          gsap.fromTo(
            el,
            { y: -amount },
            { y: amount, duration: FLOAT.period / 2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: phase },
          );
        float(plateLayer, FLOAT.amplitude * 0.4, 0);
        float(nameLayer, FLOAT.amplitude * 0.7, 0.6);
        float(cutoutLayer, FLOAT.amplitude, 1.2);
      }

      // Scroll exit: the name splits off-frame, the camera pushes in, the scene darkens
      // while the next section rises over the (sticky) hero. Reversible.
      const tl = gsap.timeline({
        defaults: { ease: "none", immediateRender: false },
        scrollTrigger: { start: 0, end: () => window.innerHeight, scrub: true, invalidateOnRefresh: true },
      });
      tl.fromTo(q("[data-shade]"), { opacity: 0 }, { opacity: 0.7, duration: 1 }, 0).fromTo(
        q("[data-claim], [data-hud]"),
        { opacity: 1 },
        { opacity: 0, duration: 0.35 },
        0,
      );
      if (!reduced) {
        tl.fromTo(q("[data-word='rid']"), { x: 0 }, { x: () => -0.6 * window.innerWidth, duration: 1 }, 0)
          .fromTo(q("[data-word='ha']"), { x: 0 }, { x: () => 0.6 * window.innerWidth, duration: 1 }, 0)
          .fromTo(plate, { scale: 1 }, { scale: 1.12, duration: 1 }, 0)
          .fromTo(cutout, { scale: 1 }, { scale: 1.25, duration: 1 }, 0);
      }
    }, stage);

    let alive = true;
    document.fonts.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      clearTimeout(introTimer);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.hero} data-hero-track>
      {/* Picks intro / rest / reduced before first paint (see motion/capabilities.ts) */}
      <script dangerouslySetInnerHTML={{ __html: HERO_MODE_SCRIPT }} />

      <div ref={stageRef} className={styles.stage} style={sceneVars}>
        <div className={styles.scene} data-scene>
          <div className={styles.layer} data-layer>
            <div className={styles.plate} data-plate>
              <Layer layer="plate" alt="" priority />
            </div>
          </div>

          <div className={styles.layer} data-layer>
            <h1 className={styles.name} aria-label={site.name}>
              <span className={styles.word} data-word="rid" aria-hidden="true">
                {["R", "I", "D"].map((ch, i) => (
                  <span key={i} className={styles.mask}>
                    <span className={styles.letter} style={{ "--i": i } as CSSProperties}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
              <span className={styles.word} data-word="ha" aria-hidden="true">
                {["H", "A"].map((ch, i) => (
                  <span key={i} className={styles.mask}>
                    <span className={styles.letter} style={{ "--i": i + 3 } as CSSProperties}>
                      {ch}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <div className={styles.layer} data-layer>
            <div className={styles.cutout}>
              <Layer layer="cutout" alt="Ridha Al-Khaykanee at a café table, looking to the side" />
            </div>
          </div>

          <div className={styles.layer} data-layer>
            <p className={styles.claim} data-claim>
              Software that <em>feels</em> right.
            </p>
          </div>
        </div>

        <div className={styles.shade} data-shade aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <Hud />
      </div>
    </section>
  );
}
