import { data, isRouteErrorResponse, Link } from "react-router";
import type { Route } from "./+types/blog-post";
import type { RouteHandle } from "@/lib/routeLang";
import { pageMeta } from "@/lib/seo";
import { getPost } from "@/lib/blog/render.server";
import { BLOG_LABELS } from "@/data/blog";
import PostWarnings from "@/components/blog/PostWarnings";
import "@/styles/prose.css";
import styles from "./BlogPost.module.css";

export const handle: RouteHandle = { lang: "nl" };

// Runs at build time for every slug listed in react-router.config.ts
export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPost(params.slug);
  if (!post) throw data(null, { status: 404 });
  return { post };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [{ title: `${BLOG_LABELS.notFoundTitle} — Stageblog` }];
  const { post } = loaderData;
  return pageMeta({
    title: `${post.title} — Stageblog Ridha`,
    description: post.summary,
    path: `/blog/${post.slug}`,
    locale: "nl_BE",
    image: post.cover ?? undefined, // falls back to the site OG image
    type: "article",
    publishedTime: post.date,
  });
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { title, date, dateLabel, readingTime, tags, cover, coverAlt, html, warnings } = loaderData.post;

  return (
    <article className={styles.post}>
      {warnings.length > 0 && (
        <div className={`${styles.column} ${styles.warnings}`}>
          <PostWarnings warnings={warnings} />
        </div>
      )}

      <header className={`${styles.column} ${styles.head}`}>
        <Link to="/blog" className={styles.back}>
          {BLOG_LABELS.backToAll}
        </Link>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.metaRow}>
          <p className={styles.meta}>
            <time dateTime={date || undefined}>{dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
          </p>

          <ul className={styles.tags} aria-label={BLOG_LABELS.tags}>
            {tags.map((tag) => (
              <li key={tag}>
                <Link to={`/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {cover ? (
        <figure className={styles.cover}>
          <img src={cover} alt={coverAlt} fetchPriority="high" />
        </figure>
      ) : (
        // No photo: no placeholder, just a short accent line between header and text
        <div className={`${styles.column} ${styles.rule}`} aria-hidden="true" />
      )}

      {/* Trusted HTML rendered from our own Markdown at build time (raw HTML is disabled) */}
      <div className={`prose ${styles.column}`} dangerouslySetInnerHTML={{ __html: html }} />

      <footer className={`${styles.column} ${styles.foot}`}>
        <Link to="/blog" className={styles.back}>
          {BLOG_LABELS.backToAll}
        </Link>
      </footer>
    </article>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className={`${styles.post} ${styles.column}`}>
      <Link to="/blog" className={styles.back}>
        {BLOG_LABELS.backToAll}
      </Link>
      <h1 className={styles.title}>{notFound ? BLOG_LABELS.notFoundTitle : "Er ging iets mis"}</h1>
      <p className={styles.meta}>{notFound ? BLOG_LABELS.notFoundText : "Probeer het later opnieuw."}</p>
    </div>
  );
}
