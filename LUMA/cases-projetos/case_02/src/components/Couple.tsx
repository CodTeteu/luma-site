
const Couple = () => {
    return (
        <section id="couple" className="section-padding bg-cream relative overflow-hidden">
            {/* Decorative floral element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 w-full relative group">
                    {/* Arched image frame */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-[10rem] border-8 border-white shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                            alt="The Happy Couple"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-olive-500/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    {/* Decorative offset border */}
                    <div className="absolute inset-0 border-2 border-olive-300 rounded-t-[10rem] translate-x-4 translate-y-4 -z-10" />
                </div>

                <div className="flex-1 space-y-8 text-center md:text-left">
                    <span className="text-olive-500 tracking-[0.2em] text-sm uppercase font-medium">Nossa Jornada</span>
                    <h2 className="text-5xl md:text-6xl text-stone-800 font-script mb-6">Nossa História</h2>
                    <div className="space-y-6 text-stone-600 leading-loose font-sans text-lg md:text-xl">
                        <p>
                            <span className="text-5xl float-left mr-3 text-olive-400 font-script line-height-1">T</span>
                            udo começou em uma tarde de verão, sob a luz dourada que agora ilumina nosso caminho.
                            O que parecia ser apenas uma coincidência, transformou-se em uma amizade sincera e,
                            pouco a pouco, no amor que celebramos hoje.
                        </p>
                        <p>
                            Compartilhamos sonhos, taças de vinho e a certeza de que a vida é melhor compartilhada.
                            Aprendemos que o amor não é apenas sobre olhar um para o outro, mas sim olhar juntos na mesma direção.
                        </p>
                        <p className="font-serif italic text-olive-700 text-2xl pt-4">
                            "Onde quer que você vá, serei seu lar."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Couple;

