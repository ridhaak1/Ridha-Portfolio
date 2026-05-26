import type { Project } from "../../data/projects";
import ConsoleMini from "./ConsoleMini";
import styles from "../../sections/Projects.module.css";

interface CardVisualProps {
  project: Project;
}

export default function CardVisual({ project }: CardVisualProps) {
  if (project.visual === "image" && project.image)
    return <img src={project.image} alt={project.title} className={styles.cardImg} />;
  return <ConsoleMini />;
}
