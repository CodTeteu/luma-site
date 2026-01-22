/**
 * Transaction Service
 * Supabase-backed service for managing gift transactions
 */

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface GiftTransaction {
    id: string;
    event_id: string;
    gift_name: string;
    amount: number;
    guest_name?: string;
    guest_email?: string;
    message?: string;
    payment_method: string;
    status: "pending" | "confirmed" | "cancelled";
    created_at: string;
}

export interface TransactionStats {
    total: number;
    confirmed: number;
    pending: number;
    totalAmount: number;
    confirmedAmount: number;
}

export type NewTransaction = Omit<GiftTransaction, "id" | "created_at">;
export type TransactionUpdate = Partial<Omit<GiftTransaction, "id" | "event_id" | "created_at">>;

// ============================================
// Service Functions
// ============================================

/**
 * Get all transactions for an event
 */
export async function getTransactions(eventId: string): Promise<GiftTransaction[]> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return [];
    }

    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("gift_transactions")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }

    return data || [];
}

/**
 * Add a new transaction
 */
export async function addTransaction(
    eventId: string,
    payload: Omit<NewTransaction, "event_id">
): Promise<GiftTransaction | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("gift_transactions")
        .insert({
            event_id: eventId,
            ...payload,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding transaction:", error);
        return null;
    }

    return data;
}

/**
 * Update a transaction (typically to change status)
 */
export async function updateTransaction(
    eventId: string,
    id: string,
    updates: TransactionUpdate
): Promise<GiftTransaction | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("gift_transactions")
        .update(updates)
        .eq("id", id)
        .eq("event_id", eventId)
        .select()
        .single();

    if (error) {
        console.error("Error updating transaction:", error);
        return null;
    }

    return data;
}

/**
 * Remove a transaction
 */
export async function removeTransaction(eventId: string, id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    const { error } = await supabase
        .from("gift_transactions")
        .delete()
        .eq("id", id)
        .eq("event_id", eventId);

    if (error) {
        console.error("Error removing transaction:", error);
        return false;
    }

    return true;
}

/**
 * Get transaction statistics for an event
 */
export async function getTransactionStats(eventId: string): Promise<TransactionStats> {
    const transactions = await getTransactions(eventId);

    const confirmed = transactions.filter(t => t.status === "confirmed");
    const pending = transactions.filter(t => t.status === "pending");

    return {
        total: transactions.length,
        confirmed: confirmed.length,
        pending: pending.length,
        totalAmount: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
        confirmedAmount: confirmed.reduce((sum, t) => sum + Number(t.amount), 0),
    };
}
