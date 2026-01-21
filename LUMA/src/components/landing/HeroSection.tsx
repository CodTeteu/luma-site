"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, Check, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Hero section - Native app-like mobile experience.
 */
export function HeroSection() {
    const ref = useRef(null);

    return (
        <section
            ref={ref}
            className="min-h-[100dvh] flex items-center px-5 md:px-6 pt-20 md:pt-32 pb-8 md:pb-20 relative overflow-hidden bg-noise"
        >
            <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-6 md:gap-12 items-center relative z-10">
                {/* Left Column: Sales Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center md:text-left order-1"
                >
                    {/* Badge - Tighter on mobile */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 md:mb-6 border border-[#C19B58]/30 rounded-full bg-[#F7F5F0]/80 backdrop-blur-md">
                        <Sparkles size={10} className="text-[#C19B58]" />
                        <span className="text-[9px] md:text-xs font-bold tracking-[0.12em] uppercase text-[#2A3B2E]">
                            {siteConfig.tagline}
                        </span>
                    </div>

                    {/* Heading - Optimized for mobile reading */}
                    <h1 className="text-[28px] leading-[1.2] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium md:leading-[1.1] mb-3 md:mb-6 text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Seu Site de Casamento{" "}
                        <span className="italic text-[#C19B58]">Cuidado por Especialistas.</span>
                    </h1>

                    {/* Description - Shorter on mobile */}
                    <p className="text-[15px] md:text-lg text-[#3E4A3F]/80 mb-5 md:mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Preencha nosso briefing e nossa equipe cria tudo para você. Finalize no WhatsApp.
                    </p>

                    {/* CTAs - Full width, larger on mobile */}
                    <div className="flex flex-col gap-2.5 md:flex-row md:gap-4">
                        <Link href="/templates" className="w-full md:w-auto">
                            <motion.div
                                className="flex items-center justify-center gap-2 bg-[#C19B58] text-white h-14 md:h-auto md:px-8 md:py-4 text-[15px] md:text-lg font-semibold rounded-xl shadow-lg shadow-[#C19B58]/25 active:scale-[0.98] transition-transform"
                                whileTap={{ scale: 0.98 }}
                            >
                                <Sparkles size={18} />
                                Ver Templates
                            </motion.div>
                        </Link>
                        <Link
                            href={siteConfig.contact.whatsapp.getUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto"
                        >
                            <motion.div
                                className="flex items-center justify-center gap-2 text-[#2A3B2E] bg-white border border-[#DCD3C5] h-14 md:h-auto md:px-8 md:py-4 text-[15px] md:text-lg font-medium rounded-xl active:bg-[#F7F5F0] transition-colors"
                                whileTap={{ scale: 0.98 }}
                            >
                                <MessageCircle size={18} />
                                Falar com Consultora
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Column: Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="relative min-h-[280px] sm:min-h-[350px] md:min-h-[500px] flex items-center justify-center order-2"
                >
                    {/* Mockup Image */}
                    <div className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-md aspect-[9/16] md:aspect-square lg:aspect-[3/4]">
                        <Image
                            src="/images/assets/hero-social-proof.png"
                            alt="Convite Digital Interativo LUMA no iPhone"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Floating Badge - Hidden on small mobile */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="hidden sm:block absolute top-0 md:top-10 right-0 md:right-10 bg-white/95 backdrop-blur shadow-lg p-2.5 md:p-4 rounded-xl border border-[#C19B58]/10 max-w-[140px] md:max-w-[200px]"
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <Check size={12} className="text-[#C19B58]" />
                            <span className="font-bold text-[#2A3B2E] text-[9px] md:text-xs uppercase">RSVP WhatsApp</span>
                        </div>
                        <p className="text-[9px] md:text-xs text-[#6B7A6C]">Confirmam em 1 clique.</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#C19B58]"
            >
                <ChevronDown className="animate-bounce" />
            </motion.div>
        </section>
    );
}
