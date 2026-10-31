/**
 * TEMPORARY — link to the internship log (Dutch blog for a school project).
 *
 * To remove: delete this file and InternshipNotice.module.css, the
 * `showInternshipNotice` flag in src/config/site.ts, and the
 * <InternshipNotice /> line in src/routes/home.tsx. Nothing else depends on it.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { onIntroDone } from "@/motion/intro";
import { NOTICE_DELAY } from "@/motion/tokens";
import styles from "./InternshipNotice.module.css";

const STORAGE_KEY = "internship-notice-dismissed";

function wasDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InternshipNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wasDismissed()) return;
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = onIntroDone(() => {
      timer = setTimeout(() => setVisible(true), NOTICE_DELAY * 1000);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage blocked: it just comes back on the next visit
    }
  };

  return (
    <aside className={styles.notice} data-visible={visible || undefined} inert={!visible} aria-label="Internship log">
      <Link to="/blog" className={styles.link}>
        Internship log — Deskdrive<span className={styles.detail}> (school project, NL)</span>{" "}
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss internship notice">
        ×
      </button>
    </aside>
  );
}
