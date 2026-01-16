"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Globe, Settings, LogOut, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import LeafShadowOverlay from "@/components/ui/LeafShadowOverlay";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#F7F5F0] font-sans selection:bg-[#C19B58] selection:text-white">
            <LeafShadowOverlay />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F7F5F0] border-r border-[#DCD3C5] hidden md:block z-20">
                <div className="p-8">
                    <span className="text-2xl font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">LUMA</span>
                </div>

                <nav className="mt-8 px-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg text-sm font-medium shadow-md shadow-[#2A3B2E]/10">
                        <LayoutDashboard size={18} />
                        Visão Geral
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3E4A3F] hover:bg-[#E5E0D6] rounded-lg text-sm font-medium transition-colors">
                        <Globe size={18} />
                        Meus Sites
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3E4A3F] hover:bg-[#E5E0D6] rounded-lg text-sm font-medium transition-colors">
                        <Settings size={18} />
                        Configurações
                    </a>
                </nav>

                <div className="absolute bottom-8 left-0 right-0 px-8">
                    <Link href="/" className="flex items-center gap-3 text-[#6B7A6C] hover:text-[#9B2C2C] transition-colors text-sm font-medium">
                        <LogOut size={18} />
                        Sair
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 p-8 relative z-10">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-medium text-[#2A3B2E] mb-2 font-[family-name:var(--font-heading)]">Olá, Matheus & Eduarda</h1>
                        <p className="text-[#6B7A6C]">Bem-vindos ao painel do seu casamento.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C19B58]/20 text-[#C19B58] flex items-center justify-center font-bold">
                            M
                        </div>
                    </div>
                </header>

                {/* Highlight Card */}
                <section className="mb-12">
                    <h2 className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider mb-6">Seu Site</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#DCD3C5] shadow-sm flex items-start justify-between"
                        >
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5E0D6] text-[#2A3B2E] text-xs font-medium mb-4">
                                    <span className="w-2 h-2 rounded-full bg-[#2A3B2E] animate-pulse" />
                                    Publicado
                                </div>
                                <h3 className="text-2xl font-medium text-[#2A3B2E] mb-2 font-[family-name:var(--font-heading)]">Ana & Pedro</h3>
                                <p className="text-sm text-[#6B7A6C] mb-6">Última edição há 2 dias</p>

                                <div className="flex gap-3">
                                    <a
                                        href="/preview/template1"
                                        target="_blank"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#2A3B2E] text-[#F7F5F0] text-sm font-medium rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/10"
                                    >
                                        <ExternalLink size={16} />
                                        Visualizar Site
                                    </a>
                                    <a
                                        href="/editor/template1"
                                        className="flex items-center gap-2 px-4 py-2 border border-[#DCD3C5] text-[#3E4A3F] text-sm font-medium rounded-lg hover:border-[#C19B58] hover:text-[#C19B58] transition-colors"
                                    >
                                        Editar
                                    </a>
                                </div>
                            </div>
                            <div className="w-32 h-32 bg-[#F7F5F0] rounded-lg overflow-hidden relative border border-[#DCD3C5]">
                                {/* Placeholder for site thumbnail */}
                                <div className="absolute inset-0 bg-[url('/images/assets/visual-identity.png')] bg-cover bg-center opacity-80" />
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="border-2 border-dashed border-[#DCD3C5] rounded-xl flex flex-col items-center justify-center p-6 text-[#6B7A6C] hover:border-[#C19B58] hover:text-[#C19B58] transition-colors group h-full min-h-[200px] bg-white/30 hover:bg-white/50"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#E5E0D6] group-hover:bg-[#C19B58]/20 flex items-center justify-center mb-4 transition-colors text-[#3E4A3F] group-hover:text-[#C19B58]">
                                <Plus size={24} />
                            </div>
                            <span className="font-medium">Criar novo site</span>
                        </motion.button>
                    </div>
                </section>

                {/* Stats (Mock) */}
                <section>
                    <h2 className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider mb-6">Visão Geral</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Visitas", value: "1,234" },
                            { label: "Confirmados", value: "85" },
                            { label: "Presentes", value: "R$ 4.500" },
                            { label: "Mensagens", value: "12" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5] hover:border-[#C19B58] transition-colors shadow-sm">
                                <p className="text-[#6B7A6C] text-[10px] uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className="text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
