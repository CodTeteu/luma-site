"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Main navigation bar with scroll-aware styling.
 * Uses centralized config for WhatsApp and navigation links.
 */
export function Navigation() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#F7F5F0]/90 backdrop-blur-xl border-b border-[#C19B58]/20 py-4"
                    : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                    <span className="text-2xl font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        {siteConfig.name}
                    </span>
                </motion.div>

                <div className="hidden md:flex items-center gap-8">
                    {siteConfig.navigation.main.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm tracking-wide text-[#3E4A3F] hover:text-[#C19B58] transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C19B58] group-hover:w-full transition-all duration-300" />
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href={siteConfig.links.login}
                        className="text-sm font-medium tracking-wide text-[#3E4A3F] hover:text-[#C19B58] transition-colors px-4 py-2"
                    >
                        Área do Cliente
                    </Link>

                    <motion.a
                        href={siteConfig.contact.whatsapp.getUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-[#2A3B2E] text-[#F7F5F0] px-6 py-2.5 text-sm font-medium tracking-wide rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/20"
                    >
                        <MessageCircle size={16} />
                        {siteConfig.contact.whatsapp.displayText}
                    </motion.a>
                </div>
            </div>
        </motion.nav>
    );
}
