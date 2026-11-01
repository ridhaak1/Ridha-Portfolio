import type { MouseEvent } from "react";
import { site } from "@/config/site";
import { sectionHref, type SectionId } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToElement } from "@/motion/lenis";
import LocalTime from "@/components/hero/LocalTime";
import styles from "./TopHud.module.css";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
const IDS = LINKS.map((l) => l.id);

function onSectionClick(e: MouseEvent<HTMLAnchorElement>, id: SectionId) {
  const target = document.getElementById(id);
  if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  scrollToElement(target);
  // Move keyboard focus along with the scroll
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/**
 * The home page's persistent top bar: name, section nav, live time.
 * Fixed, and inverted against whatever is underneath (mix-blend-mode: difference),
 * so it stays legible over photos, dark stages and paper alike.
 */
export default function TopHud() {
  const active = useActiveSection(IDS, true);

  return (
    <header className={styles.hud}>
      <p className={styles.name}>{site.name}</p>

      <nav className={styles.nav} aria-label="Main">
        <ul className={styles.list}>
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={sectionHref(id)}
                className={styles.link}
                data-cursor="View"
                aria-current={active === id ? "location" : undefined}
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
  );
}
