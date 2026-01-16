"use client";

import { useState } from "react";
import { CheckCircle, Sparkles, Calendar, Palette, Wallet, MessageCircle, Undo2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefingFormData, weddingStyles, pixKeyTypes, colorPalettes, typographyOptions } from "@/lib/briefingSchema";
import { generateBriefingJson } from "@/lib/generateBriefingJson";

interface SummaryCardProps {
    data: BriefingFormData;
    onReset: () => void;
    onEdit?: () => void;
}

function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function SectionPreview({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="relative pl-6 pb-6 border-l border-[#DCD3C5]/50 last:border-0 last:pb-0">
            <span className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-[#F7F5F0] border border-[#DCD3C5] flex items-center justify-center">
                <Icon className="w-3 h-3 text-gold" />
            </span>
            <h4 className="text-forest font-heading text-lg mb-3 leading-none">{title}</h4>
            <div className="space-y-2 text-sm text-[#3E4A3F]/80">
                {children}
            </div>
        </div>
    )
}

export function SummaryCard({ data, onReset, onEdit }: SummaryCardProps) {
    // Generate JSON for WhatsApp message
    const briefingJson = generateBriefingJson(data);
    const jsonString = JSON.stringify(briefingJson, null, 2);

    // Resolve Labels
    const styleName = weddingStyles.find(s => s.value === data.weddingStyle)?.label || data.weddingStyle;
    const pixTypeName = pixKeyTypes.find(t => t.value === data.pixKeyType)?.label || data.pixKeyType;
    const paletteName = colorPalettes.find(p => p.value === data.colorPalette)?.label || "Personalizada";
    const fontName = typographyOptions.find(f => f.value === data.fontPreference)?.label || data.fontPreference;

    const handleSendToWhatsApp = () => {
        const message = `Olá! Finalizei o preenchimento do briefing LUMA. Aqui estão os detalhes:
    
*Casal:* ${data.brideName} & ${data.groomName}
*Data:* ${formatDate(data.weddingDate)}
*Estilo:* ${styleName}
*Paleta:* ${paletteName}

*JSON Completo:*
${jsonString}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="space-y-8 animate-fade-in-up max-w-2xl mx-auto relative">

            {/* Top Navigation Options */}
            <div className="flex justify-end gap-3 mb-2">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="text-[10px] uppercase tracking-wider text-[#6B7A6C] hover:text-[#C19B58] flex items-center gap-1 transition-colors font-medium border border-transparent hover:border-[#DCD3C5] px-3 py-1.5 rounded-full"
                    >
                        <Undo2 className="w-3 h-3" /> Editar Briefing
                    </button>
                )}
                <button
                    onClick={onReset}
                    className="text-[10px] uppercase tracking-wider text-[#6B7A6C] hover:text-[#C19B58] flex items-center gap-1 transition-colors font-medium border border-transparent hover:border-[#DCD3C5] px-3 py-1.5 rounded-full"
                >
                    <PlusCircle className="w-3 h-3" /> Novo Briefing
                </button>
            </div>

            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold/30 bg-gold/10 mb-6 animate-pulse-slow">
                    <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-4xl text-forest font-heading mb-3">
                    Briefing Concluído
                </h2>
                <p className="text-muted-foreground font-light max-w-md mx-auto">
                    Tudo pronto! Envie agora para nossa equipe.
                </p>
            </div>

            <Card className="overflow-hidden border-[#DCD3C5] bg-white/90 shadow-2xl shadow-[#2A3B2E]/5 backdrop-blur-sm">
                <CardHeader className="bg-[#F7F5F0]/50 border-b border-[#DCD3C5]/30 py-6">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        Resumo do Projeto
                    </CardTitle>
                    <CardDescription>Confira os detalhes abaixo</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-8">
                    <SectionPreview title="O Casal e o Evento" icon={Calendar}>
                        <p className="font-heading text-forest text-lg">{data.brideName} & {data.groomName}</p>
                        <p className="capitalize">{formatDate(data.weddingDate)} • {data.weddingTime}</p>
                        <p>{data.venueName}</p>
                    </SectionPreview>

                    <SectionPreview title="Identidade Visual" icon={Palette}>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-dashed border-[#DCD3C5] pb-2">
                                <span>Estilo</span>
                                <span className="text-forest font-medium">{styleName}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#DCD3C5] pb-2">
                                <span>Tipografia</span>
                                <span className="text-forest font-medium">{fontName}</span>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Paleta</span>
                                    <span className="text-forest font-medium">{paletteName}</span>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    {[data.primaryColor, data.secondaryColor, data.backgroundColor].map((c, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border border-neutral-200 shadow-sm" style={{ background: c }} title={c} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionPreview>

                    <SectionPreview title="Dados Bancários" icon={Wallet}>
                        <p className="flex justify-between items-center">
                            <span>{pixTypeName}</span>
                            <span className="font-mono text-xs bg-[#F7F5F0] border border-[#DCD3C5] px-2 py-1 rounded text-forest">{data.pixKey}</span>
                        </p>
                        <p>{data.pixHolderName} • {data.pixBank}</p>
                    </SectionPreview>
                </CardContent>
            </Card>

            <div className="pt-4">
                <Button
                    onClick={handleSendToWhatsApp}
                    className="w-full h-16 text-xl bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] rounded-xl font-bold uppercase tracking-wide flex items-center justify-center gap-3"
                >
                    <MessageCircle className="w-7 h-7" />
                    Finalizar no WhatsApp
                </Button>
            </div>

        </div>
    );
}
