import type { MouseEvent } from "react";
import { site } from "@/config/site";
import { sectionHref, type SectionId } from "@/data/navigation";
import { scrollToElement } from "@/motion/lenis";
import LocalTime from "./LocalTime";
import styles from "./Hud.module.css";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function onSectionClick(e: MouseEvent<HTMLAnchorElement>, id: SectionId) {
  const target = document.getElementById(id);
  if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  scrollToElement(target);
  // Move keyboard focus along with the scroll
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Quiet corner credits over the hero, like a film title card */
export default function Hud() {
  return (
    <div className={styles.hud} data-hud>
      <header className={styles.top}>
        <p className={styles.name}>{site.name}</p>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.list}>
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={sectionHref(id)}
                  className={styles.link}
                  data-cursor="View"
                  onClick={(e) => onSectionClick(e, id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <LocalTime className={styles.time} separator=" " />
      </header>

      <p className={styles.role}>
        {site.role} — {site.company}
      </p>

      <p className={styles.scroll} aria-hidden="true">
        Scroll<span className={styles.scrollLine} />
      </p>
    </div>
  );
}
