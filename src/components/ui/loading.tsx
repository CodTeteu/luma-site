/**
 * Loading Components
 * Spinner, Skeleton, and FullPage loading states
 */

import { cn } from "@/lib/utils";

// ============================================
// Spinner
// ============================================

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-10 h-10 border-3",
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full border-[#C19B58] border-t-transparent",
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Carregando"
        >
            <span className="sr-only">Carregando...</span>
        </div>
    );
}

// ============================================
// Skeleton
// ============================================

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = "rectangular",
    width,
    height,
}: SkeletonProps) {
    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    return (
        <div
            className={cn(
                "skeleton",
                variantClasses[variant],
                className
            )}
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}

// ============================================
// Skeleton Text Lines
// ============================================

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className={cn(
                        i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    );
}

// ============================================
// Skeleton Card
// ============================================

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("p-6 bg-white rounded-2xl shadow-sm", className)}>
            <Skeleton className="w-16 h-16 mb-4" variant="circular" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <SkeletonText lines={2} />
        </div>
    );
}

// ============================================
// Full Page Loading
// ============================================

interface FullPageLoadingProps {
    message?: string;
}

export function FullPageLoading({ message = "Carregando..." }: FullPageLoadingProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F5F0] p-6">
            <div className="text-center">
                {/* Logo/Brand */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#C19B58] to-[#A88347] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-white font-bold text-2xl font-[family-name:var(--font-heading)]">
                            L
                        </span>
                    </div>
                </div>

                {/* Spinner */}
                <Spinner size="lg" className="mx-auto mb-4" />

                {/* Message */}
                <p className="text-[#6B7A6C] animate-pulse-subtle">
                    {message}
                </p>
            </div>
        </div>
    );
}

// ============================================
// Inline Loading
// ============================================

interface InlineLoadingProps {
    message?: string;
    className?: string;
}

export function InlineLoading({
    message = "Carregando...",
    className
}: InlineLoadingProps) {
    return (
        <div className={cn("flex items-center justify-center gap-3 p-4", className)}>
            <Spinner size="sm" />
            <span className="text-[#6B7A6C] text-sm">{message}</span>
        </div>
    );
}

// ============================================
// Button Loading State
// ============================================

export function ButtonSpinner() {
    return (
        <Spinner size="sm" className="border-current border-t-transparent" />
    );
}
