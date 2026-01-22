"use client";

import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site.config";

const stats = [
    { label: "Anos de Experiência", value: siteConfig.stats.yearsExperience },
    { label: "Casamentos Realizados", value: siteConfig.stats.weddingsCompleted },
    { label: "Média de Avaliação", value: siteConfig.stats.averageRating },
    { label: "Países Atendidos", value: siteConfig.stats.countriesServed },
];

/**
 * About section with company description and statistics.
 */
export function AboutSection() {
    return (
        <section id="sobre" className="py-24 px-6 bg-white relative">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#C19B58]/30 rounded-full bg-[#F7F5F0]">
                    <Heart size={12} className="text-[#C19B58]" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2A3B2E]">
                        Sobre a {siteConfig.name}
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl text-[#2A3B2E] mb-8 font-[family-name:var(--font-heading)] leading-tight">
                    Nascemos para devolver a <br />
                    <span className="italic text-[#C19B58]">elegância</span> ao digital.
                </h2>
                <p className="text-[#6B7A6C] text-lg leading-relaxed mb-12">
                    Acreditamos que o convite digital não deve ser apenas &quot;prático&quot;, mas
                    emocionante. Unimos a sofisticação do design impresso com a inteligência da
                    tecnologia. Somos um estúdio focado em casais que valorizam cada detalhe.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#DCD3C5] pt-12">
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <p className="text-3xl font-bold text-[#2A3B2E] font-heading">{stat.value}</p>
                            <p className="text-xs uppercase tracking-widest text-[#C19B58] mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
