export type SectionId = "about" | "projects" | "skills" | "contact";

export interface SectionLink {
  id: SectionId;
  label: string;
}

export const SECTION_LINKS: SectionLink[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = SECTION_LINKS.map((l) => l.id);

export const BLOG_LINK = { to: "/blog", label: "Blog" };

/** Home-page URL for a section; React Router's ScrollRestoration scrolls to the hash. */
export const sectionHref = (id: SectionId) => `/#${id}`;
