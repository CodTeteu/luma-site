"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// ============================================
// Types
// ============================================

export interface Gift {
    id: string;
    name: string;
    amount: number;
    description?: string;
    imageUrl?: string;
}

export interface CartItem {
    gift: Gift;
    qty: number;
}

interface GiftCartContextType {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    addToCart: (gift: Gift, qty?: number) => void;
    removeFromCart: (giftId: string) => void;
    updateQty: (giftId: string, qty: number) => void;
    clearCart: () => void;
    isInCart: (giftId: string) => boolean;
    getQty: (giftId: string) => number;
}

// ============================================
// Context
// ============================================

const GiftCartContext = createContext<GiftCartContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface GiftCartProviderProps {
    children: ReactNode;
    slug: string;
}

export function GiftCartProvider({ children, slug }: GiftCartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const storageKey = `luma_cart:${slug}`;

    // Load from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setItems(parsed);
                }
            }
        } catch {
            // Ignore parse errors
        }
    }, [storageKey]);

    // Save to localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(storageKey, JSON.stringify(items));
        } catch {
            // Ignore storage errors
        }
    }, [items, storageKey]);

    // Computed values
    const totalAmount = items.reduce((sum, item) => sum + item.gift.amount * item.qty, 0);
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

    // Actions
    const addToCart = useCallback((gift: Gift, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.gift.id === gift.id);
            if (existing) {
                return prev.map(item =>
                    item.gift.id === gift.id
                        ? { ...item, qty: Math.min(item.qty + qty, 10) }
                        : item
                );
            }
            return [...prev, { gift, qty: Math.min(qty, 10) }];
        });
    }, []);

    const removeFromCart = useCallback((giftId: string) => {
        setItems(prev => prev.filter(item => item.gift.id !== giftId));
    }, []);

    const updateQty = useCallback((giftId: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(giftId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.gift.id === giftId
                    ? { ...item, qty: Math.min(qty, 10) }
                    : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    const isInCart = useCallback((giftId: string) => {
        return items.some(item => item.gift.id === giftId);
    }, [items]);

    const getQty = useCallback((giftId: string) => {
        const item = items.find(i => i.gift.id === giftId);
        return item?.qty || 0;
    }, [items]);

    return (
        <GiftCartContext.Provider
            value={{
                items,
                totalAmount,
                totalItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                isInCart,
                getQty,
            }}
        >
            {children}
        </GiftCartContext.Provider>
    );
}

export function useGiftCart() {
    const context = useContext(GiftCartContext);
    if (context === undefined) {
        throw new Error("useGiftCart must be used within a GiftCartProvider");
    }
    return context;
}
