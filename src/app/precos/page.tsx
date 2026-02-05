import {
    Navigation,
    Footer,
} from "@/components/landing";
import Link from "next/link";
import { Metadata } from "next";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
    title: "Preços | LUMA Convites",
    description: "Planos e preços do LUMA Convites. Grátis, Plus ou Concierge — escolha o ideal para seu evento.",
    openGraph: {
        title: "Preços | LUMA Convites",
        description: "Planos e preços do LUMA Convites. Grátis, Plus ou Concierge.",
    },
};

const plans = [
    {
        id: "free",
        name: "Grátis",
        price: "R$ 0",
        priceNote: "",
        description: "Para quem quer publicar rápido",
        features: [
            { text: "Publicação rápida", included: true },
            { text: "1-2 templates básicos", included: true },
            { text: "RSVP até 50 confirmações", included: true },
            { text: "Galeria até 10 fotos", included: true },
            { text: "Lista até 10 presentes", included: true },
            { text: "Link válido 30 dias após evento", included: true },
            { text: "Watermark LUMA clicável", included: true },
            { text: "Suporte autoatendimento", included: true },
            { text: "Sem watermark", included: false },
            { text: "Templates premium", included: false },
            { text: "Convite com senha", included: false },
            { text: "Export CSV", included: false },
        ],
        cta: "Começar grátis",
        ctaLink: "/login",
        highlighted: false,
    },
    {
        id: "plus",
        name: "Plus",
        price: "R$ 97",
        priceNote: "pagamento único",
        description: "Para quem quer remover limites",
        features: [
            { text: "Tudo do Grátis, mais:", included: true },
            { text: "Sem watermark", included: true },
            { text: "Todos os templates", included: true },
            { text: "Templates premium", included: true },
            { text: "RSVP ilimitado", included: true },
            { text: "Galeria até 30 fotos", included: true },
            { text: "Lista de presentes ilimitada", included: true },
            { text: "Convite protegido por senha", included: true },
            { text: "Export CSV de confirmações", included: true },
            { text: "Link válido 12 meses após evento", included: true },
            { text: "Suporte prioritário", included: true },
        ],
        cta: "Escolher Plus",
        ctaLink: "/login?plan=plus",
        highlighted: true,
    },
    {
        id: "concierge",
        name: "Concierge",
        price: "R$ 297",
        priceNote: "pagamento único",
        description: "Montagem completa pelo nosso time",
        features: [
            { text: "Tudo do Plus, mais:", included: true },
            { text: "Montagem completa", included: true },
            { text: "Template premium personalizado", included: true },
            { text: "1 rodada de ajustes incluída", included: true },
            { text: "Prazo: 72h úteis após conteúdo", included: true },
            { text: "Galeria até 60 fotos", included: true },
            { text: "Canal de atendimento dedicado", included: true },
        ],
        cta: "Solicitar Concierge",
        ctaLink: "/concierge",
        highlighted: false,
    },
];

export default function PrecosPage() {
    return (
        <main className="min-h-screen bg-[#F7F5F0]">
            <Navigation />

            {/* Hero */}
            <section className="pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-light text-[#2A3B2E] mb-6">
                        Planos simples e transparentes
                    </h1>
                    <p className="text-lg text-[#6B7A6C] max-w-2xl mx-auto">
                        Publique grátis ou faça upgrade para liberar recursos premium.
                        Pagamento único por evento — sem assinatura.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`rounded-3xl p-8 ${plan.highlighted
                                        ? "bg-white border-2 border-[#C19B58] shadow-xl scale-105"
                                        : "bg-white border border-[#E5E1D8]"
                                    }`}
                            >
                                {plan.highlighted && (
                                    <span className="inline-block bg-[#C19B58] text-white text-xs px-3 py-1 rounded-full mb-4">
                                        Mais popular
                                    </span>
                                )}
                                <h2 className="text-2xl font-medium text-[#2A3B2E] mb-2">
                                    {plan.name}
                                </h2>
                                <div className="mb-4">
                                    <span className="text-4xl font-light text-[#C19B58]">
                                        {plan.price}
                                    </span>
                                    {plan.priceNote && (
                                        <span className="text-sm text-[#6B7A6C] ml-2">
                                            {plan.priceNote}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[#6B7A6C] mb-6">{plan.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-start gap-2 text-sm ${feature.included
                                                    ? "text-[#2A3B2E]"
                                                    : "text-[#A5B5A7]"
                                                }`}
                                        >
                                            {feature.included ? (
                                                <Check className="w-4 h-4 text-[#C19B58] mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <X className="w-4 h-4 text-[#D5D0C7] mt-0.5 flex-shrink-0" />
                                            )}
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.ctaLink}
                                    className={`block w-full text-center py-3 rounded-full font-medium transition-all ${plan.highlighted
                                            ? "bg-[#C19B58] text-white hover:bg-[#A88347]"
                                            : "bg-[#F7F5F0] text-[#2A3B2E] hover:bg-[#E5E1D8]"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-light text-[#2A3B2E] text-center mb-12">
                        Perguntas frequentes
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Preciso pagar todo mês?",
                                a: "Não! O pagamento é único por evento. Você paga uma vez e o convite fica no ar pelo período do seu plano.",
                            },
                            {
                                q: "Posso começar grátis e fazer upgrade depois?",
                                a: "Sim! Você pode publicar seu convite grátis e fazer upgrade a qualquer momento para remover limites.",
                            },
                            {
                                q: "O que acontece quando o link expira?",
                                a: "Após o período, você pode renovar por R$ 29-49/ano para manter o link ativo como recordação.",
                            },
                            {
                                q: "O PIX dos presentes vai para vocês?",
                                a: "Não! O PIX é direto entre o convidado e você. LUMA não recebe nem retém nenhum valor.",
                            },
                        ].map((faq, index) => (
                            <div key={index} className="border-b border-[#E5E1D8] pb-6">
                                <h3 className="font-medium text-[#2A3B2E] mb-2">{faq.q}</h3>
                                <p className="text-[#6B7A6C]">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
