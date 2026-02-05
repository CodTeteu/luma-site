"use client";

import { motion } from "framer-motion";
import { Gift, Settings, Wallet, MessageCircle } from "lucide-react";
import Image from "next/image";

const features = [
    {
        icon: MessageCircle,
        title: "RSVP automatizado no WhatsApp",
        description: "Seus convidados confirmam presença em poucos cliques e você acompanha tudo em tempo real."
    },
    {
        icon: Wallet,
        title: "Lista de presentes com PIX direto",
        description: "Crie cotas e experiências; o pagamento cai instantaneamente na sua conta, sem taxas escondidas."
    },
    {
        icon: Settings,
        title: "Painel administrativo elegante",
        description: "Atualize fotos, textos e presentes quando quiser. Tudo pensado para ser simples e rápido."
    }
];

export function GiftListSection() {
    return (
        <section id="funcionalidades" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-[#C19B58] font-medium tracking-wider uppercase text-sm">
                                Funcionalidades que encantam
                            </span>
                            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] text-[#2A3B2E] mt-4 mb-6 leading-tight">
                                Tecnologia que simplifica <br />
                                <span className="italic text-[#C19B58]">e emociona</span>
                            </h2>
                            <p className="text-lg text-[#6B7A6C] leading-relaxed">
                                Do RSVP inteligente à lista de presentes com PIX, tudo foi pensado para melhorar a experiência dos
                                seus convidados e reduzir sua carga mental. Você acompanha cada confirmação e presente em tempo real.
                            </p>
                        </motion.div>

                        <div className="grid gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#C19B58]">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-[family-name:var(--font-heading)] text-[#2A3B2E] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[#6B7A6C]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Image/Mockup */}
                    <motion.div
                        className="flex-1 w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[#F7F5F0] rounded-2xl -z-10 transform rotate-2" />
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#E5E0D6]">
                                <Image
                                    src="/gift-registry-mockup.png"
                                    alt="Interface da Lista de Presentes LUMA"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-[#F7F5F0] max-w-xs"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-medium text-[#6B7A6C]">Status em Tempo Real</span>
                                </div>
                                <p className="font-[family-name:var(--font-heading)] text-lg text-[#2A3B2E]">
                                    &quot;Recebemos um presente de R$ 500!&quot;
                                </p>
                                <p className="text-xs text-[#6B7A6C] mt-1">
                                    Notificação instantânea para os noivos
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
