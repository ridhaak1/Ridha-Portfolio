import {
  HiOutlineLightBulb,
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineArrowPath,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineFire,
  HiOutlineMapPin,
  HiOutlineRectangleStack,
  HiOutlineCursorArrowRays,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

export interface InfoRow {
  icon: IconType | null;
  label: string;
  value: string;
  dot?: boolean;
}

export interface StoryBlock {
  icon: IconType;
  eyebrow: string;
  title: string;
  text: string;
}

export interface Strength {
  n: string;
  icon: IconType;
  label: string;
  detail: string;
}

export interface BeyondItem {
  label: string;
  icon: IconType;
}

export const STATEMENT = {
  lead: "I'm driven by one thing —",
  accent: "turning ideas into something real, structured, and meaningful.",
};

export const SUBTEXT =
  "I care about how things are built as much as what is built. Structure, clarity, and intention matter. Because good products aren't just functional — they feel right to use, maintain, and grow.";

export const INFO_ROWS: InfoRow[] = [
  { icon: HiOutlineMapPin, label: "Location", value: "Brussels, Belgium" },
  { icon: HiOutlineUser, label: "Role", value: "Full-Stack Developer" },
  { icon: HiOutlineRectangleStack, label: "Focus", value: "Web · Mobile · SaaS" },
  { icon: null, label: "Status", value: "Open to remote · Europe", dot: true },
];

export const STORY: StoryBlock[] = [
  {
    icon: HiOutlineBookOpen,
    eyebrow: "Background",
    title: "Curiosity led the way.",
    text: "I started with nothing but curiosity — teaching myself how things work, then how to build them. I explored different paths, but always found my way back to code. Not because I had to — but because it felt right.",
  },
  {
    icon: HiOutlineCursorArrowRays,
    eyebrow: "Approach",
    title: "Intentional. Focused. Built to last.",
    text: "I think in systems, not shortcuts. I plan before I build, write with purpose, and refine relentlessly. The goal isn't just to deliver — it's to create value that lasts.",
  },
];

export const STRENGTHS: Strength[] = [
  {
    n: "01",
    icon: HiOutlineLightBulb,
    label: "Clarity",
    detail: "Simple solutions to complex problems.",
  },
  {
    n: "02",
    icon: HiOutlineUser,
    label: "Ownership",
    detail: "From idea to execution.",
  },
  {
    n: "03",
    icon: HiOutlineBeaker,
    label: "Thinking",
    detail: "Structure before code.",
  },
  {
    n: "04",
    icon: HiOutlineArrowPath,
    label: "Consistency",
    detail: "Quality over time.",
  },
];

export const BEYOND: BeyondItem[] = [
  { label: "Philosophy", icon: HiOutlineBookOpen },
  { label: "Reading", icon: HiOutlineDocumentText },
  { label: "Football", icon: HiOutlineTrophy },
  { label: "Discipline", icon: HiOutlineFire },
];
