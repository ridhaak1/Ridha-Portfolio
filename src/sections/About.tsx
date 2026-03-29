import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
  type Transition,
} from "framer-motion";
import styles from "./About.module.css";

// ─── Easing ───────────────────────────────────────────────────────────────────
const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

const ts = (delay = 0, dur = 0.6): Transition => ({
  duration: dur,
  ease: SPRING,
  delay,
});
const tf = (delay = 0, dur = 0.5): Transition => ({
  duration: dur,
  ease: EASE_OUT,
  delay,
});

const fUp = (d = 0): Variants => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: ts(d) },
});
const fIn = (d = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: tf(d) },
});
const fX = (d = 0): Variants => ({
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: ts(d) },
});
const barV: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: SPRING, delay: 0.1 },
  },
};
const charV: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: SPRING },
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const HOOK_WORDS = ["From", "Curiosity", "to", "Creation."];

const STRENGTHS = [
  { n: "01", label: "Full-Stack", detail: "Frontend · Backend · APIs" },
  { n: "02", label: "Architecture", detail: "Scalable · Clean · Owned" },
  { n: "03", label: "Product Mind", detail: "Systems, not just features" },
  { n: "04", label: "Fast Delivery", detail: "No compromises on quality" },
];

const BEYOND = ["Philosophy", "Reading", "Football", "Gym"];

// ─── Hook: animated section ───────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  variants,
}: {
  children: React.ReactNode;
  delay?: number;
  variants?: Variants;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={variants ?? fUp(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated word (used in hook) ─────────────────────────────────────────────
function Word({
  word,
  i,
  inView,
}: {
  word: string;
  i: number;
  inView: boolean;
}) {
  const isAccent = word === "Creation.";
  return (
    <span className={styles.wordOuter}>
      <motion.span
        className={`${styles.word} ${isAccent ? styles.wordAccent : ""}`}
        variants={charV}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.55, ease: SPRING, delay: 0.05 + i * 0.1 }}
      >
        {word}
      </motion.span>
    </span>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function SectionLabel({
  n,
  text,
  inView,
  delay = 0,
}: {
  n: string;
  text: string;
  inView: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={styles.label}
      variants={fX(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <span className={styles.labelN}>{n}</span>
      <div className={styles.labelLine} />
      <span className={styles.labelTxt}>{text}</span>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on the big number
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bigNumY = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"]);

  // Per-block inView refs
  const tagRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const philoRef = useRef<HTMLDivElement>(null);
  const strRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const beyondRef = useRef<HTMLDivElement>(null);

  const tagInView = useInView(tagRef, { once: true, margin: "-60px" });
  const hookInView = useInView(hookRef, { once: true, margin: "-60px" });
  const journeyInView = useInView(journeyRef, { once: true, margin: "-60px" });
  const philoInView = useInView(philoRef, { once: true, margin: "-60px" });
  const strInView = useInView(strRef, { once: true, margin: "-60px" });
  const visionInView = useInView(visionRef, { once: true, margin: "-60px" });
  const beyondInView = useInView(beyondRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.vLine} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

      {/* Big decorative number — parallax */}
      <motion.div
        className={styles.bigNum}
        style={{ y: bigNumY }}
        aria-hidden="true"
      >
        02
      </motion.div>

      <div className={styles.inner}>
        {/* ── Tag ── */}
        <div ref={tagRef} className={styles.tag}>
          <motion.span
            className={styles.tagN}
            variants={fIn(0)}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          >
            § 02
          </motion.span>
          <motion.div
            className={styles.tagBar}
            variants={barV}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
            style={{ originX: 0 }}
          />
          <motion.span
            className={styles.tagWord}
            variants={fIn(0.25)}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          >
            About
          </motion.span>
        </div>

        {/* ══ HOOK ══ */}
        <div ref={hookRef} className={styles.hookWrap}>
          <div className={styles.hook} aria-label="From Curiosity to Creation.">
            {HOOK_WORDS.map((w, i) => (
              <Word key={w} word={w} i={i} inView={hookInView} />
            ))}
          </div>
          <motion.div
            className={styles.hookRule}
            variants={barV}
            initial="hidden"
            animate={hookInView ? "visible" : "hidden"}
            style={{ originX: 0 }}
          />
        </div>

        {/* ══ JOURNEY ══ */}
        <div ref={journeyRef} className={styles.journeyRow}>
          <div className={styles.journeyLeft}>
            <SectionLabel n="01" text="Journey" inView={journeyInView} />
            <motion.p
              className={styles.bodyLg}
              variants={fUp(0.1)}
              initial="hidden"
              animate={journeyInView ? "visible" : "hidden"}
            >
              Started coding{" "}
              <span className={styles.hi}>long before college.</span> HTML, CSS,
              JavaScript — learned it all self-driven, out of pure obsession
              with building things.
            </motion.p>
          </div>

          <motion.div
            className={styles.journeyCard}
            variants={fUp(0.18)}
            initial="hidden"
            animate={journeyInView ? "visible" : "hidden"}
          >
            <div className={styles.jCardTag}>Plot twist</div>
            <p className={styles.jCardText}>
              Enrolled in <em>International Business Entrepreneurship</em> —
              then pivoted back to code. Because some callings don't wait.
            </p>
          </motion.div>
        </div>

        {/* ── Rule ── */}
        <Reveal>
          <div className={styles.rule} />
        </Reveal>

        {/* ══ PHILOSOPHY ══ */}
        <div ref={philoRef} className={styles.philoWrap}>
          <SectionLabel n="02" text="Philosophy" inView={philoInView} />
          <motion.blockquote
            className={styles.quote}
            variants={fUp(0.1)}
            initial="hidden"
            animate={philoInView ? "visible" : "hidden"}
          >
            "Programming is an open universe —{" "}
            <span className={styles.quoteHi}>limitless possibilities,</span>{" "}
            immediate results, and the thrill of systems that truly work."
          </motion.blockquote>
          <motion.p
            className={styles.body}
            variants={fUp(0.2)}
            initial="hidden"
            animate={philoInView ? "visible" : "hidden"}
          >
            I build products that are functional, scalable, and efficient. Clean
            code isn't a preference — it's a standard.
          </motion.p>
        </div>

        {/* ── Rule ── */}
        <Reveal>
          <div className={styles.rule} />
        </Reveal>

        {/* ══ STRENGTHS ══ */}
        <div ref={strRef} className={styles.strWrap}>
          <SectionLabel n="03" text="Strengths" inView={strInView} />
          <div className={styles.strGrid}>
            {STRENGTHS.map((s, i) => (
              <motion.div
                key={s.n}
                className={styles.strCard}
                variants={fUp(i * 0.09)}
                initial="hidden"
                animate={strInView ? "visible" : "hidden"}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className={styles.strN}>{s.n}</span>
                <span className={styles.strLabel}>{s.label}</span>
                <span className={styles.strDetail}>{s.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Rule ── */}
        <Reveal>
          <div className={styles.rule} />
        </Reveal>

        {/* ══ VISION ══ */}
        <div ref={visionRef} className={styles.visionRow}>
          <SectionLabel n="04" text="Vision" inView={visionInView} />
          <motion.div
            className={styles.visionBox}
            variants={fUp(0.1)}
            initial="hidden"
            animate={visionInView ? "visible" : "hidden"}
          >
            <p className={styles.bodyLg}>
              Build <span className={styles.hi}>my own products.</span> Serve
              European teams remotely. High-level solutions, professional
              approach — available whenever needed.
            </p>
            <div className={styles.vBadge}>
              <span className={styles.vDot} aria-hidden="true" />
              Open to remote roles · Europe
            </div>
          </motion.div>
        </div>

        {/* ── Rule ── */}
        <Reveal>
          <div className={styles.rule} />
        </Reveal>

        {/* ══ BEYOND CODE ══ */}
        <div ref={beyondRef} className={styles.beyondRow}>
          <SectionLabel n="05" text="Beyond Code" inView={beyondInView} />
          <div className={styles.beyondContent}>
            <motion.p
              className={styles.body}
              variants={fUp(0.1)}
              initial="hidden"
              animate={beyondInView ? "visible" : "hidden"}
            >
              <span className={styles.hi}>Philosophy · Reading.</span> Always
              seeking knowledge. Football and gym — keeping mind and body at
              their sharpest.
            </motion.p>
            <div className={styles.beyondTags}>
              {BEYOND.map((b, i) => (
                <motion.span
                  key={b}
                  className={styles.beyondTag}
                  variants={fUp(0.1 + i * 0.07)}
                  initial="hidden"
                  animate={beyondInView ? "visible" : "hidden"}
                  whileHover={{
                    borderColor: "rgba(245,166,35,0.45)",
                    color: "#F5A623",
                    transition: { duration: 0.2 },
                  }}
                >
                  {b}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
