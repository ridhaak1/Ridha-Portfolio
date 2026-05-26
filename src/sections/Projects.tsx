import { useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import styles from "./Projects.module.css";
import { PROJECTS } from "../data/projects";
import ProjectCard from "../components/projects/ProjectCard";
import SideDrawer from "../components/projects/SideDrawer";
import SectionTag from "../components/ui/SectionTag";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const vFadeUp = (d = 0, y = 24): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: SPRING, delay: d } },
});

const vBar: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: SPRING, delay: 0.1 } },
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const tagInView = useInView(tagRef, { once: true, margin: "-60px" });

  const [selected, setSelected] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selected) ?? null;

  const handleSelect = useCallback((id: string) => setSelected(id), []);
  const handleClose = useCallback(() => setSelected(null), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [30, -60]);
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.vLine} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

      <motion.div className={styles.bigNum} style={{ y: springY }} aria-hidden="true">
        03
      </motion.div>

      <div className={styles.inner}>
        <div ref={tagRef}>
          <SectionTag number="03" label="Projects" inView={tagInView} styles={styles} />
        </div>

        <motion.div
          className={styles.headlineWrap}
          variants={vFadeUp(0, 28)}
          initial="hidden"
          animate={tagInView ? "visible" : "hidden"}
        >
          <h2 className={styles.headline}>
            Projects I Build —<br />
            <span className={styles.headlineAccent}>Real Impact, Clean Code.</span>
          </h2>
          <motion.div
            className={styles.headlineRule}
            variants={vBar}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          />
          <p className={styles.headlineSub}>Click any project to explore the full story.</p>
        </motion.div>

        <div className={`${styles.grid} ${selected ? styles.gridDimmed : ""}`}>
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onSelect={handleSelect}
              isActive={selected === p.id}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <SideDrawer project={selectedProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
