"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    Gift,
    ArrowUpRight,
    Copy,
    Check,
    DollarSign,
    TrendingUp,
    RefreshCw
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { getFinancialSummary, getTransactions } from "@/services/mockStorage";
import { GiftTransaction } from "@/types";

export default function FinancialPage() {
    const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
    const [summary, setSummary] = useState({ totalBalance: 0, transactionCount: 0, averageGift: 0, recentTransactions: [] as GiftTransaction[] });
    const [pixKey, setPixKey] = useState("");
    const [pixHolder, setPixHolder] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadData = () => {
        const txList = getTransactions();
        const fin = getFinancialSummary();

        setTransactions(txList);
        setSummary(fin);

        // Load PIX config from localStorage
        if (typeof window !== 'undefined') {
            const storedPix = localStorage.getItem('luma_pix_config');
            if (storedPix) {
                try {
                    const pixConfig = JSON.parse(storedPix);
                    setPixKey(pixConfig.pixKey || "");
                    setPixHolder(pixConfig.pixHolder || "");
                } catch {
                    // Ignore parse errors
                }
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();

        const handleStorageUpdate = () => loadData();
        window.addEventListener("luma-storage-update", handleStorageUpdate);

        return () => window.removeEventListener("luma-storage-update", handleStorageUpdate);
    }, []);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePixConfig = async () => {
        setIsSaving(true);

        // Save PIX config to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('luma_pix_config', JSON.stringify({ pixKey, pixHolder }));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
        showToast("Configurações de PIX salvas!", "success");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return "agora";
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffHours < 48) return "ontem";
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Financeiro & Presentes
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie os presentes recebidos e configure seu PIX.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-3 py-2.5 border border-[#DCD3C5] text-[#6B7A6C] text-sm rounded-lg hover:bg-[#E5E0D6] transition-colors"
                    title="Atualizar dados"
                >
                    <RefreshCw size={16} />
                    Atualizar
                </button>
            </header>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#2A3B2E] to-[#1a261d] rounded-2xl p-8 text-white relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C19B58]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-white/10">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-white/60 text-sm">Saldo Disponível</p>
                            {summary.transactionCount > 0 && (
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-400" />
                                    <span className="text-emerald-400 text-xs">
                                        {summary.transactionCount} presente{summary.transactionCount > 1 ? 's' : ''} recebido{summary.transactionCount > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-5xl font-medium font-[family-name:var(--font-heading)] mb-4">
                        R$ {summary.totalBalance.toLocaleString('pt-BR')}
                    </p>

                    <p className="text-white/60 text-sm">
                        💚 Os valores caem direto na sua conta via PIX
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#C19B58]/10">
                            <Gift size={20} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{summary.transactionCount}</p>
                            <p className="text-xs text-[#6B7A6C]">Presentes recebidos</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <DollarSign size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">
                                R$ {summary.averageGift}
                            </p>
                            <p className="text-xs text-[#6B7A6C]">Média por presente</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <Check size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">Instantâneo</p>
                            <p className="text-xs text-[#6B7A6C]">PIX cai direto na conta</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* PIX Configuration & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PIX Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-6">
                        Configurar Recebimento
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider block mb-2">
                                Chave PIX
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                                    placeholder="email@exemplo.com ou CPF"
                                />
                                <button
                                    onClick={handleCopyPix}
                                    disabled={!pixKey}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-[#E5E0D6] text-[#6B7A6C] transition-colors disabled:opacity-50"
                                    title="Copiar"
                                >
                                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider block mb-2">
                                Nome do Titular
                            </label>
                            <input
                                type="text"
                                value={pixHolder}
                                onChange={(e) => setPixHolder(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                                placeholder="Nome completo"
                            />
                        </div>

                        <button
                            onClick={handleSavePixConfig}
                            disabled={isSaving}
                            className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1a261d] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar Configurações"
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-6">
                        Últimos Presentes
                    </h2>

                    <div className="space-y-4">
                        {transactions.length === 0 && (
                            <p className="text-sm text-[#6B7A6C] text-center py-8">
                                Nenhum presente recebido ainda.
                            </p>
                        )}

                        {transactions.slice(-5).reverse().map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between pb-4 border-b border-[#DCD3C5]/50 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center">
                                        <Gift size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#2A3B2E]">{tx.senderName}</p>
                                        <p className="text-xs text-[#6B7A6C]">{tx.giftName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-emerald-600">
                                        +R$ {tx.amount}
                                    </p>
                                    <p className="text-[10px] text-[#6B7A6C]">{formatDate(tx.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
