"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Script from "next/script";

interface AccordionItemProps {
    question: string;
    answer: string;
}

const faqItems = [
    {
        q: "Qual o prazo de entrega?",
        a: "Após o preenchimento do briefing, nossa equipe entrega a primeira versão do seu site em até 48 horas úteis.",
    },
    {
        q: "Posso alterar as cores e fontes?",
        a: "Sim! Nosso plano Premium permite personalização completa da identidade visual, incluindo paleta de cores ilimitada e biblioteca de fontes premium.",
    },
    {
        q: "O pagamento é único ou mensal?",
        a: "Trabalhamos com uma taxa única de criação de R$197. Seu site ficará no ar por 12 meses sem cobranças adicionais.",
    },
    {
        q: "Vocês oferecem suporte para os convidados?",
        a: "Sim, nossa equipe de Concierge pode auxiliar seus convidados com dúvidas sobre o RSVP e lista de presentes via WhatsApp.",
    },
    {
        q: "Quanto custa criar um site de casamento LUMA?",
        a: "O projeto completo custa R$197 em pagamento único. Inclui site personalizado, RSVP via WhatsApp, lista de presentes com PIX e painel administrativo.",
    },
    {
        q: "Posso ver exemplos de sites criados?",
        a: "Sim! Acesse nossa galeria de templates para ver os 10 designs exclusivos disponíveis. Cada template pode ser totalmente personalizado.",
    },
];

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
        },
    })),
};

/**
 * Accordion item component for FAQ - Mobile optimized with larger touch targets.
 */
function SimpleAccordion({ question, answer }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#DCD3C5]/50 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 md:py-6 text-left hover:text-[#C19B58] transition-colors min-h-[56px] active:bg-[#F7F5F0]/50"
            >
                <span className="text-base md:text-lg font-medium text-[#2A3B2E] pr-4">{question}</span>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <Plus
                        size={20}
                        className={`text-[#C19B58] transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                            }`}
                    />
                </div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="text-sm md:text-base text-[#6B7A6C] pb-5 md:pb-6 leading-relaxed">{answer}</p>
            </motion.div>
        </div>
    );
}

/**
 * FAQ section with accordion items - Mobile optimized with SEO structured data.
 */
export function FAQSection() {
    return (
        <>
            {/* FAQ Schema for SEO */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <section id="duvidas" className="py-16 md:py-24 px-4 md:px-6 bg-[#F7F5F0]">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#2A3B2E] mb-3 md:mb-4 font-[family-name:var(--font-heading)]">
                            Dúvidas Frequentes
                        </h2>
                        <p className="text-sm md:text-base text-[#6B7A6C]">Tudo o que você precisa saber antes de iniciar.</p>
                    </div>

                    <div className="bg-white p-5 sm:p-6 md:p-12 rounded-2xl border border-[#DCD3C5]">
                        {faqItems.map((item, i) => (
                            <SimpleAccordion key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
