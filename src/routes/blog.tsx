import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/blog";
import type { RouteHandle } from "@/lib/routeLang";
import { pageMeta } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog/posts.server";
import { BLOG_INTRO, BLOG_LABELS, BLOG_META } from "@/data/blog";
import { useHydrated } from "@/hooks/useHydrated";
import TagFilter from "@/components/blog/TagFilter";
import PostCard from "@/components/blog/PostCard";
import styles from "./Blog.module.css";

export const handle: RouteHandle = { lang: "nl" };

// Runs at build time (prerender); the posts end up in the static HTML.
export async function loader() {
  return { posts: await getAllPosts() };
}

export const meta: Route.MetaFunction = () =>
  pageMeta({ ...BLOG_META, path: "/blog", locale: "nl_BE" });

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [searchParams] = useSearchParams();
  // The prerendered HTML always lists every post; apply ?tag= only after hydration.
  const hydrated = useHydrated();
  const activeTag = hydrated ? searchParams.get("tag") : null;

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tag of posts.flatMap((p) => p.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "nl"));
  }, [posts]);

  const visible = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{BLOG_INTRO.title}</h1>
        <p className={styles.lead}>{BLOG_INTRO.text}</p>
      </header>

      {tags.length > 0 && <TagFilter tags={tags} total={posts.length} active={activeTag} />}

      <section className={styles.posts} aria-label={BLOG_LABELS.posts}>
        {visible.length > 0 ? (
          <ul className={styles.list}>
            {visible.map((post, i) => (
              // Keyed on the tag so the fade-in replays when the filter changes
              <li key={`${activeTag ?? "all"}:${post.slug}`} className={styles.item} style={{ "--i": i } as React.CSSProperties}>
                <PostCard post={post} priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            {activeTag ? BLOG_LABELS.noPostsForTag(activeTag) : BLOG_LABELS.noPosts}
            {activeTag && (
              <>
                {" "}
                <Link to="." className={styles.emptyLink}>
                  {BLOG_LABELS.showAll}
                </Link>
              </>
            )}
          </p>
        )}
      </section>
    </div>
  );
}
