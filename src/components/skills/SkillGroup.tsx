import { useRef } from "react";
import { useInView } from "framer-motion";
import type { SkillGroup as SkillGroupType } from "../../data/skills";
import SkillPill from "./SkillPill";
import styles from "../../sections/Skills.module.css";

interface SkillGroupProps {
  group: SkillGroupType;
}

export default function SkillGroup({ group }: SkillGroupProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={styles.group}>
      <div className={styles.groupLabel}>
        <span className={styles.groupDot} style={{ background: group.accent }} />
        <span className={styles.groupName}>{group.category}</span>
      </div>
      <div className={styles.pills}>
        {group.skills.map((skill, i) => (
          <SkillPill
            key={skill.name}
            skill={skill}
            accent={group.accent}
            delay={i * 0.07}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
