import { Link } from "react-router";
import type { PostMeta } from "@/lib/blog/types";
import { BLOG_LABELS } from "@/data/blog";
import DefaultCover from "./DefaultCover";
import PostWarnings from "./PostWarnings";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: PostMeta;
  /** Load the cover eagerly (first card above the fold). */
  priority?: boolean;
}

export default function PostCard({ post, priority = false }: PostCardProps) {
  const { slug, title, date, dateLabel, readingTime, summary, tags, cover, coverAlt, warnings } = post;

  return (
    <article className={styles.card}>
      {warnings.length > 0 && (
        <div className={styles.warnings}>
          <PostWarnings warnings={warnings} />
        </div>
      )}

      <div className={styles.cover}>
        {cover ? (
          <img src={cover} alt={coverAlt} loading={priority ? "eager" : "lazy"} decoding="async" />
        ) : (
          <DefaultCover title={title} />
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.meta}>
          <time dateTime={date || undefined}>{dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime}</span>
        </p>

        <h2 className={styles.title}>
          {/* Stretched over the whole card via ::after */}
          <Link to={`/blog/${slug}`} className={styles.link}>
            {title}
          </Link>
        </h2>

        <p className={styles.summary}>{summary}</p>

        <ul className={styles.tags} aria-label={BLOG_LABELS.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
