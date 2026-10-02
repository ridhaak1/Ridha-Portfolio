import styles from "./PostWarnings.module.css";

interface PostWarningsProps {
  warnings: string[];
}

/** Red problem list for a post. Warnings only exist during `npm run dev`. */
export default function PostWarnings({ warnings }: PostWarningsProps) {
  if (warnings.length === 0) return null;

  return (
    <div className={styles.box} role="alert">
      <p className={styles.head}>
        ⚠ {warnings.length === 1 ? "1 probleem" : `${warnings.length} problemen`} in deze post
        <span className={styles.note}> · alleen zichtbaar tijdens npm run dev, de build stopt hierop</span>
      </p>
      <ul className={styles.list}>
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
