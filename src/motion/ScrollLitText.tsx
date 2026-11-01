import { useLayoutEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { gsap, SplitText } from "./gsap";
import { REDUCED_MOTION } from "./media";
import { SCROLL_LIT } from "./tokens";

/**
 * A paragraph whose words light up one by one as it's scrolled through; fully lit under
 * reduced motion. Unlit words would fail a contrast check, so callers mark this aria-hidden
 * and provide the same copy in a visually hidden paragraph.
 */
export default function ScrollLitText(props: ComponentPropsWithoutRef<"p">) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(`not all and ${REDUCED_MOTION}`, () => {
      const split = SplitText.create(el, { type: "words", aria: "none" });
      gsap.fromTo(
        split.words,
        { opacity: SCROLL_LIT.dim },
        {
          opacity: 1,
          ease: "none",
          stagger: SCROLL_LIT.stagger,
          scrollTrigger: { trigger: el, start: SCROLL_LIT.start, end: SCROLL_LIT.end, scrub: true },
        },
      );
      return () => split.revert();
    });
    return () => mm.revert();
  }, []);

  return <p ref={ref} {...props} />;
}
