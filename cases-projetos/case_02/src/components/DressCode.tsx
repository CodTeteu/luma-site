
const DressCode = () => {
    const palette = [
        { color: '#889E53', name: 'Oliva' },
        { color: '#E07A5F', name: 'Terracota' },
        { color: '#F2CC8F', name: 'Areia' },
        { color: '#a8a29e', name: 'Cinza' },
    ];

    return (
        <section id="dresscode" className="bg-cream py-16 border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-8 items-center">

                    {/* LEFT COLUMN: Content (Compact) */}
                    <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">

                        {/* Intro Text Block - Compact */}
                        <div className="bg-white p-6 border border-stone-100 shadow-sm">
                            <p className="font-serif italic text-lg text-stone-800 text-center leading-relaxed">
                                "Vista-se para celebrar o amor, com conforto e elegância."
                            </p>
                        </div>

                        {/* Details Grid - Compact */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                                <h3 className="text-sm font-serif text-stone-800 mb-2 flex items-center gap-2">
                                    <span className="w-4 h-px bg-olive-400"></span>
                                    Ela
                                </h3>
                                <p className="text-stone-600 font-light leading-relaxed text-sm">
                                    Vestidos midi ou longos fluidos. Aposte em leveza e movimento. Evite saltos muito finos.
                                </p>
                            </div>
                            <div className="bg-white p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                                <h3 className="text-sm font-serif text-stone-800 mb-2 flex items-center gap-2">
                                    <span className="w-4 h-px bg-olive-400"></span>
                                    Ele
                                </h3>
                                <p className="text-stone-600 font-light leading-relaxed text-sm">
                                    Calça social ou sarja com camisa. Blazer opcional, gravata dispensável.
                                </p>
                            </div>
                        </div>

                        {/* Palette - Horizontal Compact */}
                        <div className="bg-stone-50 p-6 border border-stone-100/50 rounded-sm flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-800 mb-1">Paleta</h4>
                                <p className="text-stone-500 font-light text-xs max-w-[150px]">
                                    Tons terrosos e naturais.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                {palette.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-1 group cursor-pointer">
                                        <div
                                            className="w-8 h-8 rounded-full shadow-sm border border-white ring-1 ring-stone-200 transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Header Sticky */}
                    <div className="lg:col-span-4 h-fit text-left lg:text-right order-1 lg:order-2 lg:sticky lg:top-32">
                        <span className="block text-olive-500 tracking-[0.3em] text-[10px] uppercase font-medium mb-3">Traje</span>
                        <h2 className="text-4xl md:text-5xl font-script text-stone-800 mb-6 leading-tight">
                            Esporte <br /> Fino
                        </h2>
                        <p className="text-stone-600 font-light leading-relaxed mb-6 text-base">
                            O mais importante é que você se sinta bem para celebrar conosco.
                        </p>
                        <div className="w-12 h-px bg-olive-300 lg:ml-auto"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DressCode;
