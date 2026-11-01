import {
  siDotnet,
  siExpress,
  siGit,
  siMongodb,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siTypescript,
} from "simple-icons";
import { site } from "@/config/site";

/** Parts with `em` are set in italic */
export const STATEMENT: { text: string; em?: boolean }[] = [
  { text: "I started with curiosity and stayed for the " },
  { text: "craft.", em: true },
  {
    text: " Today I build web and mobile products — planning before I build, keeping things simple, and refining until it feels ",
  },
  { text: "right.", em: true },
];

export const FACTS = [
  { label: "Based", value: `${site.city}, Belgium` },
  { label: "Role", value: "Full-stack Software Developer" },
  { label: "Focus", value: "Web · Mobile · SaaS" },
  { label: "Building since", value: site.buildingSince },
];

/** Shown in the cursor ring: a simple-icons path, or short text where no logo fits */
export interface Tech {
  name: string;
  icon?: string;
  glyph?: string;
}

export const CREDITS: { category: string; techs: Tech[] }[] = [
  {
    category: "Frontend",
    techs: [
      { name: "TypeScript", icon: siTypescript.path },
      { name: "React", icon: siReact.path },
      { name: "Next.js", icon: siNextdotjs.path },
    ],
  },
  {
    category: "Backend",
    techs: [
      { name: "C#", glyph: "C#" },
      { name: "ASP.NET Core", icon: siDotnet.path },
      { name: "Node.js", icon: siNodedotjs.path },
      { name: "Express", icon: siExpress.path },
    ],
  },
  {
    category: "Data",
    techs: [
      { name: "SQL", glyph: "SQL" },
      { name: "MongoDB", icon: siMongodb.path },
    ],
  },
  {
    category: "Mobile & AI",
    techs: [
      { name: "React Native", icon: siReact.path },
      { name: "AI integration", glyph: "AI" },
      { name: "n8n", icon: siN8n.path },
    ],
  },
  {
    category: "Tooling",
    techs: [
      { name: "Git", icon: siGit.path },
      { name: "CI/CD & deployment", glyph: "CI" },
    ],
  },
];

export const MARQUEE_PHRASE = "Web · Mobile · SaaS · Full-stack ·";
