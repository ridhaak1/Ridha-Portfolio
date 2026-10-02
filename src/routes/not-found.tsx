import { Link } from "react-router";
import type { Route } from "./+types/not-found";
import styles from "./NotFound.module.css";

// Catch-all route. Prerendered as /404 and copied to build/client/404.html after the
// build, which Vercel serves (with status 404) for every URL without a static file.
export const meta: Route.MetaFunction = () => [
  { title: "404 — Page not found | Ridha" },
  { name: "robots", content: "noindex" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you're looking for doesn't exist or has moved.</p>
      <div className={styles.actions}>
        <Link to="/" className={styles.primary}>
          ← Back home
        </Link>
        <Link to="/blog" className={styles.secondary}>
          Read the blog
        </Link>
      </div>
    </div>
  );
}
