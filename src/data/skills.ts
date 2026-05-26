import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiSharp,
  SiDotnet,
  SiMysql,
  SiMongodb,
  SiGit,
  SiGithub,
  SiVercel,
  SiOpenai,
  SiN8N,
} from "react-icons/si";
import type { IconType } from "react-icons";

export interface Skill {
  name: string;
  icon: IconType;
  level: number;
}

export interface SkillGroup {
  category: string;
  accent: string;
  skills: Skill[];
}

export const GROUPS: SkillGroup[] = [
  {
    category: "Frontend Engineering",
    accent: "rgba(97,218,251,0.85)",
    skills: [
      { name: "HTML", icon: SiHtml5, level: 5 },
      { name: "CSS", icon: SiCss, level: 5 },
      { name: "JavaScript", icon: SiJavascript, level: 5 },
      { name: "TypeScript", icon: SiTypescript, level: 4 },
      { name: "React", icon: SiReact, level: 5 },
      { name: "Next.js", icon: SiNextdotjs, level: 5 },
    ],
  },
  {
    category: "Backend Engineering",
    accent: "rgba(104,211,145,0.85)",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, level: 4 },
      { name: "Express.js", icon: SiExpress, level: 4 },
      { name: "C#", icon: SiSharp, level: 5 },
      { name: "ASP.NET Core", icon: SiDotnet, level: 4 },
    ],
  },
  {
    category: "Data & Infrastructure",
    accent: "rgba(245,166,35,0.85)",
    skills: [
      { name: "SQL", icon: SiMysql, level: 4 },
      { name: "MongoDB", icon: SiMongodb, level: 4 },
      { name: "Git", icon: SiGit, level: 5 },
      { name: "GitHub", icon: SiGithub, level: 5 },
      { name: "Deployment", icon: SiVercel, level: 4 },
    ],
  },
  {
    category: "Advanced & Emerging",
    accent: "rgba(195,166,251,0.85)",
    skills: [
      { name: "React Native", icon: SiReact, level: 3 },
      { name: "AI Integration", icon: SiOpenai, level: 4 },
      { name: "n8n", icon: SiN8N, level: 3 },
    ],
  },
];
