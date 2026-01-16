"use client";

import { siteConfig } from "@/config/site.config";
import { ArrowRight } from "lucide-react";

/**
 * Final Call-to-Action section before footer.
 */
export function FinalCTASection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background with luxury gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C19B58] via-[#B08D4B] to-[#8E7036] z-0">
                {/* Texture overlay */}
                <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/10 z-0" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-12 border border-white/20 shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
                    <h2 className="text-3xl md:text-5xl font-medium mb-4 font-[family-name:var(--font-heading)] text-white drop-shadow-md">
                        Prontos para começar?
                    </h2>

                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                        Garanta a data do seu casamento na nossa agenda de produção.
                        As vagas são <span className="font-semibold italic">limitadas por mês</span> para garantir a exclusividade.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href={siteConfig.links.login}
                            className="group relative bg-[#F7F5F0] text-[#8E7036] px-10 py-4 text-base font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-white transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all">
                                Iniciar Agora
                                <ArrowRight size={18} className="w-0 group-hover:w-5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                            </span>
                        </a>

                        <a
                            href={siteConfig.contact.whatsapp.getUrl()}
                            className="text-white font-medium hover:text-[#F7F5F0] transition-colors border-b border-white/30 hover:border-white pb-0.5 text-sm"
                        >
                            Falar com consultor
                        </a>
                    </div>

                    <p className="mt-6 text-white/60 text-xs uppercase tracking-widest">
                        Sem compromisso • Cancelamento Grátis
                    </p>
                </div>
            </div>
        </section>
    );
}
