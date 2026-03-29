import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Contact.module.css";

import { SiGithub, SiLinkerd, SiGmail, SiWhatsapp } from "react-icons/si";

// ─── Animation ─────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className={styles.contact} id="contact">
      <div className={styles.inner}>
        {/* 🔥 Headline */}
        <motion.h2
          className={styles.headline}
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Let’s Build Something
          <br />
          <span>That Matters.</span>
        </motion.h2>

        {/* 🧠 Description */}
        <motion.p
          className={styles.desc}
          variants={fadeUp(0.2)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          I’m always open to meaningful projects, collaborations, or just a
          conversation about tech and ideas.
        </motion.p>

        {/* ⚡ Actions */}
        <motion.div
          className={styles.actions}
          variants={fadeUp(0.4)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <a
            href="mailto:info.ridha.dev@gmail.com"
            className={styles.primaryBtn}
          >
            <SiGmail />
            Email Me
          </a>

          <a
            href="https://github.com/ridhaak1"
            target="_blank"
            className={styles.secondaryBtn}
          >
            <SiGithub />
            GitHub
          </a>

          <a
            href="https://wa.me/32467792949"
            target="_blank"
            className={styles.secondaryBtn}
          >
            <SiWhatsapp />
            WhatsApp
          </a>

          <a
            href="https://linkedin.com/in/ridha-al-khaykanee-63928235a?"
            target="_blank"
            className={styles.secondaryBtn}
          >
            <SiLinkerd />
            LinkedIn
          </a>
        </motion.div>

        {/* 💎 Bottom Signature */}
        <motion.div
          className={styles.signature}
          variants={fadeUp(0.6)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span>© {new Date().getFullYear()} — Built with precision</span>
        </motion.div>
      </div>
    </section>
  );
}
