"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Sparkles, Star, Check, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Hero section with main CTA and social proof.
 */
export function HeroSection() {
    const ref = useRef(null);

    return (
        <section
            ref={ref}
            className="min-h-screen flex items-center px-6 pt-32 pb-20 relative overflow-hidden bg-noise"
        >
            <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Column: Sales Copy */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#C19B58]/30 rounded-full bg-[#F7F5F0]/80 backdrop-blur-md">
                        <Sparkles size={12} className="text-[#C19B58]" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2A3B2E]">
                            {siteConfig.tagline}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-6 text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Seu Site de Casamento <br />
                        <span className="italic text-[#C19B58]">Cuidado por Especialistas.</span>
                    </h1>

                    <p className="text-lg text-[#3E4A3F]/80 mb-8 leading-relaxed max-w-lg">
                        Não perca tempo configurando templates sozinha. Preencha nosso briefing e nossa
                        equipe cria tudo para você. Finalize os detalhes diretamente no WhatsApp.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.a
                            href={siteConfig.links.login}
                            className="inline-flex items-center justify-center gap-3 bg-[#C19B58] text-white px-8 py-4 text-lg font-medium tracking-wide rounded-lg shadow-xl shadow-[#C19B58]/30 hover:bg-[#b08d4b] transition-all"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Sparkles size={20} />
                            Iniciar meu Projeto
                        </motion.a>
                        <motion.a
                            href={siteConfig.contact.whatsapp.getUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 text-[#2A3B2E] bg-white/50 border border-[#2A3B2E]/10 px-8 py-4 text-lg font-medium rounded-lg hover:bg-white hover:border-[#C19B58] transition-all"
                            whileHover={{ y: -2 }}
                        >
                            <MessageCircle size={18} />
                            Falar com Consultora
                        </motion.a>
                    </div>


                </motion.div>

                {/* Right Column: Social Proof / Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-full min-h-[500px] flex items-center justify-center"
                >
                    {/* Mockup Image */}
                    <div className="relative w-full max-w-md aspect-[9/16] md:aspect-square lg:aspect-[3/4]">
                        <Image
                            src="/images/assets/hero-social-proof.png"
                            alt="Convite Digital Interativo LUMA no iPhone"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Floating Value Badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 bg-white/90 backdrop-blur shadow-lg p-4 rounded-xl border border-[#C19B58]/20 max-w-[200px]"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Check size={16} className="text-[#C19B58]" />
                            <span className="font-bold text-[#2A3B2E] text-xs uppercase">RSVP WhatsApp</span>
                        </div>
                        <p className="text-xs text-[#6B7A6C]">Seus convidados confirmam em 1 clique.</p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#C19B58]"
            >
                <ChevronDown className="animate-bounce" />
            </motion.div>
        </section>
    );
}
