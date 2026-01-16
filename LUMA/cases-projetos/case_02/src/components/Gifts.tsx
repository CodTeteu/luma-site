import { motion } from 'framer-motion';
import { Gift, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Gifts = () => {
    const [copied, setCopied] = useState(false);
    const pixKey = "ana.pedro@email.com";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <section id="gifts" className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-cream">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-30"></div>
            </div>

            <div className="section-padding relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-olive-500 tracking-[0.2em] text-sm uppercase font-medium">Carinho & Gratidão</span>
                        <h2 className="text-5xl md:text-6xl text-stone-800 font-script mt-4">Lista de Presentes</h2>
                        <p className="text-stone-500 font-light mt-4 max-w-lg mx-auto">
                            Sua presença é nosso maior presente. Se desejar nos presentear de outra forma, ficaremos imensamente gratos.
                        </p>
                    </motion.div>

                    {/* Two Cols: Link & PIX */}
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Gift List Link Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-sm shadow-xl border border-olive-100 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="w-16 h-16 bg-olive-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-olive-100 transition-colors">
                                <ExternalLink size={32} className="text-olive-600" />
                            </div>
                            <h3 className="text-2xl font-serif text-stone-800 mb-4">Lista de Presentes</h3>
                            <p className="text-stone-500 font-light mb-8">
                                Confira nossa lista de sugestões de presentes virtuais para nossa lua de mel e casa nova.
                            </p>
                            <Link
                                to="/presentes"
                                className="px-8 py-4 bg-olive-600 text-white uppercase tracking-widest text-xs font-medium rounded-sm hover:bg-olive-700 transition-colors shadow-lg hover:shadow-xl w-full md:w-auto"
                            >
                                Ver Lista Completa
                            </Link>
                        </motion.div>

                        {/* PIX Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-sm shadow-xl border border-olive-100 text-center relative overflow-hidden flex flex-col justify-center"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-olive-300 via-olive-500 to-olive-300"></div>

                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-olive-50 flex items-center justify-center">
                                <Gift size={32} className="text-olive-600" />
                            </div>

                            <h3 className="text-2xl font-script text-stone-800 mb-2">Chave PIX</h3>
                            <p className="text-stone-400 text-sm mb-6">Para transferências diretas</p>

                            <button
                                onClick={handleCopy}
                                className="w-full flex items-center justify-between bg-stone-50 p-4 rounded-sm border border-olive-100 hover:border-olive-300 hover:bg-olive-50/50 transition-all duration-300 group"
                            >
                                <code className="text-stone-600 font-mono text-sm md:text-base tracking-wider truncate px-2">{pixKey}</code>
                                <div className={`p-2 rounded-full transition-colors flex-shrink-0 ${copied ? 'bg-olive-100 text-olive-600' : 'text-stone-400 group-hover:text-olive-500'}`}>
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </div>
                            </button>

                            {copied && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-olive-600 text-sm mt-4 font-medium"
                                >
                                    ✓ Chave copiada!
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gifts;
