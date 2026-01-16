/**
 * Error Monitoring Service
 * Centralized error tracking with Sentry-ready integration.
 * ============================================================================
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Set NEXT_PUBLIC_SENTRY_DSN in your environment variables
 */

const isProduction = process.env.NODE_ENV === "production";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

interface ErrorContext {
    componentStack?: string;
    userId?: string;
    sessionId?: string;
    url?: string;
    userAgent?: string;
    extra?: Record<string, unknown>;
}

interface BreadcrumbData {
    type: "navigation" | "click" | "http" | "console" | "user";
    category: string;
    message: string;
    data?: Record<string, unknown>;
    timestamp?: number;
}

// Breadcrumb buffer for error context
const breadcrumbs: BreadcrumbData[] = [];
const MAX_BREADCRUMBS = 50;

/**
 * Add a breadcrumb for error context
 */
function addBreadcrumb(breadcrumb: Omit<BreadcrumbData, "timestamp">): void {
    breadcrumbs.push({
        ...breadcrumb,
        timestamp: Date.now(),
    });

    // Keep only the last MAX_BREADCRUMBS
    if (breadcrumbs.length > MAX_BREADCRUMBS) {
        breadcrumbs.shift();
    }
}

/**
 * Get browser context for error reports
 */
function getBrowserContext(): Partial<ErrorContext> {
    if (typeof window === "undefined") return {};

    return {
        url: window.location.href,
        userAgent: navigator.userAgent,
    };
}

/**
 * Send error to monitoring service
 * Currently logs to console; ready for Sentry integration
 */
async function sendToMonitoring(
    error: Error,
    context: ErrorContext = {}
): Promise<void> {
    const errorPayload = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: {
            ...getBrowserContext(),
            ...context,
        },
        breadcrumbs: [...breadcrumbs],
        timestamp: new Date().toISOString(),
    };

    // In development, log the error payload
    if (!isProduction) {
        console.group("🚨 Error Monitoring");
        console.error("Error:", error);
        console.log("Context:", context);
        console.log("Breadcrumbs:", breadcrumbs);
        console.groupEnd();
        return;
    }

    // In production with Sentry DSN configured
    if (SENTRY_DSN) {
        try {
            // Sentry integration placeholder
            // When Sentry is installed, replace with:
            // Sentry.captureException(error, { extra: errorPayload });

            // For now, send to a hypothetical error endpoint
            await fetch("/api/errors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(errorPayload),
            }).catch(() => {
                // Silently fail if the endpoint doesn't exist
            });
        } catch {
            // Never throw from error monitoring
        }
    }
}

/**
 * Error Monitoring API
 */
export const errorMonitoring = {
    /**
     * Capture an exception with optional context
     */
    captureException: (error: Error, context?: ErrorContext): void => {
        sendToMonitoring(error, context);
    },

    /**
     * Capture a message as an error
     */
    captureMessage: (message: string, level: "info" | "warning" | "error" = "error"): void => {
        const error = new Error(message);
        error.name = `[${level.toUpperCase()}]`;
        sendToMonitoring(error);
    },

    /**
     * Add a breadcrumb for error context
     */
    addBreadcrumb,

    /**
     * Set user context for error reports
     */
    setUser: (userId: string): void => {
        addBreadcrumb({
            type: "user",
            category: "auth",
            message: `User identified: ${userId}`,
        });
    },

    /**
     * Track navigation events
     */
    trackNavigation: (from: string, to: string): void => {
        addBreadcrumb({
            type: "navigation",
            category: "navigation",
            message: `Navigated from ${from} to ${to}`,
            data: { from, to },
        });
    },

    /**
     * Track user interactions
     */
    trackClick: (elementId: string, elementText?: string): void => {
        addBreadcrumb({
            type: "click",
            category: "ui.click",
            message: `Clicked: ${elementText || elementId}`,
            data: { elementId, elementText },
        });
    },

    /**
     * Track API requests for debugging
     */
    trackRequest: (url: string, method: string, status?: number): void => {
        addBreadcrumb({
            type: "http",
            category: "http",
            message: `${method} ${url}${status ? ` → ${status}` : ""}`,
            data: { url, method, status },
        });
    },
} as const;

export type ErrorMonitoring = typeof errorMonitoring;
