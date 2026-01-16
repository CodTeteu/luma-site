
import { MapPin, Clock, Calendar } from 'lucide-react';

const Ceremony = () => {
    return (
        <section id="ceremony" className="bg-cream min-h-screen flex items-center py-24 border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-12 gap-16 items-center">

                    {/* LEFT COLUMN: Header Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit text-left">
                        <span className="block text-olive-500 tracking-[0.3em] text-xs uppercase font-medium mb-4">O Grande Dia</span>
                        <h2 className="text-5xl md:text-6xl font-script text-stone-800 mb-8 leading-tight">
                            A <br /> Cerimônia
                        </h2>
                        <p className="text-stone-500 font-light leading-relaxed mb-8 text-lg">
                            Nosso momento de dizer sim, cercados pela natureza e pelas pessoas que amamos.
                        </p>
                        <div className="w-16 h-px bg-olive-300"></div>
                    </div>

                    {/* RIGHT COLUMN: Content (Centered Grid) */}
                    <div className="lg:col-span-8 grid md:grid-cols-3 gap-6">
                        {/* Card 1: Time */}
                        <div className="bg-white p-8 border border-stone-100 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all rounded-sm h-full justify-center">
                            <div className="w-14 h-14 bg-olive-50 rounded-full flex items-center justify-center text-olive-500 flex-shrink-0 mx-auto md:mx-0">
                                <Clock size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-center md:text-left">
                                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Horário</span>
                                <p className="text-4xl font-serif text-stone-800">16:30</p>
                                <p className="text-stone-500 font-light text-sm mt-2">Sugerimos chegar às 16:00.</p>
                            </div>
                        </div>

                        {/* Card 2: Date */}
                        <div className="bg-white p-8 border border-stone-100 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all rounded-sm h-full justify-center">
                            <div className="w-14 h-14 bg-olive-50 rounded-full flex items-center justify-center text-olive-500 flex-shrink-0 mx-auto md:mx-0">
                                <Calendar size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-center md:text-left">
                                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Data</span>
                                <p className="text-4xl font-serif text-stone-800">25 Out</p>
                                <p className="text-stone-500 font-light text-sm mt-2">Sábado ao pôr do sol.</p>
                            </div>
                        </div>

                        {/* Card 3: Location */}
                        <div className="bg-white p-8 border border-stone-100 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-all rounded-sm h-full justify-center">
                            <div className="w-14 h-14 bg-olive-50 rounded-full flex items-center justify-center text-olive-500 flex-shrink-0 mx-auto md:mx-0">
                                <MapPin size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-center md:text-left">
                                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Local</span>
                                <p className="text-3xl font-serif text-stone-800">Terracota</p>
                                <p className="text-stone-500 font-light text-sm mt-2 mb-4">Vale dos Vinhedos, RS</p>
                                <a href="#" className="inline-block text-xs uppercase tracking-widest text-olive-600 hover:text-olive-800 border-b border-olive-200 pb-1 transition-colors">
                                    Ver Mapa
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Ceremony;
