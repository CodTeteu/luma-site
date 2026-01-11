"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Globe, Settings, LogOut, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#faf9f7] font-sans">
            {/* Sidebar (Mock) */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 hidden md:block">
                <div className="p-8">
                    <Image
                        src="/luma-logo.png"
                        alt="LUMA Logo"
                        width={140}
                        height={40}
                        className="object-contain h-10 w-auto"
                    />
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[var(--gold)] text-white rounded-lg text-sm font-medium">
                        <LayoutDashboard size={18} />
                        Visão Geral
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                        <Globe size={18} />
                        Meus Sites
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                        <Settings size={18} />
                        Configurações
                    </a>
                </nav>

                <div className="absolute bottom-8 left-0 right-0 px-8">
                    <a href="/" className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                        <LogOut size={18} />
                        Sair
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-serif text-[#1a3c34] mb-2">Olá, Matheus & Eduarda</h1>
                        <p className="text-gray-500">Bem-vindos ao painel do seu casamento.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center font-bold">
                            M
                        </div>
                    </div>
                </header>

                {/* Highlight Card */}
                <section className="mb-12">
                    <h2 className="text-lg font-medium text-gray-800 mb-6">Seu Site</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium mb-4">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Publicado
                                </div>
                                <h3 className="text-xl font-serif text-[#1a3c34] mb-2">Ana & Pedro</h3>
                                <p className="text-sm text-gray-500 mb-6">Última edição há 2 dias</p>

                                <div className="flex gap-3">
                                    <a
                                        href="/preview/template1"
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#1a3c34] text-white text-sm font-medium rounded-lg hover:bg-[#2a5c4e] transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        Visualizar Site
                                    </a>
                                    <a
                                        href="/editor/template1"
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                                    >
                                        Editar
                                    </a>
                                </div>
                            </div>
                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                {/* Placeholder for site thumbnail */}
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group h-full min-h-[200px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[var(--gold)]/10 flex items-center justify-center mb-4 transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="font-medium">Criar novo site</span>
                        </motion.button>
                    </div>
                </section>

                {/* Stats (Mock) */}
                <section>
                    <h2 className="text-lg font-medium text-gray-800 mb-6">Visão Geral</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Visitas", value: "1,234" },
                            { label: "Confirmados", value: "85" },
                            { label: "Presentes", value: "R$ 4.500" },
                            { label: "Mensagens", value: "12" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className="text-2xl font-serif text-[#1a3c34]">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
