import {
    Navigation,
    Footer,
    LuxuryDivider,
} from "@/components/landing";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convites Digitais para Formatura | LUMA Convites",
    description: "Crie convites digitais para sua formatura. Mini-site com detalhes da colação, festa, RSVP e galeria. Compartilhe por WhatsApp!",
    openGraph: {
        title: "Convites Digitais para Formatura | LUMA Convites",
        description: "Crie convites digitais para sua formatura. Mini-site com detalhes da colação, festa, RSVP e galeria.",
    },
};

export default function FormaturaPage() {
    return (
        <main className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F0] via-white to-[#F7F5F0]" />
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-[#C19B58] rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C19B58] rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                    <span className="inline-block text-[#C19B58] text-sm tracking-widest uppercase mb-4">
                        🎓 Convites para Formatura
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light text-[#2A3B2E] mb-6 leading-tight">
                        Celebre sua conquista<br />
                        <span className="text-[#C19B58]">com estilo</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#6B7A6C] max-w-2xl mx-auto mb-10">
                        Um link elegante com todos os detalhes da colação e festa,
                        confirmação de presença e galeria — pronto para compartilhar no WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-[#C19B58] text-white rounded-full font-medium hover:bg-[#A88347] transition-all shadow-lg hover:shadow-xl"
                        >
                            Criar meu convite grátis
                        </Link>
                        <Link
                            href="/templates"
                            className="px-8 py-4 bg-white text-[#2A3B2E] rounded-full font-medium hover:bg-[#F7F5F0] transition-all border border-[#E5E1D8]"
                        >
                            Ver templates
                        </Link>
                    </div>
                </div>
            </section>

            <LuxuryDivider />

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-light text-[#2A3B2E] text-center mb-16">
                        Tudo que você precisa para sua formatura
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🎓",
                                title: "Colação de Grau",
                                description: "Data, horário e local da cerimônia oficial"
                            },
                            {
                                icon: "🎉",
                                title: "Festa",
                                description: "Detalhes do baile ou comemoração após a colação"
                            },
                            {
                                icon: "👔",
                                title: "Traje",
                                description: "Orientações sobre dress code para seus convidados"
                            },
                            {
                                icon: "📍",
                                title: "Local com Mapa",
                                description: "Endereço com integração Google Maps"
                            },
                            {
                                icon: "✅",
                                title: "RSVP",
                                description: "Confirmação de presença com controle de convidados"
                            },
                            {
                                icon: "📸",
                                title: "Galeria de Fotos",
                                description: "Compartilhe momentos especiais da sua jornada"
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-[#F7F5F0] rounded-2xl hover:shadow-lg transition-all"
                            >
                                <span className="text-4xl mb-4 block">{feature.icon}</span>
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[#6B7A6C]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <LuxuryDivider />

            {/* Pricing Teaser */}
            <section className="py-20 bg-[#F7F5F0]">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-light text-[#2A3B2E] mb-6">
                            Simples e acessível
                        </h2>
                        <p className="text-[#6B7A6C] mb-8">
                            Publique grátis com watermark ou faça upgrade para remover limites.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white rounded-2xl">
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">Grátis</h3>
                                <p className="text-3xl font-light text-[#C19B58] mb-4">R$ 0</p>
                                <ul className="text-[#6B7A6C] text-sm space-y-2">
                                    <li>✓ Publicação rápida</li>
                                    <li>✓ RSVP até 50 confirmações</li>
                                    <li>✓ Galeria até 10 fotos</li>
                                    <li>• Watermark LUMA</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border-2 border-[#C19B58]">
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">Plus</h3>
                                <p className="text-3xl font-light text-[#C19B58] mb-4">R$ 97</p>
                                <ul className="text-[#6B7A6C] text-sm space-y-2">
                                    <li>✓ Sem watermark</li>
                                    <li>✓ RSVP ilimitado</li>
                                    <li>✓ Galeria 30 fotos</li>
                                    <li>✓ Export CSV</li>
                                </ul>
                            </div>
                        </div>
                        <Link
                            href="/precos"
                            className="inline-block mt-8 text-[#C19B58] hover:underline"
                        >
                            Ver todos os planos →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#2A3B2E]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                        Pronto para celebrar?
                    </h2>
                    <p className="text-[#A5B5A7] mb-10 max-w-xl mx-auto">
                        Crie seu convite de formatura em minutos e compartilhe com amigos e família.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-10 py-4 bg-[#C19B58] text-white rounded-full font-medium hover:bg-[#A88347] transition-all shadow-lg hover:shadow-xl"
                    >
                        Criar convite de formatura
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
