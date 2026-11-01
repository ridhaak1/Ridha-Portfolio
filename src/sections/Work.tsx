import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import ProjectDrawer from "@/components/projects/ProjectDrawer";
import { SELECTED_WORK, type SelectedProject } from "@/data/projects";
import { useMediaAttribute } from "@/hooks/useMediaAttribute";
import { gsap, ScrollTrigger, SplitText } from "@/motion/gsap";
import { getLenis } from "@/motion/lenis";
import { FINE_POINTER, matches } from "@/motion/media";
import { createFloat, createParallax } from "@/motion/parallax";
import { whenNear } from "@/motion/schedule";
import { EASE, FLOAT, PARALLAX } from "@/motion/tokens";
import { grainUrl } from "./heroAssets";
import { frameSize, frameSrc, frameSrcSet, FRAME_SIZES, plateSrc } from "./workAssets";
import styles from "./Work.module.css";

/** Pinned, scrubbed sequence (matches the pinned layout in Work.module.css) */
const PINNED = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const STACKED = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/** Scrub timeline (0–1 over the pinned scroll): when each scene → scene transition runs */
const CUTS = [
  { at: 0.22, duration: 0.2 },
  { at: 0.58, duration: 0.2 },
];
/** Scroll progress at which each scene sits fully at rest (keyboard focus jumps here) */
const REST = [0.08, 0.5, 0.92];

/** How far (yPercent) title letters travel out of / into their line mask. Beyond 100 so
 *  nothing peeks through the mask's top padding (kept for accents and descenders). */
const TITLE_TRAVEL = 130;

const pad = (n: number) => String(n).padStart(2, "0");
const total = pad(SELECTED_WORK.length);

export default function Work() {
  const trackRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<{ project: SelectedProject; frame: HTMLElement } | null>(null);
  const returningFocus = useRef(false);
  const onDrawerClosed = useCallback(() => {
    setOpen((current) => {
      if (current) {
        returningFocus.current = true;
        current.frame.focus({ preventScroll: true });
        returningFocus.current = false;
      }
      return null;
    });
  }, []);
  const pinnedRef = useRef(false);

  // Switches Work.module.css to the sticky single-stage layout
  useMediaAttribute(trackRef, "data-pinned", PINNED);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // The heaviest setup on the page. The hero fills the first screen, so it waits for the first scroll. (-1px: its top edge touches the screen's at load, which counts as near.)
    return whenNear(track, () => {
      const q = gsap.utils.selector(track);
      const titles = q("[data-title]");
      const frames = q("[data-frame]");
      const plates = q("[data-plate]");
      const metas = q("[data-meta]");
      const [label] = q("[data-label]");
      const [counter] = q("[data-counter]");
      const [progress] = q("[data-progress]");
      const [scene] = q("[data-scene]");
      const [platesLayer, titlesLayer, framesLayer] = q("[data-depth]");

      // One split per title: chars rise/leave through a line mask
      const splits = titles.map((t) => SplitText.create(t, { type: "lines,chars", mask: "lines", aria: "none" }));
      const chars = splits.map((s) => s.chars);

      const mm = gsap.matchMedia();

      mm.add(PINNED, () => {
        pinnedRef.current = true;

        // Start state: only scene 01 is built (by the intro below)
        gsap.set(chars.flat(), { yPercent: TITLE_TRAVEL });
        gsap.set(frames, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 });
        gsap.set([...plates, ...metas, label], { opacity: 0 });

        // Section intro, as the stage rises over the hero
        // It shares targets with the scrub below. Arriving mid-sequence (deep link, reload, a fast
        // scroll), the scrubbed state has to win, or scene 1 stays on screen over the current scene.
        const resync = () => {
          const at = tl.progress();
          tl.progress(0, true).progress(at, true);
        };
        const intro = gsap.timeline({
          paused: true,
          defaults: { ease: EASE },
          onComplete: () => resync(),
        });
        intro
          .to(label, { opacity: 1, duration: 0.6 }, 0)
          .to(plates[0], { opacity: 1, duration: 1 }, 0)
          .to(chars[0], { yPercent: 0, duration: 1, stagger: 0.04 }, 0.15)
          .to(frames[0], { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1 }, 0.35)
          .to(metas[0], { opacity: 1, duration: 0.6 }, 0.7);

        // Scrubbed scene → scene cuts while the stage is pinned (CSS sticky)
        const tl = gsap.timeline({
          defaults: { ease: "none", immediateRender: false },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const i = self.progress < 0.32 ? 0 : self.progress < 0.68 ? 1 : 2;
              const text = `${pad(i + 1)} / ${total}`;
              if (counter.textContent !== text) counter.textContent = text;
            },
          },
        });
        tl.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
        CUTS.forEach(({ at, duration }, i) => {
          const d = duration;
          tl.fromTo(chars[i], { yPercent: 0 }, { yPercent: -TITLE_TRAVEL, duration: d * 0.6, stagger: d * 0.04, ease: "power2.in" }, at)
            .fromTo(
              chars[i + 1],
              { yPercent: TITLE_TRAVEL },
              { yPercent: 0, duration: d * 0.6, stagger: d * 0.04, ease: "power3.out" },
              at + d * 0.35,
            )
            .fromTo(
              frames[i + 1],
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: d, ease: "power2.inOut" },
              at,
            )
            .fromTo(plates[i], { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.06, duration: d }, at)
            .fromTo(plates[i + 1], { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: d }, at)
            .fromTo(metas[i], { opacity: 1, y: 0 }, { opacity: 0, y: -8, duration: d * 0.4 }, at)
            .fromTo(metas[i + 1], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: d * 0.4 }, at + d * 0.6);
        });
        // (Hidden frames do not catch clicks: see pointer-events in Work.module.css.)

        // After the scrub exists: arriving mid-page, this fires right away and needs it to resync
        ScrollTrigger.create({
          trigger: track,
          start: "top 70%",
          onEnter: () => {
            if (track.getBoundingClientRect().top < -1) intro.progress(1);
            else intro.play();
          },
          onLeaveBack: () => intro.reverse(),
        });

        // Depth: the same parallax as the hero, only while the stage is on screen
        const stopParallax = matches(FINE_POINTER)
          ? createParallax(
              [
                [platesLayer, -PARALLAX.plate],
                [titlesLayer, PARALLAX.name],
                [framesLayer, PARALLAX.cutout],
              ],
              scene,
              () => {
                const r = track.getBoundingClientRect();
                return r.top < window.innerHeight && r.bottom > 0;
              },
            )
          : () => {};

        track.setAttribute("data-live", "");

        return () => {
          pinnedRef.current = false;
          track.removeAttribute("data-live");
          stopParallax();
        };
      });

      mm.add(STACKED, () => {
        // Each scene reveals as it enters: title rises, frame wipes in, meta fades
        SELECTED_WORK.forEach((_, i) => {
          gsap
            .timeline({
              defaults: { ease: EASE },
              scrollTrigger: { trigger: frames[i], start: "top 85%", once: true },
            })
            .fromTo(chars[i], { yPercent: TITLE_TRAVEL }, { yPercent: 0, duration: 0.9, stagger: 0.035 }, 0)
            .fromTo(
              frames[i],
              { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1 },
              0.15,
            )
            .fromTo(metas[i], { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.5);
        });
        return createFloat(frames.map((f) => [f, FLOAT.amplitude * 0.8]));
      });

      mm.add(REDUCED, () => {
        // Static scenes, fades only
        [...titles, ...frames, ...metas].forEach((el) =>
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
        );
      });

      return () => {
        mm.revert();
        splits.forEach((s) => s.revert());
      };
    }, "-1px");
  }, []);

  // Keyboard: focusing a frame that isn't the current scene scrolls the sequence to it
  const onFrameFocus = (i: number) => {
    const track = trackRef.current;
    if (!pinnedRef.current || !track || returningFocus.current) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const y = top + REST[i] * (track.offsetHeight - window.innerHeight);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 0.8 });
    else window.scrollTo({ top: y });
  };

  return (
    <section ref={trackRef} id="work" className={styles.track} aria-labelledby="work-title">
      <div className={styles.stage}>
        <h2 id="work-title" className={styles.label} data-label>
          Selected work <span className={styles.count}>({total})</span>
        </h2>

        <div className={styles.scene} data-scene>
          <div className={styles.layer} data-depth aria-hidden="true">
            {SELECTED_WORK.map((p) => (
              <picture key={p.id} className={styles.plate} data-plate>
                <source type="image/avif" srcSet={plateSrc(p.id, "avif")} />
                <img src={plateSrc(p.id, "webp")} alt="" width={640} height={400} loading="lazy" decoding="async" />
              </picture>
            ))}
          </div>

          <div className={styles.layer} data-depth aria-hidden="true">
            {SELECTED_WORK.map((p) => (
              <p
                key={p.id}
                className={styles.title}
                style={
                  {
                    "--chars": p.scene.title.length,
                    ...(p.scene.lift && { "--lift": `${-p.scene.lift}%`, "--raise": 0.18 }),
                  } as CSSProperties
                }
                data-title
              >
                {p.scene.title}
              </p>
            ))}
          </div>

          <div className={styles.layer} data-depth>
            {SELECTED_WORK.map((p, i) => {
              const { width, height } = frameSize(p.id);
              const s = p.scene;
              return (
                <article key={p.id} className={styles.item}>
                  <h3 className={styles.srOnly}>{s.title}</h3>
                  <button
                    type="button"
                    className={styles.frame}
                    data-frame
                    data-cursor="View case"
                    aria-label={`View case: ${s.title}`}
                    onClick={(e) => setOpen({ project: p, frame: e.currentTarget })}
                    onFocus={(e) => e.currentTarget.matches(":focus-visible") && onFrameFocus(i)}
                  >
                    <picture>
                      <source type="image/avif" srcSet={frameSrcSet(p.id, "avif")} sizes={FRAME_SIZES} />
                      <source type="image/webp" srcSet={frameSrcSet(p.id, "webp")} sizes={FRAME_SIZES} />
                      <img
                        src={frameSrc(p.id)}
                        alt={`${s.title} — screenshot`}
                        width={width}
                        height={height}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </picture>
                  </button>
                  <div className={styles.meta} data-meta>
                    <p className={styles.metaRow}>
                      {pad(i + 1)} — {s.kind} · {s.year} · {s.status}
                      <span className={styles.stackSep}> · </span>
                      <span className={styles.stack}>{s.stack.join(", ")}</span>
                    </p>
                    <p className={styles.line}>{s.line}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className={styles.hud} aria-hidden="true">
          <p className={styles.counter}>
            Work <span data-counter>01 / {total}</span>
          </p>
          <span className={styles.progress} data-progress />
        </div>
        <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
      </div>

      {open && <ProjectDrawer project={open.project} origin={open.frame} onClosed={onDrawerClosed} />}
    </section>
  );
}
