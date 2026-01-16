"use client";

import Link from "next/link";
import { MessageCircle, Check } from "lucide-react";
import { siteConfig } from "@/config/site.config";

const benefits = [
    "Painel de gestão exclusivo",
    "Comissão por indicação",
    "Atendimento prioritário no WhatsApp",
    "White Label (Sua marca no rodapé)",
];

/**
 * Partners section for wedding planners and professionals.
 */
export function PartnersSection() {
    return (
        <section id="parceiros" className="py-24 px-6 bg-[#2A3B2E] text-[#F7F5F0] relative overflow-hidden">
            {/* Subtle dot pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(#C19B58 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                    <div className="inline-block px-4 py-1 border border-[#C19B58] rounded-full text-[#C19B58] text-xs uppercase tracking-widest mb-6">
                        Para Cerimonialistas
                    </div>
                    <h2 className="text-4xl md:text-5xl font-medium mb-6 font-[family-name:var(--font-heading)]">
                        Seja um <span className="italic text-[#C19B58]">Parceiro {siteConfig.name}</span>
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                        Facilite a gestão dos seus eventos com nossa plataforma. Ofereça tecnologia de
                        ponta para seus noivos com condições especiais.
                    </p>

                    <ul className="space-y-4 mb-10">
                        {benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <Check size={18} className="text-[#C19B58]" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={siteConfig.contact.whatsapp.getUrl()}
                        className="bg-[#C19B58] text-white px-8 py-4 rounded-lg font-medium inline-flex gap-2 hover:bg-[#b08d4b] transition-colors"
                    >
                        <MessageCircle size={20} />
                        Falar com Consultor
                    </Link>
                </div>

                <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="p-4">
                            <p className="text-4xl text-[#C19B58] font-[family-name:var(--font-heading)]">
                                Zero
                            </p>
                            <p className="text-sm opacity-60 uppercase mt-2">Custo para Parceiros</p>
                        </div>
                        <div className="p-4">
                            <p className="text-4xl text-[#C19B58] font-[family-name:var(--font-heading)]">
                                24h
                            </p>
                            <p className="text-sm opacity-60 uppercase mt-2">Suporte via WhatsApp</p>
                        </div>
                        <div className="col-span-2 pt-4 border-t border-white/10">
                            <p className="italic opacity-80">
                                &quot;A equipe da {siteConfig.name} resolve tudo no WhatsApp, meus noivos
                                adoram.&quot;
                            </p>
                            <p className="text-xs text-[#C19B58] mt-2">— Carla M., Assessora</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
