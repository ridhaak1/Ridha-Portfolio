import type { Route } from "./+types/home";
import { pageMeta } from "@/lib/seo";
import { AboutSection, ContactSection, HeroSection, WorkSection } from "@/sections";
import { site } from "@/config/site";
import { SELECTED_WORK } from "@/data/projects";
import { useLenis } from "@/motion/lenis";
import InternshipNotice from "@/components/temporary/InternshipNotice";
import Cursor from "@/components/cursor/Cursor";
import TopHud from "@/components/hud/TopHud";
import { plateLinks } from "@/sections/heroAssets";
import { firstFrameLink } from "@/sections/workAssets";

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: "Ridha — Full-Stack Engineer",
    description:
      "Software engineer specializing in scalable systems, SaaS products, and high-performance web applications.",
    socialDescription: "Building scalable systems and digital products that perform.",
    path: "/",
    locale: "en_US",
  });

// The hero plate paints behind the LCP (the h1); the first Work frame follows at low priority
export const links: Route.LinksFunction = () => [...plateLinks, firstFrameLink(SELECTED_WORK[0].id)];

export default function Home() {
  useLenis();

  return (
    <>
      <TopHud />
      {/* The hero is sticky inside this wrapper; Work rises over it, then both scroll away */}
      <div>
        <HeroSection />
        <div style={{ position: "relative", zIndex: 1 }}>
          <WorkSection />
        </div>
      </div>
      <AboutSection />
      <ContactSection />
      {site.showInternshipNotice && <InternshipNotice />}
      <Cursor />
    </>
  );
}
