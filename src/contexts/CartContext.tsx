"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { GiftItem } from "@/types";

interface CartItem extends GiftItem {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: GiftItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "luma-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from sessionStorage on mount
    useEffect(() => {
        const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch {
                sessionStorage.removeItem(CART_STORAGE_KEY);
            }
        }
        setIsHydrated(true);
    }, []);

    const addToCart = useCallback((item: GiftItem) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.id === item.id);
            let updated;
            if (existingIndex >= 0) {
                updated = [...prev];
                updated[existingIndex].quantity += 1;
            } else {
                updated = [...prev, { ...item, quantity: 1 }];
            }
            if (typeof window !== "undefined") {
                sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setItems((prev) => {
            const updated = prev.filter((item) => item.id !== itemId);
            if (typeof window !== "undefined") {
                sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setItems((prev) => {
            const updated = prev.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            );
            if (typeof window !== "undefined") {
                sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
        });
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        if (typeof window !== "undefined") {
            sessionStorage.removeItem(CART_STORAGE_KEY);
        }
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
