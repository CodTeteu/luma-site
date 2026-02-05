import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canExportCSV, PlanType } from "@/domain/plans";

// ============================================
// GET /api/rsvp/export?event_id=xxx
// Export RSVPs as CSV (Plus/Concierge only)
// ============================================

export async function GET(request: NextRequest) {
    try {
        const eventId = request.nextUrl.searchParams.get("event_id");

        if (!eventId) {
            return NextResponse.json(
                { success: false, error: "event_id é obrigatório" },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = await createClient();
        if (!supabase) {
            return NextResponse.json(
                { success: false, error: "Não autenticado" },
                { status: 401 }
            );
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Não autenticado" },
                { status: 401 }
            );
        }

        // Fetch event and verify ownership
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, user_id, plan, slug")
            .eq("id", eventId)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { success: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        if (event.user_id !== user.id) {
            return NextResponse.json(
                { success: false, error: "Sem permissão para este evento" },
                { status: 403 }
            );
        }

        // Check plan permissions
        const plan = (event.plan || "free") as PlanType;
        if (!canExportCSV(plan)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Export CSV disponível apenas para planos Plus e Concierge",
                    upgrade_required: true
                },
                { status: 403 }
            );
        }

        // Fetch RSVPs
        const { data: rsvps, error: rsvpError } = await supabase
            .from("rsvps")
            .select("*")
            .eq("event_id", eventId)
            .order("created_at", { ascending: false });

        if (rsvpError) {
            console.error("[RSVP Export] Error fetching RSVPs:", rsvpError);
            return NextResponse.json(
                { success: false, error: "Erro ao buscar confirmações" },
                { status: 500 }
            );
        }

        // Generate CSV
        const headers = [
            "Nome",
            "Email",
            "Telefone",
            "Confirmou Presença",
            "Acompanhantes",
            "Crianças",
            "Restrições Alimentares",
            "Mensagem",
            "Data de Confirmação",
        ];

        const rows = (rsvps || []).map((rsvp) => [
            escapeCsvField(rsvp.name || ""),
            escapeCsvField(rsvp.email || ""),
            escapeCsvField(rsvp.phone || ""),
            rsvp.is_attending ? "Sim" : "Não",
            String(rsvp.guests || 1),
            String(rsvp.children || 0),
            escapeCsvField(rsvp.dietary_restrictions || ""),
            escapeCsvField(rsvp.message || ""),
            rsvp.created_at ? new Date(rsvp.created_at).toLocaleString("pt-BR") : "",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        // Return CSV file
        const filename = `rsvp-${event.slug}-${Date.now()}.csv`;

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error("[RSVP Export] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

// Helper to escape CSV fields
function escapeCsvField(field: string): string {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}
