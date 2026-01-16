"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BriefingWizard } from "@/components/briefing";
import LeafShadowOverlay from "@/components/ui/LeafShadowOverlay";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function BriefingPage() {
    const [currentImage, setCurrentImage] = useState(0);

    // Background images carousel
    const images = [
        "/images/assets/couple-beach.png",
        "/images/assets/couple-garden.png"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5s
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <main className="min-h-screen w-full relative bg-[#F7F5F0] overflow-x-hidden selection:bg-[#C19B58] selection:text-white flex flex-col items-center">
            <LeafShadowOverlay />

            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 relative z-10 px-6 lg:px-12 items-start">

                {/* LEFT COLUMN: FORM */}
                <div className="order-2 lg:order-1 flex flex-col py-8 lg:py-16">
                    <div className="mb-8 text-center lg:text-left transition-all">
                        <p className="text-[#C19B58] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1 md:mb-2">Conciergerie Digital</p>
                        <h1 className="text-3xl md:text-4xl text-[#2A3B2E] font-[family-name:var(--font-heading)] leading-tight">
                            Personalize seu Dia
                        </h1>
                    </div>

                    <div className="w-full">
                        <BriefingWizard />
                    </div>

                    <div className="mt-8 text-center lg:text-left">
                        <p className="text-[10px] text-[#6B7A6C] uppercase tracking-widest opacity-60 flex items-center gap-2 justify-center lg:justify-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C19B58] animate-pulse" />
                            Atendimento via WhatsApp
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: IMAGE CARD (Sticky + Top Aligned) */}
                {/* sticky top-12 puts it 3rem from top, matching roughly the py-16 of the left col */}
                <div className="hidden lg:flex order-1 lg:order-2 sticky top-6 h-auto min-h-screen items-start py-16 justify-center">
                    <div className="relative w-full max-w-sm xl:max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImage}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentImage]}
                                    alt="Casal LUMA"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A3B2E]/60 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-8 left-8 right-8 text-center text-white">
                            <p className="font-[family-name:var(--font-heading)] text-2xl italic mb-1 drop-shadow-md">
                                "O luxo está nos detalhes."
                            </p>
                        </div>
                    </div>

                    {/* Decorative Blurs (Adjusted positions) */}
                    <div className="absolute -z-10 top-[10%] right-[0%] w-32 h-32 bg-[#C19B58]/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -z-10 bottom-[30%] left-[0%] w-40 h-40 bg-[#2A3B2E]/10 rounded-full blur-3xl" />
                </div>
            </div>
        </main>
    );
}
