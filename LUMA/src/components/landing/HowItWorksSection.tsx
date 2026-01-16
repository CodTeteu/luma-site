"use client";

import { motion } from "framer-motion";
import { Clock, Palette, ShieldCheck } from "lucide-react";

const steps = [
    {
        icon: Clock,
        title: "1. Briefing Rápido",
        desc: "Você preenche nosso briefing inteligente em menos de 5 minutos, contando os detalhes do seu evento.",
    },
    {
        icon: Palette,
        title: "2. Criação Personalizada",
        desc: "Nossa equipe de designers cria a identidade visual e o site completo, respeitando suas cores e estilo.",
    },
    {
        icon: ShieldCheck,
        title: "3. Aprovação & Entrega",
        desc: "Você recebe o link para aprovação no WhatsApp. Ajustamos o que for necessário até ficar perfeito.",
    },
];

/**
 * "How it works" section explaining the 3-step process.
 */
export function HowItWorksSection() {
    return (
        <section id="como-funciona" className="py-24 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Como funciona nossa Conciergerie?
                    </h2>
                    <p className="text-[#6B7A6C]">
                        Um processo simples e transparente para você focar no que importa.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-[#F7F5F0] p-8 rounded-2xl border border-[#DCD3C5] relative group hover:shadow-lg transition-all"
                        >
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-[#2A3B2E] rounded-full flex items-center justify-center text-[#F7F5F0] font-heading font-bold text-xl border-4 border-white">
                                {i + 1}
                            </div>
                            <div className="mt-6 mb-4">
                                <step.icon size={32} className="text-[#C19B58] mb-4" />
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">{step.title}</h3>
                                <p className="text-[#6B7A6C] text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
