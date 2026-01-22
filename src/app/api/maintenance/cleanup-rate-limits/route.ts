import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ============================================
// Configuration
// ============================================

const CLEANUP_DAYS = 7; // Delete records older than this

// ============================================
// GET /api/maintenance/cleanup-rate-limits
// ============================================
// This endpoint is protected by MAINTENANCE_TOKEN
// Can be called via Vercel Cron or manually

export async function GET(request: NextRequest) {
    try {
        // ================================
        // 1) VERIFY MAINTENANCE TOKEN
        // ================================
        const token = request.headers.get("x-maintenance-token")
            || request.nextUrl.searchParams.get("token");

        const expectedToken = process.env.MAINTENANCE_TOKEN;

        if (!expectedToken) {
            console.error("[Maintenance] MAINTENANCE_TOKEN not configured");
            return NextResponse.json(
                { success: false, error: "Maintenance not configured" },
                { status: 500 }
            );
        }

        if (!token || token !== expectedToken) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // ================================
        // 2) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[Maintenance] Admin client not configured");
            return NextResponse.json(
                { success: false, error: "Service unavailable" },
                { status: 503 }
            );
        }

        // ================================
        // 3) DELETE OLD RATE LIMIT RECORDS
        // ================================
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_DAYS);

        // First count how many will be deleted
        const { count: beforeCount } = await supabase
            .from("rsvp_rate_limits")
            .select("*", { count: "exact", head: true })
            .lt("created_at", cutoffDate.toISOString());

        // Delete old records
        const { error } = await supabase
            .from("rsvp_rate_limits")
            .delete()
            .lt("created_at", cutoffDate.toISOString());

        if (error) {
            console.error("[Maintenance] Delete error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to delete records" },
                { status: 500 }
            );
        }

        // ================================
        // SUCCESS
        // ================================
        console.log(`[Maintenance] Cleaned up ${beforeCount || 0} old rate limit records`);

        return NextResponse.json({
            success: true,
            deletedCount: beforeCount || 0,
            cutoffDate: cutoffDate.toISOString(),
            message: `Deleted ${beforeCount || 0} records older than ${CLEANUP_DAYS} days`,
        });

    } catch (error) {
        console.error("[Maintenance] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
