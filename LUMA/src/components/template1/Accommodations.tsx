import { Car, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Accommodations = () => {
    return (
        <section id="accommodations" className="bg-cream py-16 border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Cards Grid Compact */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Hotel 1 */}
                            <div className="bg-white p-5 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="h-40 mb-4 overflow-hidden bg-stone-100 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        alt="Hotel Spa do Vinho"
                                        unoptimized
                                    />
                                </div>
                                <h3 className="text-lg font-serif text-stone-800 mb-1">Hotel Spa do Vinho</h3>
                                <div className="flex items-center gap-2 text-stone-500 text-[10px] mb-3 uppercase tracking-wider">
                                    <MapPin size={12} /> 5 min do local
                                </div>
                                <Link href="#" className="block w-full py-2 border border-stone-200 text-center uppercase text-[10px] tracking-widest font-medium text-stone-600 hover:bg-stone-800 hover:text-white transition-colors">Reservar</Link>
                            </div>

                            {/* Hotel 2 */}
                            <div className="bg-white p-5 border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="h-40 mb-4 overflow-hidden bg-stone-100 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        alt="Pousada Castello"
                                        unoptimized
                                    />
                                </div>
                                <h3 className="text-lg font-serif text-stone-800 mb-1">Pousada Castello</h3>
                                <div className="flex items-center gap-2 text-stone-500 text-[10px] mb-3 uppercase tracking-wider">
                                    <MapPin size={12} /> 10 min do local
                                </div>
                                <Link href="#" className="block w-full py-2 border border-stone-200 text-center uppercase text-[10px] tracking-widest font-medium text-stone-600 hover:bg-stone-800 hover:text-white transition-colors">Reservar</Link>
                            </div>

                            {/* Transport Option - Very Compact */}
                            <div className="bg-stone-50 p-5 border border-stone-100 flex flex-col justify-center text-center md:col-span-2">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Car size={16} className="text-olive-600" />
                                    </div>
                                    <h3 className="text-lg font-serif text-stone-800">Transfer Oficial</h3>
                                </div>
                                <p className="text-stone-500 font-light text-xs leading-relaxed max-w-lg mx-auto">
                                    Saída dos hotéis oficiais e retorno a cada hora durante a festa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Header Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit text-left lg:text-right order-1 lg:order-2">
                        <span className="block text-olive-500 tracking-[0.3em] text-[10px] uppercase font-medium mb-3">Hospedagem</span>
                        <h2 className="text-4xl md:text-5xl text-stone-800 font-script mb-6 leading-tight">Para <br /> Ficar</h2>
                        <p className="text-stone-600 font-light text-base mb-6">
                            Opções especiais para sua estadia com conforto e proximidade.
                        </p>
                        <div className="w-12 h-px bg-olive-300 lg:ml-auto"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Accommodations;
