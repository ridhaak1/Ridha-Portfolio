import { useEffect, useRef } from "react";
import { gsap } from "@/motion/gsap";
import { FINE_POINTER, matches, REDUCED_MOTION } from "@/motion/media";
import { EASE } from "@/motion/tokens";
import styles from "./Cursor.module.css";

/** Label for an interactive element: explicit data-cursor, else inferred from what it does */
function labelFor(el: Element): string {
  const explicit = el.getAttribute("data-cursor");
  if (explicit) return explicit;
  const href = el.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "Email";
  if (href.startsWith("#") || href.startsWith("/#")) return "View";
  if (el.tagName === "BUTTON") return el.getAttribute("aria-label")?.startsWith("Dismiss") ? "Close" : "Open";
  return "Open";
}

/** Elements that show a logo or short text inside the ring (also on keyboard focus) */
const MARKED = "[data-cursor-icon], [data-cursor-glyph]";

/** How far a marked ring floats above its element's text, so that text stays readable */
const MARKED_LIFT = 52;

/**
 * A small dot that trails the native cursor and grows into a labelled ring
 * over links and buttons. The native cursor stays visible. Fine pointers only.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const mark = markRef.current;
    const icon = iconRef.current;
    const glyphEl = glyphRef.current;
    if (!root || !ring || !label || !mark || !icon || !glyphEl || !matches(FINE_POINTER) || matches(REDUCED_MOTION)) return;

    const toX = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
    const toY = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });
    let target: Element | null = null;
    let visible = false;
    let focused: Element | null = null;

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      gsap.to(root, { autoAlpha: on ? 1 : 0, duration: 0.25, overwrite: "auto" });
    };

    const morph = (next: Element | null) => {
      if (next === target) return;
      target = next;
      const path = next?.getAttribute("data-cursor-icon");
      const glyph = next?.getAttribute("data-cursor-glyph");
      const marked = Boolean(path || glyph);
      // A solid disc on the stage: inverting would make a logo unreadable over text
      root.toggleAttribute("data-marked", marked);
      if (next) {
        label.textContent = marked ? "" : labelFor(next);
        icon.style.display = path ? "block" : "none";
        icon.firstElementChild?.setAttribute("d", path ?? "");
        glyphEl.textContent = glyph ?? "";
      }
      gsap.to(mark, { opacity: marked ? 1 : 0, duration: 0.25, delay: marked ? 0.1 : 0, overwrite: "auto" });
      // 8px dot ↔ 64px ring (scale of a 64px circle)
      gsap.to(ring, {
        scale: next ? 1 : 0.125,
        backgroundColor: marked
          ? getComputedStyle(root).getPropertyValue("--stage-bg").trim()
          : next
            ? "rgba(255,255,255,0)"
            : "rgba(255,255,255,1)",
        duration: 0.5,
        ease: EASE,
        overwrite: "auto",
      });
      gsap.to(label, { opacity: next ? 1 : 0, duration: 0.25, delay: next ? 0.1 : 0, overwrite: "auto" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (focused) stopFollowingFocus();
      show(true);
      const next = (e.target as Element | null)?.closest?.(`a, button, [data-cursor], ${MARKED}`) ?? null;
      morph(next);
      toX(e.clientX);
      toY(e.clientY - (next?.matches(MARKED) ? MARKED_LIFT : 0));
    };
    const onLeave = () => show(false);

    // Keyboard: the ring parks above the focused element and stays with it while scrolling
    const placeOnFocused = () => {
      if (!focused) return;
      const rect = focused.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2 - MARKED_LIFT;
      if (visible) {
        toX(x);
        toY(y);
      } else {
        toX(x, x);
        toY(y, y);
      }
    };
    const stopFollowingFocus = () => {
      focused = null;
      window.removeEventListener("scroll", placeOnFocused);
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as Element;
      if (!el.matches(MARKED) || !el.matches(":focus-visible")) return;
      if (!focused) window.addEventListener("scroll", placeOnFocused, { passive: true });
      focused = el;
      placeOnFocused();
      show(true);
      morph(el);
    };
    const onFocusOut = () => {
      if (!focused) return;
      stopFollowingFocus();
      morph(null);
      show(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      stopFollowingFocus();
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([root, ring, label, mark]);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <span ref={ringRef} className={styles.ring} />
      <span ref={labelRef} className={styles.label} />
      <span ref={markRef} className={styles.mark}>
        <svg ref={iconRef} viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
          <path />
        </svg>
        <span ref={glyphRef} />
      </span>
    </div>
  );
}
