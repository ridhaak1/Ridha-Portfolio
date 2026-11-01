export type SectionId = "work" | "about" | "contact";

export interface SectionLink {
  id: SectionId;
  label: string;
}

export const SECTION_LINKS: SectionLink[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const BLOG_LINK = { to: "/blog", label: "Blog" };

/** Home-page URL for a section; useHashLanding lands on the hash. */
export const sectionHref = (id: SectionId) => `/#${id}`;
