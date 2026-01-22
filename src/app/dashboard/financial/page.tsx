"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    Gift,
    Copy,
    Check,
    DollarSign,
    TrendingUp,
    RefreshCw,
    Loader2,
    Package,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useBriefing } from "@/contexts/BriefingContext";
import {
    getTransactions,
    getTransactionStats,
    GiftTransaction,
    TransactionStats
} from "@/services/transactionService";
import {
    getOrders,
    getOrderStats,
    updateOrderStatus,
    GiftOrder,
    GiftOrderStats
} from "@/services/giftOrdersService";
import Link from "next/link";

export default function FinancialPage() {
    const { eventId, briefingData, hasBriefing, isLoading: contextLoading, updateBriefingData } = useBriefing();
    const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
    const [stats, setStats] = useState<TransactionStats>({
        total: 0,
        confirmed: 0,
        pending: 0,
        totalAmount: 0,
        confirmedAmount: 0
    });
    const [pixKey, setPixKey] = useState("");
    const [pixHolder, setPixHolder] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Gift Orders state
    const [orders, setOrders] = useState<GiftOrder[]>([]);
    const [orderStats, setOrderStats] = useState<GiftOrderStats>({
        pending: { count: 0, total: 0 },
        confirmed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
    });
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!eventId) return;

        setIsRefreshing(true);
        try {
            const [txList, txStats, orderList, oStats] = await Promise.all([
                getTransactions(eventId),
                getTransactionStats(eventId),
                getOrders(eventId),
                getOrderStats(eventId),
            ]);
            setTransactions(txList);
            setStats(txStats);
            setOrders(orderList);
            setOrderStats(oStats);
        } catch (e) {
            console.error("Error loading data:", e);
            showToast("Erro ao carregar dados", "error");
        }

        // Load PIX config from briefingData (Supabase)
        const payment = (briefingData as { payment?: { pixKey?: string; pixName?: string } } | null)?.payment;
        if (payment) {
            setPixKey(payment.pixKey || "");
            setPixHolder(payment.pixName || "");
        }

        setIsRefreshing(false);
        setIsLoading(false);
    }, [eventId, briefingData]);

    useEffect(() => {
        if (!contextLoading && eventId) {
            loadData();
        } else if (!contextLoading && !eventId) {
            setIsLoading(false);
        }
    }, [contextLoading, eventId, loadData]);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePixConfig = async () => {
        setIsSaving(true);

        try {
            // Save PIX config to Supabase via BriefingContext
            await updateBriefingData({
                payment: {
                    enabled: true,
                    pixKey,
                    pixName: pixHolder,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            showToast("Configurações de PIX salvas!", "success");
        } catch (error) {
            console.error("Error saving PIX config:", error);
            showToast("Erro ao salvar configurações de PIX", "error");
        }

        setIsSaving(false);
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: "pending" | "confirmed" | "cancelled") => {
        setUpdatingOrderId(orderId);

        const success = await updateOrderStatus(orderId, newStatus);

        if (success) {
            showToast(
                newStatus === "confirmed"
                    ? "Pedido confirmado!"
                    : newStatus === "cancelled"
                        ? "Pedido cancelado"
                        : "Status atualizado",
                "success"
            );
            await loadData();
        } else {
            showToast("Erro ao atualizar status", "error");
        }

        setUpdatingOrderId(null);
    };

    const filteredOrders = statusFilter === "all"
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const averageGift = stats.total > 0 ? Math.round(stats.totalAmount / stats.total) : 0;

    // Loading state
    if (isLoading || contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        );
    }

    // No event
    if (!hasBriefing || !eventId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <Wallet size={48} className="text-[#DCD3C5] mb-4" />
                <p className="text-[#6B7A6C] mb-4">
                    Você precisa criar um evento primeiro para gerenciar finanças.
                </p>
                <Link
                    href="/dashboard"
                    className="text-[#C19B58] hover:underline"
                >
                    Ir para o Dashboard
                </Link>
            </div>
        );
    }

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
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2.5 border border-[#DCD3C5] text-[#6B7A6C] text-sm rounded-lg hover:bg-[#E5E0D6] transition-colors disabled:opacity-50"
                    title="Atualizar dados"
                >
                    {isRefreshing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}
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
                            <p className="text-white/60 text-sm">Valor Total Recebido</p>
                            {stats.total > 0 && (
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-400" />
                                    <span className="text-emerald-400 text-xs">
                                        {stats.confirmed} confirmado{stats.confirmed > 1 ? 's' : ''}, {stats.pending} pendente{stats.pending > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-5xl font-medium font-[family-name:var(--font-heading)] mb-4">
                        R$ {stats.confirmedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.total}</p>
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
                                R$ {averageGift}
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
                                    <Loader2 size={16} className="animate-spin" />
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

                        {transactions.slice(0, 5).map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between pb-4 border-b border-[#DCD3C5]/50 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center">
                                        <Gift size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#2A3B2E]">{tx.guest_name || "Anônimo"}</p>
                                        <p className="text-xs text-[#6B7A6C]">{tx.gift_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${tx.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {tx.status === 'confirmed' ? '+' : ''}R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[10px] text-[#6B7A6C]">
                                        {tx.status === 'pending' ? 'Pendente • ' : ''}{formatDate(tx.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Gift Orders Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Pedidos de Presentes
                    </h2>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {(["all", "pending", "confirmed", "cancelled"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === status
                                        ? "bg-[#2A3B2E] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {status === "all" && `Todos (${orders.length})`}
                                {status === "pending" && `Pendentes (${orderStats.pending.count})`}
                                {status === "confirmed" && `Confirmados (${orderStats.confirmed.count})`}
                                {status === "cancelled" && `Cancelados (${orderStats.cancelled.count})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(orderStats.pending.total)}</p>
                        <p className="text-xs text-amber-700">{orderStats.pending.count} pendente{orderStats.pending.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(orderStats.confirmed.total)}</p>
                        <p className="text-xs text-emerald-700">{orderStats.confirmed.count} confirmado{orderStats.confirmed.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-500">{formatCurrency(orderStats.cancelled.total)}</p>
                        <p className="text-xs text-gray-500">{orderStats.cancelled.count} cancelado{orderStats.cancelled.count !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                    {filteredOrders.length === 0 && (
                        <p className="text-sm text-[#6B7A6C] text-center py-8">
                            Nenhum pedido {statusFilter !== "all" ? `com status "${statusFilter}"` : "encontrado"}.
                        </p>
                    )}

                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-[#DCD3C5] rounded-lg overflow-hidden"
                        >
                            {/* Order Header */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${order.status === "pending" ? "bg-amber-100 text-amber-600" :
                                            order.status === "confirmed" ? "bg-emerald-100 text-emerald-600" :
                                                "bg-gray-100 text-gray-500"
                                        }`}>
                                        {order.status === "pending" && <Clock size={18} />}
                                        {order.status === "confirmed" && <CheckCircle size={18} />}
                                        {order.status === "cancelled" && <XCircle size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#2A3B2E]">
                                            #{order.reference_code}
                                            {order.guest_name && ` - ${order.guest_name}`}
                                        </p>
                                        <p className="text-xs text-[#6B7A6C]">
                                            {formatDate(order.created_at)}
                                            {order.guest_email && ` • ${order.guest_email}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-[#2A3B2E]">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                    {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-[#DCD3C5] p-4 bg-gray-50">
                                    {/* Items */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-[#6B7A6C] mb-2">Itens:</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-[#2A3B2E]">
                                                        {item.qty}x {item.name}
                                                    </span>
                                                    <span className="text-[#6B7A6C]">
                                                        {formatCurrency(item.lineTotal)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {order.message && (
                                        <div className="mb-4 p-3 bg-white rounded-lg">
                                            <p className="text-xs font-medium text-[#6B7A6C] mb-1">Mensagem:</p>
                                            <p className="text-sm text-[#2A3B2E] italic">"{order.message}"</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {order.status !== "confirmed" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                                                disabled={updatingOrderId === order.id}
                                                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingOrderId === order.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <CheckCircle size={14} />
                                                )}
                                                Confirmar Recebimento
                                            </button>
                                        )}
                                        {order.status !== "cancelled" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                                disabled={updatingOrderId === order.id}
                                                className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingOrderId === order.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}
                                                Cancelar
                                            </button>
                                        )}
                                        {order.status !== "pending" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "pending")}
                                                disabled={updatingOrderId === order.id}
                                                className="py-2 px-4 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                Voltar para Pendente
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
