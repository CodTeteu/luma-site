"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { LuxuryDivider } from "./LuxuryDivider";

const features = [
    "Identidade Visual exclusiva",
    "Layout aprovado via WhatsApp",
    "Ajustes ilimitados durante a criação",
    "Site pronto em até 48 horas",
    "Tipografia premium e paleta sob medida",
];

/**
 * Visual Identity section highlighting design capabilities.
 */
export function VisualIdentitySection() {
    return (
        <section id="diferenciais" className="py-24 px-6 bg-[#F7F5F0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                    <Image
                        src="/images/assets/visual-identity.png"
                        alt="Moodboard de Identidade Visual Organic Luxury"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-medium text-[#2A3B2E] mb-6 font-[family-name:var(--font-heading)]">
                        Você sonha. <br />
                        <span className="italic text-[#C19B58]">Nós realizamos.</span>
                    </h2>
                    <LuxuryDivider className="mb-8 !justify-start" />

                    <p className="text-[#3E4A3F] text-lg leading-relaxed mb-8">
                        Tire suas ideias do Pinterest e transforme em realidade. Nossa equipe traduz
                        referências em uma identidade única, pronta para o digital — elegante, sofisticada
                        e pensada para encantar seus convidados.
                    </p>

                    <ul className="space-y-4">
                        {features.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-[#2A3B2E] font-medium">
                                <div className="w-6 h-6 rounded-full bg-[#C19B58]/20 flex items-center justify-center">
                                    <Check size={14} className="text-[#C19B58]" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}
