import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { ServicesPreview } from "@/components/marketing/ServicesPreview";
import { FeaturedProjects } from "@/components/marketing/FeaturedProjects";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — IT Solutions`,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <FeaturedProjects />
      <ProcessSection />
      <ContactCTA />
    </>
  );
}
