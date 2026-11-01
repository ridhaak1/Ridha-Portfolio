import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { Link, NavLink } from "react-router";
import { BLOG_LINK, SECTION_LINKS, sectionHref } from "@/data/navigation";
import styles from "./Header.module.css";

const DESKTOP_QUERY = "(min-width: 901px)";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({ id, open, onClose, toggleRef }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;

      // Keep focus cycling between the toggle button and the menu links
      const focusables = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a")].filter(
        (el): el is HTMLElement => el !== null,
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Close when the viewport grows into the desktop layout
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (e: MediaQueryListEvent) => e.matches && onClose();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, onClose, toggleRef]);

  if (!open) return null;

  return (
    <div ref={menuRef} id={id} className={styles.menu}>
      <nav aria-label="Mobile">
        <ul className={styles.menuList}>
          {SECTION_LINKS.map(({ id: sectionId, label }, i) => (
            <li key={sectionId} style={{ "--i": i } as CSSProperties}>
              <Link to={sectionHref(sectionId)} className={styles.menuLink} onClick={onClose}>
                <span className={styles.menuNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </Link>
            </li>
          ))}
          <li style={{ "--i": SECTION_LINKS.length } as CSSProperties}>
            <NavLink to={BLOG_LINK.to} className={`${styles.menuLink} ${styles.menuBlog}`} onClick={onClose}>
              <span className={styles.menuNum} aria-hidden="true">
                <span className={styles.liveDot} />
              </span>
              {BLOG_LINK.label}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className={styles.menuFooter}>
        <span>Antwerp · Belgium</span>
        <span>ridha.dev</span>
      </div>
    </div>
  );
}
