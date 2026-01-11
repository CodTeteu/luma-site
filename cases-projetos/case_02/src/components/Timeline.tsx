import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const timelineEvents = [
    {
        date: 'Março 2018',
        title: 'Primeiro Encontro',
        description: 'Nossos olhares se cruzaram em um café na praça central. Um café se transformou em horas de conversa.',
        side: 'left' as const,
    },
    {
        date: 'Junho 2018',
        title: 'Primeiro Beijo',
        description: 'Sob as estrelas de uma noite de inverno, selamos nosso amor com um beijo.',
        side: 'right' as const,
    },
    {
        date: 'Dezembro 2019',
        title: 'Viagem a Paris',
        description: 'Realizamos nosso sonho de conhecer a cidade do amor juntos.',
        side: 'left' as const,
    },
    {
        date: 'Março 2021',
        title: 'Morando Juntos',
        description: 'Decidimos que a vida era melhor lado a lado e dividimos nosso primeiro lar.',
        side: 'right' as const,
    },
    {
        date: 'Setembro 2024',
        title: 'O Pedido',
        description: 'Em um pôr do sol mágico na vinícola, ele ajoelhou-se e fez a pergunta mais importante.',
        side: 'left' as const,
    },
    {
        date: 'Outubro 2025',
        title: 'O Grande Dia',
        description: 'E aqui estamos, prontos para celebrar nosso amor com vocês!',
        side: 'right' as const,
        highlight: true,
    },
];

const Timeline = () => {
    return (
        <section id="timeline" className="section-padding bg-olive-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-32 h-32 border border-olive-200 rounded-full opacity-50"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 border border-olive-200 rounded-full opacity-50"></div>

            <div className="text-center mb-20">
                <span className="text-olive-500 tracking-[0.2em] text-sm uppercase font-medium">Uma Jornada</span>
                <h2 className="text-5xl md:text-6xl text-stone-800 font-script mt-4">Nossa História</h2>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-olive-200 via-olive-400 to-olive-200 -translate-x-1/2 hidden md:block"></div>

                {/* Mobile line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-olive-200 via-olive-400 to-olive-200 md:hidden"></div>

                {timelineEvents.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: event.side === 'left' ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative flex items-center mb-12 md:mb-16 ${event.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                    >
                        {/* Content card */}
                        <div className={`ml-12 md:ml-0 md:w-5/12 ${event.side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                            <div className={`bg-white p-6 md:p-8 rounded-sm shadow-lg border-l-4 ${event.highlight ? 'border-terracotta-400' : 'border-olive-300'
                                } hover:shadow-xl transition-shadow duration-300`}>
                                <span className={`text-sm font-medium tracking-wider uppercase ${event.highlight ? 'text-terracotta-500' : 'text-olive-500'
                                    }`}>
                                    {event.date}
                                </span>
                                <h3 className="text-xl md:text-2xl font-serif text-stone-800 mt-2 mb-3">{event.title}</h3>
                                <p className="text-stone-600 font-light leading-relaxed">{event.description}</p>
                            </div>
                        </div>

                        {/* Center dot - Desktop */}
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-olive-400 z-10"></div>

                        {/* Center dot - Mobile */}
                        <div className={`absolute left-4 -translate-x-1/2 w-4 h-4 rounded-full z-10 md:hidden ${event.highlight ? 'bg-terracotta-400 border-4 border-terracotta-200' : 'bg-white border-4 border-olive-400'
                            }`}></div>

                        {/* Empty space for opposite side */}
                        <div className="hidden md:block md:w-5/12"></div>
                    </motion.div>
                ))}

                {/* Heart at the end */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 hidden md:block"
                >
                    <div className="w-10 h-10 rounded-full bg-terracotta-400 flex items-center justify-center shadow-lg">
                        <Heart size={18} className="text-white fill-white" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Timeline;
