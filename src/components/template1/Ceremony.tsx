import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { TemplateData } from '@/types/template';
import EditableText from '@/components/editor/EditableText';

interface CeremonyProps {
    data?: TemplateData;
}

const Ceremony = ({ data }: CeremonyProps) => {
    // If we're not passing props yet, these will be undefined, so fallback nicely or handle it
    const ceremonyDate = data?.ceremony?.date || "2025-10-25";
    const ceremonyTime = data?.ceremony?.time || "16:00";
    const ceremonyLocation = data?.ceremony?.locationName || "Capela dos Milagres";

    const receptionLocation = data?.reception?.locationName || "Salão de Festas Jardim";

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="ceremony" className="py-24 bg-stone-900 text-stone-200 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-paper-texture opacity-5 mix-blend-overlay" />

            <div className="max-w-4xl mx-auto px-4 relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-olive-300 uppercase tracking-[0.2em] text-xs font-semibold">O Grande Dia</span>
                    <h2 className="font-script text-5xl md:text-6xl text-cream mt-4">Cerimônia & Festa</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ceremony Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 rounded-2xl md:text-right flex flex-col items-center md:items-end hover:bg-white/[0.05] transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-olive-900/50 flex items-center justify-center text-olive-300 mb-6 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <h3 className="font-serif text-2xl text-cream mb-2">A Cerimônia</h3>

                        <div className="space-y-1 mb-6 text-center md:text-right">
                            <p className="text-lg text-olive-200">{ceremonyDate}</p>
                            <div className="flex items-center justify-center md:justify-end gap-2 text-stone-400">
                                <EditableText value={ceremonyTime} field="ceremony.time" tag="span" /> <span className="text-xs uppercase tracking-widest">Horas</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-center md:text-right">
                            <h4 className="font-bold text-white uppercase tracking-widest text-xs">Local</h4>
                            <EditableText value={ceremonyLocation} field="ceremony.locationName" tag="p" className="text-stone-300 font-serif italic" />
                            <p className="text-stone-500 text-sm text-center md:text-right">Rua das Flores, 123 - Cidade Jardim</p>
                        </div>

                        <a href="#" className="mt-8 text-xs uppercase tracking-widest text-olive-400 hover:text-white border-b border-olive-400/30 hover:border-white pb-1 transition-all">
                            Ver no Mapa
                        </a>
                    </motion.div>

                    {/* Reception Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 rounded-2xl md:text-left flex flex-col items-center md:items-start hover:bg-white/[0.05] transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-full bg-olive-900/50 flex items-center justify-center text-olive-300 mb-6 group-hover:scale-110 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-serif text-2xl text-cream mb-2">A Recepção</h3>
                        <div className="space-y-1 mb-6 text-center md:text-left">
                            <p className="text-lg text-olive-200">Logo após a cerimônia</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-stone-400">
                                <span className="text-xs uppercase tracking-widest">Vamos celebrar!</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-center md:text-left">
                            <h4 className="font-bold text-white uppercase tracking-widest text-xs">Local</h4>
                            <EditableText value={receptionLocation} field="reception.locationName" tag="p" className="text-stone-300 font-serif italic" />
                            <p className="text-stone-500 text-sm text-center md:text-left">Avenida Principal, 500 - Centro</p>
                        </div>

                        <a href="#" className="mt-8 text-xs uppercase tracking-widest text-olive-400 hover:text-white border-b border-olive-400/30 hover:border-white pb-1 transition-all">
                            Ver no Mapa
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Ceremony;
