"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";

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
        <section id="portfolio" className="py-24 px-6 bg-[#F7F5F0] relative">
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
                                className="h-64 relative overflow-hidden"
                                style={{ background: project.image }}
                            >
                                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                                    <span className="text-white font-[family-name:var(--font-heading)] text-2xl drop-shadow-md">
                                        {project.name}
                                    </span>
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
                                <a
                                    href={siteConfig.links.briefing}
                                    className="inline-flex items-center text-[#C19B58] hover:text-[#b08d4b] text-sm font-medium"
                                >
                                    Quero um igual{" "}
                                    <ArrowRight
                                        size={14}
                                        className="ml-1 group-hover:translate-x-1 transition-transform"
                                    />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
