"use client";

import React, { Component, ReactNode } from "react";
import { logger } from "@/services/logger";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        logger.error("React Error Boundary caught an error", {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-[#F7F5F0] rounded-2xl border border-[#DCD3C5]">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#9B2C2C]/10 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-[#9B2C2C]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-[#2A3B2E] mb-3 font-[family-name:var(--font-heading)]">
                            Algo deu errado
                        </h2>
                        <p className="text-[#6B7A6C] mb-6">
                            Ocorreu um erro inesperado. Por favor, tente recarregar a página.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium hover:bg-[#1f2d22] transition-colors"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Section Error Boundary
 * A lighter error boundary for individual sections that doesn't break the whole page.
 */
export class SectionErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        logger.error("Section Error Boundary caught an error", {
            error: error.message,
            componentStack: errorInfo.componentStack,
        });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="py-12 px-6 text-center">
                    <p className="text-[#6B7A6C] text-sm">
                        Esta seção não pôde ser carregada.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
