import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  Transition,
  Variants,
} from "framer-motion";
import styles from "./Skills.module.css";

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiSharp,
  SiDotnet,
  SiMysql,
  SiMongodb,
  SiGit,
  SiGithub,
  SiVercel,
  SiOpenai,
  SiN8N,
} from "react-icons/si";

// ─── Animations ─────────────────────
const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SPRING,
      delay,
    } as Transition,
  },
});

// ─── Data (🔥 الجديد) ───────────────
const GROUPS = [
  {
    category: "Frontend Engineering",
    accent: "rgba(97,218,251,0.85)",
    skills: [
      { name: "HTML", icon: SiHtml5, level: 5 },
      { name: "CSS", icon: SiCss, level: 5 },
      { name: "JavaScript", icon: SiJavascript, level: 5 },
      { name: "TypeScript", icon: SiTypescript, level: 4 },
      { name: "React", icon: SiReact, level: 5 },
      { name: "Next.js", icon: SiNextdotjs, level: 5 },
    ],
  },
  {
    category: "Backend Engineering",
    accent: "rgba(104,211,145,0.85)",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, level: 4 },
      { name: "Express.js", icon: SiExpress, level: 4 },
      { name: "C#", icon: SiSharp, level: 5 },
      { name: "ASP.NET Core", icon: SiDotnet, level: 4 },
    ],
  },
  {
    category: "Data & Infrastructure",
    accent: "rgba(245,166,35,0.85)",
    skills: [
      { name: "SQL", icon: SiMysql, level: 4 },
      { name: "MongoDB", icon: SiMongodb, level: 4 },
      { name: "Git", icon: SiGit, level: 5 },
      { name: "GitHub", icon: SiGithub, level: 5 },
      { name: "Deployment", icon: SiVercel, level: 4 },
    ],
  },
  {
    category: "Advanced & Emerging",
    accent: "rgba(195,166,251,0.85)",
    skills: [
      { name: "React Native", icon: SiReact, level: 3 },
      { name: "AI Integration", icon: SiOpenai, level: 4 },
      { name: "n8n", icon: SiN8N, level: 3 },
    ],
  },
];

// ─── Components ─────────────────────
function LevelDots({ level, accent }: any) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={
            i < level
              ? { background: accent, boxShadow: `0 0 4px ${accent}` }
              : {}
          }
        />
      ))}
    </div>
  );
}

function SkillPill({ skill, accent, delay, inView }: any) {
  const Icon = skill.icon;

  return (
    <motion.div
      className={styles.pill}
      variants={fadeUp(delay)}
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

function SkillGroup({ group }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={styles.group}>
      <div className={styles.groupLabel}>
        <span
          className={styles.groupDot}
          style={{ background: group.accent }}
        />
        <span className={styles.groupName}>{group.category}</span>
      </div>

      <div className={styles.pills}>
        {group.skills.map((skill: any, i: number) => (
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

// ─── Main ───────────────────────────
export default function Skills() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]));

  const totalSkills = GROUPS.reduce((acc, g) => acc + g.skills.length, 0);

  return (
    <section ref={sectionRef} className={styles.skills} id="skills">
      <motion.div className={styles.bigNum} style={{ y }}>
        04
      </motion.div>

      <div className={styles.inner}>
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
