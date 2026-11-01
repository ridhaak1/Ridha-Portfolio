import { site } from "@/config/site";
import styles from "./Hud.module.css";

/**
 * The hero's bottom credits (the top bar is the global TopHud). They fade out
 * with the hero's scroll exit.
 */
export default function Hud() {
  return (
    <div className={styles.hud} data-hud>
      <p className={styles.role}>
        {site.role} — {site.focus}
      </p>

      <p className={styles.scroll} aria-hidden="true">
        Scroll<span className={styles.scrollLine} />
      </p>
    </div>
  );
}
