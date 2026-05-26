import { motion } from "framer-motion";
import styles from "../../sections/Projects.module.css";

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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

export default function ConsoleMini() {
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
            transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.15 + i * 0.055 }}
          >
            <span className={styles.lineN}>{i + 1}</span>
            <span className={styles[`tok_${l.t}` as keyof typeof styles]}>{l.v}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
