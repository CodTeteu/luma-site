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
    LuxuryDivider,
} from "@/components/landing";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navigation />
            <HeroSection />
            <LuxuryDivider />
            <HowItWorksSection />
            <LuxuryDivider />
            <VisualIdentitySection />
            <LuxuryDivider />
            <GiftListSection />
            <LuxuryDivider />
            <AboutSection />
            <PortfolioSection />
            <LuxuryDivider />
            <FAQSection />
            <PartnersSection />
            <FinalCTASection />
            <Footer />
        </main>
    );
}
