/**
 * Report Button Component
 * Allows visitors to report inappropriate content on public invites
 */

"use client";

import { useState } from "react";
import { Flag, X, Loader2 } from "lucide-react";

interface ReportButtonProps {
    slug: string;
    className?: string;
}

const REPORT_REASONS = [
    { id: "inappropriate_content", label: "Conteúdo inapropriado" },
    { id: "spam", label: "Spam ou propaganda" },
    { id: "fake_event", label: "Evento falso" },
    { id: "harassment", label: "Assédio ou bullying" },
    { id: "copyright", label: "Violação de direitos autorais" },
    { id: "other", label: "Outro" },
];

export function ReportButton({ slug, className = "" }: ReportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    reason,
                    message,
                    email,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Erro ao enviar denúncia");
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao enviar denúncia");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
                <div className="bg-white rounded-xl p-4 shadow-lg max-w-xs">
                    <p className="text-[#2A3B2E] font-medium">Obrigado!</p>
                    <p className="text-sm text-[#6B7A6C]">
                        Sua denúncia foi recebida e será analisada.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Report Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-4 right-4 z-40 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all ${className}`}
                title="Reportar conteúdo"
            >
                <Flag className="w-4 h-4 text-[#6B7A6C]" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-medium text-[#2A3B2E]">
                                Reportar conteúdo
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-[#F7F5F0] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#2A3B2E] mb-2">
                                    Motivo *
                                </label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-3 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/50"
                                    required
                                >
                                    <option value="">Selecione um motivo</option>
                                    {REPORT_REASONS.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#2A3B2E] mb-2">
                                    Detalhes (opcional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/50 h-24 resize-none"
                                    placeholder="Descreva o problema..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#2A3B2E] mb-2">
                                    Seu email (opcional)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/50"
                                    placeholder="Para recebermos feedback"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-3 border border-[#E5E1D8] rounded-lg hover:bg-[#F7F5F0] transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !reason}
                                    className="flex-1 px-4 py-3 bg-[#C19B58] text-white rounded-lg hover:bg-[#A88347] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar denúncia"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
