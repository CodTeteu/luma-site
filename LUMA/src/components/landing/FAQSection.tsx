"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

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
        a: "Trabalhamos com uma taxa única de criação. Seu site ficará no ar por 12 meses sem cobranças adicionais.",
    },
    {
        q: "Vocês oferecem suporte para os convidados?",
        a: "Sim, nossa equipe de Concierge pode auxiliar seus convidados com dúvidas sobre o RSVP e lista de presentes via WhatsApp.",
    },
];

/**
 * Accordion item component for FAQ.
 */
function SimpleAccordion({ question, answer }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#DCD3C5]/50 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left hover:text-[#C19B58] transition-colors"
            >
                <span className="text-lg font-medium text-[#2A3B2E]">{question}</span>
                <Plus
                    size={20}
                    className={`text-[#C19B58] transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                        }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="text-[#6B7A6C] pb-6 leading-relaxed">{answer}</p>
            </motion.div>
        </div>
    );
}

/**
 * FAQ section with accordion items.
 */
export function FAQSection() {
    return (
        <section id="duvidas" className="py-24 px-6 bg-[#F7F5F0]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Dúvidas Frequentes
                    </h2>
                    <p className="text-[#6B7A6C]">Tudo o que você precisa saber antes de iniciar.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl border border-[#DCD3C5]">
                    {faqItems.map((item, i) => (
                        <SimpleAccordion key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}
