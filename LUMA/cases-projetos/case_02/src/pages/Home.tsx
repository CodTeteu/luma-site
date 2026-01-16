import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, Heart } from 'lucide-react';

import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Couple from '../components/Couple';
import Gallery from '../components/Gallery';
import Ceremony from '../components/Ceremony';
import Buffet from '../components/Buffet';
import Gifts from '../components/Gifts';
import FAQ from '../components/FAQ';
import RSVP from '../components/RSVP';
import SectionTransition from '../components/SectionTransition';

function Home() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <LoadingScreen onComplete={() => setIsLoading(false)} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-cream text-stone-800 font-sans selection:bg-olive-200 selection:text-olive-900"
            >
                <Navbar />

                <main>
                    <Hero />

                    {/* Transition: Hero to Couple */}
                    <SectionTransition variant="wave" fromColor="#1c1917" toColor="#FDFBF7" />

                    <Couple />

                    <Gallery />

                    {/* Editorial Continuous Flow Start */}
                    <Ceremony />
                    <Buffet />
                    {/* Editorial Continuous Flow End */}

                    {/* Break before interactive sections */}
                    <SectionTransition variant="leaves" fromColor="#FDFBF7" toColor="#FDFBF7" />

                    <Gifts />

                    <div className="h-px bg-stone-200 max-w-7xl mx-auto" />

                    <FAQ />

                    <div className="h-px bg-stone-200 max-w-7xl mx-auto" />

                    <RSVP />

                    {/* Transition: RSVP to Footer (dark) */}
                    <SectionTransition variant="diagonal" fromColor="#FDFBF7" toColor="#1c1917" />
                </main>

                <footer className="bg-stone-900 text-olive-100 py-12 text-center relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-olive-900/10 blur-3xl rounded-full"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                        {/* Left: Names & Date */}
                        <div className="text-center md:text-left">
                            <h2 className="font-script text-3xl md:text-4xl mb-2 text-cream">
                                Ana & Pedro
                            </h2>
                            <p className="text-olive-400 font-serif text-sm">
                                25 de Outubro de 2025
                            </p>
                        </div>

                        {/* Center: Quote (Hidden on mobile for compactness) */}
                        <div className="hidden md:block">
                            <p className="text-stone-500 font-light text-xs italic tracking-wider">
                                "O amor é a poesia dos sentidos."
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <a
                                href="#"
                                className="text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
                            >
                                Salvar na Agenda
                            </a>

                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="text-stone-500 hover:text-olive-300 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="#"
                                    className="text-stone-500 hover:text-olive-300 transition-colors"
                                    aria-label="Email"
                                >
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tiny bottom bar */}
                    <div className="mt-12 pt-6 border-t border-stone-800/50 text-[10px] text-stone-700 uppercase tracking-widest flex justify-center gap-4">
                        <p>© 2025 Ana & Pedro</p>
                        <Heart size={10} className="text-stone-800" />
                        <p>Feito com amor</p>
                    </div>
                </footer>
            </motion.div>
        </>
    );
}

export default Home;
