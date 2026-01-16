"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
    success: <Check size={16} />,
    error: <X size={16} />,
    warning: <AlertCircle size={16} />,
    info: <Info size={16} />,
};

const colors: Record<ToastType, string> = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-[#C19B58]",
};

function ToastItem({ toast, onDismiss }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl border border-[#DCD3C5] p-4 flex items-center gap-3 min-w-[280px] max-w-[400px]"
        >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", colors[toast.type])}>
                {icons[toast.type]}
            </div>
            <p className="text-sm text-[#2A3B2E] font-medium flex-1">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#6B7A6C] hover:text-[#2A3B2E] transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

// Global toast state
let toastListener: ((toast: ToastData) => void) | null = null;

/**
 * Show a toast notification
 */
export function showToast(message: string, type: ToastType = "success") {
    const toast: ToastData = {
        id: `toast_${Date.now()}`,
        message,
        type,
    };
    toastListener?.(toast);
}

/**
 * Toast container - place once in layout
 */
export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        toastListener = (toast) => {
            setToasts((prev) => [...prev, toast]);
        };

        return () => {
            toastListener = null;
        };
    }, []);

    const handleDismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}
