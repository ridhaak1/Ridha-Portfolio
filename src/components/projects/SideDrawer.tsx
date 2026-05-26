import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import type { Project } from "../../data/projects";
import ConsoleFull from "./ConsoleFull";
import styles from "../../sections/Projects.module.css";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const vBar: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: SPRING, delay: 0.1 } },
};

const vFadeUp = (y = 24) => (d = 0): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: SPRING, delay: d } },
});

const vFadeIn = (d = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number], delay: d } },
});

const d = (n: number) => 0.12 + n * 0.07;

interface SideDrawerProps {
  project: Project;
  onClose: () => void;
}

export default function SideDrawer({ project, onClose }: SideDrawerProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.aside
        className={styles.drawer}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.42, ease: SPRING }}
        aria-label={`${project.title} details`}
        role="complementary"
      >
        <div className={styles.drawerTopLine} aria-hidden="true" />
        <div className={styles.drawerGlow} aria-hidden="true" />

        <motion.button
          className={styles.drawerClose}
          onClick={onClose}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.button>

        {project.visual === "image" && project.image ? (
          <motion.div
            className={styles.drawerImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <img src={project.image} alt={project.title} />
          </motion.div>
        ) : (
          <motion.div
            className={styles.drawerConsole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <ConsoleFull />
          </motion.div>
        )}

        <div className={styles.drawerContent}>
          <motion.div
            className={styles.drawerMeta}
            variants={vFadeIn(0)}
            initial="hidden"
            animate="visible"
            transition={{ delay: d(0) }}
          >
            <span className={styles.drawerIdx}>{project.index}</span>
            <motion.div className={styles.drawerMetaLine} variants={vBar} initial="hidden" animate="visible" />
            <span className={styles.drawerType}>{project.type}</span>
          </motion.div>

          <motion.div
            className={styles.drawerTitleWrap}
            variants={vFadeUp(16)(0)}
            initial="hidden"
            animate="visible"
            transition={{ delay: d(1) }}
          >
            <h2 className={styles.drawerTitle}>{project.title}</h2>
            <p className={styles.drawerTagline}>{project.tagline}</p>
          </motion.div>

          <motion.div className={styles.drawerDivider} variants={vBar} initial="hidden" animate="visible" transition={{ delay: d(2) }} />

          <motion.p
            className={styles.drawerDesc}
            variants={vFadeUp(12)(0)}
            initial="hidden"
            animate="visible"
            transition={{ delay: d(2) }}
          >
            {project.description}
          </motion.p>

          <motion.div variants={vFadeIn(0)} initial="hidden" animate="visible" transition={{ delay: d(3) }}>
            <div className={styles.drawerFeaturesLabel}>Key features</div>
            <div className={styles.drawerFeatures}>
              {project.features.map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.drawerFeature}
                  variants={vFadeUp(10)(0)}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <span className={styles.featureDot} aria-hidden="true" />
                  {f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={styles.drawerTags}
            variants={vFadeUp(8)(0)}
            initial="hidden"
            animate="visible"
            transition={{ delay: d(4) }}
          >
            {project.tags.map((t) => (
              <span key={t} className={styles.drawerTag}>{t}</span>
            ))}
          </motion.div>

          <motion.div
            className={styles.drawerBtns}
            variants={vFadeUp(8)(0)}
            initial="hidden"
            animate="visible"
            transition={{ delay: d(5) }}
          >
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className={styles.btnGhost}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg viewBox="0 0 24 24" className={styles.btnIcon} aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
                </svg>
                GitHub
              </motion.a>
            )}
            {project.demo ? (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={styles.btnDot} aria-hidden="true" />
                Live Demo
                <svg viewBox="0 0 16 16" className={styles.btnArrow} aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </motion.a>
            ) : (
              <span className={styles.btnDisabled}>Demo not available</span>
            )}
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
