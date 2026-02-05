"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";

/**
 * Call-to-action section at the bottom of templates page.
 * Freemium model: start free, upgrade to Plus for R$97
 */
export function TemplatesCTASection() {
    return (
        <section className="py-20 md:py-24 px-5 md:px-6 bg-[#2A3B2E] relative overflow-hidden">
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
                            Modelo Freemium
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-6 font-[family-name:var(--font-heading)]">
                        Comece{" "}
                        <span className="italic text-[#C19B58]">Grátis</span>
                    </h2>

                    <p className="text-white/70 mb-10 max-w-xl mx-auto">
                        Publique seu convite sem custo. Faça upgrade apenas se precisar remover limites.
                    </p>

                    {/* Plans Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                        {/* Free Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-left"
                        >
                            <h3 className="text-xl font-medium text-white mb-2">Grátis</h3>
                            <p className="text-3xl font-bold text-[#C19B58] mb-4">R$ 0</p>
                            <ul className="space-y-2 text-white/70 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-[#C19B58]" />
                                    1-2 templates básicos
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-[#C19B58]" />
                                    RSVP até 50 confirmações
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-[#C19B58]" />
                                    Galeria até 10 fotos
                                </li>
                                <li className="flex items-center gap-2 text-white/50">
                                    • Watermark LUMA
                                </li>
                            </ul>
                        </motion.div>

                        {/* Plus Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#C19B58] rounded-2xl p-6 text-left relative"
                        >
                            <span className="absolute top-4 right-4 text-xs px-2 py-1 bg-white/20 rounded-full text-white">
                                Mais popular
                            </span>
                            <h3 className="text-xl font-medium text-white mb-2">Plus</h3>
                            <p className="text-3xl font-bold text-white mb-4">R$ 97</p>
                            <ul className="space-y-2 text-white/90 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-white" />
                                    Todos os templates
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-white" />
                                    RSVP ilimitado
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-white" />
                                    Galeria 30 fotos
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-white" />
                                    Sem watermark
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <motion.button
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center gap-2 bg-[#C19B58] text-white px-8 py-4 text-lg font-medium rounded-full shadow-xl shadow-[#C19B58]/30 hover:bg-[#b08d4b] transition-all w-full sm:w-auto"
                            >
                                Criar meu convite grátis
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <Link href="/precos">
                            <motion.button
                                whileHover={{ y: -2 }}
                                className="inline-flex items-center justify-center gap-2 text-white bg-white/10 border border-white/20 px-8 py-4 text-lg font-medium rounded-full hover:bg-white/20 transition-all w-full sm:w-auto"
                            >
                                Ver todos os planos
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
