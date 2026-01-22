"use client";

import { useState } from "react";
import { useGiftCart } from "./GiftCartContext";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
    const { items, totalAmount, totalItems, updateQty, removeFromCart } = useGiftCart();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <h2 className="text-lg font-semibold">Carrinho</h2>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-sm rounded-full">
                            {totalItems}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingCart size={48} className="mb-4 opacity-30" />
                            <p>Seu carrinho está vazio</p>
                            <button
                                onClick={onClose}
                                className="mt-4 text-amber-600 hover:underline"
                            >
                                Ver presentes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.gift.id}
                                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                    {/* Gift icon */}
                                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🎁</span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {item.gift.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(item.gift.amount)} cada
                                        </p>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQty(item.gift.id, item.qty - 1)}
                                                className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.gift.id, item.qty + 1)}
                                                disabled={item.qty >= 10}
                                                className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.gift.id)}
                                                className="p-1 ml-auto text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="text-right">
                                        <span className="font-semibold text-amber-600">
                                            {formatCurrency(item.gift.amount * item.qty)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                        >
                            Continuar para pagamento
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// Floating cart button
interface CartButtonProps {
    onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
    const { totalItems, totalAmount } = useGiftCart();

    if (totalItems === 0) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 bg-amber-500 text-white rounded-full shadow-xl hover:bg-amber-600 transition-all hover:scale-105 z-30"
        >
            <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-amber-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            </div>
            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
        </button>
    );
}
