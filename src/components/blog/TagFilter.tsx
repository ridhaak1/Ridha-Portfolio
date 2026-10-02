import { Link } from "react-router";
import { BLOG_LABELS } from "@/data/blog";
import styles from "./TagFilter.module.css";

interface TagFilterProps {
  tags: { name: string; count: number }[];
  total: number;
  active: string | null;
}

export default function TagFilter({ tags, total, active }: TagFilterProps) {
  const pills = [{ name: null, label: BLOG_LABELS.allTags, count: total }, ...tags.map((t) => ({ ...t, label: t.name }))];

  return (
    <nav className={styles.filter} aria-label={BLOG_LABELS.tagFilter}>
      <ul className={styles.list}>
        {pills.map(({ name, label, count }) => (
          <li key={label}>
            <Link
              to={name ? `?tag=${encodeURIComponent(name)}` : "."}
              preventScrollReset
              className={styles.pill}
              aria-current={active === name ? "true" : undefined}
            >
              {label}
              <span className={styles.count}>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
