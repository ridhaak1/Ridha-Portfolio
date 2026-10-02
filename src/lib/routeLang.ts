import { useMatches } from "react-router";

export type Lang = "en" | "nl";

/** Set `export const handle: RouteHandle = { lang: "nl" }` on a route to change <html lang>. */
export interface RouteHandle {
  lang?: Lang;
}

/** Language of the deepest matched route that declares one; defaults to English. */
export function useRouteLang(): Lang {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const lang = (matches[i].handle as RouteHandle | undefined)?.lang;
    if (lang) return lang;
  }
  return "en";
}
