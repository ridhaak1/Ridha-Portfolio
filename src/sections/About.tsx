import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { CREDITS, FACTS, MARQUEE_PHRASE, STATEMENT } from "@/data/about";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { createVelocityMarquee } from "@/motion/marquee";
import { REDUCED_MOTION } from "@/motion/media";
import ScrollLitText from "@/motion/ScrollLitText";
import { DUR, EASE, FADE } from "@/motion/tokens";
import { grainUrl } from "./heroAssets";
import styles from "./About.module.css";

/** Phrases in the marquee track: enough to cover the viewport while one wraps around */
const COPIES = 3;

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const [facts] = q("[data-facts]");
    const rules = q("[data-rule]");
    const labels = q("[data-fact-label]");
    const values = q("[data-fact-value]");
    const rows: HTMLElement[] = q("[data-row]");
    const [marquee] = q("[data-marquee]");
    const [track] = q("[data-track]");

    const mm = gsap.matchMedia();

    mm.add(`not all and ${REDUCED_MOTION}`, () => {
      // Facts: hairlines draw left → right, then values rise through their masks
      gsap
        .timeline({
          defaults: { ease: EASE },
          scrollTrigger: { trigger: facts, start: "top 85%", once: true },
        })
        .fromTo(rules, { scaleX: 0 }, { scaleX: 1, duration: DUR.slow, stagger: 0.1 }, 0)
        .fromTo(labels, { opacity: 0 }, { opacity: 1, duration: DUR.fast, stagger: 0.1 }, 0.25)
        .fromTo(values, { yPercent: 110 }, { yPercent: 0, duration: DUR.base, stagger: 0.1 }, 0.35);

      // Credits: each row rises through its own mask, a row's height of travel
      rows.forEach((row) => gsap.set(row.children, { y: row.offsetHeight }));
      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((row, i) =>
            gsap.to(row.children, {
              y: 0,
              duration: DUR.base,
              ease: EASE,
              stagger: 0.06,
              delay: i * 0.1,
              // Mask off, so focus outlines aren't clipped
              onComplete: () => row.setAttribute("data-revealed", ""),
            }),
          ),
      });

      const stopMarquee = createVelocityMarquee(marquee, track, COPIES);
      return () => {
        stopMarquee();
        rows.forEach((row) => row.removeAttribute("data-revealed"));
      };
    });

    mm.add(REDUCED_MOTION, () => {
      // Everything is in place already; blocks just fade in
      [facts, ...rows].forEach((el) =>
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: FADE.duration, scrollTrigger: { trigger: el, start: "top 90%", once: true } },
        ),
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.srOnly}>
        About
      </h2>

      <p className={styles.srOnly}>{STATEMENT.map((part) => part.text).join("")}</p>
      <ScrollLitText className={styles.statement} aria-hidden="true">
        {STATEMENT.map(({ text, em }) => (em ? <em key={text}>{text}</em> : text))}
      </ScrollLitText>

      <dl className={styles.facts} data-facts>
        {FACTS.map(({ label, value }) => (
          <div key={label} className={styles.fact}>
            <span className={styles.rule} data-rule aria-hidden="true" />
            <dt className={styles.factLabel} data-fact-label>
              {label}
            </dt>
            <dd className={styles.factMask}>
              <span className={styles.factValue} data-fact-value>
                {value}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <dl className={styles.credits}>
        {CREDITS.map(({ category, techs }) => (
          <div key={category} className={styles.row} data-row>
            <dt className={styles.category}>{category}</dt>
            <dd className={styles.techs}>
              <ul className={styles.techList}>
                {techs.map(({ name, icon, glyph }, i) => (
                  <li key={name} className={styles.techItem}>
                    <span className={styles.tech} tabIndex={0} data-cursor-icon={icon} data-cursor-glyph={glyph}>
                      {name}
                    </span>
                    {i < techs.length - 1 && <span aria-hidden="true"> / </span>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.marquee} data-marquee aria-hidden="true">
        <div className={styles.track} data-track>
          {Array.from({ length: COPIES }, (_, i) => (
            <span key={i} className={styles.phrase}>
              {MARQUEE_PHRASE}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
    </section>
  );
}
