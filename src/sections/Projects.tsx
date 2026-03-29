import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
  type Transition,
} from "framer-motion";
import styles from "./Projects.module.css";
import adminImg from "../assets/images/adminpanel.png";
import reviewnest from "../assets/images/reviewnest.png";

// ─── Easing ───────────────────────────────────────────────────────────────────
const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ts = (d = 0, dur = 0.65): Transition => ({
  duration: dur,
  ease: SPRING,
  delay: d,
});
const tf = (d = 0, dur = 0.45): Transition => ({
  duration: dur,
  ease: EASE_OUT,
  delay: d,
});

const vFadeUp = (d = 0, y = 24): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0, transition: ts(d) },
});
const vFadeIn = (d = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: tf(d) },
});
const vBar: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: SPRING, delay: 0.1 },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
type VisualType = "image" | "console";

interface Project {
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
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

// ─── Console mini (card preview) ─────────────────────────────────────────────
function ConsoleMini() {
  const lines = [
    { t: "comment", v: "// R-Library · C#" },
    { t: "keyword", v: "public abstract class " },
    { t: "class", v: "LibraryItem" },
    { t: "kw2", v: "public abstract void " },
    { t: "fn", v: "DisplayInfo()" },
    { t: "kw2", v: "public class " },
    { t: "class", v: "Book : LibraryItem" },
    { t: "string", v: "  Console.WriteLine(Title)" },
  ];
  return (
    <div className={styles.consoleMiniWrap}>
      <div className={styles.mockBar} style={{ background: "rgba(0,0,0,0.5)" }}>
        <span className={styles.dot} style={{ background: "#FF5F57" }} />
        <span className={styles.dot} style={{ background: "#FFBD2E" }} />
        <span className={styles.dot} style={{ background: "#28CA41" }} />
        <span className={styles.mockBarTitle}>RLibrary.cs</span>
      </div>
      <div className={styles.consoleMini}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className={styles.codeLine}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.28,
              ease: EASE_OUT,
              delay: 0.15 + i * 0.055,
            }}
          >
            <span className={styles.lineN}>{i + 1}</span>
            <span className={styles[`tok_${l.t}` as keyof typeof styles]}>
              {l.v}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Console full (drawer) ────────────────────────────────────────────────────
function ConsoleFull() {
  const lines = [
    { t: "comment", v: "// R-Library Management System — C# OOP Demo" },
    {
      t: "keyword",
      v: "public abstract class ",
      c: "class",
      v2: "LibraryItem",
    },
    { t: "prop", v: "  public string Title   { get; protected set; }" },
    { t: "prop", v: "  public string Author  { get; protected set; }" },
    {
      t: "keyword",
      v: "  public abstract void ",
      c: "fn",
      v2: "DisplayInfo();",
    },
    { t: "blank", v: "" },
    { t: "keyword", v: "public class ", c: "class", v2: "Book : LibraryItem" },
    { t: "prop", v: "  public string ISBN { get; init; }" },
    {
      t: "keyword",
      v: "  public override void ",
      c: "fn",
      v2: "DisplayInfo()",
    },
    { t: "string", v: '    Console.WriteLine($"[Book] {Title} by {Author}")' },
    { t: "blank", v: "" },
    { t: "comment", v: "// Custom exception handling" },
    {
      t: "keyword",
      v: "public class ",
      c: "class",
      v2: "BookNotFoundException : Exception",
    },
    {
      t: "keyword",
      v: "  public ",
      c: "fn",
      v2: "BookNotFoundException(string id)",
    },
    { t: "string", v: '    : base($"Book {id} not found in library")' },
  ];
  return (
    <div className={styles.consoleFull}>
      <div className={styles.mockBar} style={{ background: "rgba(0,0,0,0.5)" }}>
        <span className={styles.dot} style={{ background: "#FF5F57" }} />
        <span className={styles.dot} style={{ background: "#FFBD2E" }} />
        <span className={styles.dot} style={{ background: "#28CA41" }} />
        <span className={styles.mockBarTitle}>
          RLibrary.cs — Advanced OOP System
        </span>
      </div>
      <div className={styles.consoleBody}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className={styles.codeLineFull}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.25,
              ease: EASE_OUT,
              delay: 0.1 + i * 0.04,
            }}
          >
            <span className={styles.lineNFull}>
              {l.t !== "blank" ? String(i + 1).padStart(2, " ") : "  "}
            </span>
            {(l as { c?: string }).c ? (
              <span>
                <span className={styles.tok_keyword}>{l.v}</span>
                <span
                  className={
                    styles[
                      `tok_${(l as { c?: string }).c}` as keyof typeof styles
                    ]
                  }
                >
                  {(l as { v2?: string }).v2}
                </span>
              </span>
            ) : (
              <span className={styles[`tok_${l.t}` as keyof typeof styles]}>
                {l.v}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Card visual ──────────────────────────────────────────────────────────────
function CardVisual({ project }: { project: Project }) {
  if (project.visual === "image" && project.image)
    return (
      <img src={project.image} alt={project.title} className={styles.cardImg} />
    );
  return <ConsoleMini />;
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onSelect,
  isActive,
}: {
  project: Project;
  index: number;
  onSelect: (id: string) => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      variants={vFadeUp(index * 0.1)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE_OUT } }}
      onClick={() => onSelect(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(project.id)}
      aria-label={`View ${project.title} details`}
    >
      <div className={styles.cardBorder} aria-hidden="true" />
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardVisual}>
        <motion.div
          className={styles.cardVisualInner}
          whileHover={{
            scale: 1.04,
            transition: { duration: 0.4, ease: EASE_OUT },
          }}
        >
          <CardVisual project={project} />
        </motion.div>
        <div className={styles.cardOverlay} aria-hidden="true" />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <span className={styles.cardIndex}>{project.index}</span>
          <span
            className={styles.cardBadge}
            style={{ "--badge-accent": project.accent } as React.CSSProperties}
          >
            {project.badge}
          </span>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardType}>{project.type}</div>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardTagline}>{project.tagline}</p>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.cardTags}>
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className={styles.cardTag}>
                {t}
              </span>
            ))}
          </div>
          <div className={styles.cardCta}>
            <span className={styles.cardCtaTxt}>View project</span>
            <svg
              viewBox="0 0 16 16"
              className={styles.cardCtaArrow}
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Side Drawer ──────────────────────────────────────────────────────────────
function SideDrawer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Stagger delays for content
  const d = (n: number) => ({ delay: 0.12 + n * 0.07 });

  return (
    <>
      {/* Backdrop — click to close */}
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.aside
        className={styles.drawer}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.42, ease: SPRING }}
        aria-label={`${project.title} details`}
        role="complementary"
      >
        <div className={styles.drawerTopLine} aria-hidden="true" />
        <div className={styles.drawerGlow} aria-hidden="true" />

        {/* Close button */}
        <motion.button
          className={styles.drawerClose}
          onClick={onClose}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>

        {/* Top visual — image or console */}
        {project.visual === "image" && project.image ? (
          <motion.div
            className={styles.drawerImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <img src={project.image} alt={project.title} />
          </motion.div>
        ) : (
          <motion.div
            className={styles.drawerConsole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <ConsoleFull />
          </motion.div>
        )}

        {/* Scrollable content */}
        <div className={styles.drawerContent}>
          {/* Meta */}
          <motion.div
            className={styles.drawerMeta}
            variants={vFadeIn(0)}
            initial="hidden"
            animate="visible"
            transition={d(0)}
          >
            <span className={styles.drawerIdx}>{project.index}</span>
            <motion.div
              className={styles.drawerMetaLine}
              variants={vBar}
              initial="hidden"
              animate="visible"
            />
            <span className={styles.drawerType}>{project.type}</span>
          </motion.div>

          {/* Title */}
          <motion.div
            className={styles.drawerTitleWrap}
            variants={vFadeUp(0, 16)}
            initial="hidden"
            animate="visible"
            transition={d(1)}
          >
            <h2 className={styles.drawerTitle}>{project.title}</h2>
            <p className={styles.drawerTagline}>{project.tagline}</p>
          </motion.div>

          <motion.div
            className={styles.drawerDivider}
            variants={vBar}
            initial="hidden"
            animate="visible"
            transition={d(2)}
          />

          {/* Description */}
          <motion.p
            className={styles.drawerDesc}
            variants={vFadeUp(0, 12)}
            initial="hidden"
            animate="visible"
            transition={d(2)}
          >
            {project.description}
          </motion.p>

          {/* Features */}
          <motion.div
            variants={vFadeIn(0)}
            initial="hidden"
            animate="visible"
            transition={d(3)}
          >
            <div className={styles.drawerFeaturesLabel}>Key features</div>
            <div className={styles.drawerFeatures}>
              {project.features.map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.drawerFeature}
                  variants={vFadeUp(0, 10)}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 + i * 0.07 }}
                >
                  <span className={styles.featureDot} aria-hidden="true" />
                  {f}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            className={styles.drawerTags}
            variants={vFadeUp(0, 8)}
            initial="hidden"
            animate="visible"
            transition={d(4)}
          >
            {project.tags.map((t) => (
              <span key={t} className={styles.drawerTag}>
                {t}
              </span>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            className={styles.drawerBtns}
            variants={vFadeUp(0, 8)}
            initial="hidden"
            animate="visible"
            transition={d(5)}
          >
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className={styles.btnGhost}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={styles.btnIcon}
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    fill="currentColor"
                  />
                </svg>
                GitHub
              </motion.a>
            )}
            {project.demo ? (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={styles.btnDot} aria-hidden="true" />
                Live Demo
                <svg
                  viewBox="0 0 16 16"
                  className={styles.btnArrow}
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </motion.a>
            ) : (
              <span className={styles.btnDisabled}>Demo not available</span>
            )}
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const tagInView = useInView(tagRef, { once: true, margin: "-60px" });

  const [selected, setSelected] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selected) ?? null;

  const handleSelect = useCallback((id: string) => setSelected(id), []);
  const handleClose = useCallback(() => setSelected(null), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [30, -60]);
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.vLine} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

      <motion.div
        className={styles.bigNum}
        style={{ y: springY }}
        aria-hidden="true"
      >
        03
      </motion.div>

      <div className={styles.inner}>
        {/* Tag */}
        <div ref={tagRef} className={styles.tag}>
          <motion.span
            className={styles.tagN}
            variants={vFadeIn(0)}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          >
            § 03
          </motion.span>
          <motion.div
            className={styles.tagBar}
            variants={vBar}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          />
          <motion.span
            className={styles.tagWord}
            variants={vFadeIn(0.25)}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          >
            Projects
          </motion.span>
        </div>

        {/* Headline */}
        <motion.div
          className={styles.headlineWrap}
          variants={vFadeUp(0, 28)}
          initial="hidden"
          animate={tagInView ? "visible" : "hidden"}
        >
          <h2 className={styles.headline}>
            Projects I Build —<br />
            <span className={styles.headlineAccent}>
              Real Impact, Clean Code.
            </span>
          </h2>
          <motion.div
            className={styles.headlineRule}
            variants={vBar}
            initial="hidden"
            animate={tagInView ? "visible" : "hidden"}
          />
          <p className={styles.headlineSub}>
            Click any project to explore the full story.
          </p>
        </motion.div>

        {/* Grid — dims when drawer is open */}
        <div className={`${styles.grid} ${selected ? styles.gridDimmed : ""}`}>
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onSelect={handleSelect}
              isActive={selected === p.id}
            />
          ))}
        </div>
      </div>

      {/* Side Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <SideDrawer project={selectedProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
