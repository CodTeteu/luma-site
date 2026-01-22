/**
 * Logger Service
 * Replaces console.log with environment-aware logging.
 * Silent in production to prevent data leakage.
 * ============================================================================
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
    level: LogLevel;
    message: string;
    data?: unknown;
    timestamp: string;
}

const isProduction = process.env.NODE_ENV === "production";

function formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
}

function createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Logger that is silent in production.
 * Use this instead of console.log throughout the application.
 */
export const logger = {
    debug: (message: string, data?: unknown): void => {
        if (isProduction) return;
        const entry = createLogEntry("debug", message, data);
        console.log(formatLog(entry), data ?? "");
    },

    info: (message: string, data?: unknown): void => {
        if (isProduction) return;
        const entry = createLogEntry("info", message, data);
        console.info(formatLog(entry), data ?? "");
    },

    warn: (message: string, data?: unknown): void => {
        if (isProduction) return;
        const entry = createLogEntry("warn", message, data);
        console.warn(formatLog(entry), data ?? "");
    },

    error: (message: string, error?: unknown): void => {
        // Errors are always logged (but could be sent to monitoring service)
        const entry = createLogEntry("error", message, error);
        console.error(formatLog(entry), error ?? "");

        // TODO: In production, send to error monitoring service (Sentry, etc.)
        // if (isProduction && typeof window !== 'undefined') {
        //   sendToMonitoring(entry);
        // }
    },

    /**
     * Log form data (sanitized in production)
     */
    formSubmission: (formName: string, data: object): void => {
        if (isProduction) return;
        logger.info(`Form submitted: ${formName}`, data);
    },
} as const;

export type Logger = typeof logger;
