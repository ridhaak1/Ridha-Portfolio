import { useEffect, useRef, type CSSProperties, type FocusEvent } from "react";
import { FACTS_LINE, LAYERS, PHASES, SENTENCE } from "@/data/about";
import { useMediaAttribute } from "@/hooks/useMediaAttribute";
import RevealText from "@/motion/RevealText";
import { loadMotionWhenNear } from "@/motion/schedule";
import type { AboutMotion } from "./About.motion";
import { ABOUT_PINNED } from "./aboutLayout";
import { grainUrl } from "./heroAssets";
import styles from "./About.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export default function About() {
  const trackRef = useRef<HTMLElement>(null);
  const motionRef = useRef<AboutMotion | null>(null);

  useMediaAttribute(trackRef, "data-pinned", ABOUT_PINNED);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    return loadMotionWhenNear(
      track,
      () => import("./About.motion").then((m) => m.initAbout),
      (motion) => (motionRef.current = motion),
    );
  }, []);

  const onPointerOver = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") motionRef.current?.pointerOver(e.target as Element);
  };

  const onFocusLayer = (e: FocusEvent<HTMLElement>, i: number) => {
    if (e.currentTarget.matches(":focus-visible")) motionRef.current?.focusLayer(i);
  };

  return (
    <section
      ref={trackRef}
      id="about"
      className={styles.track}
      aria-labelledby="about-title"
      onPointerOver={onPointerOver}
      onPointerLeave={() => motionRef.current?.setActive(null)}
      onKeyDown={(e) => e.key === "Escape" && motionRef.current?.setActive(null)}
    >
      <div className={styles.stage}>
        <div className={styles.intro}>
          <h2 id="about-title" className={styles.label}>
            About
          </h2>
          <RevealText as="h3" className={styles.headline}>
            One developer.
            <br />
            The <em>whole</em> stack.
          </RevealText>
          <RevealText className={styles.sentence}>{SENTENCE}</RevealText>

          <div className={styles.phases} aria-hidden="true" data-fade>
            {PHASES.map(({ name, line }, i) => (
              <div key={name} className={styles.phase} data-phase>
                <span className={styles.phaseLine}>
                  <span className={styles.phaseFill} data-fill />
                </span>
                <p>
                  {pad(i + 1)} {name} — {line}
                </p>
              </div>
            ))}
          </div>
          <ol className={styles.srOnly}>
            {PHASES.map(({ name, line }) => (
              <li key={name}>
                {name}: {line}
              </li>
            ))}
          </ol>

          <p className={styles.facts} data-fade>
            {FACTS_LINE}
          </p>
        </div>

        <div className={styles.diagram}>
          <div className={styles.scene} data-scene data-fade aria-hidden="true">
            <div className={styles.rot} data-tilt>
              <div className={`${styles.rot} ${styles.rotX}`} data-rot-x>
                <div className={`${styles.rot} ${styles.rotZ}`} data-rot-z>
                  {LAYERS.map(({ name, techs }, i) => (
                    <div
                      key={name}
                      className={styles.plane}
                      style={{ "--depth": (LAYERS.length - 1) / 2 - i } as CSSProperties}
                      data-plane
                    >
                      <div className={styles.lift} data-lift data-layer={i} data-cursor={name}>
                        <span className={styles.surface} data-surface />
                        <span className={styles.border} data-border />
                        <span className={styles.outline} data-outline />
                        <div className={styles.content} data-content>
                          <div className={styles.logos}>
                            {techs.map((tech) =>
                              tech.icon ? (
                                <svg key={tech.name} viewBox="0 0 24 24" className={styles.logo}>
                                  <path d={tech.icon} />
                                </svg>
                              ) : (
                                <span key={tech.name} className={styles.glyph}>
                                  {tech.glyph}
                                </span>
                              ),
                            )}
                          </div>
                          <p className={styles.engraved}>{name}</p>
                        </div>
                        <span className={styles.anchor} data-anchor />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <svg className={styles.leaders} aria-hidden="true" data-leaders>
            {LAYERS.map(({ name }) => (
              <path key={name} className={styles.leader} pathLength={1} data-leader />
            ))}
          </svg>

          <ul className={styles.layers}>
            {LAYERS.map(({ name, techs }, i) => (
              <li key={name} className={styles.layerItem} data-layer={i} data-layer-item>
                <button
                  type="button"
                  className={styles.layerButton}
                  data-cursor={name}
                  data-layer-label
                  onFocus={(e) => onFocusLayer(e, i)}
                  onBlur={() => motionRef.current?.setActive(null)}
                >
                  <span className={styles.layerName}>
                    {pad(i + 1)} {name}
                  </span>
                  <span className={styles.layerTechs}>
                    {techs.map((t, j) => (
                      <span key={t.name}>
                        {j > 0 && " · "}
                        <span className={styles.techName}>{t.name}</span>
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
      </div>
    </section>
  );
}
