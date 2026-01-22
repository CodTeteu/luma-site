"use client";

import { useState } from "react";
import { GiftCartProvider, useGiftCart, Gift } from "./GiftCartContext";
import GiftList from "./GiftList";
import CartDrawer, { CartButton } from "./CartDrawer";
import GiftCheckoutModal from "./GiftCheckoutModal";
import PixPaymentBox from "./PixPaymentBox";

interface GiftSectionProps {
    slug: string;
    gifts: Gift[];
    pixKey?: string;
    pixName?: string;
}

function GiftSectionInner({ slug, gifts, pixKey, pixName }: GiftSectionProps) {
    const { items, totalAmount, clearCart } = useGiftCart();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Payment result state
    const [paymentInfo, setPaymentInfo] = useState<{
        referenceCode: string;
        totalAmount: number;
        pixKey: string;
        pixName?: string | null;
    } | null>(null);

    const handleOpenCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handleCheckout = async (data: {
        guestName?: string;
        guestEmail?: string;
        message?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/gifts/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug,
                    cart: items.map(item => ({
                        giftId: item.gift.id,
                        qty: item.qty,
                    })),
                    guestName: data.guestName,
                    guestEmail: data.guestEmail,
                    message: data.message,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.error || "Erro ao processar pedido");
            }

            // Success - show payment box
            setPaymentInfo({
                referenceCode: result.referenceCode,
                totalAmount: result.totalAmount,
                pixKey: result.pixKey,
                pixName: result.pixName,
            });

            // Clear cart and close checkout modal
            clearCart();
            setIsCheckoutOpen(false);
            setIsPaymentOpen(true);

        } catch (e) {
            const message = e instanceof Error ? e.message : "Erro ao processar pedido";
            setError(message);
            console.error("[GiftSection] Checkout error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePayment = () => {
        setIsPaymentOpen(false);
        setPaymentInfo(null);
    };

    return (
        <>
            {/* Gift list section */}
            <GiftList gifts={gifts} />

            {/* Floating cart button */}
            <CartButton onClick={() => setIsCartOpen(true)} />

            {/* Cart drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleOpenCheckout}
            />

            {/* Checkout modal */}
            <GiftCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleCheckout}
                isLoading={isLoading}
                totalAmount={totalAmount}
            />

            {/* Error toast */}
            {error && (
                <div className="fixed bottom-6 left-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-3 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Payment box */}
            {paymentInfo && (
                <PixPaymentBox
                    isOpen={isPaymentOpen}
                    onClose={handleClosePayment}
                    totalAmount={paymentInfo.totalAmount}
                    pixKey={paymentInfo.pixKey}
                    pixName={paymentInfo.pixName}
                    referenceCode={paymentInfo.referenceCode}
                />
            )}
        </>
    );
}

// Wrapper with provider
export default function GiftSection({ slug, gifts, pixKey, pixName }: GiftSectionProps) {
    // Don't render if no gifts
    if (!gifts || gifts.length === 0) {
        return null;
    }

    return (
        <GiftCartProvider slug={slug}>
            <GiftSectionInner
                slug={slug}
                gifts={gifts}
                pixKey={pixKey}
                pixName={pixName}
            />
        </GiftCartProvider>
    );
}
