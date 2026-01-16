
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const faqItems = [
    {
        question: 'Posso levar crianças?',
        answer: 'Sim! Crianças são muito bem-vindas. Teremos um espaço kids com recreação.',
    },
    {
        question: 'Onde posso estacionar?',
        answer: 'A vinícola possui estacionamento próprio gratuito com serviço de manobrista.',
    },
    {
        question: 'Posso tirar fotos na cerimônia?',
        answer: 'Pedimos que aproveitem o momento desconectados. Teremos fotógrafos profissionais!',
    },
    {
        question: 'Haverá transporte?',
        answer: 'Sim, vans sairão do centro e dos hotéis oficiais.',
    },
    {
        question: 'Qual o horário de chegada?',
        answer: 'Sugerimos chegar às 16:00h para o welcome drink.',
    },
    {
        question: 'Posso pedir músicas?',
        answer: 'Claro! Informe suas preferidas no formulário de RSVP.',
    },
    {
        question: 'Restrições alimentares?',
        answer: 'Nos informe no RSVP. Teremos opções para todos.',
    },
    {
        question: 'Haverá open bar?',
        answer: 'Sim! Bar completo de drinks, vinhos e cervejas.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="bg-olive-50 min-h-screen flex items-center py-24 relative border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Header - Sticky Left Compact */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="text-left">
                            <div className="flex items-center gap-4 mb-6">
                                <MessageCircleQuestion size={32} className="text-olive-400" strokeWidth={1} />
                            </div>
                            <span className="block text-olive-500 tracking-[0.3em] text-xs uppercase font-medium mb-4">Dúvidas?</span>
                            <h2 className="text-5xl md:text-6xl text-stone-800 font-script mb-8 leading-tight">Perguntas <br /> Frequentes</h2>
                            <p className="text-stone-500 font-light leading-relaxed mb-8 text-lg">
                                Reunimos aqui as respostas para as principais questões sobre o nosso grande dia.
                            </p>
                            <div className="w-16 h-px bg-olive-300 mb-8"></div>

                            <p className="text-stone-400 font-light text-sm italic">
                                Ainda tem dúvidas? <br /> Nos chame no WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* Questions List Compact Grid */}
                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                        {faqItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white rounded-sm shadow-sm overflow-hidden border border-olive-100 hover:shadow-md transition-shadow h-fit"
                            >
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-olive-50/30 transition-colors"
                                >
                                    <span className="font-serif text-lg text-stone-800 pr-2">{item.question}</span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0 text-olive-500"
                                    >
                                        <ChevronDown size={18} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-stone-600 font-light text-base leading-relaxed border-t border-olive-50 pt-4 bg-olive-50/10">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
