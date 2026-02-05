"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
    generateUniqueSlug,
    generateSlugFromNames,
    generateTemporarySlug,
} from "@/lib/slug";

// ============================================
// Types
// ============================================

export interface BriefingData {
    // Template Info
    templateId: string;
    templateName: string;
    templateStyle: string;
    // Couple Info (PRIVATE - do NOT persist inside events.content)
    email: string;
    phone: string;
    brideName: string;
    groomName: string;
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
    eventType: "wedding" | "graduation";
    submittedAt: string;
    status: "pending" | "in_progress" | "completed";
}

/**
 * Only PUBLIC data should be stored in events.content.
 * Anything private (email/phone) must NOT go here.
 */
type EventContent = Omit<BriefingData, "email" | "phone">;

export interface EventSummary {
    id: string;
    slug: string;
    status: "draft" | "published";
    event_type: "wedding" | "graduation";
    created_at: string;
    content: Partial<EventContent>;
}

interface BriefingContextType {
    briefingData: BriefingData | null;
    eventId: string | null;
    eventSlug: string | null;
    eventStatus: "draft" | "published" | null;
    allEvents: EventSummary[];
    hasBriefing: boolean;
    isLoading: boolean;
    setBriefingData: (data: BriefingData) => void;
    updateBriefingData: (updates: Partial<BriefingData>) => Promise<void>;
    createEvent: (
        templateId: string,
        templateName: string,
        templateStyle: string
    ) => Promise<boolean>;
    setActiveEvent: (eventId: string) => Promise<boolean>;
    updateSlug: (brideName: string, groomName: string) => Promise<string | null>;
    clearBriefingData: () => void;
    refreshEvents: () => Promise<void>;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = "luma_briefing_data";

const DEFAULT_BRIEFING_DATA: BriefingData = {
    templateId: "",
    templateName: "",
    templateStyle: "",
    brideName: "",
    groomName: "",
    email: "",
    phone: "",
    weddingDate: "",
    ceremonyTime: "",
    partyTime: "",
    ceremonyLocation: "",
    partyLocation: "",
    guestCount: "",
    style: "",
    colors: "",
    message: "",
    eventType: "wedding",
    submittedAt: "",
    status: "pending",
};

// ============================================
// Helpers: sanitize/merge for DB vs State
// ============================================

function toEventContent(data: BriefingData): EventContent {
    // Strip private fields (email/phone) before persisting
    const { email: _email, phone: _phone, ...publicPart } = data;
    return publicPart;
}

function fromEventContent(
    content: Partial<EventContent> | null | undefined,
    privateOverrides?: Partial<Pick<BriefingData, "email" | "phone">>
): BriefingData {
    return {
        ...DEFAULT_BRIEFING_DATA,
        ...(content ?? {}),
        email: privateOverrides?.email ?? DEFAULT_BRIEFING_DATA.email,
        phone: privateOverrides?.phone ?? DEFAULT_BRIEFING_DATA.phone,
    };
}

// ============================================
// Context
// ============================================

const BriefingContext = createContext<BriefingContextType | undefined>(
    undefined
);

export function BriefingProvider({ children }: { children: ReactNode }) {
    const [briefingData, setBriefingDataState] = useState<BriefingData | null>(
        null
    );
    const [eventId, setEventId] = useState<string | null>(null);
    const [eventSlug, setEventSlug] = useState<string | null>(null);
    const [eventStatus, setEventStatus] = useState<"draft" | "published" | null>(
        null
    );
    const [allEvents, setAllEvents] = useState<EventSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ============================================
    // Helper: Load event by ID (PUBLIC content only)
    // ============================================
    const loadEventById = useCallback(
        async (
            supabase: ReturnType<typeof createClient>,
            eventIdToLoad: string,
            privateOverrides?: Partial<Pick<BriefingData, "email" | "phone">>
        ) => {
            if (!supabase) return false;

            const { data: event, error } = await supabase
                .from("events")
                // Avoid select("*") to reduce risk of leaking unexpected fields
                .select("id, slug, status, event_type, content")
                .eq("id", eventIdToLoad)
                .single();

            if (error || !event) {
                console.error("Error loading event:", error);
                return false;
            }

            setEventId(event.id);
            setEventSlug(event.slug);
            setEventStatus(event.status);

            const merged = fromEventContent(event.content as Partial<EventContent>, {
                email: privateOverrides?.email ?? "",
                phone: privateOverrides?.phone ?? "",
            });

            // Set the event type from the database field
            merged.eventType = (event.event_type as "wedding" | "graduation") || "wedding";

            setBriefingDataState(merged);
            return true;
        },
        []
    );

    // ============================================
    // Load data on mount
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            if (!isSupabaseConfigured()) {
                // Fallback to localStorage for development
                console.warn("SUPABASE NOT CONFIGURED: Using localStorage fallback");
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        setBriefingDataState(JSON.parse(stored));
                    }
                } catch (e) {
                    console.error("Failed to parse localStorage briefing data:", e);
                }
                setIsLoading(false);
                return;
            }

            const supabase = createClient();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // 1) Fetch all user's events
                const { data: events, error: eventsError } = await supabase
                    .from("events")
                    .select("id, slug, status, event_type, created_at, content")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (eventsError) {
                    console.error("Error fetching events:", eventsError);
                    setIsLoading(false);
                    return;
                }

                setAllEvents((events as EventSummary[]) || []);

                // 2) Fetch user's profile to get active_event_id
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("active_event_id")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    // Not fatal; continue with fallback
                    console.warn("Could not load profile.active_event_id:", profileError);
                }

                let eventToLoad: string | null = null;

                if (profile?.active_event_id) {
                    eventToLoad = profile.active_event_id;
                } else if (events && events.length > 0) {
                    eventToLoad = events[0].id;

                    // Upsert profile with active event
                    await supabase.from("profiles").upsert(
                        {
                            id: user.id,
                            active_event_id: eventToLoad,
                        },
                        { onConflict: "id" }
                    );
                }

                // 3) Load the active event
                if (eventToLoad) {
                    // Keep private fields only in state (not in DB content)
                    await loadEventById(supabase, eventToLoad, {
                        email: user.email || "",
                        phone: "",
                    });
                } else {
                    // No event yet: keep state null
                    setBriefingDataState(null);
                    setEventId(null);
                    setEventSlug(null);
                    setEventStatus(null);
                }
            } catch (e) {
                console.error("Error loading briefing data:", e);
            }

            setIsLoading(false);
        };

        loadData();
    }, [loadEventById]);

    // ============================================
    // refreshEvents - reload all events list
    // ============================================
    const refreshEvents = useCallback(async () => {
        if (!isSupabaseConfigured()) return;

        const supabase = createClient();
        if (!supabase) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: events } = await supabase
            .from("events")
            .select("id, slug, status, event_type, created_at, content")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        setAllEvents((events as EventSummary[]) || []);
    }, []);

    // ============================================
    // setActiveEvent - switch to a different event
    // ============================================
    const setActiveEvent = useCallback(
        async (newEventId: string): Promise<boolean> => {
            if (!isSupabaseConfigured()) return false;

            const supabase = createClient();
            if (!supabase) return false;

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) return false;

                const { error: profileError } = await supabase.from("profiles").upsert(
                    {
                        id: user.id,
                        active_event_id: newEventId,
                    },
                    { onConflict: "id" }
                );

                if (profileError) {
                    console.error("Error updating active event:", profileError);
                    return false;
                }

                const success = await loadEventById(supabase, newEventId, {
                    email: user.email || "",
                    phone: "",
                });

                return success;
            } catch (e) {
                console.error("Error setting active event:", e);
                return false;
            }
        },
        [loadEventById]
    );

    // ============================================
    // setBriefingData - set entire briefing data
    // ============================================
    const setBriefingData = useCallback((data: BriefingData) => {
        setBriefingDataState(data);

        if (!isSupabaseConfigured()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, []);

    // ============================================
    // updateBriefingData - update partial data
    // ============================================
    const updateBriefingData = useCallback(
        async (updates: Partial<BriefingData>) => {
            const newData = {
                ...(briefingData || DEFAULT_BRIEFING_DATA),
                ...updates,
            };
            setBriefingDataState(newData);

            if (!isSupabaseConfigured()) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
                return;
            }

            if (!eventId) return;

            const supabase = createClient();
            if (!supabase) return;

            try {
                // Persist ONLY public data
                const contentToSave = toEventContent(newData);

                const { error } = await supabase
                    .from("events")
                    .update({ content: contentToSave })
                    .eq("id", eventId);

                if (error) {
                    console.error("Error updating event:", error);
                }
            } catch (e) {
                console.error("Error updating briefing data:", e);
            }
        },
        [briefingData, eventId]
    );

    // ============================================
    // createEvent - create new event in Supabase
    // ============================================
    const createEvent = useCallback(
        async (
            templateId: string,
            templateName: string,
            templateStyle: string
        ): Promise<boolean> => {
            if (!isSupabaseConfigured()) {
                const data: BriefingData = {
                    ...DEFAULT_BRIEFING_DATA,
                    templateId,
                    templateName,
                    templateStyle,
                    submittedAt: new Date().toISOString(),
                };
                setBriefingDataState(data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            }

            const supabase = createClient();
            if (!supabase) return false;

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) {
                    console.error("No user logged in");
                    return false;
                }

                // PUBLIC content only
                const contentPublic: EventContent = {
                    ...toEventContent(DEFAULT_BRIEFING_DATA),
                    templateId,
                    templateName,
                    templateStyle,
                    submittedAt: new Date().toISOString(),
                };

                // Use temporary slug until names are set
                const baseSlug = generateTemporarySlug();
                const slug = await generateUniqueSlug(baseSlug, supabase);

                if (!slug) {
                    console.error("Could not generate unique slug");
                    return false;
                }

                const { data: newEvent, error } = await supabase
                    .from("events")
                    .insert({
                        user_id: user.id,
                        slug,
                        template_id: templateId,
                        event_type: templateId.includes("grad") ? "graduation" : "wedding", // simple heuristic or pass explicitly
                        status: "draft",
                        content: contentPublic,
                    })
                    .select("id, slug, status, event_type, content")
                    .single();

                if (error || !newEvent) {
                    console.error("Error creating event:", error);
                    return false;
                }

                await supabase.from("profiles").upsert(
                    {
                        id: user.id,
                        active_event_id: newEvent.id,
                    },
                    { onConflict: "id" }
                );

                setEventId(newEvent.id);
                setEventSlug(newEvent.slug);
                setEventStatus(newEvent.status);

                // Keep private fields only in state
                setBriefingDataState({
                    ...fromEventContent(newEvent.content as Partial<EventContent>, {
                        email: user.email || "",
                        phone: "",
                    }),
                    eventType: newEvent.event_type as "wedding" | "graduation"
                });

                await refreshEvents();
                return true;
            } catch (e) {
                console.error("Error creating event:", e);
                return false;
            }
        },
        [refreshEvents]
    );

    // ============================================
    // updateSlug - generate new slug from names
    // ============================================
    const updateSlug = useCallback(
        async (brideName: string, groomName: string): Promise<string | null> => {
            if (!isSupabaseConfigured() || !eventId) return null;

            const supabase = createClient();
            if (!supabase) return null;

            try {
                const baseSlug = generateSlugFromNames(brideName, groomName);
                if (!baseSlug) {
                    console.error("Cannot generate slug from empty names");
                    return null;
                }

                const newSlug = await generateUniqueSlug(baseSlug, supabase);
                if (!newSlug) {
                    console.error("Could not generate unique slug");
                    return null;
                }

                const { error } = await supabase
                    .from("events")
                    .update({ slug: newSlug })
                    .eq("id", eventId);

                if (error) {
                    console.error("Error updating slug:", error);
                    return null;
                }

                setEventSlug(newSlug);
                await refreshEvents();
                return newSlug;
            } catch (e) {
                console.error("Error updating slug:", e);
                return null;
            }
        },
        [eventId, refreshEvents]
    );

    // ============================================
    // clearBriefingData - clear all data
    // ============================================
    const clearBriefingData = useCallback(() => {
        setBriefingDataState(null);
        setEventId(null);
        setEventSlug(null);
        setEventStatus(null);

        // Only relevant for dev fallback
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ============================================
    // Provider
    // ============================================
    return (
        <BriefingContext.Provider
            value={{
                briefingData,
                eventId,
                eventSlug,
                eventStatus,
                allEvents,
                hasBriefing: !!eventId || (!!briefingData && !!briefingData.templateId),
                isLoading,
                setBriefingData,
                updateBriefingData,
                createEvent,
                setActiveEvent,
                updateSlug,
                clearBriefingData,
                refreshEvents,
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
