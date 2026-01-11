import { BriefingWizard } from "@/components/briefing";
import LeafShadowOverlay from "@/components/ui/LeafShadowOverlay";

export default function BriefingPage() {
    return (
        <main className="min-h-screen bg-noise relative">
            <LeafShadowOverlay />

            {/* Header */}
            <header className="py-12 px-4 text-center sticky top-0 z-10">
                <div className="absolute inset-0 bg-cream/90 backdrop-blur-md border-b border-[#DCD3C5]/50 -z-10" />
                <div className="max-w-2xl mx-auto relative">
                    <h1
                        className="text-4xl md:text-5xl text-forest mb-4 font-heading"
                    >
                        Briefing do Casamento
                    </h1>
                    <p className="text-[#6B7A6C] font-light text-lg">
                        Preencha os dados do seu grande dia para criarmos o site perfeito para vocês
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 relative z-10">
                <BriefingWizard />
            </div>

            {/* Footer */}
            <footer className="py-8 px-4 text-center border-t border-[#DCD3C5]/30 relative z-10">
                <p className="text-sm text-[#8C9A8D] uppercase tracking-widest font-sans text-xs">
                    LUMA • Sites Exclusivos para Casamentos
                </p>
            </footer>
        </main>
    );
}
