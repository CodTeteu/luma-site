"use client";

import { motion } from "framer-motion";
import { Gift, Settings, Wallet } from "lucide-react";
import Image from "next/image";

const features = [
    {
        icon: Gift,
        title: "Experiência de Compra Real",
        description: "Seus convidados sentem que estão presenteando com experiências reais (jantares, cotas de lua de mel), tornando o ato de presentear muito mais carinhoso e pessoal."
    },
    {
        icon: Wallet,
        title: "Dinheiro 100% na Sua Conta",
        description: "Esqueça taxas abusivas de saque ou prazos longos. O convidado paga via PIX e o valor cai instantaneamente na sua conta bancária. Liberdade total."
    },
    {
        icon: Settings,
        title: "Painel de Controle Completo",
        description: "Você tem autonomia total para criar, editar e excluir presentes. Defina valores, escolha fotos e organize sua lista como preferir através da nossa área administrativa."
    }
];

export function GiftListSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
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
                                O Grande Diferencial
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mt-4 mb-6 leading-tight">
                                Lista de Presentes Inteligente: <br />
                                <span className="italic text-[#C19B58]">Mais Elegância, Zero Taxas</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Transformamos a tradicional &quot;lista de presentes em dinheiro&quot; em uma experiência elegante para seus convidados.
                                Nossa plataforma simula uma loja virtual onde cada &quot;presente&quot; comprado é, na verdade, uma transferência PIX direto para você.
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
                                        <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">
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
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-100">
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
                                    <span className="text-sm font-medium text-gray-500">Status em Tempo Real</span>
                                </div>
                                <p className="font-serif text-lg text-[#1A1A1A]">
                                    &quot;Recebemos um presente de R$ 500!&quot;
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
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
