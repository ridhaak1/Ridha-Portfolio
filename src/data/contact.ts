import { SiGithub, SiGmail, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import type { IconType } from "react-icons";

export type ContactId = "email" | "github" | "whatsapp" | "linkedin";

export interface ContactItem {
  id: ContactId;
  icon: IconType;
  label: string;
  value: string;
  href: string;
  desc: string;
}

export const contacts: ContactItem[] = [
  {
    id: "email",
    icon: SiGmail,
    label: "Email",
    value: "info.ridha.dev@gmail.com",
    href: "mailto:info.ridha.dev@gmail.com",
    desc: "Best for project inquiries",
  },
  {
    id: "github",
    icon: SiGithub,
    label: "GitHub",
    value: "github.com/ridhaak1",
    href: "https://github.com/ridhaak1",
    desc: "Explore my open-source work",
  },
  {
    id: "whatsapp",
    icon: SiWhatsapp,
    label: "WhatsApp",
    value: "+32 467 792 949",
    href: "https://wa.me/32467792949",
    desc: "Quick chats & real-time talks",
  },
  {
    id: "linkedin",
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "Ridha Al-Khaykanee",
    href: "https://linkedin.com/in/ridha-al-khaykanee-63928235a",
    desc: "Professional network",
  },
];
