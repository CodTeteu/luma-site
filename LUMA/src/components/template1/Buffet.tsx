
import { motion } from 'framer-motion';

const Buffet = () => {
    return (
        <section id="buffet" className="bg-cream min-h-screen flex items-center py-24 border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Header Left Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="block text-olive-500 tracking-[0.3em] text-xs uppercase font-medium mb-4">Gastronomia</span>
                            <h2 className="text-5xl md:text-6xl font-script text-stone-800 mb-8 leading-tight">
                                Menu <br /> da Noite
                            </h2>
                            <p className="text-stone-500 font-light leading-relaxed mb-8 text-lg">
                                Uma experiência gastronômica para celebrar o amor, com vinhos da nossa reserva.
                            </p>
                            <div className="w-16 h-px bg-olive-300"></div>
                        </motion.div>
                    </div>

                    {/* Menu Items - Full Height Focus */}
                    <div className="lg:col-span-8 flex flex-col justify-center space-y-12 h-full">
                        {/* Section 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-sm shadow-sm border border-stone-100"
                        >
                            <h3 className="text-2xl font-serif italic text-stone-800 mb-6 border-b border-stone-100 pb-4 inline-block">Entradas</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-olive-700 mb-2">Bruschettas Confit</h4>
                                    <p className="text-stone-600 font-light text-base leading-relaxed">Tomates cereja assados, manjericão e redução de balsâmico.</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-olive-700 mb-2">Tartar de Salmão</h4>
                                    <p className="text-stone-600 font-light text-base leading-relaxed">Salmão picado com avocado e dill.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-sm shadow-sm border border-stone-100"
                        >
                            <h3 className="text-2xl font-serif italic text-stone-800 mb-6 border-b border-stone-100 pb-4 inline-block">Principais</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-olive-700 mb-2">Filé ao Barolo</h4>
                                    <p className="text-stone-600 font-light text-base leading-relaxed">Medalhões ao molho de vinho tinto com risoto de parmesão.</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-olive-700 mb-2">Peixe da Estação</h4>
                                    <p className="text-stone-600 font-light text-base leading-relaxed">Peixe branco em crosta de ervas e purê de mandioquinha.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-8 rounded-sm shadow-sm border border-stone-100"
                        >
                            <h3 className="text-2xl font-serif italic text-stone-800 mb-6 border-b border-stone-100 pb-4 inline-block">Doçuras</h3>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                <p className="text-stone-600 font-light text-base leading-relaxed col-span-2">
                                    Uma seleção de doces finos, trufas de chocolate e nosso bolo de casamento com frutas vermelhas.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Buffet;

