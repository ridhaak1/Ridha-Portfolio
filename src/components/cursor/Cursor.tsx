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

/**
 * A small dot that trails the native cursor and grows into a labelled ring
 * over links and buttons. The native cursor stays visible. Fine pointers only.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !ring || !label || !matches(FINE_POINTER) || matches(REDUCED_MOTION)) return;

    const toX = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
    const toY = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });
    let target: Element | null = null;
    let visible = false;

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      gsap.to(root, { autoAlpha: on ? 1 : 0, duration: 0.25, overwrite: "auto" });
    };

    // The label follows data-cursor while hovering, so an element can just change the attribute
    const labelWatcher = new MutationObserver(() => {
      gsap.to(label, {
        opacity: 0,
        duration: 0.12,
        overwrite: true,
        onComplete: () => {
          if (!target) return;
          label.textContent = labelFor(target);
          gsap.to(label, { opacity: 1, duration: 0.2 });
        },
      });
    });

    const morph = (next: Element | null) => {
      if (next === target) return;
      target = next;
      labelWatcher.disconnect();
      if (next) labelWatcher.observe(next, { attributes: true, attributeFilter: ["data-cursor"] });
      if (next) label.textContent = labelFor(next);
      // 8px dot ↔ 64px ring (scale of a 64px circle)
      gsap.to(ring, {
        scale: next ? 1 : 0.125,
        backgroundColor: next ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
        duration: 0.5,
        ease: EASE,
        overwrite: "auto",
      });
      // overwrite: true also kills a delayed fade-in that hasn't started yet
      gsap.to(label, { opacity: next ? 1 : 0, duration: 0.25, delay: next ? 0.1 : 0, overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show(true);
      morph((e.target as Element | null)?.closest?.("a, button, [data-cursor]") ?? null);
      toX(e.clientX);
      toY(e.clientY);
    };
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      labelWatcher.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([root, ring, label]);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <span ref={ringRef} className={styles.ring} />
      <span ref={labelRef} className={styles.label} />
    </div>
  );
}
