import { motion } from "framer-motion";
import styles from "../../sections/Projects.module.css";

const EASE_OUT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type ConsoleLine = {
  t: string;
  v: string;
  c?: string;
  v2?: string;
};

const lines: ConsoleLine[] = [
  { t: "comment", v: "// R-Library Management System — C# OOP Demo" },
  { t: "keyword", v: "public abstract class ", c: "class", v2: "LibraryItem" },
  { t: "prop", v: "  public string Title   { get; protected set; }" },
  { t: "prop", v: "  public string Author  { get; protected set; }" },
  { t: "keyword", v: "  public abstract void ", c: "fn", v2: "DisplayInfo();" },
  { t: "blank", v: "" },
  { t: "keyword", v: "public class ", c: "class", v2: "Book : LibraryItem" },
  { t: "prop", v: "  public string ISBN { get; init; }" },
  { t: "keyword", v: "  public override void ", c: "fn", v2: "DisplayInfo()" },
  { t: "string", v: '    Console.WriteLine($"[Book] {Title} by {Author}")' },
  { t: "blank", v: "" },
  { t: "comment", v: "// Custom exception handling" },
  { t: "keyword", v: "public class ", c: "class", v2: "BookNotFoundException : Exception" },
  { t: "keyword", v: "  public ", c: "fn", v2: "BookNotFoundException(string id)" },
  { t: "string", v: '    : base($"Book {id} not found in library")' },
];

export default function ConsoleFull() {
  return (
    <div className={styles.consoleFull}>
      <div className={styles.mockBar} style={{ background: "rgba(0,0,0,0.5)" }}>
        <span className={styles.dot} style={{ background: "#FF5F57" }} />
        <span className={styles.dot} style={{ background: "#FFBD2E" }} />
        <span className={styles.dot} style={{ background: "#28CA41" }} />
        <span className={styles.mockBarTitle}>RLibrary.cs — Advanced OOP System</span>
      </div>
      <div className={styles.consoleBody}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className={styles.codeLineFull}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT, delay: 0.1 + i * 0.04 }}
          >
            <span className={styles.lineNFull}>
              {l.t !== "blank" ? String(i + 1).padStart(2, " ") : "  "}
            </span>
            {l.c ? (
              <span>
                <span className={styles.tok_keyword}>{l.v}</span>
                <span className={styles[`tok_${l.c}` as keyof typeof styles]}>{l.v2}</span>
              </span>
            ) : (
              <span className={styles[`tok_${l.t}` as keyof typeof styles]}>{l.v}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
