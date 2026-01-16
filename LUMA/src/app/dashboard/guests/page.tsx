"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Download,
    Users,
    UserCheck,
    Clock,
    Baby,
    MessageSquare,
    Filter
} from "lucide-react";

// Mock guest data
const MOCK_GUESTS = [
    { id: 1, name: "Maria Silva", status: "confirmed", adults: 2, children: 1, message: "Mal podemos esperar pela festa! Parabéns aos noivos!" },
    { id: 2, name: "João Santos", status: "confirmed", adults: 1, children: 0, message: "Estarei presente com muito carinho!" },
    { id: 3, name: "Ana Oliveira", status: "pending", adults: 2, children: 0, message: "" },
    { id: 4, name: "Carlos Lima", status: "confirmed", adults: 2, children: 2, message: "Obrigado pelo convite, será uma honra!" },
    { id: 5, name: "Fernanda Costa", status: "confirmed", adults: 1, children: 0, message: "Contando os dias!" },
    { id: 6, name: "Roberto Almeida", status: "pending", adults: 2, children: 1, message: "" },
    { id: 7, name: "Patricia Santos", status: "confirmed", adults: 2, children: 0, message: "Que dia especial será!" },
    { id: 8, name: "Lucas Ferreira", status: "pending", adults: 1, children: 0, message: "" },
    { id: 9, name: "Camila Rodrigues", status: "confirmed", adults: 2, children: 1, message: "Amamos vocês!" },
    { id: 10, name: "Bruno Martins", status: "confirmed", adults: 1, children: 0, message: "" },
];

export default function GuestsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "pending">("all");

    const filteredGuests = MOCK_GUESTS.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || guest.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalConfirmed = MOCK_GUESTS.filter(g => g.status === "confirmed").length;
    const totalPending = MOCK_GUESTS.filter(g => g.status === "pending").length;
    const totalAdults = MOCK_GUESTS.filter(g => g.status === "confirmed").reduce((sum, g) => sum + g.adults, 0);
    const totalChildren = MOCK_GUESTS.filter(g => g.status === "confirmed").reduce((sum, g) => sum + g.children, 0);

    const handleExportCSV = () => {
        const headers = ["Nome", "Status", "Adultos", "Crianças", "Mensagem"];
        const rows = MOCK_GUESTS.map(g => [
            g.name,
            g.status === "confirmed" ? "Confirmado" : "Pendente",
            g.adults.toString(),
            g.children.toString(),
            g.message
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "convidados-casamento.csv";
        a.click();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Convidados
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie a lista de presença do seu casamento.
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#2A3B2E] text-[#F7F5F0] text-sm font-medium rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/10"
                >
                    <Download size={16} />
                    Exportar CSV
                </button>
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
                            <p className="text-2xl font-medium text-[#2A3B2E]">{MOCK_GUESTS.length}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Total</p>
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
                            <p className="text-2xl font-medium text-[#2A3B2E]">{totalConfirmed}</p>
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
                            <p className="text-2xl font-medium text-[#2A3B2E]">{totalPending}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">Pendentes</p>
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
                            <p className="text-2xl font-medium text-[#2A3B2E]">{totalAdults + totalChildren}</p>
                            <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">{totalAdults} adultos, {totalChildren} crianças</p>
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
                        <option value="pending">Pendentes</option>
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
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Status</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Adultos</th>
                                <th className="text-center px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Crianças</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Mensagem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCD3C5]/50">
                            {filteredGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-[#F7F5F0]/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-[#2A3B2E]">{guest.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${guest.status === "confirmed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${guest.status === "confirmed" ? "bg-emerald-500" : "bg-amber-500"
                                                }`} />
                                            {guest.status === "confirmed" ? "Confirmado" : "Pendente"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm text-[#3E4A3F]">{guest.adults}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm text-[#3E4A3F]">{guest.children}</span>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredGuests.length === 0 && (
                    <div className="p-12 text-center">
                        <Users size={40} className="mx-auto text-[#DCD3C5] mb-4" />
                        <p className="text-[#6B7A6C]">Nenhum convidado encontrado.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
