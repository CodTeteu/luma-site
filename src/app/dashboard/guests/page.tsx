"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Download,
    Users,
    UserCheck,
    Clock,
    Baby,
    MessageSquare,
    Filter,
    RefreshCw,
    Trash2,
    Loader2
} from "lucide-react";
import { useBriefing } from "@/contexts/BriefingContext";
import {
    getGuestList,
    getGuestStats,
    updateGuest,
    removeRSVP,
    RSVPGuest,
    RSVPStats
} from "@/services/rsvpService";
import { showToast } from "@/components/ui/Toast";
import Link from "next/link";

export default function GuestsPage() {
    const { eventId, briefingData, hasBriefing, isLoading: contextLoading } = useBriefing();
    const eventType = briefingData?.eventType || "wedding";

    const guestGroups = [
        "Sem Grupo",
        eventType === "graduation" ? "Família" : "Família Noiva",
        eventType === "graduation" ? "Amigos de Turma" : "Família Noivo",
        "Amigos",
        "Trabalho",
        eventType === "graduation" ? "Homenageados" : "Padrinhos",
        "Outros"
    ];

    const [guests, setGuests] = useState<RSVPGuest[]>([]);
    const [stats, setStats] = useState<RSVPStats>({
        total: 0,
        confirmed: 0,
        declined: 0,
        totalGuests: 0,
        totalChildren: 0
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "declined">("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        if (!eventId) return;

        setIsRefreshing(true);
        try {
            const [guestList, guestStats] = await Promise.all([
                getGuestList(eventId),
                getGuestStats(eventId)
            ]);
            setGuests(guestList);
            setStats(guestStats);
        } catch (e) {
            console.error("Error loading guests:", e);
            showToast("Erro ao carregar convidados", "error");
        }
        setIsRefreshing(false);
        setIsLoading(false);
    }, [eventId]);

    useEffect(() => {
        if (!contextLoading && eventId) {
            loadData();
        } else if (!contextLoading && !eventId) {
            setIsLoading(false);
        }
    }, [contextLoading, eventId, loadData]);

    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" ||
            (filterStatus === "confirmed" && guest.is_attending) ||
            (filterStatus === "declined" && !guest.is_attending);
        return matchesSearch && matchesFilter;
    });

    const handleExportCSV = () => {
        const headers = ["Nome", "Email", "Telefone", "Status", "Grupo", "Adultos", "Crianças", "Mensagem", "Data"];
        const rows = guests.map(g => [
            g.name,
            g.email || "",
            g.phone || "",
            g.is_attending ? "Confirmado" : "Não comparecerá",
            g.group_name || "Sem Grupo",
            g.guests.toString(),
            g.children.toString(),
            `"${(g.message || "").replace(/"/g, "'")}"`,
            new Date(g.created_at).toLocaleDateString('pt-BR')
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = eventType === "graduation" ? "convidados-formatura.csv" : "convidados-casamento.csv";
        a.click();
    };

    const handleGroupChange = async (guestId: string, group: string) => {
        if (!eventId) return;

        const result = await updateGuest(eventId, guestId, { group_name: group });
        if (result) {
            setGuests(prev => prev.map(g =>
                g.id === guestId ? { ...g, group_name: group } : g
            ));
        } else {
            showToast("Erro ao atualizar grupo", "error");
        }
    };

    const handleRemoveGuest = async (guestId: string) => {
        if (!eventId) return;

        if (!confirm("Tem certeza que deseja remover este convidado?")) return;

        const success = await removeRSVP(eventId, guestId);
        if (success) {
            setGuests(prev => prev.filter(g => g.id !== guestId));
            setStats(prev => ({
                ...prev,
                total: prev.total - 1,
                confirmed: guests.find(g => g.id === guestId)?.is_attending ? prev.confirmed - 1 : prev.confirmed,
                declined: !guests.find(g => g.id === guestId)?.is_attending ? prev.declined - 1 : prev.declined,
            }));
            showToast("Convidado removido", "success");
        } else {
            showToast("Erro ao remover convidado", "error");
        }
    };

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
                <Users size={48} className="text-[#DCD3C5] mb-4" />
                <p className="text-[#6B7A6C] mb-4">
                    Você precisa criar um evento primeiro para gerenciar convidados.
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
                        Convidados
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie a lista de presença do seu {eventType === "graduation" ? "evento" : "casamento"}.
                    </p>
                </div>
                <div className="flex gap-2">
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
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={guests.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#2A3B2E] text-[#F7F5F0] text-sm font-medium rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/10 disabled:opacity-50"
                    >
                        <Download size={16} />
                        Exportar CSV
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 p-4 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#2A3B2E]/5">
                            <Users size={18} className="text-[#2A3B2E]" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.total}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Respostas</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 p-4 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50">
                            <UserCheck size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.confirmed}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Confirmados</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 p-4 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50">
                            <Clock size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.declined}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Não comparecerão</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 p-4 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#C19B58]/10">
                            <Baby size={18} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.totalGuests}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Pessoas Total</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A6C]" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-[#6B7A6C]" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                        className="px-4 py-2.5 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                    >
                        <option value="all">Todos</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="declined">Não comparecerão</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F7F5F0] border-b border-[#DCD3C5]">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Nome</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Contato</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Grupo</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Pessoas</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Mensagem</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCD3C5]/50">
                            {filteredGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-[#2A3B2E]">{guest.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[#6B7A6C]">
                                            {guest.email && <div>{guest.email}</div>}
                                            {guest.phone && <div>{guest.phone}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${guest.is_attending
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${guest.is_attending ? "bg-emerald-500" : "bg-amber-500"
                                                }`} />
                                            {guest.is_attending ? "Confirmado" : "Não comparecerá"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={guest.group_name || "Sem Grupo"}
                                            onChange={(e) => handleGroupChange(guest.id, e.target.value)}
                                            className="px-2 py-1 text-xs border border-[#DCD3C5] rounded-md focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                        >
                                            {guestGroups.map((group) => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm text-[#3E4A3F]">
                                            {guest.guests}{guest.children > 0 && ` + ${guest.children} crianças`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {guest.message ? (
                                            <div className="flex items-center gap-2 max-w-xs">
                                                <MessageSquare size={14} className="text-[#C19B58] flex-shrink-0" />
                                                <span className="text-sm text-[#6B7A6C] truncate">{guest.message}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-[#DCD3C5]">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleRemoveGuest(guest.id)}
                                            className="p-1.5 text-[#6B7A6C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remover convidado"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredGuests.length === 0 && (
                    <div className="p-12 text-center">
                        <Users size={40} className="mx-auto text-[#DCD3C5] mb-4" />
                        <p className="text-[#6B7A6C]">
                            {guests.length === 0
                                ? "Nenhum convidado confirmou ainda."
                                : "Nenhum convidado encontrado com esse filtro."}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
