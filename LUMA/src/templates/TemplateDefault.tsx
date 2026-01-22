"use client";

import { useState } from "react";
import { TemplateProps } from "./types";
import { Calendar, MapPin, Clock, Heart, Send, Loader2, CheckCircle, XCircle } from "lucide-react";
import { GiftSection } from "@/components/gifts";

/**
 * Default Template - Base wedding invitation template
 * Elegant and classic design that works as fallback for all events
 */
export default function TemplateDefault({ content, isPreview = false, slug }: TemplateProps) {
    const { couple, event, locations, messages, theme, rsvp } = content;

    // Extract gifts and payment info from content (may be extended)
    const gifts = (content as any).gifts || [];
    const payment = (content as any).payment || {};

    // RSVP Form State
    const [showRSVPForm, setShowRSVPForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        is_attending: true,
        guests: 1,
        children: 0,
        message: "",
        website: "", // Honeypot
    });

    // Format date for display
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Data a definir";
        try {
            return new Date(dateStr).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    // Format time for display
    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        return timeStr;
    };

    const coupleNames = [couple.brideName, couple.groomName]
        .filter(Boolean)
        .join(" & ") || "Noiva & Noivo";

    // Handle RSVP submission
    const handleSubmitRSVP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!slug || isPreview) return;

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    name: formData.name,
                    email: formData.email || undefined,
                    phone: formData.phone || undefined,
                    is_attending: formData.is_attending,
                    guests: formData.guests,
                    children: formData.children,
                    message: formData.message || undefined,
                    website: formData.website, // Honeypot
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitResult({ success: true, message: data.message });
                setShowRSVPForm(false);
            } else {
                setSubmitResult({ success: false, message: data.error || "Erro ao enviar confirmação" });
            }
        } catch {
            setSubmitResult({ success: false, message: "Erro de conexão. Tente novamente." });
        }

        setIsSubmitting(false);
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "#F7F5F0",
                fontFamily: theme.fontFamily || "var(--font-cormorant), serif",
            }}
        >
            {/* Hero Section */}
            <section
                className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden"
                style={{ backgroundColor: theme.secondaryColor }}
            >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 text-white/20">
                        <Heart size={120} strokeWidth={1} />
                    </div>
                    <div className="absolute bottom-10 right-10 text-white/20">
                        <Heart size={80} strokeWidth={1} />
                    </div>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <p className="text-sm uppercase tracking-[0.3em] mb-6" style={{ color: theme.primaryColor }}>
                        Celebre conosco
                    </p>

                    <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight text-white">
                        {coupleNames}
                    </h1>

                    <div
                        className="w-20 h-[1px] mx-auto mb-8"
                        style={{ backgroundColor: theme.primaryColor }}
                    />

                    <p className="text-xl text-white/80 mb-8">
                        {messages.welcomeText || "Convidam você para celebrar o seu casamento"}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-white/90">
                        <Calendar size={20} style={{ color: theme.primaryColor }} />
                        <span className="text-lg">{formatDate(event.weddingDate)}</span>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            {messages.storyText && (
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2
                            className="text-3xl mb-8 font-light"
                            style={{ color: theme.secondaryColor }}
                        >
                            Nossa História
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-700">
                            {messages.storyText}
                        </p>
                    </div>
                </section>
            )}

            {/* Event Details */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2
                        className="text-3xl text-center mb-16 font-light"
                        style={{ color: theme.secondaryColor }}
                    >
                        Detalhes do Evento
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Ceremony */}
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ backgroundColor: `${theme.primaryColor}20` }}
                            >
                                <MapPin size={28} style={{ color: theme.primaryColor }} />
                            </div>
                            <h3 className="text-xl font-medium mb-2" style={{ color: theme.secondaryColor }}>
                                Cerimônia
                            </h3>
                            <p className="text-gray-600 mb-2">{locations.ceremonyLocation || "Local a definir"}</p>
                            {locations.ceremonyAddress && (
                                <p className="text-sm text-gray-500">{locations.ceremonyAddress}</p>
                            )}
                            {event.ceremonyTime && (
                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-700">
                                    <Clock size={16} style={{ color: theme.primaryColor }} />
                                    <span>{formatTime(event.ceremonyTime)}</span>
                                </div>
                            )}
                        </div>

                        {/* Party */}
                        <div className="text-center">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ backgroundColor: `${theme.primaryColor}20` }}
                            >
                                <Heart size={28} style={{ color: theme.primaryColor }} />
                            </div>
                            <h3 className="text-xl font-medium mb-2" style={{ color: theme.secondaryColor }}>
                                Recepção
                            </h3>
                            <p className="text-gray-600 mb-2">{locations.partyLocation || "Local a definir"}</p>
                            {locations.partyAddress && (
                                <p className="text-sm text-gray-500">{locations.partyAddress}</p>
                            )}
                            {event.partyTime && (
                                <div className="flex items-center justify-center gap-2 mt-4 text-gray-700">
                                    <Clock size={16} style={{ color: theme.primaryColor }} />
                                    <span>{formatTime(event.partyTime)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Gift Section */}
            {!isPreview && slug && gifts.length > 0 && (
                <GiftSection
                    slug={slug}
                    gifts={gifts}
                    pixKey={payment.pixKey}
                    pixName={payment.pixName}
                />
            )}

            {/* RSVP Section */}
            {rsvp.enabled && (
                <section
                    className="py-20 px-6"
                    style={{ backgroundColor: theme.secondaryColor }}
                    id="rsvp"
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl mb-6 font-light text-white">
                            Confirme sua Presença
                        </h2>
                        <p className="text-white/80 mb-8">
                            Ficaremos muito felizes em contar com você neste dia especial.
                            {rsvp.deadline && (
                                <span className="block mt-2 text-sm">
                                    Por favor, confirme até {formatDate(rsvp.deadline)}
                                </span>
                            )}
                        </p>

                        {/* Success/Error Message */}
                        {submitResult && (
                            <div className={`mb-8 p-4 rounded-lg inline-flex items-center gap-3 ${submitResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                {submitResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                {submitResult.message}
                            </div>
                        )}

                        {/* RSVP Form */}
                        {!submitResult?.success && !isPreview && slug && (
                            <>
                                {!showRSVPForm ? (
                                    <button
                                        onClick={() => setShowRSVPForm(true)}
                                        className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: theme.primaryColor,
                                            color: "#fff",
                                        }}
                                    >
                                        <Send size={20} />
                                        Confirmar Presença
                                    </button>
                                ) : (
                                    <form
                                        onSubmit={handleSubmitRSVP}
                                        className="bg-white rounded-xl p-6 md:p-8 text-left max-w-md mx-auto"
                                    >
                                        {/* Honeypot - Hidden field */}
                                        <input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            autoComplete="off"
                                            tabIndex={-1}
                                            style={{
                                                position: "absolute",
                                                left: "-9999px",
                                                opacity: 0,
                                                height: 0,
                                                width: 0,
                                            }}
                                            aria-hidden="true"
                                        />

                                        {/* Attendance */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Você poderá comparecer?
                                            </label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="attending"
                                                        checked={formData.is_attending}
                                                        onChange={() => setFormData({ ...formData, is_attending: true })}
                                                        className="w-4 h-4"
                                                        style={{ accentColor: theme.primaryColor }}
                                                    />
                                                    <span className="text-gray-700">Sim, estarei presente</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="attending"
                                                        checked={!formData.is_attending}
                                                        onChange={() => setFormData({ ...formData, is_attending: false })}
                                                        className="w-4 h-4"
                                                        style={{ accentColor: theme.primaryColor }}
                                                    />
                                                    <span className="text-gray-700">Não poderei ir</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Seu nome *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                minLength={2}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                                placeholder="Nome completo"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                                placeholder="seu@email.com"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Telefone
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>

                                        {/* Guests & Children - Only show if attending */}
                                        {formData.is_attending && (
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Adultos
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        value={formData.guests}
                                                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Crianças
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={10}
                                                        value={formData.children}
                                                        onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Message */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mensagem para os noivos
                                            </label>
                                            <textarea
                                                rows={3}
                                                maxLength={1000}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 resize-none"
                                                placeholder="Deixe uma mensagem carinhosa (opcional)"
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowRSVPForm(false)}
                                                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                                                style={{ backgroundColor: theme.primaryColor }}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={18} />
                                                        Enviar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* Preview mode placeholder */}
                        {isPreview && (
                            <div
                                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-lg opacity-75"
                                style={{
                                    backgroundColor: theme.primaryColor,
                                    color: "#fff",
                                }}
                            >
                                <Send size={20} />
                                Confirmar Presença
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 px-6 text-center">
                <p className="text-gray-500 text-sm">
                    {messages.closingText || `Com amor, ${coupleNames}`}
                </p>
                <p className="text-xs text-gray-400 mt-4">
                    Feito com ❤️ por LUMA
                </p>
            </footer>
        </div>
    );
}
