import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

// ============================================
// Configuration
// ============================================

const RATE_LIMIT_MAX_REPORTS = 3;      // Max reports per IP per event
const RATE_LIMIT_WINDOW_HOURS = 24;    // Window in hours

// ============================================
// Types
// ============================================

interface ReportPayload {
    slug: string;
    reason: string;
    message?: string;
    email?: string;
}

const VALID_REASONS = [
    "inappropriate_content",
    "spam",
    "fake_event",
    "harassment",
    "copyright",
    "other",
];

// ============================================
// Helpers
// ============================================

function hashIP(ip: string): string {
    const salt = process.env.RSVP_RATE_LIMIT_SALT || "default-salt-change-me";
    return createHash("sha256").update(`${ip}:reports:${salt}`).digest("hex").substring(0, 64);
}

function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }
    return "unknown";
}

// ============================================
// POST /api/reports
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as ReportPayload;

        // ================================
        // 1) VALIDATE PAYLOAD
        // ================================
        if (!body.slug || typeof body.slug !== "string") {
            return NextResponse.json(
                { success: false, error: "Slug do evento é obrigatório" },
                { status: 400 }
            );
        }

        if (!body.reason || !VALID_REASONS.includes(body.reason)) {
            return NextResponse.json(
                { success: false, error: "Motivo da denúncia é obrigatório" },
                { status: 400 }
            );
        }

        if (body.message && body.message.length > 1000) {
            return NextResponse.json(
                { success: false, error: "Mensagem muito longa (máximo 1000 caracteres)" },
                { status: 400 }
            );
        }

        if (body.email && body.email.length > 255) {
            return NextResponse.json(
                { success: false, error: "Email muito longo" },
                { status: 400 }
            );
        }

        // ================================
        // 2) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[Reports] Admin client not configured");
            return NextResponse.json(
                { success: false, error: "Serviço temporariamente indisponível" },
                { status: 503 }
            );
        }

        // ================================
        // 3) FETCH EVENT BY SLUG
        // ================================
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id")
            .eq("slug", body.slug)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { success: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        // ================================
        // 4) RATE LIMITING
        // ================================
        const clientIP = getClientIP(request);
        const ipHash = hashIP(clientIP);
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

        const { count, error: countError } = await supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("reporter_ip_hash", ipHash)
            .gte("created_at", windowStart);

        if (!countError && count && count >= RATE_LIMIT_MAX_REPORTS) {
            return NextResponse.json(
                { success: false, error: "Limite de denúncias atingido. Tente novamente mais tarde." },
                { status: 429 }
            );
        }

        // ================================
        // 5) INSERT REPORT
        // ================================
        const { error: insertError } = await supabase
            .from("reports")
            .insert({
                event_id: event.id,
                reason: body.reason,
                message: body.message?.trim() || null,
                reporter_email: body.email?.trim().toLowerCase() || null,
                reporter_ip_hash: ipHash,
            });

        if (insertError) {
            console.error("[Reports] Insert error:", insertError);
            return NextResponse.json(
                { success: false, error: "Erro ao registrar denúncia" },
                { status: 500 }
            );
        }

        // ================================
        // SUCCESS
        // ================================
        return NextResponse.json({
            success: true,
            message: "Denúncia registrada. Obrigado pelo feedback.",
        });

    } catch (error) {
        console.error("[Reports] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
