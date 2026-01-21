"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Sparkles, CheckCircle, Tag } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Call-to-action section at the bottom of templates page.
 */
export function TemplatesCTASection() {
    const benefits = [
        "Site completo e personalizado",
        "Suporte dedicado via WhatsApp",
        "Entrega em até 48 horas",
        "Revisões ilimitadas incluídas",
        "Domínio próprio incluso",
        "Gestão de convidados e presentes",
    ];

    return (
        <section className="py-24 px-6 bg-[#2A3B2E] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/assets/noise-texture.png')] bg-repeat" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-[#C19B58]/30 rounded-full bg-[#C19B58]/10 backdrop-blur-sm">
                        <Sparkles size={14} className="text-[#C19B58]" />
                        <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#C19B58]">
                            Pronto para Começar?
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 font-[family-name:var(--font-heading)]">
                        Seu Site de Casamento{" "}
                        <span className="italic text-[#C19B58]">Completo</span>
                    </h2>

                    {/* Price Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex flex-col items-center gap-2 px-10 py-6 mb-10 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                    >
                        <div className="flex items-center gap-2">
                            <Tag size={20} className="text-[#C19B58]" />
                            <span className="text-sm text-white/60 uppercase tracking-wider">Valor Único</span>
                        </div>
                        <p className="text-5xl font-bold text-white font-[family-name:var(--font-heading)]">
                            R$ 197
                        </p>
                        <p className="text-sm text-white/70">Pagamento único • Tudo incluso</p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-left"
                            >
                                <CheckCircle size={18} className="text-[#C19B58] flex-shrink-0" />
                                <span className="text-sm text-white/80">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={siteConfig.contact.whatsapp.getUrl("Olá! Quero contratar o site de casamento por R$197!")}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.button
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center gap-3 bg-[#C19B58] text-white px-8 py-4 text-lg font-medium tracking-wide rounded-lg shadow-xl shadow-[#C19B58]/30 hover:bg-[#b08d4b] transition-all w-full sm:w-auto"
                            >
                                <MessageCircle size={20} />
                                Contratar por R$ 197
                            </motion.button>
                        </Link>
                        <Link href="/">
                            <motion.button
                                whileHover={{ y: -2 }}
                                className="inline-flex items-center justify-center gap-2 text-white bg-white/10 border border-white/20 px-8 py-4 text-lg font-medium rounded-lg hover:bg-white/20 transition-all w-full sm:w-auto"
                            >
                                Voltar ao Início
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
