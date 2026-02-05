/**
 * Invitation Content Types
 * Structure for wedding invitation content stored in events.content JSONB
 */

// ============================================
// Content Sub-types
// ============================================

export interface CoupleInfo {
    brideName: string;
    groomName: string;
}

export interface EventInfo {
    weddingDate: string;      // ISO date string
    ceremonyTime: string;     // HH:mm format
    partyTime: string;        // HH:mm format
}

export interface LocationInfo {
    ceremonyLocation: string;
    ceremonyAddress?: string;
    ceremonyMapUrl?: string;
    partyLocation: string;
    partyAddress?: string;
    partyMapUrl?: string;
}

export interface MessagesInfo {
    welcomeText: string;
    storyText: string;
    closingText?: string;
}

export interface ThemeInfo {
    primaryColor: string;     // Hex color e.g. #C19B58
    secondaryColor: string;   // Hex color e.g. #2A3B2E
    fontFamily?: string;
}

export interface RSVPInfo {
    enabled: boolean;
    deadline?: string;        // ISO date string
    whatsappNumber?: string;
}

export interface PaymentInfo {
    enabled: boolean;
    pixKey?: string;
    pixName?: string;         // Name of the account holder
}

// ============================================
// Main Content Type
// ============================================

export interface InvitationContent {
    couple: CoupleInfo;
    event: EventInfo;
    locations: LocationInfo;
    messages: MessagesInfo;
    theme: ThemeInfo;
    rsvp: RSVPInfo;
    payment?: PaymentInfo;
}

// ============================================
// Default Content
// ============================================

export const DEFAULT_INVITATION_CONTENT: InvitationContent = {
    couple: {
        brideName: "",
        groomName: "",
    },
    event: {
        weddingDate: "",
        ceremonyTime: "",
        partyTime: "",
    },
    locations: {
        ceremonyLocation: "",
        partyLocation: "",
    },
    messages: {
        welcomeText: "Com alegria convidamos você para celebrar nosso casamento",
        storyText: "Nossa história de amor começou...",
    },
    theme: {
        primaryColor: "#C19B58",
        secondaryColor: "#2A3B2E",
    },
    rsvp: {
        enabled: true,
    },
    payment: {
        enabled: false,
    },
};

// ============================================
// Event Status
// ============================================

export type EventStatus = "draft" | "published";

// ============================================
// Event Type & Plan (from domain/plans)
// ============================================

export type EventType = "wedding" | "graduation";
export type PlanType = "free" | "plus" | "concierge";

// ============================================
// Full Event Type (from Supabase)
// ============================================

export interface Event {
    id: string;
    user_id: string;
    slug: string;
    template_id: string;
    status: EventStatus;
    event_type: EventType;
    plan: PlanType;
    event_date: string | null;
    expires_at: string | null;
    password_hash: string | null;
    content: InvitationContent;
    created_at: string;
    updated_at: string;
}

