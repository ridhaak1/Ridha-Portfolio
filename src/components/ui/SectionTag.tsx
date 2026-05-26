import { motion, type Variants } from "framer-motion";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const barV: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: SPRING, delay: 0.1 } },
};

const fIn = (d = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: d } },
});

interface SectionTagProps {
  number: string;
  label: string;
  inView: boolean;
  styles: Record<string, string>;
}

export default function SectionTag({ number, label, inView, styles }: SectionTagProps) {
  return (
    <div className={styles.tag}>
      <motion.span
        className={styles.tagN}
        variants={fIn(0)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        § {number}
      </motion.span>
      <motion.div
        className={styles.tagBar}
        variants={barV}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{ originX: 0 }}
      />
      <motion.span
        className={styles.tagWord}
        variants={fIn(0.25)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {label}
      </motion.span>
    </div>
  );
}
