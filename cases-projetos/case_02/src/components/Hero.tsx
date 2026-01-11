import { motion } from 'framer-motion';
import { ChevronDown, MousePointer2 } from 'lucide-react';
import Countdown from './Countdown';

const Hero = () => {
    const scrollToNext = () => {
        const coupleSection = document.getElementById('couple');
        coupleSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute inset-0 z-0 select-none"
            >
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    alt="Wedding Couple"
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-900/70" />
                <div className="absolute inset-0 bg-paper-texture opacity-10 mix-blend-overlay" />
            </motion.div>

            {/* Decorative floating elements */}
            <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/4 left-10 w-16 h-16 border border-white/10 rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/3 right-20 w-24 h-24 border border-olive-200/20 rounded-full"
                />
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-terracotta-200/20 rounded-full"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                {/* Main title - Editorial Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="relative mb-10"
                >
                    <h1 className="font-script text-[5rem] md:text-[8rem] lg:text-[11rem] leading-none text-cream drop-shadow-2xl mix-blend-overlay opacity-90">
                        Ana <span className="text-[3rem] md:text-[5rem] font-serif italic align-middle mx-4 text-olive-200">&</span> Pedro
                    </h1>
                </motion.div>

                {/* Date with decorative lines */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex items-center justify-center gap-4 md:gap-6 text-lg md:text-xl font-serif italic tracking-wider text-olive-50 mb-12"
                >
                    <span className="border-t border-olive-200/50 w-12 md:w-20"></span>
                    <p>25 de Outubro de 2025</p>
                    <span className="border-t border-olive-200/50 w-12 md:w-20"></span>
                </motion.div>

                {/* Countdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                >
                    <Countdown />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                onClick={scrollToNext}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors cursor-pointer group"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs tracking-[0.3em] uppercase font-light hidden md:block">Role para baixo</span>
                    <MousePointer2 size={20} className="opacity-50 hidden md:block" />
                    <ChevronDown size={24} />
                </motion.div>
            </motion.button>
        </section>
    );
};

export default Hero;
