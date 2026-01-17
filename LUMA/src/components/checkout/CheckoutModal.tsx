"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "@/contexts/CartContext";

interface CheckoutModalProps {
    whatsappNumber?: string;
    coupleName?: string;
}

export default function CheckoutModal({ whatsappNumber, coupleName = "os noivos" }: CheckoutModalProps) {
    const { items, removeFromCart, updateQuantity, clearCart, total, isOpen, setIsOpen } = useCart();

    const generateWhatsAppLink = () => {
        const itemsList = items
            .map((item) => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toLocaleString("pt-BR")}`)
            .join("\n");

        const message = `🎁 *Lista de Presentes - Casamento*\n\n${itemsList}\n\n💰 *Total: R$ ${total.toLocaleString("pt-BR")}*\n\nOlá! Gostaria de presentear ${coupleName} com esses itens. Vou enviar o comprovante PIX em seguida! 💍`;

        const encodedMessage = encodeURIComponent(message);
        const phone = whatsappNumber?.replace(/\D/g, "") || "";
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    };

    const handleCheckout = () => {
        // Fire fireworks celebration!
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#C19B58', '#5c6b5d', '#2A3B2E']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#C19B58', '#5c6b5d', '#2A3B2E']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        const link = generateWhatsAppLink();
        window.open(link, "_blank");
        clearCart();
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F7F5F0] shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[#DCD3C5]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#2A3B2E] flex items-center justify-center">
                                    <ShoppingBag size={18} className="text-[#C19B58]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                        Sua Sacola
                                    </h2>
                                    <p className="text-xs text-[#6B7A6C]">{items.length} {items.length === 1 ? "item" : "itens"}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-[#E5E0D6] transition-colors"
                            >
                                <X size={20} className="text-[#6B7A6C]" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Heart size={48} className="text-[#DCD3C5] mb-4" />
                                    <p className="text-[#6B7A6C]">Sua sacola está vazia</p>
                                    <p className="text-xs text-[#9CA38B] mt-1">Adicione presentes para {coupleName}</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex gap-4 p-4 bg-white rounded-xl border border-[#E5E0D6]"
                                    >
                                        {/* Item Image Placeholder */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#2A3B2E] to-[#3E4A3F] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🎁</span>
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-[#2A3B2E] text-sm truncate">{item.name}</h3>
                                            <p className="text-[#C19B58] font-medium mt-1">
                                                R$ {item.price.toLocaleString("pt-BR")}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-full bg-[#F7F5F0] border border-[#DCD3C5] flex items-center justify-center hover:bg-[#E5E0D6] transition-colors"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-sm font-medium text-[#2A3B2E] w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-full bg-[#F7F5F0] border border-[#DCD3C5] flex items-center justify-center hover:bg-[#E5E0D6] transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[#9CA38B] hover:text-red-500 transition-colors self-start"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {items.length > 0 && (
                            <div className="p-5 border-t border-[#DCD3C5] bg-white/50 space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#6B7A6C]">Total</span>
                                    <span className="text-2xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                        R$ {total.toLocaleString("pt-BR")}
                                    </span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={!whatsappNumber}
                                    className="w-full py-4 bg-[#25D366] hover:bg-[#20BD59] text-white font-medium rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle size={20} />
                                    Finalizar no WhatsApp
                                </button>

                                <p className="text-[10px] text-[#6B7A6C] text-center">
                                    Você será redirecionado para enviar o comprovante PIX
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
