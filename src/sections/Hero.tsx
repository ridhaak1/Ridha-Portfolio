import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { site } from "@/config/site";
import Hud from "@/components/hero/Hud";
import { HERO_MODE_SCRIPT } from "@/motion/capabilities";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { markIntroDone } from "@/motion/intro";
import { FINE_POINTER, matches, MOBILE, REDUCED_MOTION } from "@/motion/media";
import { createFloat, createParallax, type DepthLayer } from "@/motion/parallax";
import { afterIntro } from "@/motion/schedule";
import { FLOAT, PARALLAX } from "@/motion/tokens";
import { fallbackSrc, grainUrl, heroMeta, HERO_PORTRAIT, SIZES, srcSet } from "./heroAssets";
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
      <source media={HERO_PORTRAIT} type="image/avif" srcSet={srcSet(layer, "mobile", "avif")} sizes={SIZES.mobile} />
      <source media={HERO_PORTRAIT} type="image/webp" srcSet={srcSet(layer, "mobile", "webp")} sizes={SIZES.mobile} />
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
      // On a slow device the CSS intro can finish before the page has even hydrated
      if (claim?.getAnimations().every((a) => a.playState === "finished")) done();
      else {
        claim?.addEventListener("animationend", done, { once: true });
        introTimer = setTimeout(done, 3500); // safety net (e.g. animations disabled)
      }
    } else {
      markIntroDone();
    }

    // Parallax and the scroll exit aren't needed until the intro is over
    const stopMotion = afterIntro(() => {
      const cleanups: Array<() => void> = [];
      const ctx = gsap.context(() => {
        // Depth: mouse parallax + a tiny tilt (fine pointer), or a slow float (touch)
        if (!reduced && matches(FINE_POINTER) && !matches(MOBILE)) {
          const layers: DepthLayer[] = [
            [plateLayer, -PARALLAX.plate],
            [nameLayer, PARALLAX.name],
            [frontLayer, PARALLAX.name],
            [cutoutLayer, PARALLAX.cutout],
          ];
          cleanups.push(createParallax(layers, scene, () => window.scrollY < window.innerHeight));
        } else if (!reduced) {
          createFloat([
            [plateLayer, FLOAT.amplitude * 0.4],
            [nameLayer, FLOAT.amplitude * 0.7],
            [cutoutLayer, FLOAT.amplitude],
          ]);
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
      document.fonts.ready.then(() => {
        // Once the queue of deferred setup has run, on its own turn
        if (alive) afterIntro(() => ScrollTrigger.refresh());
      });

      return () => {
        alive = false;
        cleanups.forEach((fn) => fn());
        ctx.revert();
      };
    });

    return () => {
      clearTimeout(introTimer);
      stopMotion();
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
