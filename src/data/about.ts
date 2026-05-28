import {
  HiOutlineLightBulb,
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineArrowPath,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineFire,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

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

export const STRENGTHS: Strength[] = [
  { n: "01", icon: HiOutlineLightBulb, label: "Clarity",     detail: "Simple solutions to complex problems." },
  { n: "02", icon: HiOutlineUser,       label: "Ownership",   detail: "From idea to execution."              },
  { n: "03", icon: HiOutlineBeaker,     label: "Thinking",    detail: "Structure before code."               },
  { n: "04", icon: HiOutlineArrowPath,  label: "Consistency", detail: "Quality over time."                   },
];

export const BEYOND: BeyondItem[] = [
  { label: "Philosophy", icon: HiOutlineBookOpen     },
  { label: "Reading",    icon: HiOutlineDocumentText },
  { label: "Football",   icon: HiOutlineTrophy       },
  { label: "Discipline", icon: HiOutlineFire         },
];
