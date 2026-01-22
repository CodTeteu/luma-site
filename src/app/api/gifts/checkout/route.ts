import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

// ============================================
// Configuration
// ============================================

const RATE_LIMIT_MAX_REQUESTS = 5;      // Max checkouts per window
const RATE_LIMIT_WINDOW_MINUTES = 10;   // Window in minutes
const MAX_ITEM_QTY = 10;                // Max quantity per item
const REFERENCE_CODE_LENGTH = 8;        // Length of reference code
const REFERENCE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1

// ============================================
// Types
// ============================================

interface CartItem {
    giftId: string;
    qty: number;
}

interface CheckoutPayload {
    slug: string;
    cart: CartItem[];
    guestName?: string;
    guestEmail?: string;
    message?: string;
    honeypot?: string;
}

interface Gift {
    id: string;
    name: string;
    amount: number;
}

interface OrderItem {
    giftId: string;
    name: string;
    unitAmount: number;
    qty: number;
    lineTotal: number;
}

// ============================================
// Helpers
// ============================================

function hashIP(ip: string): string {
    const salt = process.env.GIFTS_RATE_LIMIT_SALT || "default-gifts-salt-change-me";
    return createHash("sha256").update(`${ip}:${salt}`).digest("hex").substring(0, 64);
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

function generateReferenceCode(): string {
    let code = "";
    for (let i = 0; i < REFERENCE_CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * REFERENCE_CODE_CHARS.length);
        code += REFERENCE_CODE_CHARS[randomIndex];
    }
    return code;
}

function validatePayload(payload: CheckoutPayload): string | null {
    if (!payload.slug || typeof payload.slug !== "string") {
        return "Slug do evento é obrigatório";
    }

    if (!Array.isArray(payload.cart) || payload.cart.length === 0) {
        return "Carrinho não pode estar vazio";
    }

    if (payload.cart.length > 50) {
        return "Carrinho com muitos itens";
    }

    for (const item of payload.cart) {
        if (!item.giftId || typeof item.giftId !== "string") {
            return "ID do presente inválido";
        }
        if (typeof item.qty !== "number" || item.qty < 1 || item.qty > MAX_ITEM_QTY) {
            return `Quantidade deve ser entre 1 e ${MAX_ITEM_QTY}`;
        }
    }

    if (payload.guestEmail && typeof payload.guestEmail === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.guestEmail)) {
            return "Email inválido";
        }
    }

    if (payload.message && payload.message.length > 1000) {
        return "Mensagem muito longa (máximo 1000 caracteres)";
    }

    return null;
}

// ============================================
// POST /api/gifts/checkout
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CheckoutPayload;

        // ================================
        // 1) HONEYPOT CHECK
        // ================================
        if (body.honeypot && body.honeypot.trim() !== "") {
            console.log("[GiftCheckout] Honeypot triggered");
            return NextResponse.json(
                { ok: false, error: "Erro ao processar pedido" },
                { status: 400 }
            );
        }

        // ================================
        // 2) VALIDATE PAYLOAD
        // ================================
        const validationError = validatePayload(body);
        if (validationError) {
            return NextResponse.json(
                { ok: false, error: validationError },
                { status: 400 }
            );
        }

        // ================================
        // 3) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[GiftCheckout] Admin client not configured");
            return NextResponse.json(
                { ok: false, error: "Serviço temporariamente indisponível" },
                { status: 503 }
            );
        }

        // ================================
        // 4) FETCH EVENT BY SLUG
        // ================================
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, status, content")
            .eq("slug", body.slug)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { ok: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        // ================================
        // 5) CHECK EVENT IS PUBLISHED
        // ================================
        if (event.status !== "published") {
            return NextResponse.json(
                { ok: false, error: "Este evento ainda não está aberto" },
                { status: 403 }
            );
        }

        // ================================
        // 6) GET PIX CONFIG
        // ================================
        const content = event.content as {
            payment?: { pixKey?: string; pixName?: string; enabled?: boolean };
            gifts?: Gift[];
        } | null;

        const pixKey = content?.payment?.pixKey;
        const pixName = content?.payment?.pixName;

        if (!pixKey || pixKey.trim() === "") {
            return NextResponse.json(
                { ok: false, error: "Pix não configurado para este evento" },
                { status: 400 }
            );
        }

        // ================================
        // 7) GET GIFTS CATALOG
        // ================================
        const gifts: Gift[] = content?.gifts || [];
        if (gifts.length === 0) {
            return NextResponse.json(
                { ok: false, error: "Nenhum presente cadastrado neste evento" },
                { status: 400 }
            );
        }

        // ================================
        // 8) RATE LIMITING
        // ================================
        const clientIP = getClientIP(request);
        const ipHash = hashIP(clientIP);
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

        const { count, error: countError } = await supabase
            .from("gift_checkout_rate_limits")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("ip_hash", ipHash)
            .gte("created_at", windowStart);

        if (countError) {
            console.error("[GiftCheckout] Rate limit check error:", countError);
            // Continue anyway
        } else if (count && count >= RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." },
                { status: 429 }
            );
        }

        // Record this attempt
        await supabase
            .from("gift_checkout_rate_limits")
            .insert({
                event_id: event.id,
                ip_hash: ipHash,
            });

        // ================================
        // 9) CALCULATE ORDER ITEMS & TOTAL (SERVER-SIDE)
        // ================================
        const orderItems: OrderItem[] = [];
        let totalAmount = 0;

        for (const cartItem of body.cart) {
            const gift = gifts.find(g => g.id === cartItem.giftId);

            if (!gift) {
                return NextResponse.json(
                    { ok: false, error: `Presente não encontrado: ${cartItem.giftId}` },
                    { status: 400 }
                );
            }

            const lineTotal = gift.amount * cartItem.qty;

            orderItems.push({
                giftId: gift.id,
                name: gift.name,
                unitAmount: gift.amount,
                qty: cartItem.qty,
                lineTotal,
            });

            totalAmount += lineTotal;
        }

        if (totalAmount <= 0) {
            return NextResponse.json(
                { ok: false, error: "Valor total inválido" },
                { status: 400 }
            );
        }

        // ================================
        // 10) GENERATE UNIQUE REFERENCE CODE
        // ================================
        let referenceCode: string | null = null;
        const maxAttempts = 10;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const candidate = generateReferenceCode();

            const { data: existing } = await supabase
                .from("gift_orders")
                .select("id")
                .eq("reference_code", candidate)
                .maybeSingle();

            if (!existing) {
                referenceCode = candidate;
                break;
            }
        }

        if (!referenceCode) {
            console.error("[GiftCheckout] Could not generate unique reference code");
            return NextResponse.json(
                { ok: false, error: "Erro ao gerar código do pedido" },
                { status: 500 }
            );
        }

        // ================================
        // 11) INSERT ORDER
        // ================================
        const { data: order, error: insertError } = await supabase
            .from("gift_orders")
            .insert({
                event_id: event.id,
                reference_code: referenceCode,
                guest_name: body.guestName?.trim() || null,
                guest_email: body.guestEmail?.trim().toLowerCase() || null,
                message: body.message?.trim() || null,
                items: orderItems,
                total_amount: totalAmount,
                payment_method: "pix",
                status: "pending",
            })
            .select()
            .single();

        if (insertError) {
            console.error("[GiftCheckout] Insert error:", insertError);

            // Handle unique constraint violation (race condition on reference_code)
            if (insertError.code === "23505") {
                return NextResponse.json(
                    { ok: false, error: "Erro ao criar pedido. Tente novamente." },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { ok: false, error: "Erro ao criar pedido" },
                { status: 500 }
            );
        }

        // ================================
        // SUCCESS
        // ================================
        return NextResponse.json({
            ok: true,
            orderId: order.id,
            referenceCode: order.reference_code,
            totalAmount,
            pixKey,
            pixName: pixName || null,
        });

    } catch (error) {
        console.error("[GiftCheckout] Unexpected error:", error);
        return NextResponse.json(
            { ok: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
