import type { Route } from "./+types/home";
import { pageMeta } from "@/lib/seo";
import { AboutSection, ContactSection, Footer, HeroSection, WorkSection } from "@/sections";
import { site } from "@/config/site";
import { LINKS } from "@/data/contact";
import { SELECTED_WORK } from "@/data/projects";
import { useHashLanding } from "@/hooks/useHashLanding";
import { useLenis } from "@/motion/lenis";
import { SITE_URL } from "@/data/site";
import InternshipNotice from "@/components/temporary/InternshipNotice";
import Cursor from "@/components/cursor/Cursor";
import TopHud from "@/components/hud/TopHud";
import { plateLinks } from "@/sections/heroAssets";
import { firstFrameLink } from "@/sections/workAssets";

const DESCRIPTION =
  "Ridha Al-Khaykanee is a full-stack software developer in Antwerp, Belgium, building web and mobile products from the database to the last pixel.";

export const meta: Route.MetaFunction = () => [
  ...pageMeta({
    title: "Ridha Al-Khaykanee — Software Developer",
    description: DESCRIPTION,
    path: "/",
    locale: "en_US",
  }),
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      jobTitle: "Software Developer",
      url: SITE_URL,
      address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "BE" },
      sameAs: LINKS.map((link) => link.href),
    },
  },
];

// The hero plate paints behind the LCP (the h1); the first Work frame follows at low priority
export const links: Route.LinksFunction = () => [...plateLinks, firstFrameLink(SELECTED_WORK[0].id)];

export default function Home() {
  useLenis();
  useHashLanding();

  return (
    <>
      {/* Not in MainLayout, which would load GSAP on the blog too. <main> is the footer's curtain. */}
      <main data-page="home">
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
      </main>
      <Footer />
    </>
  );
}
