"use client";

import Link from "next/link";
import { MessageCircle, Check, Star, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";

const benefits = [
    {
        title: "Painel de gestão exclusivo",
        desc: "Acompanhe seus indicados em tempo real",
    },
    {
        title: "Comissão por indicação",
        desc: "Ganhe recompensas por cada contrato fechado",
    },
    {
        title: "Atendimento prioritário",
        desc: "Canal direto com nossa equipe no WhatsApp",
    },
    {
        title: "White Label",
        desc: "Sua marca em destaque no rodapé dos sites",
    },
];

/**
 * Partners section for wedding planners and professionals.
 */
export function PartnersSection() {
    return (
        <section
            id="parceiros"
            className="py-20 px-6 bg-[#1A251D] text-[#F7F5F0] relative overflow-hidden"
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#C19B58] blur-[100px] opacity-20 mix-blend-screen" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-[#C19B58] blur-[80px] opacity-10 mix-blend-screen" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Column: Content */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C19B58]/30 bg-[#C19B58]/10 rounded-full text-[#C19B58] text-[10px] font-medium uppercase tracking-[0.2em] mb-6">
                        <Star size={10} fill="currentColor" />
                        <span>Para Cerimonialistas</span>
                    </div>

                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 font-[family-name:var(--font-heading)] leading-tight text-[#EAD1A2]"
                        style={{ color: '#EAD1A2' }}
                    >
                        Seja um Parceiro {siteConfig.name}
                    </h2>

                    <p className="text-white/90 text-base leading-relaxed mb-8 max-w-lg">
                        Facilite a gestão dos seus eventos com nossa plataforma. Ofereça
                        tecnologia de ponta para seus noivos com condições exclusivas e
                        benefícios reais para o seu negócio.
                    </p>

                    <div className="space-y-4 mb-8">
                        {benefits.map((item, i) => (
                            <div key={i} className="flex gap-3 group">
                                <div className="mt-1 w-5 h-5 rounded-full bg-[#C19B58] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Check size={12} className="text-[#1A251D]" strokeWidth={3} />
                                </div>
                                <div>
                                    <h3
                                        className="text-base font-medium text-white group-hover:text-[#C19B58] transition-colors"
                                        style={{ color: '#FFFFFF' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-white/95 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href={siteConfig.contact.whatsapp.getUrl()}
                        className="group bg-[#C19B58] text-white pl-6 pr-5 py-3 rounded-full font-medium inline-flex items-center gap-3 hover:bg-[#D4AF6A] transition-all duration-300 shadow-[0_4px_20px_rgba(193,155,88,0.3)] hover:shadow-[0_8px_30px_rgba(193,155,88,0.5)] translate-y-0 hover:-translate-y-1 text-sm"
                    >
                        <span className="tracking-wide">Falar com Consultor</span>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <MessageCircle size={14} />
                        </div>
                    </Link>
                </div>

                {/* Right Column: Glass Card */}
                <div className="relative">
                    {/* Abstract geometric decoration behind card */}
                    <div className="absolute inset-0 border border-[#C19B58]/20 rounded-3xl translate-x-3 translate-y-3 -z-10" />

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Star size={100} className="text-[#C19B58]" fill="currentColor" />
                        </div>

                        <div className="grid gap-8 relative z-10">
                            <div>
                                <div className="flex items-baseline gap-2 text-[#C19B58]">
                                    <span className="text-6xl font-[family-name:var(--font-heading)]">Zero</span>
                                </div>
                                <p className="text-xs font-medium tracking-widest text-[#EAD1A2] uppercase mt-2 border-l-2 border-[#C19B58] pl-3">
                                    Custo para ingressar
                                </p>
                                <p className="mt-3 text-white/95 text-xs leading-relaxed">
                                    Não há taxas de adesão ou mensalidades para parceiros. Você só ganha.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-baseline gap-2 text-[#C19B58]">
                                    <span className="text-6xl font-[family-name:var(--font-heading)]">24h</span>
                                </div>
                                <p className="text-xs font-medium tracking-widest text-[#EAD1A2] uppercase mt-2 border-l-2 border-[#C19B58] pl-3">
                                    Suporte via WhatsApp
                                </p>
                                <p className="mt-3 text-white/95 text-xs leading-relaxed">
                                    Equipe dedicada para atender você e seus clientes a qualquer momento.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <Star key={n} size={14} className="text-[#C19B58]" fill="currentColor" />
                                    ))}
                                </div>
                                <p className="italic text-base text-white font-[family-name:var(--font-heading)] leading-snug">
                                    &quot;A equipe da {siteConfig.name} resolve tudo no WhatsApp, meus noivos adoram a agilidade e o design.&quot;
                                </p>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="w-8 h-8 rounded-full bg-[#C19B58]/20 flex items-center justify-center text-[#C19B58] font-bold text-base">C</div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Carla M.</p>
                                        <p className="text-[10px] text-white/70 uppercase tracking-wider">Assessora de Casamentos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
