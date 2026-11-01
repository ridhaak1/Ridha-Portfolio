import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { gsap } from "./gsap";
import { FINE_POINTER, matches, REDUCED_MOTION } from "./media";
import { DUR, EASE } from "./tokens";

type MagneticButtonProps = (
  | ({ as?: "button" } & ComponentPropsWithoutRef<"button">)
  | ({ as: "a" } & ComponentPropsWithoutRef<"a">)
) & {
  /** Fraction of the cursor's offset from center the element follows */
  strength?: number;
  /** Furthest it may lean, px */
  max?: number;
};

/** Leans toward the cursor while hovered, springs back on leave. Fine pointers only. */
export default function MagneticButton({ as = "button", strength = 0.3, max = Infinity, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matches(FINE_POINTER) || matches(REDUCED_MOTION)) return;

    const toX = gsap.quickTo(el, "x", { duration: DUR.fast, ease: EASE });
    const toY = gsap.quickTo(el, "y", { duration: DUR.fast, ease: EASE });

    const limit = gsap.utils.clamp(-max, max);
    const onMove = (e: PointerEvent) => {
      // Measured from where it rests: the rect moves as the element leans
      const rect = el.getBoundingClientRect();
      const restX = rect.left - (gsap.getProperty(el, "x") as number);
      const restY = rect.top - (gsap.getProperty(el, "y") as number);
      toX(limit((e.clientX - restX - rect.width / 2) * strength));
      toY(limit((e.clientY - restY - rect.height / 2) * strength));
    };
    const onLeave = () => {
      toX(0);
      toY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [strength, max]);

  if (as === "a") {
    return <a ref={ref as React.Ref<HTMLAnchorElement>} {...(props as ComponentPropsWithoutRef<"a">)} />;
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      {...(props as ComponentPropsWithoutRef<"button">)}
    />
  );
}
