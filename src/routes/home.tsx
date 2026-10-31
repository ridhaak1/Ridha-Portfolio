import type { Route } from "./+types/home";
import { pageMeta } from "@/lib/seo";
import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "@/sections";
import { site } from "@/config/site";
import { useLenis } from "@/motion/lenis";
import InternshipNotice from "@/components/temporary/InternshipNotice";
import Cursor from "@/components/cursor/Cursor";
import { plateLinks } from "@/sections/heroAssets";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Ridha — Full-Stack Engineer",
    description:
      "Software engineer specializing in scalable systems, SaaS products, and high-performance web applications.",
    socialDescription: "Building scalable systems and digital products that perform.",
    path: "/",
    locale: "en_US",
  });

// The plate is the LCP image: preload it for the matching layout
export const links: Route.LinksFunction = () => [...plateLinks];

export default function Home() {
  useLenis();

  return (
    <>
      {/* The hero is sticky inside this wrapper; About rises over it, then both scroll away */}
      <div>
        <HeroSection />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AboutSection />
        </div>
      </div>
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      {site.showInternshipNotice && <InternshipNotice />}
      <Cursor />
    </>
  );
}
