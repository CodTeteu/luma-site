import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TemplateData } from '@/types/template';

interface NavbarProps {
    data: TemplateData;
}

const Navbar = ({ data }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'INÍCIO', href: '#home' },
        { name: 'O CASAL', href: '#couple' },
        { name: 'GALERIA', href: '#gallery' },
        { name: 'CERIMÔNIA', href: '#ceremony' },
        { name: 'BUFFET', href: '#buffet' },
        { name: 'FAQ', href: '#faq' },
        { name: 'RSVP', href: '#rsvp' },
    ];



    return (
        <nav className="fixed w-full z-50 flex justify-center pt-6 pointer-events-none">
            {/* Pill Container */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={`pointer-events-auto transition-all duration-500 ease-in-out ${scrolled
                    ? 'w-auto px-8 py-3 bg-white/70 backdrop-blur-xl rounded-full border border-white/20 shadow-lg'
                    : 'w-full max-w-7xl px-6 bg-transparent border-none'
                    }`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        layout
                        className="flex items-center"
                    >
                        <div className="relative h-8 w-auto aspect-[3/1]">
                            <Image
                                src="/luma-logo.png"
                                alt="LUMA Logo"
                                width={120}
                                height={40}
                                className="object-contain h-full w-auto"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Desktop Menu */}
                    <motion.div
                        layout
                        className={`hidden md:flex items-center gap-8 ${scrolled ? 'ml-12' : ''}`}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300 hover:text-olive-300 relative group ${scrolled ? 'text-stone-600' : 'text-stone-200'
                                    }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-olive-300 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                            </Link>
                        ))}
                    </motion.div>

                    {/* Mobile Menu Button - shows only on mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-full transition-colors ${scrolled ? 'text-stone-800 hover:bg-stone-100' : 'text-white hover:bg-white/10'}`}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 pointer-events-auto md:hidden border border-white/40"
                    >
                        <div className="flex flex-col items-center space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs uppercase tracking-[0.2em] font-medium text-stone-600 hover:text-olive-600"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
