import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText } from "./gsap";
import { matches, REDUCED_MOTION } from "./media";
import { DUR, EASE, FADE } from "./tokens";

interface RevealTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  /** Reveal when scrolled into view (default) or right after mount */
  onScroll?: boolean;
}

/** Line-by-line masked slide-up; a plain fade under reduced motion */
export default function RevealText({
  as: Tag = "p",
  children,
  className,
  delay = 0,
  duration = DUR.base,
  stagger = 0.08,
  onScroll = true,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scrollTrigger = onScroll ? { trigger: el, start: "top 85%", once: true } : undefined;

    const ctx = gsap.context(() => {
      if (matches(REDUCED_MOTION)) {
        gsap.from(el, { opacity: 0, duration: FADE.duration, delay, scrollTrigger });
        return;
      }
      // autoSplit re-splits on resize / font load and syncs the returned tween's progress
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 100, duration, stagger, delay, ease: EASE, scrollTrigger }),
      });
    });
    return () => ctx.revert();
  }, [delay, duration, stagger, onScroll]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
