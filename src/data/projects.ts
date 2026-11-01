/** How a project appears as a scene in "Selected work" on the home page */
export interface ProjectScene {
  /** Display title (sentence case) */
  title: string;
  /** e.g. "AI education platform" */
  kind: string;
  /** TODO(ridha): fill in the real years */
  year: string;
  status: string;
  /** TODO(ridha): fill in the real stacks */
  stack: string[];
  /** One short sentence, ≤ ~12 words */
  line: string;
  /**
   * How far the title sits up on the frame's top edge (translate-y, % of the title box;
   * default 84). Raise it when a descender carries a letter's identity (the y in "MyShop"
   * reads as a v, the j in "Ajib" as an i, with their tails behind the frame).
   */
  lift?: number;
}

export interface SelectedProject {
  /** Also names its images in src/assets/work (scripts/work-assets/build.py) */
  id: string;
  description: string;
  github: string | null;
  demo: string | null;
  /** More screenshots for the drawer's gallery, after the scene's frame */
  screenshots?: { src: string; alt: string }[];
  scene: ProjectScene;
}

/** The projects shown as scenes in "Selected work", in order */
export const SELECTED_WORK: SelectedProject[] = [
  {
    id: "ajib",
    description:
      "An AI-powered educational platform that transforms any study material into a personalized exam experience. Students upload a PDF or document, and the platform generates questions, evaluates answers, and adapts to each student's weak points over time.",
    github: null,
    demo: null,
    scene: {
      title: "Ajib",
      kind: "AI education platform",
      year: "[YEAR]",
      status: "In progress",
      stack: ["AI", "EdTech", "NLP"],
      line: "Any study material becomes your next exam.",
      lift: 100,
    },
  },
  {
    id: "admin-panel",
    description:
      "A high-performance admin dashboard for seamless product management. Built with clean architecture and role-based access to give admins full visibility and control over inventory, users, and operations.",
    github: "https://github.com/ridhaak1/Product-Admin-Panel.git",
    demo: "https://product-admin-panel-m35e.onrender.com/login",
    scene: {
      title: "MyShop",
      kind: "Product admin panel",
      year: "[YEAR]",
      status: "Live",
      stack: ["React", "TypeScript", "Node.js"],
      line: "A lightweight dashboard with full control over products.",
      lift: 100,
    },
  },
  {
    id: "reviewnest",
    description:
      "An advanced review management platform that transforms raw customer feedback into actionable intelligence. Track sentiment, analyze trends, and respond — all from a single unified dashboard.",
    github: "https://github.com/ridhaak1",
    demo: null,
    scene: {
      title: "ReviewNest",
      kind: "Review management SaaS",
      year: "[YEAR]",
      status: "Completed",
      stack: ["React", "C#", ".NET", "SQL"],
      line: "Every customer review, one dashboard.",
    },
  },
];
