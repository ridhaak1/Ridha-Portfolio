import { useEffect, useRef, type RefObject } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { BLOG_LINK, SECTION_LINKS, sectionHref, type SectionId } from "@/data/navigation";
import styles from "./Header.module.css";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DESKTOP_QUERY = "(min-width: 901px)";

const listV: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SPRING } },
};

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
  activeSection: SectionId | null;
}

export default function MobileMenu({ id, open, onClose, toggleRef, activeSection }: MobileMenuProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          id={id}
          className={styles.menu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
        >
          <nav aria-label="Mobile">
            <motion.ul className={styles.menuList} variants={listV} initial="hidden" animate="visible">
              {SECTION_LINKS.map(({ id: sectionId, label }, i) => (
                <motion.li key={sectionId} variants={itemV}>
                  <Link
                    to={sectionHref(sectionId)}
                    className={styles.menuLink}
                    aria-current={activeSection === sectionId ? "location" : undefined}
                    onClick={onClose}
                  >
                    <span className={styles.menuNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemV}>
                <NavLink to={BLOG_LINK.to} className={`${styles.menuLink} ${styles.menuBlog}`} onClick={onClose}>
                  <span className={styles.menuNum} aria-hidden="true">
                    <span className={styles.liveDot} />
                  </span>
                  {BLOG_LINK.label}
                </NavLink>
              </motion.li>
            </motion.ul>
          </nav>

          <motion.div className={styles.menuFooter} variants={itemV} initial="hidden" animate="visible">
            <span>Antwerp · Belgium</span>
            <span>ridha.dev</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
