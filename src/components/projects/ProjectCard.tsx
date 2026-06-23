import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Project } from "../../data/projects";
import CardVisual from "./CardVisual";
import styles from "../../sections/Projects.module.css";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (id: string) => void;
  isActive: boolean;
}

export default function ProjectCard({ project, index, onSelect, isActive }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const inProgress = project.status === "in-progress";

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isActive ? styles.cardActive : ""} ${inProgress ? styles.cardInProgress : ""}`}
      style={{ "--card-accent": project.accent } as React.CSSProperties}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: SPRING, delay: index * 0.1 } },
      }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE_OUT } }}
      onClick={() => onSelect(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(project.id)}
      aria-label={`View ${project.title} details`}
    >
      <div className={styles.cardBorder} aria-hidden="true" />
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardVisual}>
        <motion.div
          className={styles.cardVisualInner}
          whileHover={{ scale: 1.04, transition: { duration: 0.4, ease: EASE_OUT } }}
        >
          <CardVisual project={project} />
        </motion.div>
        <div className={styles.cardOverlay} aria-hidden="true" />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <span className={styles.cardIndex}>{project.index}</span>
          <span
            className={`${styles.cardBadge} ${inProgress ? styles.badgeProgress : ""}`}
            style={{ "--badge-accent": project.accent } as React.CSSProperties}
          >
            {project.badge}
          </span>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardType}>{project.type}</div>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardTagline}>{project.tagline}</p>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.cardTags}>
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className={styles.cardTag}>{t}</span>
            ))}
          </div>
          <div className={styles.cardCta}>
            <span className={styles.cardCtaTxt}>{inProgress ? "In development" : "View project"}</span>
            <svg viewBox="0 0 16 16" className={styles.cardCtaArrow} aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
