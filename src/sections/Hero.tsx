import { useRef, useEffect, useState, useCallback } from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import styles from "./Hero.module.css";
import profilePhoto from "../assets/images/ridha.jpeg";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MousePos {
  x: number;
  y: number;
}

// ─── Easing — 4-tuple required by Framer Motion's BezierDefinition ────────────
const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Constants ────────────────────────────────────────────────────────────────
const PHRASES = [
  "Building scalable web applications",
  "Crafting clean UI/UX experiences",
  "Available for European opportunities",
];

const STACK: Array<{
  sym: string;
  label: string;
  color: string;
  mono?: boolean;
}> = [
  { sym: "⚛", label: "React", color: "rgba(97,218,251,.75)" },
  { sym: "C#", label: "C#", color: "rgba(245,166,35,.8)", mono: true },
  { sym: ".NET", label: ".NET", color: "rgba(180,180,220,.7)", mono: true },
  { sym: "TS", label: "TypeScript", color: "rgba(100,180,255,.7)", mono: true },
  { sym: "📱", label: "Mobile", color: "inherit" },
  { sym: "SQL", label: "SQL / DB", color: "rgba(150,200,120,.65)", mono: true },
];

// ─── Shared transition builders ───────────────────────────────────────────────
const springTrans = (delay = 0, duration = 0.55): Transition => ({
  duration,
  ease: SPRING,
  delay,
});

const fadeUpTrans = (delay = 0): Transition => ({
  duration: 0.55,
  ease: EASE_OUT,
  delay,
});

// ─── Variant factories ────────────────────────────────────────────────────────
const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: fadeUpTrans(delay) },
});

const photoVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springTrans(0.25, 0.8) },
};

const letterVariants = (i: number): Variants => ({
  hidden: { opacity: 0, y: 55, skewX: -4 },
  visible: {
    opacity: 1,
    y: 0,
    skewX: 0,
    transition: springTrans(0.42 + i * 0.09, 0.6),
  },
});

const iconVariants = (i: number): Variants => ({
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: fadeUpTrans(1.35 + i * 0.08) },
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const [glowPos, setGlowPos] = useState<MousePos>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const [typeText, setTypeText] = useState("");
  const [showCaret, setShowCaret] = useState(true);

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setGlowPos({ x, y });

    const cx = (x - rect.width / 2) / rect.width;
    const cy = (y - rect.height / 2) / rect.height;

    if (photoRef.current)
      photoRef.current.style.transform = `translate(${cx * 14}px, ${cy * 8}px)`;
    if (nameRef.current)
      nameRef.current.style.transform = `translate(${cx * 5}px, ${cy * 3}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (photoRef.current) photoRef.current.style.transform = "";
    if (nameRef.current) nameRef.current.style.transform = "";
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // ── Dot grid canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SP = 28;
    let xs: number[] = [];
    let ys: number[] = [];
    let W = 0;
    let H = 0;

    const init = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      xs = [];
      ys = [];
      for (let x = SP / 2; x < W; x += SP) {
        for (let y = SP / 2; y < H; y += SP) {
          xs.push(x);
          ys.push(y);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const lx = mousePos.x;
      const ly = mousePos.y;
      for (let i = 0; i < xs.length; i++) {
        const dx = lx - xs[i];
        const dy = ly - ys[i];
        const d = Math.sqrt(dx * dx + dy * dy);
        const f = Math.max(0, 1 - d / 110);
        ctx.beginPath();
        ctx.arc(xs[i], ys[i], 1 + f * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,166,35,${0.042 + f * 0.2})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", init);
    };
  }, [mousePos]);

  // ── Typewriter ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let pi = 0;
    let ci = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const step = () => {
      const phrase = PHRASES[pi];
      if (!deleting) {
        ci++;
        setTypeText(phrase.slice(0, ci));
        if (ci === phrase.length) {
          timeout = setTimeout(() => {
            deleting = true;
            timeout = setTimeout(step, 80);
          }, 2600);
          return;
        }
        timeout = setTimeout(step, 62);
      } else {
        ci--;
        setTypeText(phrase.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % PHRASES.length;
          timeout = setTimeout(step, 380);
          return;
        }
        timeout = setTimeout(step, 36);
      }
    };

    timeout = setTimeout(step, 1800);
    return () => clearTimeout(timeout);
  }, []);

  // ── Caret blink ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setShowCaret((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section ref={heroRef} className={styles.hero}>
      {/* ── Decorative ── */}
      <div className={styles.topLine} />
      <div className={styles.botLine} />
      <div className={`${styles.corner} ${styles.tl}`} />
      <div className={`${styles.corner} ${styles.br}`} />

      {/* ── Background ── */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div
        className={styles.glow}
        style={{ left: glowPos.x, top: glowPos.y }}
        aria-hidden="true"
      />

      {/* ── Floating lines ── */}
      <span className={`${styles.fl} ${styles.fl1}`} aria-hidden="true" />
      <span className={`${styles.fl} ${styles.fl2}`} aria-hidden="true" />
      <span className={`${styles.fl} ${styles.fl3}`} aria-hidden="true" />

      {/* ══ Main grid ══ */}
      <div className={styles.layout}>
        {/* ── LEFT column ── */}
        <div className={styles.left}>
          <motion.div
            className={styles.badge}
            variants={fadeUp(0.08)}
            initial="hidden"
            animate="visible"
          >
            <span className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeTxt}>Open to opportunities</span>
          </motion.div>

          <div
            ref={nameRef}
            className={styles.nameRow}
            style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)" }}
          >
            {"RIDHA".split("").map((char, i) => (
              <motion.span
                key={i}
                className={styles.ltr}
                variants={letterVariants(i)}
                initial="hidden"
                animate="visible"
              >
                {char}
              </motion.span>
            ))}
            <motion.div
              className={styles.nameBar}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, ease: SPRING, delay: 1.1 }}
              style={{ originX: 0 }}
            />
          </div>

          <motion.div
            className={styles.specRow}
            variants={fadeUp(1.25)}
            initial="hidden"
            animate="visible"
          >
            <span className={`${styles.spec} ${styles.specHi}`}>
              Software Engineer
            </span>
            <span className={styles.dotSep} aria-hidden="true" />
            <span className={styles.spec}>Full-Stack</span>
            <span className={styles.dotSep} aria-hidden="true" />
            <span className={styles.spec}>Mobile Apps</span>
          </motion.div>

          <motion.p
            className={styles.tagline}
            variants={fadeUp(1.45)}
            initial="hidden"
            animate="visible"
          >
            {typeText}
            <span
              className={styles.caret}
              style={{ opacity: showCaret ? 1 : 0 }}
              aria-hidden="true"
            />
          </motion.p>

          <motion.div
            className={styles.cta}
            variants={fadeUp(1.65)}
            initial="hidden"
            animate="visible"
          >
            <button
              className={styles.btnP}
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Work
            </button>
            <button
              className={styles.btnS}
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get in Touch
            </button>
          </motion.div>

          <motion.div
            className={styles.socials}
            variants={fadeUp(1.85)}
            initial="hidden"
            animate="visible"
          >
            <a
              href="https://github.com/ridhaak1"
              target="_blank"
              rel="noreferrer"
              className={styles.slink}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/ridha-al-khaykanee-63928235a?"
              target="_blank"
              rel="noreferrer"
              className={styles.slink}
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:info.ridha.dev@gmail.com"
              className={styles.slink}
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* ── CENTER – Photo ── */}
        <div className={styles.center}>
          <motion.div
            ref={photoRef}
            className={styles.photoZone}
            variants={photoVariants}
            initial="hidden"
            animate="visible"
            style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div className={styles.aura} aria-hidden="true" />
            <div className={styles.ringOuter} aria-hidden="true" />
            <div className={styles.ringSpin} aria-hidden="true" />
            <div className={styles.photoIn}>
              {
                <img
                  src={profilePhoto}
                  alt="Ridha"
                  className={styles.photoImg}
                />
              }
            </div>
          </motion.div>

          <motion.div
            className={styles.photoCap}
            variants={fadeUp(0.85)}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.capName}>Ridha</div>
            <div className={styles.capLoc}>Brussels · EU</div>
          </motion.div>
        </div>

        {/* ── RIGHT – Stack ── */}
        <div className={styles.right}>
          <motion.div
            className={styles.stackHd}
            variants={fadeUp(1.1)}
            initial="hidden"
            animate="visible"
          >
            Tech Stack
          </motion.div>

          <div className={styles.iconGrid}>
            {STACK.map((item, i) => (
              <motion.div
                key={item.label}
                className={styles.icItem}
                variants={iconVariants(i)}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className={styles.icSym}
                  style={{
                    color: item.color,
                    fontFamily: item.mono ? "monospace" : "inherit",
                    fontSize: item.mono ? "12px" : "16px",
                  }}
                >
                  {item.sym}
                </span>
                <span className={styles.icLbl}>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className={styles.rdiv}
            variants={fadeUp(1.6)}
            initial="hidden"
            animate="visible"
          />

          <motion.div
            className={styles.exp}
            variants={fadeUp(1.7)}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.expN}>3+</div>
            <div className={styles.expS}>Years exp.</div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.botBar}>
        <span className={styles.bm}>Brussels · Belgium</span>
        <span className={styles.bm}>ridha.dev</span>
        <span className={styles.bm}>© 2026</span>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className={styles.scrollInd}
        variants={fadeUp(2.2)}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        <div className={styles.scLine} />
        <div className={styles.scDot} />
      </motion.div>
    </section>
  );
}
