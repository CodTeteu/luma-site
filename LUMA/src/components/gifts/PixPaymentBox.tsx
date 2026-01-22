"use client";

import { useState } from "react";
import { Copy, Check, QrCode, X } from "lucide-react";

interface PixPaymentBoxProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    pixKey: string;
    pixName?: string | null;
    referenceCode: string;
}

export default function PixPaymentBox({
    isOpen,
    onClose,
    totalAmount,
    pixKey,
    pixName,
    referenceCode,
}: PixPaymentBoxProps) {
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const pixMessage = `Presente de casamento - REF: ${referenceCode}`;

    const copyToClipboard = async (text: string, type: "key" | "message") => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === "key") {
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
            } else {
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
            }
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            if (type === "key") {
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
            } else {
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
            }
        }
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
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <QrCode size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-1">Pagamento via Pix</h2>
                        <p className="text-green-100">Pedido #{referenceCode}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {/* Total */}
                        <div className="text-center py-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Valor a transferir</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(totalAmount)}
                            </p>
                        </div>

                        {/* Pix Key */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Chave Pix
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-800 truncate">
                                    {pixKey}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pixKey, "key")}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                                >
                                    {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedKey ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            {pixName && (
                                <p className="text-sm text-gray-500">
                                    Titular: {pixName}
                                </p>
                            )}
                        </div>

                        {/* Message/Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Mensagem para descrição do Pix
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-800">
                                    {pixMessage}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pixMessage, "message")}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                                >
                                    {copiedMessage ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedMessage ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-medium text-amber-800 mb-2">
                                Como pagar:
                            </h4>
                            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                                <li>Abra o app do seu banco</li>
                                <li>Escolha pagar via Pix</li>
                                <li>Cole a chave Pix acima</li>
                                <li>Informe o valor: {formatCurrency(totalAmount)}</li>
                                <li>Cole a mensagem na descrição</li>
                                <li>Confirme o pagamento</li>
                            </ol>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
