import adminImg from "../assets/images/adminpanel.png";
import reviewnest from "../assets/images/reviewnest.png";

export type VisualType = "image" | "console";

export interface Project {
  id: string;
  index: string;
  type: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tags: string[];
  github: string | null;
  demo: string | null;
  image?: string;
  visual: VisualType;
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: "admin-panel",
    index: "01",
    type: "Web Application",
    badge: "Full-Stack",
    title: "Product Admin Panel",
    tagline: "Lightweight dashboard. Maximum control.",
    description:
      "A high-performance admin dashboard for seamless product management. Built with clean architecture and role-based access to give admins full visibility and control over inventory, users, and operations.",
    features: [
      "Role-based access — Users vs Admins",
      "Full inventory management system",
      "High performance, minimal load time",
      "Clean REST API architecture",
    ],
    tags: ["React", "TypeScript", "Node.js", "REST API"],
    github: "https://github.com/ridhaak1/Product-Admin-Panel.git",
    demo: "https://product-admin-panel-m35e.onrender.com/login",
    image: adminImg,
    visual: "image",
    accent: "rgba(245,166,35,0.9)",
  },
  {
    id: "reviewnest",
    index: "02",
    type: "SaaS Platform",
    badge: "Dashboard",
    title: "Reviewnest",
    tagline: "Turn feedback into intelligence.",
    description:
      "An advanced review management platform that transforms raw customer feedback into actionable intelligence. Track sentiment, analyze trends, and respond — all from a single unified dashboard.",
    features: [
      "Intelligent review analysis engine",
      "Negative feedback tracking & alerts",
      "Direct response workflow",
      "Multi-channel review aggregation",
    ],
    tags: ["React", "C#", ".NET", "SQL"],
    github: "https://github.com",
    demo: null,
    image: reviewnest,
    visual: "image",
    accent: "rgba(130,210,255,0.9)",
  },
  {
    id: "r-library",
    index: "03",
    type: "Console Application",
    badge: "Advanced OOP",
    title: "R-Library System",
    tagline: "Architecture that speaks for itself.",
    description:
      "A console-based library management system demonstrating advanced OOP principles. Proof that clean architecture lives at the code level — not the UI layer. Built to showcase real-world domain modeling in C#.",
    features: [
      "Encapsulation · Inheritance · Polymorphism",
      "Custom exception handling system",
      "Real-world domain modeling",
      "Dependency inversion principles",
    ],
    tags: ["C#", "OOP", ".NET", "Architecture"],
    github: "https://github.com/ridhaak1/Bib_ridha.git",
    demo: null,
    visual: "console",
    accent: "rgba(195,232,141,0.9)",
  },
];
