/** Post metadata as sent to the browser (all derived fields are computed at build time). */
export interface PostMeta {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD ("" if invalid, dev only) */
  date: string;
  /** Pre-formatted nl-BE date, e.g. "2 oktober 2026" */
  dateLabel: string;
  summary: string;
  tags: string[];
  /** Absolute path under /public, e.g. "/images/blog/week-1/cover.jpeg"; null → default cover */
  cover: string | null;
  coverAlt: string;
  /** e.g. "4 min lezen" */
  readingTime: string;
  /** Problems found in the post (Dutch). Only ever non-empty during `npm run dev`. */
  warnings: string[];
}

export interface Post extends PostMeta {
  /** Rendered, syntax-highlighted HTML */
  html: string;
}
