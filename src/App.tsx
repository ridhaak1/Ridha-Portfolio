import { ConfigProvider, App as AntApp } from "antd";
import { antdTheme } from "@/styles/antdTheme";
import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/sections/Hero";
import AboutSection from "@/sections/About";
import { ContactSection, ProjectsSection, SkillsSection } from "./sections";
import "@/styles/tokens.css";
import "@/styles/global.css";

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <MainLayout>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />
        </MainLayout>
      </AntApp>
    </ConfigProvider>
  );
}
