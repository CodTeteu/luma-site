"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CartProvider } from "@/contexts/CartContext";
import { BriefingProvider } from "@/contexts/BriefingContext";
import { ToastContainer } from "@/components/ui/Toast";

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Client-side providers wrapper
 * Wraps the app with Error Boundary and context providers
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            <CartProvider>
                <BriefingProvider>
                    {children}
                    <ToastContainer />
                </BriefingProvider>
            </CartProvider>
        </ErrorBoundary>
    );
}

