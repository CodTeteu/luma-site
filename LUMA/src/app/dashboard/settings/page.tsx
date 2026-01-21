"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Lock,
    Calendar,
    MapPin,
    AlertCircle
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export default function SettingsPage() {
    const [email, setEmail] = useState("ana.pedro@email.com");
    const [weddingDate, setWeddingDate] = useState("2025-10-25");
    const [venueName, setVenueName] = useState("Capela dos Milagres");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveAccount = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        showToast("Configurações da conta salvas!", "success");
    };

    const handleSaveWedding = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        showToast("Dados do casamento atualizados!", "success");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <header>
                <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                    Configurações
                </h1>
                <p className="text-[#6B7A6C] mt-1">
                    Gerencie sua conta e dados do casamento.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-[#2A3B2E]/5">
                            <User size={20} className="text-[#2A3B2E]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                Dados da Conta
                            </h2>
                            <p className="text-xs text-[#6B7A6C]">Gerencie seu email e senha</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-2 mb-2">
                                <Mail size={12} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-2 mb-2">
                                <Lock size={12} />
                                Senha Atual
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-2 mb-2">
                                <Lock size={12} />
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                            />
                        </div>

                        <button
                            onClick={handleSaveAccount}
                            disabled={isSaving}
                            className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1a261d] transition-colors disabled:opacity-70"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </motion.div>

                {/* Wedding Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-[#C19B58]/10">
                            <Calendar size={20} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                Dados do Casamento
                            </h2>
                            <p className="text-xs text-[#6B7A6C]">Informações que aparecem no site</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-2 mb-2">
                                <Calendar size={12} />
                                Data do Casamento
                            </label>
                            <input
                                type="date"
                                value={weddingDate}
                                onChange={(e) => setWeddingDate(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-2 mb-2">
                                <MapPin size={12} />
                                Local da Cerimônia
                            </label>
                            <input
                                type="text"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                            />
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800">
                                Alterar a data ou local irá atualizar automaticamente o seu site publicado.
                            </p>
                        </div>

                        <button
                            onClick={handleSaveWedding}
                            disabled={isSaving}
                            className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1a261d] transition-colors disabled:opacity-70"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
