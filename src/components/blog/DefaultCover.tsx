import styles from "./DefaultCover.module.css";

interface DefaultCoverProps {
  title: string;
}

/** CSS-only fallback for posts without a cover. Fills its positioned parent. */
export default function DefaultCover({ title }: DefaultCoverProps) {
  return (
    <div className={styles.cover} aria-hidden="true">
      {/* cq units resolve against .cover, so the content sits in an inner element */}
      <div className={styles.inner}>
        <span className={styles.logo}>
          RIDHA<span className={styles.bar} />
        </span>
        <span className={styles.bottom}>
          <span className={styles.label}>Stageblog</span>
          <span className={styles.title}>{title}</span>
        </span>
      </div>
    </div>
  );
}
