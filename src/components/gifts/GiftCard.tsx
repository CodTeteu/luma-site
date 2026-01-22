"use client";

import { Gift, useGiftCart } from "./GiftCartContext";
import { Plus, Check, Minus } from "lucide-react";

interface GiftCardProps {
    gift: Gift;
}

export default function GiftCard({ gift }: GiftCardProps) {
    const { addToCart, isInCart, getQty, updateQty, removeFromCart } = useGiftCart();
    const inCart = isInCart(gift.id);
    const qty = getQty(gift.id);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image placeholder */}
            {gift.imageUrl ? (
                <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${gift.imageUrl})` }}
                />
            ) : (
                <div className="h-40 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {gift.name}
                </h3>

                {gift.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {gift.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-600">
                        {formatCurrency(gift.amount)}
                    </span>

                    {inCart ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQty(gift.id, qty - 1)}
                                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <button
                                onClick={() => updateQty(gift.id, qty + 1)}
                                disabled={qty >= 10}
                                className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors disabled:opacity-50"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(gift)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                        >
                            <Plus size={16} />
                            Adicionar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
