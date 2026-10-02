import adminImg from "../assets/images/adminpanel.png";
import reviewnest from "../assets/images/reviewnest.png";
import gustoItaliano from "../assets/images/gustoitaliano.png";
import ajib from "../assets/images/ajibhome.png";

export type VisualType = "image" | "console";
export type ProjectStatus = "completed" | "in-progress";

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
  status?: ProjectStatus;
}

export const PROJECTS: Project[] = [
  {
    id: "ajib",
    index: "01",
    type: "AI Education Platform",
    badge: "In Progress",
    title: "Ajib",
    tagline: "Any study material becomes your next exam.",
    description:
      "An AI-powered educational platform that transforms any study material into a personalized exam experience. Students upload a PDF or document, and the platform generates questions, evaluates answers, and adapts to each student's weak points over time.",
    features: [
      "Upload any PDF or study document",
      "AI-generated exam questions from your material",
      "Automated, instant answer evaluation",
      "Adapts to each student's weak points over time",
    ],
    tags: ["AI", "EdTech", "NLP"],
    github: null,
    demo: null,
    image: ajib,
    visual: "image",
    accent: "rgba(245,166,35,0.9)",
    status: "in-progress",
  },
  {
    id: "admin-panel",
    index: "02",
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
    index: "03",
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
    github: "https://github.com/ridhaak1",
    demo: null,
    image: reviewnest,
    visual: "image",
    accent: "rgba(130,210,255,0.9)",
  },
  {
    id: "r-library",
    index: "04",
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
  {
    id: "gusto-italiano",
    index: "05",
    type: "Restaurant Website",
    badge: "Team Project",
    title: "Gusto Italiano",
    tagline: "From browsing to ordering — seamlessly.",
    description:
      "A fully functional restaurant website allowing customers to browse the menu and place orders, built with full backend–frontend integration.",
    features: [
      "Live, browsable restaurant menu",
      "End-to-end online ordering flow",
      "Full backend–frontend integration",
      "Built collaboratively as a team project",
    ],
    tags: ["Fullstack", "Team Project"],
    github: "https://github.com/ridhaak1",
    demo: "https://wpl-five.vercel.app/",
    image: gustoItaliano,
    visual: "image",
    accent: "rgba(224,86,67,0.9)",
  },
];
