"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Palette } from "lucide-react";

/**
 * Hero section for templates gallery - Native app-like compact design.
 */
export function TemplatesHeroSection() {
    return (
        <section className="relative pt-20 md:pt-32 pb-6 md:pb-16 px-5 md:px-6 overflow-hidden bg-noise">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 md:top-20 left-5 md:left-10 w-40 md:w-64 h-40 md:h-64 bg-[#C19B58]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-5 md:right-10 w-60 md:w-96 h-60 md:h-96 bg-[#2A3B2E]/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Breadcrumb - Hidden on mobile */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden md:flex items-center justify-center gap-2 text-sm text-[#6B7A6C] mb-8"
                >
                    <Link href="/" className="hover:text-[#C19B58] transition-colors">
                        Home
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-[#2A3B2E] font-medium">Templates</span>
                </motion.nav>

                {/* Badge - Compact on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 md:mb-6 border border-[#C19B58]/30 rounded-full bg-white/80 backdrop-blur-md shadow-sm"
                >
                    <Palette size={12} className="text-[#C19B58]" />
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.12em] uppercase text-[#2A3B2E]">
                        10 Templates
                    </span>
                </motion.div>

                {/* Heading - Optimized for mobile */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[26px] leading-[1.2] md:text-5xl lg:text-6xl font-medium md:leading-tight mb-3 md:mb-6 text-[#2A3B2E] font-[family-name:var(--font-heading)]"
                >
                    Escolha o Template{" "}
                    <span className="italic text-[#C19B58]">Perfeito</span>
                </motion.h1>

                {/* Subtitle - Shorter on mobile */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-[14px] md:text-xl text-[#6B7A6C] max-w-2xl mx-auto mb-5 md:mb-10 leading-relaxed"
                >
                    Escolha seu favorito e nossa equipe personaliza tudo para você.
                </motion.p>

                {/* Stats - Compact on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center gap-8 md:gap-16"
                >
                    {[
                        { value: "10", label: "Templates" },
                        { value: "R$197", label: "Tudo Incluso" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-xl md:text-4xl font-medium text-[#C19B58] font-[family-name:var(--font-heading)]">
                                {stat.value}
                            </div>
                            <div className="text-[9px] md:text-xs uppercase tracking-wider text-[#6B7A6C] mt-0.5">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
