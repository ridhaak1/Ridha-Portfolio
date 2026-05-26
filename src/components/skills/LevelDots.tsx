import styles from "../../sections/Skills.module.css";

interface LevelDotsProps {
  level: number;
  accent: string;
}

export default function LevelDots({ level, accent }: LevelDotsProps) {
  return (
    <div className={styles.dots}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={styles.dot}
          style={i < level ? { background: accent, boxShadow: `0 0 4px ${accent}` } : {}}
        />
      ))}
    </div>
  );
}
