"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, Check, ChevronDown, Star } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Hero Section - Conversion-focused, mobile-first design
 */
export function HeroSection() {
    const ref = useRef(null);

    return (
        <section
            ref={ref}
            className="min-h-[100dvh] flex items-center px-5 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20 relative overflow-hidden bg-noise"
        >
            <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Left Column: Sales Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center md:text-left order-1"
                >
                    {/* Social Proof Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 md:mb-6 border border-[#C19B58]/30 rounded-full bg-white/80 backdrop-blur-md shadow-sm"
                    >
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C19B58] to-[#A88347] flex items-center justify-center text-white text-[8px] font-bold border-2 border-white"
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={10} className="text-[#C19B58] fill-[#C19B58]" />
                            ))}
                        </div>
                        <span className="text-[11px] font-semibold text-[#2A3B2E]">
                            +500 convites criados
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <h1 className="text-[32px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl font-medium md:leading-[1.1] mb-4 md:mb-6 text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Convites Digitais{" "}
                        <span className="italic text-[#C19B58]">Elegantes</span>{" "}
                        para seu Evento
                    </h1>

                    {/* Description */}
                    <p className="text-[17px] md:text-xl text-[#3E4A3F]/80 mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Crie um convite digital lindo, com confirmação de presença e lista de presentes.
                        <span className="font-semibold text-[#2A3B2E]"> Grátis para começar.</span>
                    </p>

                    {/* Value Props - Hidden on mobile, shown on md+ */}
                    <div className="hidden md:flex flex-wrap gap-4 mb-8">
                        {[
                            "Confirmação via WhatsApp",
                            "Lista de Presentes com PIX",
                            "Fotos em Alta Qualidade",
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-[#3E4A3F]">
                                <Check size={16} className="text-[#C19B58]" />
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* CTAs - Stack on mobile */}
                    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                        {/* Primary CTA - CRIAR GRÁTIS */}
                        <Link href="/templates" className="w-full md:w-auto">
                            <motion.div
                                className="flex items-center justify-center gap-2 bg-[#C19B58] text-white h-14 md:h-auto md:px-10 md:py-4 text-[16px] md:text-lg font-semibold rounded-2xl shadow-lg shadow-[#C19B58]/30 active:scale-[0.98] transition-all hover:bg-[#A88347] hover:shadow-xl"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Sparkles size={20} />
                                Criar meu convite grátis
                            </motion.div>
                        </Link>

                        {/* Secondary CTA */}
                        <Link
                            href={siteConfig.contact.whatsapp.getUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto"
                        >
                            <motion.div
                                className="flex items-center justify-center gap-2 text-[#2A3B2E] bg-white border border-[#E5E0D6] h-14 md:h-auto md:px-8 md:py-4 text-[16px] md:text-lg font-medium rounded-2xl active:bg-[#F7F5F0] transition-colors hover:border-[#C19B58]/30"
                                whileTap={{ scale: 0.98 }}
                            >
                                <MessageCircle size={18} />
                                Falar com Consultora
                            </motion.div>
                        </Link>
                    </div>

                    {/* Trust Badge */}
                    <p className="text-[13px] text-[#6B7A6C] mt-4 flex items-center justify-center md:justify-start gap-1.5">
                        <Check size={14} className="text-[#4CAF50]" />
                        Sem cartão de crédito • Pronto em minutos
                    </p>
                </motion.div>

                {/* Right Column: Phone Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[540px] flex items-center justify-center order-2"
                >
                    {/* Phone Frame Container */}
                    <div className="relative w-[200px] sm:w-[240px] md:w-[280px]">
                        {/* Phone Frame */}
                        <div className="relative bg-black rounded-[32px] md:rounded-[40px] p-2 md:p-2.5 shadow-2xl">
                            {/* Screen */}
                            <div className="relative aspect-[9/19] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#F7F5F0]">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 md:h-6 bg-black rounded-b-xl z-10" />

                                {/* Invite Preview */}
                                <Image
                                    src="/images/assets/hero-social-proof.png"
                                    alt="Exemplo de convite digital LUMA"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 md:-top-6 md:-right-8 bg-white shadow-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#E5E0D6]"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Check size={14} className="text-[#4CAF50]" />
                                <span className="font-semibold text-[#2A3B2E] text-[11px] md:text-xs">
                                    Nova Confirmação!
                                </span>
                            </div>
                            <p className="text-[9px] md:text-[10px] text-[#6B7A6C]">
                                Maria confirmou via WhatsApp
                            </p>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-2 -left-4 md:-bottom-4 md:-left-8 bg-gradient-to-br from-[#C19B58] to-[#A88347] shadow-lg p-3 md:p-4 rounded-xl md:rounded-2xl text-white"
                        >
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <Sparkles size={12} />
                                <span className="font-semibold text-[11px] md:text-xs">Lista de Presentes</span>
                            </div>
                            <p className="text-[9px] md:text-[10px] opacity-90">
                                PIX integrado
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2 text-[#A5B5A7]"
            >
                <span className="text-xs">Role para ver mais</span>
                <ChevronDown className="animate-bounce" size={20} />
            </motion.div>
        </section>
    );
}
