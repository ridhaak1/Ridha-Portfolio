import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import styles from "./Skills.module.css";
import { GROUPS } from "../data/skills";
import SkillGroup from "../components/skills/SkillGroup";
import SectionTag from "../components/ui/SectionTag";

export default function Skills() {
  const sectionRef = useRef(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const tagInView = useInView(tagRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]));

  const totalSkills = GROUPS.reduce((acc, g) => acc + g.skills.length, 0);

  return (
    <section ref={sectionRef} className={styles.skills} id="skills">
      <motion.div className={styles.bigNum} style={{ y }}>
        04
      </motion.div>

      <div className={styles.inner}>
        <div ref={tagRef}>
          <SectionTag number="04" label="Skills" inView={tagInView} styles={styles} />
        </div>

        <div className={styles.headerRow}>
          <h2 className={styles.headline}>
            Engineering Stack —
            <br />
            <span>From UI to Infrastructure.</span>
          </h2>

          <div className={styles.stat}>
            <div className={styles.statN}>{totalSkills}</div>
            <div className={styles.statL}>Technologies</div>
          </div>
        </div>

        <div className={styles.groups}>
          {GROUPS.map((g) => (
            <SkillGroup key={g.category} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
