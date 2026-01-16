"use client";

import LeafShadowOverlay from "@/components/ui/LeafShadowOverlay";
import {
  Navigation,
  HeroSection,
  HowItWorksSection,
  VisualIdentitySection,
  GiftListSection,
  AboutSection,
  PortfolioSection,
  FAQSection,
  PartnersSection,
  FinalCTASection,
  Footer,
} from "@/components/landing";

/**
 * Landing Page
 * ============================================================================
 * Refactored from 649 lines to ~30 lines.
 * All section components are now modular and use centralized configuration.
 */
export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#F7F5F0] selection:bg-[#C19B58] selection:text-white">
      <LeafShadowOverlay />
      <Navigation />
      <HeroSection />
      <HowItWorksSection />
      <VisualIdentitySection />
      <GiftListSection />
      <AboutSection />
      <PortfolioSection />
      <FAQSection />
      <PartnersSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
