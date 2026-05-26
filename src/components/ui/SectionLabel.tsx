import { motion, type Variants } from "framer-motion";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SectionLabelProps {
  n: string;
  text: string;
  inView: boolean;
  delay?: number;
  styles: Record<string, string>;
}

export default function SectionLabel({ n, text, inView, delay = 0, styles }: SectionLabelProps) {
  const fX = (d = 0): Variants => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: SPRING, delay: d } },
  });

  return (
    <motion.div
      className={styles.label}
      variants={fX(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <span className={styles.labelN}>{n}</span>
      <div className={styles.labelLine} />
      <span className={styles.labelTxt}>{text}</span>
    </motion.div>
  );
}
