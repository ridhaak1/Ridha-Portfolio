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

export const SENTENCE = "I design, build and ship web and mobile products end to end — from the database to the last pixel.";

export const FACTS_LINE = "Antwerp, Belgium · Full-stack developer · Web, mobile & SaaS";

export const PHASES = [
  { name: "Plan", line: "Structure before code." },
  { name: "Build", line: "Clean, typed, tested." },
  { name: "Refine", line: "Until it feels right." },
];

/** Drawn on a plane: a simple-icons path, or short text where no logo fits */
export interface Tech {
  name: string;
  icon?: string;
  glyph?: string;
}

export interface Layer {
  name: string;
  techs: Tech[];
}

/** Top → bottom of the stack */
export const LAYERS: Layer[] = [
  {
    name: "Interface",
    techs: [
      { name: "React", icon: siReact.path },
      { name: "Next.js", icon: siNextdotjs.path },
      { name: "TypeScript", icon: siTypescript.path },
      { name: "React Native", icon: siReact.path },
    ],
  },
  {
    name: "Logic",
    techs: [
      { name: "C#", glyph: "C#" },
      { name: "ASP.NET Core", icon: siDotnet.path },
      { name: "Node.js", icon: siNodedotjs.path },
      { name: "Express", icon: siExpress.path },
    ],
  },
  {
    name: "Intelligence",
    techs: [
      { name: "AI integration", glyph: "AI" },
      { name: "n8n", icon: siN8n.path },
    ],
  },
  {
    name: "Data",
    techs: [
      { name: "SQL", glyph: "SQL" },
      { name: "MongoDB", icon: siMongodb.path },
    ],
  },
  {
    name: "Delivery",
    techs: [
      { name: "Git", icon: siGit.path },
      { name: "CI/CD", glyph: "CI/CD" },
    ],
  },
];
