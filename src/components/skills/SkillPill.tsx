import { motion } from "framer-motion";
import type { Skill } from "../../data/skills";
import LevelDots from "./LevelDots";
import styles from "../../sections/Skills.module.css";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SkillPillProps {
  skill: Skill;
  accent: string;
  delay: number;
  inView: boolean;
}

export default function SkillPill({ skill, accent, delay, inView }: SkillPillProps) {
  const Icon = skill.icon;

  return (
    <motion.div
      className={styles.pill}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SPRING, delay } },
      }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -4 }}
      style={{ "--pill-accent": accent } as React.CSSProperties}
    >
      <div className={styles.pillIcon} style={{ color: accent }}>
        <Icon size={16} />
      </div>
      <span className={styles.pillName}>{skill.name}</span>
      <LevelDots level={skill.level} accent={accent} />
    </motion.div>
  );
}
