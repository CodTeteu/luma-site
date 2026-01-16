"use client";

import { siteConfig } from "@/config/site.config";

/**
 * Final Call-to-Action section before footer.
 */
export function FinalCTASection() {
    return (
        <section className="py-24 px-6 bg-[#C19B58] relative overflow-hidden text-center text-white">
            <div className="absolute inset-0 bg-[#2A3B2E] mix-blend-multiply opacity-20" />
            <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-medium mb-6 font-[family-name:var(--font-heading)]">
                    Prontos para começar?
                </h2>
                <p className="text-xl opacity-90 mb-10 max-w-xl mx-auto">
                    Garanta a data do seu casamento na nossa agenda de produção. Vagas limitadas por mês.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={siteConfig.links.login}
                        className="bg-white text-[#C19B58] px-10 py-4 text-lg font-bold rounded-lg shadow-xl hover:bg-[#F7F5F0] transition-colors"
                    >
                        Iniciar Agora
                    </a>
                </div>
            </div>
        </section>
    );
}
