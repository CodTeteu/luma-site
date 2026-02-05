import {
    Navigation,
    Footer,
    LuxuryDivider,
} from "@/components/landing";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Convites Digitais para Casamento | LUMA Convites",
    description: "Crie convites digitais elegantes para seu casamento. Mini-site personalizado com RSVP, galeria e lista de presentes. Compartilhe por WhatsApp!",
    openGraph: {
        title: "Convites Digitais para Casamento | LUMA Convites",
        description: "Crie convites digitais elegantes para seu casamento. Mini-site personalizado com RSVP, galeria e lista de presentes.",
    },
};

export default function CasamentoPage() {
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
                        💒 Convites para Casamento
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light text-[#2A3B2E] mb-6 leading-tight">
                        O convite perfeito<br />
                        <span className="text-[#C19B58]">para o dia mais especial</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#6B7A6C] max-w-2xl mx-auto mb-10">
                        Um link elegante que conta a história do casal, confirma presenças
                        e recebe presentes via PIX — tudo em um mini-site otimizado para WhatsApp.
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
                        Tudo que você precisa para o seu casamento
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "💌",
                                title: "História do Casal",
                                description: "Conte como vocês se conheceram e compartilhe fotos especiais"
                            },
                            {
                                icon: "📍",
                                title: "Local com Mapa",
                                description: "Endereço da cerimônia e festa com integração Google Maps"
                            },
                            {
                                icon: "✅",
                                title: "RSVP Inteligente",
                                description: "Confirmação de presença com contagem de acompanhantes"
                            },
                            {
                                icon: "🎁",
                                title: "Lista de Presentes",
                                description: "PIX direto para vocês — sem taxas, sem intermediários"
                            },
                            {
                                icon: "📸",
                                title: "Galeria de Fotos",
                                description: "Compartilhe suas melhores fotos com compressão automática"
                            },
                            {
                                icon: "📱",
                                title: "Mobile-First",
                                description: "Otimizado para WhatsApp e Instagram com preview perfeito"
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

            {/* CTA Section */}
            <section className="py-20 bg-[#2A3B2E]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                        Comece grátis agora
                    </h2>
                    <p className="text-[#A5B5A7] mb-10 max-w-xl mx-auto">
                        Publique seu convite em minutos. Upgrade opcional para remover
                        watermark e liberar recursos premium.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-10 py-4 bg-[#C19B58] text-white rounded-full font-medium hover:bg-[#A88347] transition-all shadow-lg hover:shadow-xl"
                    >
                        Criar convite de casamento
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
