import type { Route } from "./+types/home";
import { pageMeta } from "@/lib/seo";
import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "@/sections";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Ridha — Full-Stack Engineer",
    description:
      "Software engineer specializing in scalable systems, SaaS products, and high-performance web applications.",
    socialDescription: "Building scalable systems and digital products that perform.",
    path: "/",
    locale: "en_US",
  });

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
