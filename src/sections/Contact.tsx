import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import LocalTime from "@/components/hero/LocalTime";
import { site } from "@/config/site";
import { EMAIL, LINKS } from "@/data/contact";
import { useMediaAttribute } from "@/hooks/useMediaAttribute";
import { corridorLayout, GATE_DEPTHS } from "@/motion/corridorLayout";
import { gsap } from "@/motion/gsap";
import MagneticButton from "@/motion/MagneticButton";
import { matches, REDUCED_MOTION } from "@/motion/media";
import { loadMotionWhenNear } from "@/motion/schedule";
import { CORRIDOR, EASE } from "@/motion/tokens";
import type { ContactMotion } from "./Contact.motion";
import { ARRIVE_AT, CONTACT_PINNED, onPhones } from "./contactLayout";
import { fallbackSrc, grainUrl, srcSet } from "./heroAssets";
import styles from "./Contact.module.css";

const COPIED_FOR = 1600;
const { greetings } = site;
const PLACEMENT = corridorLayout(greetings);
const pad = (n: number) => String(n).padStart(2, "0");
export default function Contact() {
  const trackRef = useRef<HTMLElement>(null);
  const motionRef = useRef<ContactMotion | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  useMediaAttribute(trackRef, "data-pinned", CONTACT_PINNED);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    return loadMotionWhenNear(
      track,
      () => import("./Contact.motion").then((m) => m.initContact),
      (motion) => (motionRef.current = motion),
    );
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR);
  };

  const roll = (e: PointerEvent<HTMLElement>, over: boolean) => {
    if (e.pointerType !== "mouse" || matches(REDUCED_MOTION)) return;
    gsap.to(e.currentTarget.querySelectorAll("[data-roll]"), {
      yPercent: over ? -50 : 0,
      duration: 0.5,
      ease: EASE,
      stagger: 0.012,
      overwrite: true,
    });
  };

  // The plane isn't visible until the camera arrives: focus jumps there
  const onFocusPlane = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) motionRef.current?.focusPlane();
  };

  return (
    <section
      ref={trackRef}
      id="contact"
      className={styles.track}
      style={{ "--arrive": ARRIVE_AT } as CSSProperties}
      aria-labelledby="contact-title"
    >
      {/* Where the "Contact" link lands: the arrival, not the start of the flight */}
      <span className={styles.navAnchor} data-nav-anchor />

      <div className={styles.stage}>
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.steer} data-steer>
            <div className={styles.world} data-world>
              <picture className={styles.plate} data-plate>
                <source type="image/avif" srcSet={srcSet("plate", "desktop", "avif")} sizes="200vw" />
                <img src={fallbackSrc("plate")} alt="" loading="lazy" decoding="async" />
              </picture>

              {GATE_DEPTHS.map((z) => (
                <span key={z} className={styles.gate} style={{ "--z": `${z}px` } as CSSProperties} data-gate>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              ))}
              {["tl", "tr", "bl", "br"].map((corner) => (
                <span key={corner} className={`${styles.rail} ${styles[corner]}`} />
              ))}

              {greetings.map(({ word, ...rest }, i) => {
                const { x, y, z, size } = PLACEMENT[i];
                return (
                  <p
                    key={word}
                    className={styles.word}
                    style={{ "--x": `${x}vw`, "--y": `${y}vh`, "--z": `${z}px`, "--size": `${size}vw` } as CSSProperties}
                    lang={"lang" in rest ? rest.lang : undefined}
                    dir={"dir" in rest ? rest.dir : undefined}
                    data-phone={onPhones(i) || undefined}
                  >
                    <span className={styles.wordInner} data-word>
                      {word}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.plane} data-plane onFocus={onFocusPlane}>
          <p className={styles.greetingLine} data-fade>
            {greetings.map(({ word, ...rest }, i) => (
              <span key={word}>
                {i > 0 && " · "}
                <bdi lang={"lang" in rest ? rest.lang : undefined}>{word}</bdi>
              </span>
            ))}
          </p>

          <div data-fade>
            <p className={styles.label}>Contact</p>
            <h2 id="contact-title" className={styles.headlineMask}>
              <span className={styles.headline} data-headline>
                Say hello.
              </span>
            </h2>
            <p className={styles.sub}>Got an idea, a project or just a question? My inbox is open.</p>
          </div>

          <div className={styles.reach} data-fade>
            <MagneticButton
              type="button"
              className={styles.email}
              strength={0.1}
              max={CORRIDOR.magnetic}
              data-cursor={copied ? "Copied ✓" : "Copy"}
              aria-label={`${EMAIL}, copy to clipboard`}
              onClick={copy}
              onPointerEnter={(e) => roll(e, true)}
              onPointerLeave={(e) => roll(e, false)}
            >
              {[...EMAIL].map((char, i) => (
                <span key={i} className={styles.roll}>
                  <span className={styles.rollStack} data-roll>
                    <span>{char}</span>
                    <span>{char}</span>
                  </span>
                </span>
              ))}
              <span className={styles.underline} aria-hidden="true" />
            </MagneticButton>

            <ul className={styles.links}>
              <li>
                <a href={`mailto:${EMAIL}`} className={styles.link}>
                  Open mail app{" "}
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
              {LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                    {label}
                    <span className={styles.srOnly}> (opens in a new tab)</span>{" "}
                    <span className={styles.arrow} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <LocalTime className={styles.status} place="Antwerp, Belgium" separator=" · " data-fade>
            {" · Replies within 24h"}
          </LocalTime>
        </div>

        <p className={styles.counter} aria-hidden="true" data-counter>
          <bdi data-counter-word>{greetings[0].word}</bdi> — <span data-counter-index>01 / {pad(greetings.length)}</span>
          <span className={styles.counterLanguage} data-counter-language>
            {greetings[0].language}
          </span>
        </p>

        {/* Always mounted, so screen readers announce the text when it appears */}
        <p className={styles.toast} role="status" aria-live="polite" data-visible={copied || undefined}>
          {copied ? "Email address copied" : ""}
        </p>

        <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
      </div>
    </section>
  );
}
