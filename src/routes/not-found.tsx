import type { CSSProperties } from "react";
import { Link } from "react-router";
import { grainUrl } from "@/sections/heroAssets";
import type { Route } from "./+types/not-found";
import styles from "./NotFound.module.css";

// Catch-all route. Prerendered as /404 and copied to build/client/404.html after the
// build, which Vercel serves (with status 404) for every URL without a static file.
export const meta: Route.MetaFunction = () => [
  { title: "Page not found — Ridha Al-Khaykanee" },
  { name: "robots", content: "noindex" },
];

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <div className={styles.copy}>
        <h1 className={styles.title}>Page not found.</h1>
        <Link to="/" className={styles.link}>
          Back home <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
    </main>
  );
}
