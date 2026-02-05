import {
    Navigation,
    Footer,
    LuxuryDivider,
} from "@/components/landing";
import Link from "next/link";
import { Metadata } from "next";
import { Check, Clock, Heart, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Serviço Concierge | LUMA Convites",
    description: "Deixe a gente criar seu convite. Montagem completa pelo nosso time com template premium e 1 rodada de ajustes.",
    openGraph: {
        title: "Serviço Concierge | LUMA Convites",
        description: "Deixe a gente criar seu convite. Montagem completa pelo nosso time.",
    },
};

export default function ConciergePage() {
    return (
        <main className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2A3B2E] to-[#1A2B1E]" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-[#C19B58] rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#C19B58] rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                    <span className="inline-block text-[#C19B58] text-sm tracking-widest uppercase mb-4">
                        ✨ Serviço Premium
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
                        A gente cria<br />
                        <span className="text-[#C19B58]">você celebra</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#A5B5A7] max-w-2xl mx-auto mb-10">
                        Envie suas fotos e textos. Nosso time monta um convite premium
                        com seu estilo em até 72h úteis. Zero trabalho para você.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login?plan=concierge"
                            className="px-8 py-4 bg-[#C19B58] text-white rounded-full font-medium hover:bg-[#A88347] transition-all shadow-lg hover:shadow-xl"
                        >
                            Solicitar Concierge — R$ 297
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-light text-[#2A3B2E] text-center mb-16">
                        Como funciona
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                step: "1",
                                title: "Solicite",
                                description: "Preencha o brief com detalhes do seu evento e faça o pagamento",
                                icon: <MessageCircle className="w-6 h-6" />,
                            },
                            {
                                step: "2",
                                title: "Envie",
                                description: "Mande suas fotos, textos e preferências pelo canal dedicado",
                                icon: <Heart className="w-6 h-6" />,
                            },
                            {
                                step: "3",
                                title: "Aguarde",
                                description: "Em até 72h úteis, receba o link do convite pronto",
                                icon: <Clock className="w-6 h-6" />,
                            },
                            {
                                step: "4",
                                title: "Ajuste",
                                description: "1 rodada de ajustes incluída para deixar perfeito",
                                icon: <Check className="w-6 h-6" />,
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C19B58]">
                                    {item.icon}
                                </div>
                                <div className="text-sm text-[#C19B58] mb-2">Passo {item.step}</div>
                                <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-[#6B7A6C] text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <LuxuryDivider />

            {/* What's Included */}
            <section className="py-20 bg-[#F7F5F0]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-light text-[#2A3B2E] text-center mb-16">
                        O que está incluído
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            "Montagem completa do convite",
                            "Template premium personalizado",
                            "Até 60 fotos na galeria",
                            "RSVP configurado e funcionando",
                            "Lista de presentes com PIX",
                            "1 rodada de ajustes",
                            "Link válido por 12 meses após evento",
                            "Canal de atendimento dedicado",
                            "Suporte prioritário durante o evento",
                            "Sem watermark LUMA",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-[#2A3B2E]"
                            >
                                <Check className="w-5 h-5 text-[#C19B58] flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-light text-[#2A3B2E] text-center mb-6">
                        Concierge vs Fazer você mesmo
                    </h2>
                    <p className="text-[#6B7A6C] text-center mb-16 max-w-xl mx-auto">
                        Se você tem tempo, faça grátis ou Plus. Se prefere zero trabalho, Concierge é para você.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 bg-[#F7F5F0] rounded-2xl">
                            <h3 className="text-xl font-medium text-[#2A3B2E] mb-6">
                                Fazer você mesmo (Grátis/Plus)
                            </h3>
                            <ul className="space-y-3 text-[#6B7A6C]">
                                <li>• Você edita o convite no editor</li>
                                <li>• Você faz upload das fotos</li>
                                <li>• Você configura RSVP e presentes</li>
                                <li>• Publicação imediata</li>
                                <li>• A partir de R$ 0</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-[#2A3B2E] rounded-2xl text-white">
                            <h3 className="text-xl font-medium mb-6">
                                Concierge
                            </h3>
                            <ul className="space-y-3 text-[#A5B5A7]">
                                <li>• A gente monta tudo para você</li>
                                <li>• Você só envia o conteúdo</li>
                                <li>• Template premium personalizado</li>
                                <li>• Pronto em até 72h úteis</li>
                                <li>• R$ 297 (pagamento único)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[#C19B58]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                        Pronto para delegar?
                    </h2>
                    <p className="text-white/80 mb-10 max-w-xl mx-auto">
                        Solicite agora e receba seu convite premium em até 72h úteis.
                    </p>
                    <Link
                        href="/login?plan=concierge"
                        className="inline-block px-10 py-4 bg-white text-[#2A3B2E] rounded-full font-medium hover:bg-[#F7F5F0] transition-all shadow-lg"
                    >
                        Solicitar Concierge — R$ 297
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
