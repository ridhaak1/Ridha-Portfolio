import { useCallback, useRef, useState, type FocusEvent } from "react";
import { Link, NavLink } from "react-router";
import { BLOG_LINK, SECTION_LINKS, sectionHref } from "@/data/navigation";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

const MENU_ID = "mobile-menu";

export default function Header() {
  const { scrolled, hidden } = useHeaderScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Keep the header visible while the menu is open or a keyboard user is inside it
  const isHidden = hidden && !menuOpen && !focusWithin;

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
  };

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-hidden={isHidden || undefined}
        data-menu-open={menuOpen || undefined}
        onFocus={() => setFocusWithin(true)}
        onBlur={onBlur}
      >
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Ridha — home" onClick={closeMenu}>
            RIDHA
            <span className={styles.logoBar} aria-hidden="true" />
          </Link>

          <nav className={styles.nav} aria-label="Main">
            <ul className={styles.list}>
              {SECTION_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <Link to={sectionHref(id)} className={styles.link}>
                    {label}
                  </Link>
                </li>
              ))}
              <li className={styles.blogItem}>
                <NavLink to={BLOG_LINK.to} className={styles.blogLink}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  {BLOG_LINK.label}
                </NavLink>
              </li>
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.toggleLine} aria-hidden="true" />
            <span className={styles.toggleLine} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={closeMenu}
        toggleRef={toggleRef}
      />
    </>
  );
}
