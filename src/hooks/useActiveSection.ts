import { useEffect, useState } from "react";

/**
 * Returns the id of the section that crosses the vertical middle of the viewport,
 * or null when none does (e.g. while the Hero is in view).
 */
export function useActiveSection<T extends string>(ids: readonly T[], enabled: boolean): T | null {
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const visible = new Set<T>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as T;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      // A thin band around the middle of the viewport
      { rootMargin: "-50% 0px -49% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids, enabled]);

  return enabled ? active : null;
}
