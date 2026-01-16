"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/template1/LoadingScreen';
import Navbar from '@/components/template1/Navbar';
import Hero from '@/components/template1/Hero';
import Couple from '@/components/template1/Couple';
import Gallery from '@/components/template1/Gallery';
import Ceremony from '@/components/template1/Ceremony';
import Buffet from '@/components/template1/Buffet';
import Gifts from '@/components/template1/Gifts';
import FAQ from '@/components/template1/FAQ';
import RSVP from '@/components/template1/RSVP';
import SectionTransition from '@/components/template1/SectionTransition';
import { Instagram, Mail, Heart } from 'lucide-react';
import { TemplateData } from '@/types/template';
import Link from 'next/link';

interface Template1Props {
    data: TemplateData;
}

// Field to element ID mapping for highlight functionality
const fieldToElementMap: Record<string, string> = {
    groomName: "hero-names",
    brideName: "hero-names",
    date: "hero-date",
    "couple.description": "couple-story",
    "couple.brideBio": "couple-bride-bio",
    "couple.groomBio": "couple-groom-bio",
    "ceremony.locationName": "ceremony-location",
    "ceremony.time": "ceremony-time",
    "reception.locationName": "reception-location",
};

export default function Template1({ data }: Template1Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
            const [year, month, day] = dateString.split('-');
            const months = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            return `${day} de ${months[parseInt(month) - 1]} de ${year}`;
        } catch {
            return dateString;
        }
    };

    // Handle highlight messages from editor
    const handleHighlight = useCallback((field: string) => {
        const elementId = fieldToElementMap[field];
        if (!elementId) return;

        const element = document.getElementById(elementId);
        if (!element) return;

        // Scroll to element
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // Apply highlight effect
        setHighlightedElement(elementId);

        // Remove highlight after animation
        setTimeout(() => {
            setHighlightedElement(null);
        }, 2000);
    }, []);

    // Listen for messages from parent (editor)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (!event.data) return;

            if (event.data.type === "HIGHLIGHT") {
                handleHighlight(event.data.field);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [handleHighlight]);

    // Get highlight style for element
    const getHighlightStyle = (elementId: string): React.CSSProperties => {
        if (highlightedElement === elementId) {
            return {
                boxShadow: '0 0 0 4px rgba(193, 155, 88, 0.75)',
                borderRadius: '8px',
                transition: 'box-shadow 0.3s ease-in-out',
            };
        }
        return {};
    };

    return (
        <>
            {/* Optional Loading Screen handling */}
            <LoadingScreen onComplete={() => setIsLoading(false)} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-cream text-stone-800 font-sans selection:bg-olive-200 selection:text-olive-900"
            >
                <Navbar data={data} />

                <main>
                    {/* Hero - Always visible since it contains essential info */}
                    <div id="hero-section">
                        <Hero data={data} />
                    </div>

                    <SectionTransition variant="wave" fromColor="#1c1917" toColor="#FDFBF7" />

                    {/* Couple Section */}
                    {data.couple?.isVisible !== false && (
                        <div id="couple-section" style={getHighlightStyle("couple-story")}>
                            <Couple data={data} />
                        </div>
                    )}

                    {/* Gallery Section */}
                    {data.gallery?.isVisible !== false && (
                        <Gallery data={data} />
                    )}

                    {/* Ceremony & Reception */}
                    {data.ceremony?.isVisible !== false && (
                        <div id="ceremony-section" style={getHighlightStyle("ceremony-location")}>
                            <Ceremony data={data} />
                        </div>
                    )}

                    {/* Buffet - Always visible for now */}
                    <Buffet />

                    <SectionTransition variant="leaves" fromColor="#FDFBF7" toColor="#FDFBF7" />

                    {/* Gifts Section */}
                    {data.gifts?.isVisible !== false && (
                        <Gifts />
                    )}

                    <div className="h-px bg-stone-200 max-w-7xl mx-auto" />

                    <FAQ />

                    <div className="h-px bg-stone-200 max-w-7xl mx-auto" />

                    {/* RSVP Section */}
                    {data.rsvp?.isVisible !== false && (
                        <RSVP />
                    )}

                    <SectionTransition variant="diagonal" fromColor="#FDFBF7" toColor="#1c1917" />
                </main>

                <footer className="bg-stone-900 text-olive-100 py-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-olive-900/10 blur-3xl rounded-full"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                        <div className="text-center md:text-left">
                            <h2 className="font-script text-3xl md:text-4xl mb-2 text-cream">
                                {data.brideName} & {data.groomName}
                            </h2>
                            <p className="text-olive-400 font-serif text-sm">
                                {formatDate(data.date)}
                            </p>
                        </div>

                        <div className="hidden md:block">
                            <p className="text-stone-500 font-light text-xs italic tracking-wider">
                                &quot;O amor é a poesia dos sentidos.&quot;
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Link
                                href="#"
                                className="text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
                            >
                                Salvar na Agenda
                            </Link>

                            <div className="flex gap-4">
                                <Link
                                    href="#"
                                    className="text-stone-500 hover:text-olive-300 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </Link>
                                <Link
                                    href="#"
                                    className="text-stone-500 hover:text-olive-300 transition-colors"
                                    aria-label="Email"
                                >
                                    <Mail size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-stone-800/50 text-[10px] text-stone-700 uppercase tracking-widest flex justify-center gap-4">
                        <p>© 2025 {data.brideName} & {data.groomName}</p>
                        <Heart size={10} className="text-stone-800" />
                        <p>Feito com amor</p>
                    </div>
                </footer>
            </motion.div>
        </>
    );
}
