"use client";

import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Client-side providers wrapper
 * Wraps the app with Error Boundary and any future context providers
 */
export function Providers({ children }: ProvidersProps) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
}
