import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/templates/registry";
import { InvitationContent, DEFAULT_INVITATION_CONTENT, PlanType } from "@/types/invitation";
import { Metadata } from "next";
import { Watermark, ReportButton } from "@/components/templates";
import { hasWatermark } from "@/domain/plans";
import Link from "next/link";

// ============================================
// Types
// ============================================

interface PageProps {
    params: { slug: string };
}

interface EventData {
    id: string;
    slug: string;
    status: string;
    template_id: string | null;
    content: InvitationContent;
    plan: PlanType;
    event_type: string;
    expires_at: string | null;
    password_hash: string | null;
}

// ============================================
// Generate Metadata (with noindex for public invites)
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = params;
    const supabase = await createClient();

    if (!supabase) {
        return {
            title: "Convite",
            robots: { index: false, follow: false }, // noindex
        };
    }

    const { data: event } = await supabase
        .from("events")
        .select("content, event_type")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!event) {
        return {
            title: "Convite não encontrado",
            robots: { index: false, follow: false },
        };
    }

    const content = event.content as InvitationContent;
    const eventType = event.event_type || "wedding";

    // Build title based on event type
    let title: string;
    let description: string;

    if (eventType === "graduation") {
        const graduateName = content.couple?.brideName || "Formatura";
        title = `${graduateName} | Convite de Formatura`;
        description = content.messages?.welcomeText || "Você está convidado para minha formatura!";
    } else {
        const coupleNames = [content.couple?.brideName, content.couple?.groomName]
            .filter(Boolean)
            .join(" & ") || "Casamento";
        title = `${coupleNames} | Convite de Casamento`;
        description = content.messages?.welcomeText || "Você está convidado para o nosso casamento!";
    }

    return {
        title,
        description,
        robots: { index: false, follow: false }, // noindex por padrão
        openGraph: {
            title,
            description,
        },
    };
}

// ============================================
// Expiration Page
// ============================================

function ExpiredPage({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-[#C19B58]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-medium text-[#2A3B2E] mb-4">
                    Convite Expirado
                </h1>
                <p className="text-[#6B7A6C] mb-8">
                    Este convite não está mais disponível.
                    O período de visualização terminou.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block px-6 py-3 bg-[#C19B58] text-white rounded-full hover:bg-[#A88347] transition-colors"
                    >
                        Criar meu próprio convite
                    </Link>
                    <p className="text-xs text-[#A5B5A7]">
                        Dono do convite? Entre em contato para renovar.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Draft Page
// ============================================

function DraftPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-[#C19B58]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-medium text-[#2A3B2E] mb-4">
                    Convite em Preparação
                </h1>
                <p className="text-[#6B7A6C]">
                    Este convite ainda está sendo preparado.
                    Volte em breve para conferir os detalhes!
                </p>
            </div>
        </div>
    );
}

// ============================================
// Page Component
// ============================================

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = params;
    const supabase = await createClient();

    // If Supabase not configured, show not found
    if (!supabase) {
        notFound();
    }

    // Fetch event by slug with all needed fields
    const { data: event, error } = await supabase
        .from("events")
        .select("id, slug, status, template_id, content, plan, event_type, expires_at, password_hash")
        .eq("slug", slug)
        .single();

    // Event not found
    if (error || !event) {
        notFound();
    }

    // Type cast event
    const eventData = event as unknown as EventData;

    // Event not published - show draft page
    if (eventData.status !== "published") {
        return <DraftPage />;
    }

    // Check expiration
    if (eventData.expires_at && new Date(eventData.expires_at) < new Date()) {
        return <ExpiredPage slug={slug} />;
    }

    // Get plan info
    const plan = (eventData.plan || "free") as PlanType;
    const showWatermark = hasWatermark(plan);

    // TODO: Password protection will be handled by a client component wrapper
    // For now, we skip password check if password_hash exists
    // This will be implemented in a follow-up with cookies/session

    // Merge content with defaults
    const rawContent = eventData.content as Partial<InvitationContent>;
    const content: InvitationContent = {
        couple: { ...DEFAULT_INVITATION_CONTENT.couple, ...rawContent?.couple },
        event: { ...DEFAULT_INVITATION_CONTENT.event, ...rawContent?.event },
        locations: { ...DEFAULT_INVITATION_CONTENT.locations, ...rawContent?.locations },
        messages: { ...DEFAULT_INVITATION_CONTENT.messages, ...rawContent?.messages },
        theme: { ...DEFAULT_INVITATION_CONTENT.theme, ...rawContent?.theme },
        rsvp: { ...DEFAULT_INVITATION_CONTENT.rsvp, ...rawContent?.rsvp },
    };

    // Get template component
    const TemplateComponent = getTemplate(eventData.template_id || "default");

    return (
        <>
            <TemplateComponent content={content} isPreview={false} slug={slug} />

            {/* Watermark for Free plan */}
            {showWatermark && <Watermark />}

            {/* Report button for all public invites */}
            <ReportButton slug={slug} />
        </>
    );
}
