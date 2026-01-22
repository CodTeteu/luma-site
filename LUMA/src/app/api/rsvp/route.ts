import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

// ============================================
// Configuration
// ============================================

const RATE_LIMIT_MAX_REQUESTS = 5;      // Max requests per window
const RATE_LIMIT_WINDOW_MINUTES = 10;   // Window in minutes
const MAX_GUESTS = 20;                   // Max guests per RSVP
const MAX_CHILDREN = 10;                 // Max children per RSVP

// ============================================
// Types
// ============================================

interface RSVPPayload {
    slug: string;
    name: string;
    email?: string;
    phone?: string;
    is_attending: boolean;
    guests?: number;
    children?: number;
    dietary_restrictions?: string;
    message?: string;
    // Honeypot field
    website?: string;
}

// ============================================
// Helpers
// ============================================

function hashIP(ip: string): string {
    const salt = process.env.RSVP_RATE_LIMIT_SALT || "default-salt-change-me";
    return createHash("sha256").update(`${ip}:${salt}`).digest("hex").substring(0, 64);
}

function getClientIP(request: NextRequest): string {
    // Try various headers in order of preference
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }

    // Fallback
    return "unknown";
}

function validatePayload(payload: RSVPPayload): string | null {
    if (!payload.slug || typeof payload.slug !== "string") {
        return "Slug do evento é obrigatório";
    }

    if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length < 2) {
        return "Nome é obrigatório (mínimo 2 caracteres)";
    }

    if (payload.name.length > 200) {
        return "Nome muito longo (máximo 200 caracteres)";
    }

    if (typeof payload.is_attending !== "boolean") {
        return "Confirmação de presença é obrigatória";
    }

    if (payload.email && typeof payload.email === "string") {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            return "Email inválido";
        }
    }

    if (payload.guests !== undefined) {
        const guests = Number(payload.guests);
        if (isNaN(guests) || guests < 1 || guests > MAX_GUESTS) {
            return `Número de convidados deve ser entre 1 e ${MAX_GUESTS}`;
        }
    }

    if (payload.children !== undefined) {
        const children = Number(payload.children);
        if (isNaN(children) || children < 0 || children > MAX_CHILDREN) {
            return `Número de crianças deve ser entre 0 e ${MAX_CHILDREN}`;
        }
    }

    if (payload.message && payload.message.length > 1000) {
        return "Mensagem muito longa (máximo 1000 caracteres)";
    }

    return null;
}

// ============================================
// POST /api/rsvp
// ============================================

export async function POST(request: NextRequest) {
    try {
        // Parse body
        const body = await request.json() as RSVPPayload;

        // ================================
        // 1) HONEYPOT CHECK
        // ================================
        if (body.website && body.website.trim() !== "") {
            // Bot detected - return fake success to not reveal detection
            console.log("[RSVP] Honeypot triggered");
            return NextResponse.json(
                { success: false, error: "Erro ao processar RSVP" },
                { status: 400 }
            );
        }

        // ================================
        // 2) VALIDATE PAYLOAD
        // ================================
        const validationError = validatePayload(body);
        if (validationError) {
            return NextResponse.json(
                { success: false, error: validationError },
                { status: 400 }
            );
        }

        // ================================
        // 3) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[RSVP] Admin client not configured");
            return NextResponse.json(
                { success: false, error: "Serviço temporariamente indisponível" },
                { status: 503 }
            );
        }

        // ================================
        // 4) FETCH EVENT BY SLUG
        // ================================
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, status")
            .eq("slug", body.slug)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { success: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        // ================================
        // 5) CHECK EVENT IS PUBLISHED
        // ================================
        if (event.status !== "published") {
            return NextResponse.json(
                { success: false, error: "Este evento ainda não está aberto para confirmações" },
                { status: 403 }
            );
        }

        // ================================
        // 6) RATE LIMITING
        // ================================
        const clientIP = getClientIP(request);
        const ipHash = hashIP(clientIP);
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

        // Count recent requests from this IP for this event
        const { count, error: countError } = await supabase
            .from("rsvp_rate_limits")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("ip_hash", ipHash)
            .gte("created_at", windowStart);

        if (countError) {
            console.error("[RSVP] Rate limit check error:", countError);
            // Continue anyway, don't block legitimate users
        } else if (count && count >= RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                { success: false, error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
                { status: 429 }
            );
        }

        // Record this attempt
        await supabase
            .from("rsvp_rate_limits")
            .insert({
                event_id: event.id,
                ip_hash: ipHash,
            });

        // ================================
        // 7) CHECK FOR EXISTING RSVP (UPSERT LOGIC)
        // ================================
        const emailNormalized = body.email?.trim().toLowerCase() || null;
        let existingRSVPId: string | null = null;

        if (emailNormalized) {
            const { data: existingRSVP } = await supabase
                .from("rsvps")
                .select("id")
                .eq("event_id", event.id)
                .ilike("email", emailNormalized)
                .single();

            if (existingRSVP) {
                existingRSVPId = existingRSVP.id;
            }
        }

        // ================================
        // 8) INSERT OR UPDATE RSVP
        // ================================
        const rsvpData = {
            event_id: event.id,
            name: body.name.trim(),
            email: emailNormalized,
            phone: body.phone?.trim() || null,
            is_attending: body.is_attending,
            guests: body.guests || 1,
            children: body.children || 0,
            dietary_restrictions: body.dietary_restrictions?.trim() || null,
            message: body.message?.trim() || null,
        };

        let rsvp;
        let isUpdate = false;

        if (existingRSVPId) {
            // UPDATE existing RSVP
            const { data, error: updateError } = await supabase
                .from("rsvps")
                .update(rsvpData)
                .eq("id", existingRSVPId)
                .select()
                .single();

            if (updateError) {
                console.error("[RSVP] Update error:", updateError);
                return NextResponse.json(
                    { success: false, error: "Erro ao atualizar confirmação" },
                    { status: 500 }
                );
            }

            rsvp = data;
            isUpdate = true;
        } else {
            // INSERT new RSVP
            const { data, error: insertError } = await supabase
                .from("rsvps")
                .insert(rsvpData)
                .select()
                .single();

            if (insertError) {
                console.error("[RSVP] Insert error:", insertError);

                // Handle unique constraint violation (race condition)
                if (insertError.code === "23505") {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Já existe uma confirmação para este email. Tente novamente para atualizar sua resposta."
                        },
                        { status: 409 }
                    );
                }

                return NextResponse.json(
                    { success: false, error: "Erro ao salvar confirmação" },
                    { status: 500 }
                );
            }

            rsvp = data;
        }

        // ================================
        // SUCCESS
        // ================================
        let message: string;
        if (isUpdate) {
            message = body.is_attending
                ? "Confirmação atualizada com sucesso!"
                : "Sua resposta foi atualizada.";
        } else {
            message = body.is_attending
                ? "Presença confirmada! Obrigado."
                : "Resposta registrada. Sentiremos sua falta!";
        }

        return NextResponse.json({
            success: true,
            message,
            rsvp_id: rsvp.id,
            updated: isUpdate,
        });

    } catch (error) {
        console.error("[RSVP] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
