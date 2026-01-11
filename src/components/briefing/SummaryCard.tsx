"use client";

import { useState } from "react";
import { CheckCircle, Copy, Sparkles, Calendar, MapPin, Palette, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefingFormData, weddingStyles, pixKeyTypes } from "@/lib/briefingSchema";
import { generateBriefingJson, copyToClipboard } from "@/lib/generateBriefingJson";

interface SummaryCardProps {
    data: BriefingFormData;
    onReset: () => void;
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

export function SummaryCard({ data, onReset }: SummaryCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyJson = async () => {
        const json = generateBriefingJson(data);
        const jsonString = JSON.stringify(json, null, 2);
        const success = await copyToClipboard(jsonString);

        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const styleName = weddingStyles.find(s => s.value === data.weddingStyle)?.label || data.weddingStyle;
    const pixTypeName = pixKeyTypes.find(t => t.value === data.pixKeyType)?.label || data.pixKeyType;

    return (
        <div className="space-y-8 animate-fade-in-up max-w-2xl mx-auto">
            {/* Header de sucesso */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold/30 bg-gold/10 mb-6">
                    <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-4xl text-forest font-heading mb-3">
                    Briefing Concluído
                </h2>
                <p className="text-muted-foreground font-light max-w-md mx-auto">
                    Os dados foram compilados com sucesso. Copie o JSON abaixo para dar início ao processo de criação.
                </p>
            </div>

            {/* Card com resumo */}
            <Card className="overflow-hidden border-[#DCD3C5] bg-white/90 shadow-2xl shadow-[#2A3B2E]/5">
                <CardHeader className="bg-[#F7F5F0]/50 border-b border-[#DCD3C5]/30 py-6">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        Resumo do Projeto
                    </CardTitle>
                    <CardDescription>Confira os dados antes de gerar</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-8">
                    <SectionPreview title="O Casal e o Evento" icon={Calendar}>
                        <p className="font-heading text-forest text-lg">{data.brideName} & {data.groomName}</p>
                        <p className="capitalize">{formatDate(data.weddingDate)} • {data.weddingTime}</p>
                        <p>{data.venueName}</p>
                    </SectionPreview>

                    <SectionPreview title="Identidade Visual" icon={Palette}>
                        <div className="flex items-center justify-between">
                            <span>Estilo <span className="text-forest font-medium">{styleName}</span></span>
                            <div className="flex gap-1">
                                {[data.primaryColor, data.secondaryColor, data.backgroundColor].map(c => (
                                    <div key={c} className="w-5 h-5 rounded-full border border-neutral-200" style={{ background: c }} />
                                ))}
                            </div>
                        </div>
                    </SectionPreview>

                    <SectionPreview title="Dados Bancários" icon={Wallet}>
                        <p className="flex justify-between">
                            <span>{pixTypeName}</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-forest">{data.pixKey}</span>
                        </p>
                        <p>{data.pixHolderName} • {data.pixBank}</p>
                    </SectionPreview>
                </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                    onClick={handleCopyJson}
                    variant="gold"
                    size="lg"
                    className="flex-1 gap-2 shadow-lg shadow-gold/20"
                >
                    {copied ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            JSON Copiado!
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5" />
                            Copiar JSON para IA
                        </>
                    )}
                </Button>
                <Button
                    onClick={onReset}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                >
                    Novo Briefing
                </Button>
            </div>

            {/* JSON Preview Accordion */}
            <div className="border border-[#DCD3C5]/50 rounded-lg overflow-hidden">
                <details className="group">
                    <summary className="p-4 bg-[#F7F5F0]/50 cursor-pointer text-sm text-[#6B7A6C] hover:text-forest transition-colors flex items-center justify-between font-medium">
                        <span>Ver dados brutos (JSON)</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="p-0 bg-[#2A3B2E]">
                        <pre className="p-6 text-xs text-[#F7F5F0] overflow-x-auto font-mono leading-relaxed">
                            {JSON.stringify(generateBriefingJson(data), null, 2)}
                        </pre>
                    </div>
                </details>
            </div>
        </div>
    );
}
