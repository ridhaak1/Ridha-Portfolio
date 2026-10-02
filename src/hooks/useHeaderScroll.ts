import { useEffect, useState } from "react";

const SCROLLED_AFTER = 24; // px before the header gets its glass background
const HIDE_AFTER = 160; // never hide while this close to the top
const TOLERANCE = 8; // px of movement needed to flip direction

interface HeaderScroll {
  scrolled: boolean;
  hidden: boolean;
}

/** Tracks whether the page is scrolled and whether the header should hide (scrolling down). */
export function useHeaderScroll(): HeaderScroll {
  const [state, setState] = useState<HeaderScroll>({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;

      setState((prev) => {
        let hidden = prev.hidden;
        if (y < HIDE_AFTER) hidden = false;
        else if (delta > TOLERANCE) hidden = true;
        else if (delta < -TOLERANCE) hidden = false;

        const scrolled = y > SCROLLED_AFTER;
        return prev.hidden === hidden && prev.scrolled === scrolled ? prev : { scrolled, hidden };
      });

      // Only move the reference point once the movement is significant,
      // so slow scrolling still accumulates past the tolerance.
      if (Math.abs(delta) > TOLERANCE) lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    onScroll(); // sync with the initial position (e.g. after a reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
