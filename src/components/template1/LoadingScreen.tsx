import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onComplete?: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            onComplete?.();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center"
                >
                    {/* Decorative circles */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-olive-100/30 blur-3xl animate-pulse-soft"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-terracotta-100/30 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center"
                    >
                        {/* Initials */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="relative"
                        >
                            <h1 className="font-script text-7xl md:text-9xl text-olive-600">
                                A<span className="text-terracotta-400 mx-2">&</span>P
                            </h1>

                            {/* Decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="h-px w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-olive-300 to-transparent"
                            />
                        </motion.div>

                        {/* Loading text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className="mt-8 text-stone-400 text-sm tracking-[0.3em] uppercase font-light"
                        >
                            Carregando...
                        </motion.p>

                        {/* Loading dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-2 h-2 rounded-full bg-olive-400"
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
