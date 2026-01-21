"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface BriefingData {
    // Template Info
    templateId: string;
    templateName: string;
    templateStyle: string;
    // Couple Info
    brideName: string;
    groomName: string;
    email: string;
    phone: string;
    // Event Details
    weddingDate: string;
    ceremonyTime: string;
    partyTime: string;
    ceremonyLocation: string;
    partyLocation: string;
    guestCount: string;
    // Style Preferences
    style: string;
    colors: string;
    message: string;
    // Metadata
    submittedAt: string;
    status: "pending" | "in_progress" | "completed";
}

interface BriefingContextType {
    briefingData: BriefingData | null;
    setBriefingData: (data: BriefingData) => void;
    updateBriefingData: (updates: Partial<BriefingData>) => void;
    clearBriefingData: () => void;
    hasBriefing: boolean;
}

const STORAGE_KEY = "luma_briefing_data";

const BriefingContext = createContext<BriefingContextType | undefined>(undefined);

export function BriefingProvider({ children }: { children: ReactNode }) {
    const [briefingData, setBriefingDataState] = useState<BriefingData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setBriefingDataState(parsed);
            }
        } catch (e) {
            console.error("Failed to parse briefing data:", e);
        }
        setIsLoaded(true);
    }, []);

    const setBriefingData = useCallback((data: BriefingData) => {
        setBriefingDataState(data);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, []);

    const updateBriefingData = useCallback((updates: Partial<BriefingData>) => {
        setBriefingDataState((prev) => {
            if (!prev) return null;
            const newData = { ...prev, ...updates };
            if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            }
            return newData;
        });
    }, []);

    const clearBriefingData = useCallback(() => {
        setBriefingDataState(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <BriefingContext.Provider
            value={{
                briefingData,
                setBriefingData,
                updateBriefingData,
                clearBriefingData,
                hasBriefing: !!briefingData,
            }}
        >
            {children}
        </BriefingContext.Provider>
    );
}

export function useBriefing() {
    const context = useContext(BriefingContext);
    if (context === undefined) {
        throw new Error("useBriefing must be used within a BriefingProvider");
    }
    return context;
}
