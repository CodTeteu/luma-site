"use client";

import { useState } from "react";
import { X, Loader2, User, Mail, MessageSquare } from "lucide-react";

interface GiftCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { guestName?: string; guestEmail?: string; message?: string }) => void;
    isLoading: boolean;
    totalAmount: number;
}

export default function GiftCheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    totalAmount,
}: GiftCheckoutModalProps) {
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [message, setMessage] = useState("");

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            guestName: guestName.trim() || undefined,
            guestEmail: guestEmail.trim() || undefined,
            message: message.trim() || undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-amber-50">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Finalizar Presente
                            </h2>
                            <p className="text-sm text-gray-600">
                                Total: <span className="font-semibold text-amber-600">{formatCurrency(totalAmount)}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <p className="text-sm text-gray-500">
                            Deixe uma mensagem para os noivos (opcional)
                        </p>

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <User size={14} />
                                Seu nome
                            </label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Maria Silva"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Mail size={14} />
                                Seu email
                            </label>
                            <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="maria@email.com"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <MessageSquare size={14} />
                                Mensagem para os noivos
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Desejo muitas felicidades..."
                                disabled={isLoading}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Honeypot - hidden from users */}
                        <input
                            type="text"
                            name="website"
                            style={{ display: "none" }}
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                "Continuar para Pix"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
