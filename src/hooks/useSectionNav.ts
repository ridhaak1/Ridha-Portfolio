import { useCallback } from "react";
import { useNavigate } from "react-router";
import { sectionHref, type SectionId } from "@/data/navigation";

/**
 * Navigates to a home-page section from anywhere. On "/" this just updates the hash;
 * from other routes it goes to "/" first. ScrollRestoration then scrolls to the section.
 */
export function useSectionNav() {
  const navigate = useNavigate();
  return useCallback((id: SectionId) => navigate(sectionHref(id)), [navigate]);
}
