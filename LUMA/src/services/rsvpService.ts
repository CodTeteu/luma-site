/**
 * RSVP Service
 * Supabase-backed service for managing wedding RSVPs
 */

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface RSVPGuest {
    id: string;
    event_id: string;
    name: string;
    email?: string;
    phone?: string;
    is_attending: boolean;
    guests: number;
    children: number;
    dietary_restrictions?: string;
    message?: string;
    group_name?: string;
    created_at: string;
}

export interface RSVPStats {
    total: number;
    confirmed: number;
    declined: number;
    totalGuests: number;
    totalChildren: number;
}

export type NewRSVP = Omit<RSVPGuest, "id" | "created_at">;
export type RSVPUpdate = Partial<Omit<RSVPGuest, "id" | "event_id" | "created_at">>;

// ============================================
// Service Functions
// ============================================

/**
 * Get all RSVPs for an event
 */
export async function getGuestList(eventId: string): Promise<RSVPGuest[]> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return [];
    }

    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching RSVPs:", error);
        return [];
    }

    return data || [];
}

/**
 * Add a new RSVP
 */
export async function addRSVP(
    eventId: string,
    payload: Omit<NewRSVP, "event_id">
): Promise<RSVPGuest | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("rsvps")
        .insert({
            event_id: eventId,
            ...payload,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding RSVP:", error);
        return null;
    }

    return data;
}

/**
 * Update an RSVP
 */
export async function updateGuest(
    eventId: string,
    id: string,
    updates: RSVPUpdate
): Promise<RSVPGuest | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("rsvps")
        .update(updates)
        .eq("id", id)
        .eq("event_id", eventId)
        .select()
        .single();

    if (error) {
        console.error("Error updating RSVP:", error);
        return null;
    }

    return data;
}

/**
 * Remove an RSVP
 */
export async function removeRSVP(eventId: string, id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    const { error } = await supabase
        .from("rsvps")
        .delete()
        .eq("id", id)
        .eq("event_id", eventId);

    if (error) {
        console.error("Error removing RSVP:", error);
        return false;
    }

    return true;
}

/**
 * Get RSVP statistics for an event
 */
export async function getGuestStats(eventId: string): Promise<RSVPStats> {
    const guests = await getGuestList(eventId);

    const confirmed = guests.filter(g => g.is_attending);
    const declined = guests.filter(g => !g.is_attending);

    return {
        total: guests.length,
        confirmed: confirmed.length,
        declined: declined.length,
        totalGuests: confirmed.reduce((sum, g) => sum + (g.guests || 1), 0),
        totalChildren: confirmed.reduce((sum, g) => sum + (g.children || 0), 0),
    };
}
