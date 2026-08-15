import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineRectangleStack,
  HiOutlineBookOpen,
  HiOutlineCursorArrowRays,
} from "react-icons/hi2";
import styles from "./About.module.css";
import { STRENGTHS } from "../data/about";
import SectionTag from "../components/ui/SectionTag";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fUp = (d = 0): Variants => ({
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SPRING, delay: d } },
});
const fIn = (d = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: d } },
});
const lineV: Variants = {
  hidden:   { scaleX: 0 },
  visible:  { scaleX: 1, transition: { duration: 0.9, ease: SPRING, delay: 0.08 } },
};

const INFO_ROWS = [
  { icon: HiOutlineMapPin,         label: "Location", value: "Antwerp, Belgium"       },
  { icon: HiOutlineUser,           label: "Role",     value: "Full-Stack Developer"   },
  { icon: HiOutlineRectangleStack, label: "Focus",    value: "Web · Mobile · SaaS"    },
  { icon: null,                    label: "Status",   value: "Open to remote · Europe", dot: true },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef     = useRef<HTMLDivElement>(null);
  const topRef     = useRef<HTMLDivElement>(null);
  const storyRef   = useRef<HTMLDivElement>(null);
  const strRef     = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const tagInView   = useInView(tagRef,   { once: true, margin: "-60px" });
  const topInView   = useInView(topRef,   { once: true, margin: "-60px" });
  const storyInView = useInView(storyRef, { once: true, margin: "-60px" });
  const strInView   = useInView(strRef,   { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
      <motion.div className={styles.bigNum} style={{ y: numY }} aria-hidden="true">02</motion.div>

      <div className={styles.inner}>

        {/* ── Tag ── */}
        <div ref={tagRef}>
          <SectionTag number="02" label="About" inView={tagInView} styles={styles} />
        </div>

        {/* ══ TOP: statement + info card ══ */}
        <div ref={topRef} className={styles.topGrid}>

          {/* Statement col */}
          <div className={styles.statementCol}>
            <motion.h2 className={styles.statement} variants={fUp(0)} initial="hidden" animate={topInView ? "visible" : "hidden"}>
              I'm driven by one thing —{" "}
              <span className={styles.accent}>
                turning ideas into something real, structured, and meaningful.
              </span>
            </motion.h2>

            <motion.div
              className={styles.rule}
              variants={lineV}
              initial="hidden"
              animate={topInView ? "visible" : "hidden"}
              style={{ originX: 0 }}
            />

            <motion.p className={styles.subText} variants={fUp(0.12)} initial="hidden" animate={topInView ? "visible" : "hidden"}>
              I care about how things are built as much as what is built.
              Structure, clarity, and intention matter.
              Because good products aren't just functional —
              they feel right to use, maintain, and grow.
            </motion.p>
          </div>

          {/* Info card */}
          <motion.div className={styles.infoCard} variants={fUp(0.15)} initial="hidden" animate={topInView ? "visible" : "hidden"}>
            {INFO_ROWS.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className={styles.infoRow}>
                  <div className={styles.infoIconBox}>
                    {row.dot
                      ? <span className={styles.infoDot} aria-hidden="true" />
                      : Icon && <Icon size={15} />
                    }
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    <span className={styles.infoValue}>{row.value}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div className={styles.divider} variants={lineV} initial="hidden" animate={topInView ? "visible" : "hidden"} style={{ originX: 0 }} />

        {/* ══ STORY: Background + Approach ══ */}
        <div ref={storyRef} className={styles.storyGrid}>

          {/* Background */}
          <motion.div className={styles.storyBlock} variants={fUp(0)} initial="hidden" animate={storyInView ? "visible" : "hidden"}>
            <div className={styles.storyIconCircle}><HiOutlineBookOpen size={18} /></div>
            <span className={styles.eyebrow}>Background</span>
            <h3 className={styles.storyTitle}>Curiosity led the way.</h3>
            <p className={styles.storyText}>
              I started with nothing but curiosity — teaching myself how
              things work, then how to build them. I explored different
              paths, but always found my way back to code.
              Not because I had to — but because it felt right.
            </p>
          </motion.div>

          {/* Approach */}
          <motion.div className={styles.storyBlock} variants={fUp(0.1)} initial="hidden" animate={storyInView ? "visible" : "hidden"}>
            <div className={styles.storyIconCircle}><HiOutlineCursorArrowRays size={18} /></div>
            <span className={styles.eyebrow}>Approach</span>
            <h3 className={styles.storyTitle}>Intentional. Focused. Built to last.</h3>
            <p className={styles.storyText}>
              I think in systems, not shortcuts. I plan before I build,
              write with purpose, and refine relentlessly.
              The goal isn't just to deliver —
              it's to create value that lasts.
            </p>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <motion.div className={styles.divider} variants={lineV} initial="hidden" animate={storyInView ? "visible" : "hidden"} style={{ originX: 0 }} />

        {/* ══ STRENGTHS ══ */}
        <div ref={strRef} className={styles.strSection}>
          <motion.span className={styles.strEyebrow} variants={fIn(0)} initial="hidden" animate={strInView ? "visible" : "hidden"}>
            Strengths
          </motion.span>
          <motion.div className={styles.strTable} variants={fIn(0.05)} initial="hidden" animate={strInView ? "visible" : "hidden"}>
            {STRENGTHS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  className={styles.strRow}
                  variants={fUp(i * 0.07)}
                  initial="hidden"
                  animate={strInView ? "visible" : "hidden"}
                >
                  <span className={styles.strN}>{s.n}</span>
                  <div className={styles.strIconBox}><Icon size={15} /></div>
                  <span className={styles.strLabel}>{s.label}</span>
                  <span className={styles.strLine} aria-hidden="true" />
                  <span className={styles.strDetail}>{s.detail}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
