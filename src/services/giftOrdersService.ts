import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface GiftOrderItem {
    giftId: string;
    name: string;
    unitAmount: number;
    qty: number;
    lineTotal: number;
}

export interface GiftOrder {
    id: string;
    event_id: string;
    reference_code: string;
    guest_name: string | null;
    guest_email: string | null;
    message: string | null;
    items: GiftOrderItem[];
    total_amount: number;
    payment_method: string;
    status: "pending" | "confirmed" | "cancelled";
    created_at: string;
    updated_at: string;
}

export interface GiftOrderStats {
    pending: { count: number; total: number };
    confirmed: { count: number; total: number };
    cancelled: { count: number; total: number };
}

// ============================================
// Service Functions
// ============================================

/**
 * Get orders for an event, optionally filtered by status
 */
export async function getOrders(
    eventId: string,
    status?: "pending" | "confirmed" | "cancelled"
): Promise<GiftOrder[]> {
    const supabase = createClient();
    if (!supabase) return [];

    let query = supabase
        .from("gift_orders")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error("[GiftOrdersService] Error fetching orders:", error);
        return [];
    }

    return (data as GiftOrder[]) || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
    orderId: string,
    status: "pending" | "confirmed" | "cancelled"
): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    const { error } = await supabase
        .from("gift_orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
        console.error("[GiftOrdersService] Error updating status:", error);
        return false;
    }

    return true;
}

/**
 * Get order statistics for an event
 */
export async function getOrderStats(eventId: string): Promise<GiftOrderStats> {
    const supabase = createClient();

    const defaultStats: GiftOrderStats = {
        pending: { count: 0, total: 0 },
        confirmed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
    };

    if (!supabase) return defaultStats;

    const { data, error } = await supabase
        .from("gift_orders")
        .select("status, total_amount")
        .eq("event_id", eventId);

    if (error || !data) {
        console.error("[GiftOrdersService] Error fetching stats:", error);
        return defaultStats;
    }

    const stats = { ...defaultStats };

    for (const order of data) {
        const status = order.status as keyof GiftOrderStats;
        if (stats[status]) {
            stats[status].count += 1;
            stats[status].total += Number(order.total_amount) || 0;
        }
    }

    return stats;
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<GiftOrder | null> {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("gift_orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("[GiftOrdersService] Error fetching order:", error);
        return null;
    }

    return data as GiftOrder;
}
