"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Menu, X, Sparkles, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/**
 * Main navigation bar - Native mobile app experience.
 */
export function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[#F7F5F0]/95 backdrop-blur-xl border-b border-[#C19B58]/10 py-2 md:py-4"
                    : "bg-transparent py-3 md:py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-lg md:text-2xl font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                            {siteConfig.name}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {siteConfig.navigation.main.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm tracking-wide text-[#3E4A3F] hover:text-[#C19B58] transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C19B58] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href={siteConfig.links.login}
                            className="text-sm font-medium tracking-wide text-[#3E4A3F] hover:text-[#C19B58] transition-colors px-4 py-2"
                        >
                            Área do Cliente
                        </Link>
                        <Link
                            href={siteConfig.contact.whatsapp.getUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-[#2A3B2E] text-[#F7F5F0] px-6 py-2.5 text-sm font-medium tracking-wide rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/20"
                            >
                                <MessageCircle size={16} />
                                {siteConfig.contact.whatsapp.displayText}
                            </motion.div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#2A3B2E]/5 text-[#2A3B2E] transition-colors active:bg-[#2A3B2E]/10"
                        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu - Full Screen App-like */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Menu Panel - Slide from right like iOS */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#F7F5F0] flex flex-col shadow-2xl"
                        >
                            {/* Handle bar - iOS style */}
                            <div className="pt-3 pb-2 flex justify-center">
                                <div className="w-10 h-1 bg-[#DCD3C5] rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#DCD3C5]/50">
                                <span className="text-lg font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2A3B2E]/5 text-[#2A3B2E]"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Navigation Links - App style list */}
                            <nav className="flex-1 py-2 overflow-y-auto">
                                {siteConfig.navigation.main.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-between px-5 py-4 text-[15px] font-medium text-[#2A3B2E] active:bg-[#E5E0D6] transition-colors border-b border-[#DCD3C5]/30"
                                        >
                                            {item.label}
                                            <ChevronRight size={18} className="text-[#C19B58]" />
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="my-2 border-t border-[#DCD3C5]/50" />

                                <Link
                                    href={siteConfig.links.login}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-5 py-4 text-[15px] font-medium text-[#2A3B2E] active:bg-[#E5E0D6] transition-colors"
                                >
                                    Área do Cliente
                                    <ChevronRight size={18} className="text-[#C19B58]" />
                                </Link>
                            </nav>

                            {/* Bottom CTAs - Fixed */}
                            <div className="p-4 space-y-2.5 border-t border-[#DCD3C5]/50 bg-white/50 safe-area-inset-bottom">
                                <Link
                                    href="/templates"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full h-12 bg-[#C19B58] text-white rounded-xl font-semibold text-[15px] shadow-lg shadow-[#C19B58]/25 active:scale-[0.98] transition-transform"
                                >
                                    <Sparkles size={18} />
                                    Ver Templates
                                </Link>
                                <Link
                                    href={siteConfig.contact.whatsapp.getUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full h-12 bg-[#2A3B2E] text-white rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-transform"
                                >
                                    <MessageCircle size={18} />
                                    Falar no WhatsApp
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
