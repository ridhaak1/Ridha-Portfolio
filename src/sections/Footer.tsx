import { useLayoutEffect, useRef, type CSSProperties, type FocusEvent } from "react";
import LocalTime from "@/components/hero/LocalTime";
import { site } from "@/config/site";
import { useMediaAttribute } from "@/hooks/useMediaAttribute";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { getLenis, scrollToTop } from "@/motion/lenis";
import { FINE_POINTER, matches, REDUCED_MOTION } from "@/motion/media";
import { createParallax, type DepthLayer } from "@/motion/parallax";
import { afterIntro } from "@/motion/schedule";
import { FADE } from "@/motion/tokens";
import { grainUrl } from "./heroAssets";
import styles from "./Footer.module.css";

const NAME = "RIDHA";
/** Per-letter parallax, px at the viewport edge */
const LETTER_DEPTH = [-10, 7, -5, 9, -7];

const CURTAIN = `${FINE_POINTER} and (prefers-reduced-motion: no-preference)`;

function backToTop() {
  scrollToTop();
  // Don't leave keyboard focus inside a footer that's about to be covered
  const h1 = document.querySelector("h1");
  if (!h1) return;
  h1.setAttribute("tabindex", "-1");
  h1.focus({ preventScroll: true });
}

/** Under the curtain a focused element doesn't scroll into view by itself */
function onFocus(e: FocusEvent<HTMLElement>) {
  if (!document.documentElement.hasAttribute("data-curtain") || !e.target.matches(":focus-visible")) return;
  const lenis = getLenis();
  lenis?.scrollTo(lenis.limit, { duration: 0.8 });
}

/**
 * The closing bookend of the hero. In flow by default (prerender, touch, reduced motion);
 * on fine pointers html[data-curtain] fixes it underneath <main>, which lifts away to reveal it.
 */
export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useMediaAttribute(null, "data-curtain", CURTAIN);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const main = document.querySelector("main");
    if (!root || !main) return;

    // Hidden until the page is within a viewport of its end. Painted at load, this fixed giant
    // word counts as a layout shift and takes over LCP, even behind <main> and out of view.
    if (matches(CURTAIN) && main.getBoundingClientRect().bottom > 2 * window.innerHeight) root.style.visibility = "hidden";

    return afterIntro(() => {
      const letters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-letter]"));
      const mm = gsap.matchMedia();

      mm.add(CURTAIN, () => {
        const reveal = ScrollTrigger.create({
          trigger: main,
          start: "bottom bottom+=100%",
          onEnter: () => (root.style.visibility = ""),
          onLeaveBack: () => (root.style.visibility = "hidden"),
        });
        root.style.visibility = reveal.progress === 0 ? "hidden" : "";
        const layers = letters.map((el, i): DepthLayer => [el, LETTER_DEPTH[i]]);
        const stop = createParallax(layers, null, () => main.getBoundingClientRect().bottom < window.innerHeight);
        return () => {
          root.style.visibility = "";
          stop();
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          letters,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: main, start: "bottom bottom", end: "max", scrub: true },
          },
        );
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.fromTo(
          root,
          { opacity: 0 },
          { opacity: 1, duration: FADE.duration, scrollTrigger: { trigger: root, start: "top 95%", once: true } },
        );
      });

      return () => mm.revert();
    });
  }, []);

  return (
    <footer ref={rootRef} className={styles.footer} onFocus={onFocus}>
      <div className={styles.row}>
        <p className={styles.copyright}>© 2026 {site.name}</p>
        <LocalTime className={styles.time} separator=" " />
        <button type="button" className={styles.top} data-cursor="Top" onClick={backToTop}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>

      <div className={styles.name} aria-hidden="true">
        {[...NAME].map((letter, i) => (
          <span key={i} className={styles.letter} data-letter>
            {letter}
          </span>
        ))}
      </div>

      <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />
    </footer>
  );
}
