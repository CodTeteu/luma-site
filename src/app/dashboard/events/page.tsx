"use client";

import { useEffect, useState } from "react";
import { useBriefing, EventSummary } from "@/contexts/BriefingContext";
import { Plus, Check, Calendar, Globe, Pencil, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";

export default function EventsPage() {
    const {
        allEvents,
        eventId: activeEventId,
        setActiveEvent,
        createEvent,
        refreshEvents,
        isLoading
    } = useBriefing();

    const [isCreating, setIsCreating] = useState(false);
    const [isSwitching, setIsSwitching] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Format date
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    // Get event display name from content
    const getEventName = (event: EventSummary) => {
        const content = event.content;
        if (content?.brideName && content?.groomName) {
            return `${content.brideName} & ${content.groomName}`;
        }
        if (content?.brideName || content?.groomName) {
            return content.brideName || content.groomName;
        }
        return "Novo Evento";
    };

    // Handle creating new event
    const handleCreateEvent = async () => {
        setIsCreating(true);
        const success = await createEvent("default", "Template Padrão", "classic");
        if (success) {
            showToast("Novo evento criado!", "success");
        } else {
            showToast("Erro ao criar evento", "error");
        }
        setIsCreating(false);
    };

    // Handle selecting an event
    const handleSelectEvent = async (eventIdToSelect: string) => {
        if (eventIdToSelect === activeEventId) return;

        setIsSwitching(eventIdToSelect);
        const success = await setActiveEvent(eventIdToSelect);
        if (success) {
            showToast("Evento selecionado!", "success");
        } else {
            showToast("Erro ao selecionar evento", "error");
        }
        setIsSwitching(null);
    };

    // Handle deleting an event
    const handleDeleteEvent = async (eventIdToDelete: string) => {
        if (!confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
            return;
        }

        setIsDeleting(eventIdToDelete);

        const supabase = createClient();
        if (!supabase) {
            showToast("Erro de conexão", "error");
            setIsDeleting(null);
            return;
        }

        try {
            const { error } = await supabase
                .from("events")
                .delete()
                .eq("id", eventIdToDelete);

            if (error) {
                throw error;
            }

            showToast("Evento excluído", "success");
            await refreshEvents();

            // If deleted the active event, switch to another
            if (eventIdToDelete === activeEventId && allEvents.length > 1) {
                const otherEvent = allEvents.find(e => e.id !== eventIdToDelete);
                if (otherEvent) {
                    await setActiveEvent(otherEvent.id);
                }
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            showToast("Erro ao excluir evento", "error");
        }

        setIsDeleting(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#C19B58]" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2A3B2E]">
                        Meus Eventos
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie seus eventos e selecione qual está ativo
                    </p>
                </div>

                <button
                    onClick={handleCreateEvent}
                    disabled={isCreating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A3B2E] text-white rounded-lg font-medium hover:bg-[#1a261d] transition-colors disabled:opacity-70"
                >
                    {isCreating ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Plus size={18} />
                    )}
                    Novo Evento
                </button>
            </div>

            {/* Events Grid */}
            {allEvents.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#DCD3C5] p-12 text-center">
                    <div className="w-16 h-16 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-[#C19B58]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-2">
                        Nenhum evento ainda
                    </h3>
                    <p className="text-[#6B7A6C] mb-6">
                        Crie seu primeiro evento para começar
                    </p>
                    <button
                        onClick={handleCreateEvent}
                        disabled={isCreating}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-lg font-medium hover:bg-[#A88347] transition-colors"
                    >
                        <Plus size={18} />
                        Criar Primeiro Evento
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {allEvents.map((event) => {
                        const isActive = event.id === activeEventId;
                        const isCurrentlySwitching = isSwitching === event.id;
                        const isCurrentlyDeleting = isDeleting === event.id;

                        return (
                            <div
                                key={event.id}
                                className={`bg-white rounded-xl border-2 p-6 transition-all ${isActive
                                        ? "border-[#C19B58] shadow-md"
                                        : "border-[#DCD3C5] hover:border-[#C19B58]/50"
                                    }`}
                            >
                                {/* Active Badge */}
                                {isActive && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-[#C19B58] mb-3">
                                        <Check size={14} />
                                        Evento Ativo
                                    </div>
                                )}

                                {/* Event Name */}
                                <h3 className="text-lg font-semibold text-[#2A3B2E] mb-1">
                                    {getEventName(event)}
                                </h3>

                                {/* Slug */}
                                <p className="text-sm text-[#6B7A6C] mb-3 font-mono">
                                    /{event.slug}
                                </p>

                                {/* Status & Date */}
                                <div className="flex items-center gap-4 text-sm text-[#6B7A6C] mb-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${event.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                        <Globe size={12} />
                                        {event.status === "published" ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(event.created_at)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {!isActive && (
                                        <button
                                            onClick={() => handleSelectEvent(event.id)}
                                            disabled={isCurrentlySwitching}
                                            className="flex-1 py-2 bg-[#C19B58] text-white rounded-lg text-sm font-medium hover:bg-[#A88347] transition-colors disabled:opacity-70 flex items-center justify-center gap-1"
                                        >
                                            {isCurrentlySwitching ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Check size={14} />
                                            )}
                                            Selecionar
                                        </button>
                                    )}

                                    {isActive && (
                                        <Link
                                            href="/dashboard/editor"
                                            className="flex-1 py-2 bg-[#2A3B2E] text-white rounded-lg text-sm font-medium hover:bg-[#1a261d] transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Pencil size={14} />
                                            Editar
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        disabled={isCurrentlyDeleting}
                                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-70"
                                        title="Excluir evento"
                                    >
                                        {isCurrentlyDeleting ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
