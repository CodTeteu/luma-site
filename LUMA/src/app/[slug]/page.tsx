import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/templates/registry";
import { InvitationContent, DEFAULT_INVITATION_CONTENT } from "@/types/invitation";
import { Metadata } from "next";

// ============================================
// Types
// ============================================

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ============================================
// Generate Metadata
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    if (!supabase) {
        return { title: "Convite" };
    }

    const { data: event } = await supabase
        .from("events")
        .select("content")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!event) {
        return { title: "Convite não encontrado" };
    }

    const content = event.content as InvitationContent;
    const coupleNames = [content.couple?.brideName, content.couple?.groomName]
        .filter(Boolean)
        .join(" & ") || "Casamento";

    return {
        title: `${coupleNames} | Convite de Casamento`,
        description: content.messages?.welcomeText || "Você está convidado para o nosso casamento!",
        openGraph: {
            title: `${coupleNames} - Convite de Casamento`,
            description: content.messages?.welcomeText || "Você está convidado para o nosso casamento!",
        },
    };
}

// ============================================
// Page Component
// ============================================

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // If Supabase not configured, show not found
    if (!supabase) {
        notFound();
    }

    // Fetch event by slug
    const { data: event, error } = await supabase
        .from("events")
        .select("id, slug, status, template_id, content")
        .eq("slug", slug)
        .single();

    // Event not found
    if (error || !event) {
        notFound();
    }

    // Event not published
    if (event.status !== "published") {
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
                    <h1 className="text-2xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Convite em Preparação
                    </h1>
                    <p className="text-[#6B7A6C]">
                        Este convite ainda está sendo preparado pelos noivos.
                        Volte em breve para conferir os detalhes!
                    </p>
                </div>
            </div>
        );
    }

    // Merge content with defaults
    const rawContent = event.content as Partial<InvitationContent>;
    const content: InvitationContent = {
        couple: { ...DEFAULT_INVITATION_CONTENT.couple, ...rawContent?.couple },
        event: { ...DEFAULT_INVITATION_CONTENT.event, ...rawContent?.event },
        locations: { ...DEFAULT_INVITATION_CONTENT.locations, ...rawContent?.locations },
        messages: { ...DEFAULT_INVITATION_CONTENT.messages, ...rawContent?.messages },
        theme: { ...DEFAULT_INVITATION_CONTENT.theme, ...rawContent?.theme },
        rsvp: { ...DEFAULT_INVITATION_CONTENT.rsvp, ...rawContent?.rsvp },
    };

    // Get template component
    const TemplateComponent = getTemplate(event.template_id || "default");

    return <TemplateComponent content={content} isPreview={false} slug={slug} />;
}
