"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Calendar,
    MapPin,
    Users,
    Palette,
    Clock,
    Mail,
    Phone,
    MessageCircle,
    Edit2,
    Check,
    X,
    Sparkles,
    Tag,
} from "lucide-react";
import { useBriefing, BriefingData } from "@/contexts/BriefingContext";
import Link from "next/link";

interface EditableFieldProps {
    label: string;
    value: string;
    field: keyof BriefingData;
    icon: React.ReactNode;
    type?: "text" | "date" | "time" | "email" | "tel";
}

function EditableField({ label, value, field, icon, type = "text" }: EditableFieldProps) {
    const { updateBriefingData } = useBriefing();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        updateBriefingData({ [field]: editValue });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const formatDisplayValue = () => {
        if (!value) return <span className="text-[#6B7A6C]/50 italic">Não informado</span>;
        if (type === "date") {
            return new Date(value).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        }
        return value;
    };

    return (
        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DCD3C5] hover:border-[#C19B58]/30 transition-colors group">
            <div className="p-2 bg-[#C19B58]/10 rounded-lg text-[#C19B58]">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider mb-1">{label}</p>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-[#F7F5F0] border border-[#C19B58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/20"
                            autoFocus
                        />
                        <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[#2A3B2E] font-medium">{formatDisplayValue()}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-[#6B7A6C] hover:text-[#C19B58] hover:bg-[#C19B58]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { briefingData, hasBriefing, isLoading, createEvent } = useBriefing();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateEvent = async () => {
        setIsCreating(true);
        // Create with default template - user can change later
        const success = await createEvent(
            "classic-elegance",
            "Classic Elegance",
            "Elegante e atemporal"
        );
        if (!success) {
            console.error("Failed to create event");
        }
        setIsCreating(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        );
    }

    if (!hasBriefing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                >
                    <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Tag size={40} className="text-[#C19B58]" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Crie Seu Evento
                    </h1>
                    <p className="text-[#6B7A6C] mb-6">
                        Você ainda não criou um evento. Clique abaixo para começar a personalizar seu convite de casamento.
                    </p>

                    {/* Price Card */}
                    <div className="bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] rounded-2xl p-6 mb-6 text-white">
                        <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Projeto Completo</p>
                        <p className="text-4xl font-bold font-[family-name:var(--font-heading)] mb-2">
                            R$ 197
                        </p>
                        <p className="text-sm text-white/70">Pagamento único • Tudo incluso</p>
                    </div>

                    <motion.button
                        onClick={handleCreateEvent}
                        disabled={isCreating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-lg font-medium hover:bg-[#b08d4b] transition-colors shadow-lg shadow-[#C19B58]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Criar Meu Evento
                            </>
                        )}
                    </motion.button>

                    <p className="text-xs text-[#6B7A6C] mt-4">
                        Ou <Link href="/templates" className="text-[#C19B58] hover:underline">escolha um template específico</Link>
                    </p>
                </motion.div>
            </div>
        );
    }

    const statusColors = {
        pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Aguardando" },
        in_progress: { bg: "bg-blue-50", text: "text-blue-700", label: "Em Produção" },
        completed: { bg: "bg-green-50", text: "text-green-700", label: "Concluído" },
    };

    const status = statusColors[briefingData?.status || "pending"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Bem-vindos, {briefingData?.brideName} & {briefingData?.groomName}! 💍
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie as informações do seu convite de casamento
                    </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.text} text-sm font-medium`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {status.label}
                </div>
            </motion.div>

            {/* Template Card */}
            {briefingData?.templateName && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#C19B58]/20 rounded-lg">
                            <Palette size={20} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <p className="text-xs text-white/60 uppercase tracking-wider">Template Selecionado</p>
                            <h2 className="text-xl font-medium font-[family-name:var(--font-heading)]">
                                {briefingData.templateName}
                            </h2>
                        </div>
                    </div>
                    <p className="text-sm text-white/70 ml-12">{briefingData.templateStyle}</p>
                </motion.div>
            )}

            {/* Info Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Couple Info */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Heart size={18} className="text-[#C19B58]" />
                        Dados do Casal
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Noiva" value={briefingData?.brideName || ""} field="brideName" icon={<Heart size={16} />} />
                        <EditableField label="Noivo" value={briefingData?.groomName || ""} field="groomName" icon={<Heart size={16} />} />
                        <EditableField label="Email" value={briefingData?.email || ""} field="email" icon={<Mail size={16} />} type="email" />
                        <EditableField label="WhatsApp" value={briefingData?.phone || ""} field="phone" icon={<Phone size={16} />} type="tel" />
                    </div>
                </motion.section>

                {/* Event Details */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Calendar size={18} className="text-[#C19B58]" />
                        Detalhes do Evento
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Data do Casamento" value={briefingData?.weddingDate || ""} field="weddingDate" icon={<Calendar size={16} />} type="date" />
                        <EditableField label="Horário Cerimônia" value={briefingData?.ceremonyTime || ""} field="ceremonyTime" icon={<Clock size={16} />} type="time" />
                        <EditableField label="Horário Festa" value={briefingData?.partyTime || ""} field="partyTime" icon={<Clock size={16} />} type="time" />
                        <EditableField label="Convidados" value={briefingData?.guestCount || ""} field="guestCount" icon={<Users size={16} />} />
                    </div>
                </motion.section>

                {/* Locations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <MapPin size={18} className="text-[#C19B58]" />
                        Locais
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Local da Cerimônia" value={briefingData?.ceremonyLocation || ""} field="ceremonyLocation" icon={<MapPin size={16} />} />
                        <EditableField label="Local da Festa" value={briefingData?.partyLocation || ""} field="partyLocation" icon={<MapPin size={16} />} />
                    </div>
                </motion.section>

                {/* Style Preferences */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Palette size={18} className="text-[#C19B58]" />
                        Preferências de Estilo
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Estilo do Casamento" value={briefingData?.style || ""} field="style" icon={<Sparkles size={16} />} />
                        <EditableField label="Cores Preferidas" value={briefingData?.colors || ""} field="colors" icon={<Palette size={16} />} />
                        <EditableField label="Observações" value={briefingData?.message || ""} field="message" icon={<MessageCircle size={16} />} />
                    </div>
                </motion.section>
            </div>

            {/* Submitted Info */}
            {briefingData?.submittedAt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-[#6B7A6C]"
                >
                    Briefing enviado em{" "}
                    {new Date(briefingData.submittedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </motion.div>
            )}
        </div>
    );
}
