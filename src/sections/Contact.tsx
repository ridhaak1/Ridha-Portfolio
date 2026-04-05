import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Contact.module.css";
import { SiGithub, SiLinkerd, SiGmail, SiWhatsapp } from "react-icons/si";
import { HiArrowUpRight } from "react-icons/hi2";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay },
  },
});

const contacts = [
  {
    icon: SiGmail,
    label: "Email",
    value: "info.ridha.dev@gmail.com",
    href: "mailto:info.ridha.dev@gmail.com",
    desc: "Best for project inquiries",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    value: "github.com/ridhaak1",
    href: "https://github.com/ridhaak1",
    desc: "Explore my open-source work",
  },
  {
    icon: SiWhatsapp,
    label: "WhatsApp",
    value: "+32 467 792 949",
    href: "https://wa.me/32467792949",
    desc: "Quick chats & real-time talks",
  },
  {
    icon: SiLinkerd,
    label: "LinkedIn",
    value: "Ridha Al-Khaykanee",
    href: "https://linkedin.com/in/ridha-al-khaykanee-63928235a",
    desc: "Professional network",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className={styles.contact} id="contact">
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.bgGrid} aria-hidden />

      <div className={styles.inner}>
        {/* Availability badge */}
        <motion.div
          className={styles.badge}
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className={styles.dot} />
          Available for new projects
        </motion.div>

        {/* Headline */}
        <motion.h2
          className={styles.headline}
          variants={fadeUp(0.1)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Let's Build Something
          <br />
          <span>Extraordinary.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className={styles.desc}
          variants={fadeUp(0.2)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Whether it's a bold new product, a creative collaboration, or simply
          a conversation about technology — I'm here. Let's turn your vision
          into something the world remembers.
        </motion.p>

        {/* Contact Cards */}
        <motion.div
          className={styles.grid}
          variants={fadeUp(0.3)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {contacts.map(({ icon: Icon, label, value, href, desc }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                  <Icon />
                </div>
                <HiArrowUpRight className={styles.arrow} />
              </div>
              <span className={styles.cardLabel}>{label}</span>
              <span className={styles.cardValue}>{value}</span>
              <span className={styles.cardDesc}>{desc}</span>
            </a>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          variants={fadeUp(0.5)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <a href="mailto:info.ridha.dev@gmail.com" className={styles.cta}>
            <SiGmail />
            Send me an email
            <HiArrowUpRight className={styles.ctaArrow} />
          </a>
        </motion.div>

        {/* Signature */}
        <motion.footer
          className={styles.signature}
          variants={fadeUp(0.65)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className={styles.sigBrand}>ridha.dev</span>
          <span className={styles.divider} />
          <span>© {new Date().getFullYear()}</span>
          <span className={styles.divider} />
          <span>Designed & built with precision</span>
        </motion.footer>
      </div>
    </section>
  );
}
