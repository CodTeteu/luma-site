"use client";

import { motion } from "framer-motion";
import { ArrowRight, Monitor, Smartphone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";

const cases = [
    {
        name: "Ana & Pedro",
        style: "Organic Luxury",
        image: "linear-gradient(135deg, #F7F5F0 0%, #E5E0D6 100%)",
        desc: "Um casamento ao ar livre com tons terrosos e texturas naturais.",
        tags: ["Minimalista", "Campo"],
    },
    {
        name: "Juliana & Roberto",
        style: "Classic Gold",
        image: "linear-gradient(135deg, #1a1a1a 0%, #2A3B2E 100%)",
        desc: "A sofisticação do tradicional com toques de modernidade digital.",
        tags: ["Clássico", "Noite"],
    },
    {
        name: "Lucas & Bea",
        style: "Modern Boho",
        image: "linear-gradient(135deg, #C19B58 0%, #D4B56A 100%)",
        desc: "Autenticidade e liberdade em cada detalhe do layout.",
        tags: ["Boho", "Praia"],
    },
];

/**
 * Portfolio section showcasing previous projects.
 */
export function PortfolioSection() {
    return (
        <section id="portfolio" className="py-24 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Nossas Criações
                    </h2>
                    <p className="text-[#6B7A6C]">Veja o que estamos criando para outros casais</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#DCD3C5]"
                        >
                            <div
                                className="h-64 relative overflow-hidden bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                style={{ background: project.image }}
                            >
                                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                                    <span className="text-white font-[family-name:var(--font-heading)] text-2xl drop-shadow-md">
                                        {project.name}
                                    </span>
                                </div>

                                {/* Overlay Interactions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 transition-all">
                                    <span className="text-white font-[family-name:var(--font-heading)] text-2xl mb-2">
                                        Visualizar em:
                                    </span>
                                    <div className="flex gap-4">
                                        <button className="bg-white text-[#2A3B2E] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C19B58] hover:text-white transition-colors flex items-center gap-2">
                                            <Monitor size={16} />
                                            Computador
                                        </button>
                                        <button className="bg-white text-[#2A3B2E] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C19B58] hover:text-white transition-colors flex items-center gap-2">
                                            <Smartphone size={16} />
                                            Celular
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#F7F5F0] text-[#C19B58] rounded-sm font-bold"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">{project.style}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.desc}</p>
                                <Link
                                    href={siteConfig.links.briefing}
                                    className="inline-flex items-center text-[#C19B58] hover:text-[#b08d4b] text-sm font-medium"
                                >
                                    Quero um igual{" "}
                                    <ArrowRight
                                        size={14}
                                        className="ml-1 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
