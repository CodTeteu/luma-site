import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TemplateData } from '@/types/template';
import EditableText from '@/components/editor/EditableText';
import EditableImage from '@/components/editor/EditableImage';

// In a real app we would pass data prop here, but for now we might need to access it from context or props
// Assuming we update Template1.tsx to pass data to Couple
interface CoupleProps {
    data?: TemplateData;
}

const Couple = ({ data }: CoupleProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Fallback data if not provided (should be provided by Template1)
    const groomName = data?.groomName || "Pedro";
    const brideName = data?.brideName || "Ana";
    const coupleImage = data?.couple?.image || "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60";
    const description = data?.couple?.description || "Nossa história começou de forma inesperada...";
    const brideBio = data?.couple?.brideBio || "Ana ama café, livros e dias chuvosos.";
    const groomBio = data?.couple?.groomBio || "Pedro ama futebol, churrasco e dias de sol.";

    return (
        <section id="couple" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-50 rounded-bl-full opacity-50" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-50 rounded-tr-full opacity-50" />

            <div className="max-w-6xl mx-auto px-4 relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-olive-500 uppercase tracking-[0.2em] text-xs font-semibold">Nossa História</span>
                    <h2 className="font-script text-5xl md:text-6xl text-stone-800 mt-4">O Casal</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-olive-100 rounded-tl-[5rem] rounded-br-[5rem] translate-x-4 translate-y-4" />
                        <div className="relative h-[500px] w-full rounded-tl-[5rem] rounded-br-[5rem] overflow-hidden shadow-2xl">
                            <EditableImage
                                src={coupleImage}
                                alt="Couple"
                                field="couple.image" // Assuming backend handles dot notation or we flatten in EditorPage
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center md:text-left space-y-8"
                    >
                        <div>
                            <EditableText
                                value={description}
                                field="couple.description"
                                tag="p"
                                className="font-serif text-lg md:text-xl text-stone-600 leading-relaxed italic"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-stone-100">
                            <div>
                                <h3 className="font-script text-3xl text-olive-600 mb-2">{brideName}</h3>
                                <EditableText
                                    value={brideBio}
                                    field="couple.brideBio"
                                    tag="p"
                                    className="text-stone-500 text-sm leading-relaxed"
                                />
                            </div>
                            <div>
                                <h3 className="font-script text-3xl text-olive-600 mb-2">{groomName}</h3>
                                <EditableText
                                    value={groomBio}
                                    field="couple.groomBio"
                                    tag="p"
                                    className="text-stone-500 text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Couple;
