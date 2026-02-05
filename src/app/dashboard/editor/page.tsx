"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Globe,
    Loader2,
    Check,
    ExternalLink,
    Users,
    Calendar,
    MapPin,
    MessageSquare,
    Palette,
    Send,
    ChevronDown,
    ChevronUp,
    Link2,
    AlertTriangle,
    EyeOff,
    Gift,
    DollarSign,
    Plus,
    Trash2,
    Edit2
} from "lucide-react";
import { useBriefing } from "@/contexts/BriefingContext";
import { createClient } from "@/lib/supabase/client";
import { isTemporarySlug, normalizeSlug, isReservedSlug, generateUniqueSlug } from "@/lib/slug";
import { InvitationContent, DEFAULT_INVITATION_CONTENT } from "@/types/invitation";
import { getTemplate } from "@/templates/registry";
import { showToast } from "@/components/ui/Toast";
import Link from "next/link";

// ============================================
// Section Component
// ============================================

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-[#DCD3C5] rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F7F5F0]/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#C19B58]/10 rounded-lg text-[#C19B58]">
                        {icon}
                    </div>
                    <span className="font-medium text-[#2A3B2E]">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================
// Input Field Component
// ============================================

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "date" | "time" | "textarea" | "color";
    placeholder?: string;
}

function InputField({ label, value, onChange, type = "text", placeholder }: InputFieldProps) {
    const baseClass = "w-full px-4 py-2.5 rounded-lg border border-[#DCD3C5] bg-[#F7F5F0]/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E] text-sm";

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={baseClass + " resize-none"}
                />
            ) : type === "color" ? (
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={value || "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-[#DCD3C5] cursor-pointer"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="#C19B58"
                        className={baseClass + " flex-1"}
                    />
                </div>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseClass}
                />
            )}
        </div>
    );
}

// ============================================
// Main Editor Page
// ============================================

export default function EditorPage() {
    const { eventId, eventSlug, hasBriefing, isLoading: contextLoading, updateSlug } = useBriefing();
    const [content, setContent] = useState<InvitationContent>(DEFAULT_INVITATION_CONTENT);
    const [templateId, setTemplateId] = useState("default");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [eventType, setEventType] = useState<"wedding" | "graduation">("wedding");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [isUpdatingSlug, setIsUpdatingSlug] = useState(false);
    const [isUnpublishing, setIsUnpublishing] = useState(false);
    const [customSlug, setCustomSlug] = useState("");
    const [slugError, setSlugError] = useState<string | null>(null);
    const [isSavingSlug, setIsSavingSlug] = useState(false);

    // Gift/PIX state
    interface GiftItem {
        id: string;
        name: string;
        amount: number;
        description?: string;
    }
    const [gifts, setGifts] = useState<GiftItem[]>([]);
    const [pixKey, setPixKey] = useState("");
    const [pixName, setPixName] = useState("");
    const [giftsEnabled, setGiftsEnabled] = useState(false);
    const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
    const [newGift, setNewGift] = useState({ name: "", amount: "", description: "" });
    const MAX_GIFTS = 20;

    // Load event data
    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                setIsLoading(false);
                return;
            }

            const supabase = createClient();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const { data: event, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", eventId)
                    .single();

                if (error) throw error;

                if (event) {
                    // Merge with defaults to ensure all fields exist
                    const eventContent = event.content as Partial<InvitationContent> & {
                        gifts?: GiftItem[];
                        payment?: { pixKey?: string; pixName?: string };
                        sections?: { giftsEnabled?: boolean };
                    };
                    setContent({
                        couple: { ...DEFAULT_INVITATION_CONTENT.couple, ...eventContent?.couple },
                        event: { ...DEFAULT_INVITATION_CONTENT.event, ...eventContent?.event },
                        locations: { ...DEFAULT_INVITATION_CONTENT.locations, ...eventContent?.locations },
                        messages: { ...DEFAULT_INVITATION_CONTENT.messages, ...eventContent?.messages },
                        theme: { ...DEFAULT_INVITATION_CONTENT.theme, ...eventContent?.theme },
                        rsvp: { ...DEFAULT_INVITATION_CONTENT.rsvp, ...eventContent?.rsvp },
                    });
                    setTemplateId(event.template_id || "default");
                    setStatus(event.status);

                    // Load gifts and PIX
                    setGifts(eventContent?.gifts || []);
                    setPixKey(eventContent?.payment?.pixKey || "");
                    setPixName(eventContent?.payment?.pixName || "");
                    setGiftsEnabled(eventContent?.sections?.giftsEnabled ?? false);
                    setEventType(event.event_type || "wedding");
                }
            } catch (e) {
                console.error("Error loading event:", e);
                showToast("Erro ao carregar evento", "error");
            }

            setIsLoading(false);
        };

        if (!contextLoading) {
            loadEvent();
        }
    }, [eventId, contextLoading]);

    // Update content helper
    const updateContent = useCallback(<K extends keyof InvitationContent>(
        section: K,
        field: keyof InvitationContent[K],
        value: string | boolean
    ) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
        setHasChanges(true);
    }, []);

    // Save to Supabase
    const handleSave = async () => {
        if (!eventId) return;

        setIsSaving(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsSaving(false);
            return;
        }

        try {
            // Combine content with gifts and payment
            const fullContent = {
                ...content,
                gifts,
                payment: {
                    enabled: true,
                    pixKey,
                    pixName,
                },
                sections: {
                    giftsEnabled,
                },
            };

            const { error } = await supabase
                .from("events")
                .update({ content: fullContent, template_id: templateId })
                .eq("id", eventId);

            if (error) throw error;

            showToast("Salvo com sucesso!", "success");
            setHasChanges(false);
        } catch (e) {
            console.error("Error saving:", e);
            showToast("Erro ao salvar", "error");
        }

        setIsSaving(false);
    };

    // Publish event
    const handlePublish = async () => {
        if (!eventId) return;

        setIsPublishing(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsPublishing(false);
            return;
        }

        try {
            // Save content and update status
            const { error } = await supabase
                .from("events")
                .update({
                    content,
                    template_id: templateId,
                    status: "published"
                })
                .eq("id", eventId);

            if (error) throw error;

            setStatus("published");
            setHasChanges(false);
            showToast("Convite publicado! 🎉", "success");
        } catch (e) {
            console.error("Error publishing:", e);
            showToast("Erro ao publicar", "error");
        }

        setIsPublishing(false);
    };

    // Unpublish event (back to draft)
    const handleUnpublish = async () => {
        if (!eventId) return;
        if (!confirm("Tem certeza? O link público ficará indisponível.")) return;

        setIsUnpublishing(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsUnpublishing(false);
            return;
        }

        try {
            const { error } = await supabase
                .from("events")
                .update({ status: "draft" })
                .eq("id", eventId);

            if (error) throw error;

            setStatus("draft");
            showToast("Convite despublicado. Link público desativado.", "success");
        } catch (e) {
            console.error("Error unpublishing:", e);
            showToast("Erro ao despublicar", "error");
        }

        setIsUnpublishing(false);
    };

    // Validate and save custom slug
    const handleSaveSlug = async () => {
        if (!eventId || !customSlug.trim()) return;

        const supabase = createClient();
        if (!supabase) {
            showToast("Supabase não configurado", "error");
            return;
        }

        setIsSavingSlug(true);
        setSlugError(null);

        try {
            const normalized = normalizeSlug(customSlug);

            if (!normalized || normalized.length < 3) {
                setSlugError("Slug deve ter pelo menos 3 caracteres");
                setIsSavingSlug(false);
                return;
            }

            if (isReservedSlug(normalized)) {
                setSlugError(`"${normalized}" é um nome reservado. Escolha outro.`);
                setIsSavingSlug(false);
                return;
            }

            // Check if slug exists (excluding current event)
            const { data: existing } = await supabase
                .from("events")
                .select("id")
                .eq("slug", normalized)
                .neq("id", eventId)
                .maybeSingle();

            if (existing) {
                // Suggest alternative
                const alternative = await generateUniqueSlug(normalized, supabase);
                setSlugError(`"${normalized}" já está em uso. Sugestão: ${alternative}`);
                setCustomSlug(alternative || normalized);
                setIsSavingSlug(false);
                return;
            }

            // Save the new slug
            const { error } = await supabase
                .from("events")
                .update({ slug: normalized })
                .eq("id", eventId);

            if (error) throw error;

            showToast(`Link atualizado para /${normalized}`, "success");
            // Update local state would need context refresh
            window.location.reload();
        } catch (e) {
            console.error("Error saving slug:", e);
            showToast("Erro ao salvar link", "error");
        }

        setIsSavingSlug(false);
    };

    // Get template component for preview
    const TemplateComponent = getTemplate(templateId);

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
                <p className="text-[#6B7A6C] mb-4">
                    Você precisa criar um evento primeiro.
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
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#DCD3C5] bg-white">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Editor do Convite
                    </h1>
                    {status === "published" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Publicado
                        </span>
                    )}
                    {hasChanges && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Alterações não salvas
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Open Invite Link */}
                    {status === "published" && eventSlug && (
                        <Link
                            href={`/${eventSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#6B7A6C] hover:text-[#2A3B2E] hover:bg-[#F7F5F0] rounded-lg transition-colors"
                        >
                            <ExternalLink size={16} />
                            Abrir Convite
                        </Link>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A3B2E] bg-[#F7F5F0] hover:bg-[#E5E0D6] rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Salvar
                    </button>

                    {/* Publish Button */}
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#C19B58] hover:bg-[#b08d4b] rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-[#C19B58]/20"
                    >
                        {isPublishing ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : status === "published" ? (
                            <Check size={16} />
                        ) : (
                            <Globe size={16} />
                        )}
                        {status === "published" ? "Atualizar" : "Publicar"}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor Form */}
                <div className="w-[400px] xl:w-[450px] flex-shrink-0 overflow-y-auto p-4 space-y-4 bg-[#F7F5F0] border-r border-[#DCD3C5]">
                    {/* Couple / Person Section */}
                    <Section
                        title={eventType === "graduation" ? "Formando" : "Casal"}
                        icon={<Users size={18} />}
                    >
                        <InputField
                            label={eventType === "graduation" ? "Nome do Formando(a)" : "Nome da Noiva"}
                            value={content.couple.brideName}
                            onChange={(v) => updateContent("couple", "brideName", v)}
                            placeholder={eventType === "graduation" ? "Maria Silva" : "Maria"}
                        />
                        <InputField
                            label={eventType === "graduation" ? "Curso / Instituição" : "Nome do Noivo"}
                            value={content.couple.groomName}
                            onChange={(v) => updateContent("couple", "groomName", v)}
                            placeholder={eventType === "graduation" ? "Direito - USP" : "João"}
                        />

                        {/* Update Slug Button */}
                        {eventSlug && isTemporarySlug(eventSlug) && content.couple.brideName && content.couple.groomName && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-700 mb-2">
                                    Seu link atual é <code className="bg-amber-100 px-1 rounded">/{eventSlug}</code>.
                                    Atualize para um link personalizado!
                                </p>
                                <button
                                    onClick={async () => {
                                        setIsUpdatingSlug(true);
                                        const newSlug = await updateSlug(content.couple.brideName, content.couple.groomName);
                                        if (newSlug) {
                                            showToast(`Link atualizado para /${newSlug}`, "success");
                                        } else {
                                            showToast("Erro ao atualizar link", "error");
                                        }
                                        setIsUpdatingSlug(false);
                                    }}
                                    disabled={isUpdatingSlug}
                                    className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isUpdatingSlug ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <ExternalLink size={14} />
                                    )}
                                    Atualizar Link Automaticamente
                                </button>
                            </div>
                        )}
                    </Section>

                    {/* Event Section */}
                    <Section
                        title={eventType === "graduation" ? "Datas" : "Evento"}
                        icon={<Calendar size={18} />}
                    >
                        <InputField
                            label={eventType === "graduation" ? "Data da Formatura" : "Data do Casamento"}
                            value={content.event.weddingDate}
                            onChange={(v) => updateContent("event", "weddingDate", v)}
                            type="date"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label={eventType === "graduation" ? "Horário Colação" : "Horário Cerimônia"}
                                value={content.event.ceremonyTime}
                                onChange={(v) => updateContent("event", "ceremonyTime", v)}
                                type="time"
                            />
                            <InputField
                                label={eventType === "graduation" ? "Horário Baile" : "Horário Festa"}
                                value={content.event.partyTime}
                                onChange={(v) => updateContent("event", "partyTime", v)}
                                type="time"
                            />
                        </div>
                    </Section>

                    {/* Locations Section */}
                    <Section title="Locais" icon={<MapPin size={18} />}>
                        <InputField
                            label={eventType === "graduation" ? "Local da Colação" : "Local da Cerimônia"}
                            value={content.locations.ceremonyLocation}
                            onChange={(v) => updateContent("locations", "ceremonyLocation", v)}
                            placeholder={eventType === "graduation" ? "Auditório Principal" : "Igreja São José"}
                        />
                        <InputField
                            label={eventType === "graduation" ? "Endereço da Colação" : "Endereço da Cerimônia"}
                            value={content.locations.ceremonyAddress || ""}
                            onChange={(v) => updateContent("locations", "ceremonyAddress", v)}
                            placeholder="Rua das Flores, 123"
                        />
                        <InputField
                            label={eventType === "graduation" ? "Local do Baile" : "Local da Festa"}
                            value={content.locations.partyLocation}
                            onChange={(v) => updateContent("locations", "partyLocation", v)}
                            placeholder={eventType === "graduation" ? "Salão Nobre" : "Espaço Jardim"}
                        />
                        <InputField
                            label={eventType === "graduation" ? "Endereço do Baile" : "Endereço da Festa"}
                            value={content.locations.partyAddress || ""}
                            onChange={(v) => updateContent("locations", "partyAddress", v)}
                            placeholder="Av. Principal, 456"
                        />
                    </Section>

                    {/* Messages Section */}
                    <Section title="Mensagens" icon={<MessageSquare size={18} />}>
                        <InputField
                            label="Texto de Boas-vindas"
                            value={content.messages.welcomeText}
                            onChange={(v) => updateContent("messages", "welcomeText", v)}
                            type="textarea"
                            placeholder="Com alegria convidamos você..."
                        />
                        <InputField
                            label="Nossa História"
                            value={content.messages.storyText}
                            onChange={(v) => updateContent("messages", "storyText", v)}
                            type="textarea"
                            placeholder="Nossa história de amor começou..."
                        />
                        <InputField
                            label="Mensagem de Encerramento"
                            value={content.messages.closingText || ""}
                            onChange={(v) => updateContent("messages", "closingText", v)}
                            placeholder="Com amor, Noiva & Noivo"
                        />
                    </Section>

                    {/* Theme Section */}
                    <Section title="Cores" icon={<Palette size={18} />} defaultOpen={false}>
                        <InputField
                            label="Cor Primária (destaques)"
                            value={content.theme.primaryColor}
                            onChange={(v) => updateContent("theme", "primaryColor", v)}
                            type="color"
                        />
                        <InputField
                            label="Cor Secundária (fundos)"
                            value={content.theme.secondaryColor}
                            onChange={(v) => updateContent("theme", "secondaryColor", v)}
                            type="color"
                        />
                    </Section>

                    {/* Publication & Link Section */}
                    <Section title="Publicação e Link" icon={<Link2 size={18} />} defaultOpen={false}>
                        {/* Current Link */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                                Link Atual
                            </label>
                            {eventSlug && (
                                <div className="flex items-center gap-2 p-3 bg-[#F7F5F0] rounded-lg">
                                    <code className="text-sm text-[#2A3B2E] flex-1 truncate">
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/{eventSlug}
                                    </code>
                                    {status === "published" && (
                                        <Link
                                            href={`/${eventSlug}`}
                                            target="_blank"
                                            className="text-[#C19B58] hover:text-[#A88347]"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Custom Slug Editor */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                                Editar Link
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A6C] text-sm">/</span>
                                    <input
                                        type="text"
                                        value={customSlug || eventSlug || ""}
                                        onChange={(e) => {
                                            setCustomSlug(e.target.value);
                                            setSlugError(null);
                                        }}
                                        placeholder="ana-joao"
                                        className="w-full pl-6 pr-3 py-2.5 rounded-lg border border-[#DCD3C5] bg-white focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E] text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveSlug}
                                    disabled={isSavingSlug || (!customSlug || customSlug === eventSlug)}
                                    className="px-4 py-2 bg-[#2A3B2E] text-white rounded-lg text-sm font-medium hover:bg-[#1a261d] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSavingSlug ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Check size={14} />
                                    )}
                                    Salvar
                                </button>
                            </div>
                            {slugError && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    {slugError}
                                </p>
                            )}
                        </div>

                        {/* Warning */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Alterar o link pode quebrar links já compartilhados. Use com cuidado.
                            </p>
                        </div>

                        {/* Unpublish Button */}
                        {status === "published" && (
                            <button
                                onClick={handleUnpublish}
                                disabled={isUnpublishing}
                                className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isUnpublishing ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <EyeOff size={14} />
                                )}
                                Despublicar (voltar para rascunho)
                            </button>
                        )}
                    </Section>

                    {/* RSVP Section */}
                    <Section title="Confirmação de Presença" icon={<Send size={18} />} defaultOpen={false}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6B7A6C]">Habilitar RSVP</span>
                            <button
                                onClick={() => updateContent("rsvp", "enabled", !content.rsvp.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors ${content.rsvp.enabled ? "bg-[#C19B58]" : "bg-[#DCD3C5]"
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${content.rsvp.enabled ? "translate-x-6" : "translate-x-0.5"
                                    }`} />
                            </button>
                        </div>
                        {content.rsvp.enabled && (
                            <>
                                <InputField
                                    label="Prazo para Confirmação"
                                    value={content.rsvp.deadline || ""}
                                    onChange={(v) => updateContent("rsvp", "deadline", v)}
                                    type="date"
                                />
                                <InputField
                                    label="WhatsApp para RSVP"
                                    value={content.rsvp.whatsappNumber || ""}
                                    onChange={(v) => updateContent("rsvp", "whatsappNumber", v)}
                                    placeholder="5511999999999"
                                />
                            </>
                        )}
                    </Section>

                    {/* Gifts Section */}
                    <Section title="Presentes e PIX" icon={<Gift size={18} />} defaultOpen={false}>
                        {/* Enable Gifts Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6B7A6C]">Habilitar Lista de Presentes</span>
                            <button
                                onClick={() => {
                                    setGiftsEnabled(!giftsEnabled);
                                    setHasChanges(true);
                                }}
                                className={`w-12 h-6 rounded-full transition-colors ${giftsEnabled ? "bg-[#C19B58]" : "bg-[#DCD3C5]"}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${giftsEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                            </button>
                        </div>

                        {giftsEnabled && (
                            <>
                                {/* PIX Configuration */}
                                <div className="p-4 bg-[#F7F5F0] rounded-lg space-y-3">
                                    <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                        Configuração PIX
                                    </p>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Chave PIX *</label>
                                        <input
                                            type="text"
                                            value={pixKey}
                                            onChange={(e) => {
                                                setPixKey(e.target.value);
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="email@exemplo.com ou CPF"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Nome do Titular</label>
                                        <input
                                            type="text"
                                            value={pixName}
                                            onChange={(e) => {
                                                setPixName(e.target.value);
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                </div>

                                {/* Add Gift Form */}
                                <div className="p-4 bg-white border border-[#DCD3C5] rounded-lg space-y-3">
                                    <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                        Adicionar Presente ({gifts.length}/{MAX_GIFTS})
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs text-[#6B7A6C]">Nome *</label>
                                            <input
                                                type="text"
                                                value={newGift.name}
                                                onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                                placeholder="Jogo de panelas"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-[#6B7A6C]">Valor (R$) *</label>
                                            <input
                                                type="number"
                                                value={newGift.amount}
                                                onChange={(e) => setNewGift({ ...newGift, amount: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                                placeholder="250"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Descrição (opcional)</label>
                                        <input
                                            type="text"
                                            value={newGift.description}
                                            onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="Para nossa cozinha"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!newGift.name.trim() || !newGift.amount) {
                                                showToast("Nome e valor são obrigatórios", "error");
                                                return;
                                            }
                                            const amount = parseFloat(newGift.amount);
                                            if (isNaN(amount) || amount <= 0) {
                                                showToast("Valor deve ser maior que zero", "error");
                                                return;
                                            }
                                            if (gifts.length >= MAX_GIFTS) {
                                                showToast(`Limite de ${MAX_GIFTS} presentes atingido`, "error");
                                                return;
                                            }
                                            const gift: GiftItem = {
                                                id: crypto.randomUUID(),
                                                name: newGift.name.trim(),
                                                amount,
                                                description: newGift.description.trim() || undefined,
                                            };
                                            setGifts([...gifts, gift]);
                                            setNewGift({ name: "", amount: "", description: "" });
                                            setHasChanges(true);
                                        }}
                                        disabled={gifts.length >= MAX_GIFTS}
                                        className="w-full py-2 bg-[#C19B58] text-white rounded-lg text-sm font-medium hover:bg-[#A88347] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Adicionar Presente
                                    </button>
                                </div>

                                {/* Gifts List */}
                                {gifts.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                            Lista de Presentes
                                        </p>
                                        {gifts.map((gift, index) => (
                                            <div
                                                key={gift.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#2A3B2E] truncate">{gift.name}</p>
                                                    <p className="text-sm text-[#6B7A6C]">
                                                        R$ {gift.amount.toFixed(2)}
                                                        {gift.description && ` • ${gift.description}`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setNewGift({
                                                                name: gift.name,
                                                                amount: gift.amount.toString(),
                                                                description: gift.description || "",
                                                            });
                                                            setGifts(gifts.filter(g => g.id !== gift.id));
                                                            setHasChanges(true);
                                                        }}
                                                        className="p-1.5 text-[#6B7A6C] hover:bg-gray-200 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setGifts(gifts.filter(g => g.id !== gift.id));
                                                            setHasChanges(true);
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!pixKey && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                        <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700">
                                            Configure a chave PIX para habilitar o checkout de presentes.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </Section>
                </div>

                {/* Right: Live Preview */}
                <div className="flex-1 overflow-hidden bg-gray-100">
                    <div className="h-full overflow-y-auto">
                        <div className="flex items-center justify-center p-2 bg-gray-200 text-xs text-gray-600 gap-2">
                            <Eye size={14} />
                            <span>Preview ao vivo</span>
                        </div>
                        <div className="transform origin-top scale-[0.85] xl:scale-90">
                            <TemplateComponent content={content} isPreview={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
