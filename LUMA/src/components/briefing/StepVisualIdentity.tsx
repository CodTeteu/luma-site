"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Palette, Type, Sliders, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    BriefingFormData,
    weddingStyles,
    typographyOptions,
    colorPalettes,
    ColorPalette
} from "@/lib/briefingSchema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface StepVisualIdentityProps {
    form: UseFormReturn<BriefingFormData>;
}

// Sub-component for a visual selectable card
function SelectionCard({
    selected,
    onClick,
    children,
    className = ""
}: {
    selected: boolean,
    onClick: () => void,
    children: React.ReactNode,
    className?: string
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative cursor-pointer rounded-lg border transition-all duration-200 overflow-hidden group hover:scale-[1.02]",
                selected
                    ? "border-[#C19B58] bg-[#F7F5F0] shadow-md ring-1 ring-[#C19B58]"
                    : "border-neutral-200 bg-white shadow-sm hover:border-[#C19B58]/50",
                className
            )}
        >
            {children}
            {selected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C19B58] rounded-full flex items-center justify-center text-white shadow-sm animate-scale-in">
                    <Check size={10} strokeWidth={3} />
                </div>
            )}
        </div>
    )
}

export function StepVisualIdentity({ form }: StepVisualIdentityProps) {
    const { control, watch, setValue, formState: { errors } } = form;
    const [showCustomColors, setShowCustomColors] = useState(false);

    // Watch values for preview
    const selectedStyle = watch("weddingStyle");
    const selectedFont = watch("fontPreference");
    const selectedPalette = watch("colorPalette");
    const primaryColor = watch("primaryColor");
    const secondaryColor = watch("secondaryColor");
    const backgroundColor = watch("backgroundColor");

    // Handle Palette Selection
    const handlePaletteSelect = (palette: ColorPalette) => {
        setValue("colorPalette", palette.value);
        setValue("primaryColor", palette.colors[0]);
        setValue("secondaryColor", palette.colors[1]);
        setValue("backgroundColor", palette.colors[2]);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-4">
            <div className="text-center mb-6">
                <h2 className="text-xl text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-1">
                    Identidade do Evento
                </h2>
                <p className="text-[#6B7A6C] text-xs italic">
                    Escolha o estilo que mais combina com vocês.
                </p>
            </div>

            {/* 1. WEDDING STYLE (Compact Grid) */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[#2A3B2E] text-sm font-medium">
                    <Palette className="w-3.5 h-3.5 text-[#C19B58]" />
                    Qual o estilo do casamento?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weddingStyles.map((style) => (
                        <SelectionCard
                            key={style.value}
                            selected={selectedStyle === style.value}
                            onClick={() => setValue("weddingStyle", style.value as any)}
                            className="p-3 flex flex-col items-center justify-center text-center gap-1 min-h-[80px]"
                        >
                            <span className="text-lg mb-0.5 filter drop-shadow-sm">{style.label.split(" ")[0]}</span>
                            <h3 className="font-bold text-[#2A3B2E] text-xs transition-colors">{style.label.split(" ").slice(1).join(" ")}</h3>
                        </SelectionCard>
                    ))}
                </div>
                {errors.weddingStyle && <p className="text-red-500 text-[10px]">{errors.weddingStyle.message}</p>}
            </div>

            {/* 2. TYPOGRAPHY (Compact Grid) */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[#2A3B2E] text-sm font-medium">
                    <Type className="w-3.5 h-3.5 text-[#C19B58]" />
                    Preferência de Tipografia
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {typographyOptions.map((font) => (
                        <SelectionCard
                            key={font.value}
                            selected={selectedFont === font.value}
                            onClick={() => setValue("fontPreference", font.value as any)}
                            className="p-3 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-[#F7F5F0] rounded flex items-center justify-center text-lg text-[#2A3B2E] font-medium border border-[#DCD3C5]">
                                <span className={
                                    font.value === 'classica' ? 'font-serif' :
                                        font.value === 'moderna' ? 'font-sans' :
                                            font.value === 'romantica' ? 'italic font-serif' :
                                                'font-mono'
                                }>
                                    Aa
                                </span>
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-[#2A3B2E] text-xs">{font.label}</h3>
                                <p className="text-[10px] text-[#6B7A6C]">{font.description}</p>
                            </div>
                        </SelectionCard>
                    ))}
                </div>
            </div>

            {/* 3. COLOR PALETTE (Compact Swatches) */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[#2A3B2E] text-sm font-medium">
                    <Sliders className="w-3.5 h-3.5 text-[#C19B58]" />
                    Paleta de Cores
                </Label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {colorPalettes.map((palette) => (
                        <SelectionCard
                            key={palette.value}
                            selected={selectedPalette === palette.value}
                            onClick={() => handlePaletteSelect(palette)}
                            className="p-3"
                        >
                            <div className="flex gap-1.5 mb-2 justify-center">
                                {palette.colors.map((c, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full shadow-sm border border-black/5" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-[#2A3B2E] text-[10px] leading-tight">{palette.label}</h3>
                            </div>
                        </SelectionCard>
                    ))}
                </div>

                {/* Custom Colors Toggle */}
                <div className="pt-2 border-t border-[#DCD3C5]/30 mt-2">
                    <button
                        type="button"
                        onClick={() => setShowCustomColors(!showCustomColors)}
                        className="text-[10px] text-[#C19B58] hover:underline font-medium flex items-center gap-1 opacity-80 hover:opacity-100"
                    >
                        {showCustomColors ? "Ocultar cores personalizadas" : "Ajuste manual de cores"}
                    </button>

                    {showCustomColors && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="grid grid-cols-3 gap-2 mt-2 bg-white p-3 rounded-lg border border-[#DCD3C5]"
                        >
                            <div>
                                <Label className="text-[9px] uppercase text-[#6B7A6C]">Primária</Label>
                                <div className="flex items-center gap-1 mt-1">
                                    <input type="color" value={primaryColor} onChange={e => setValue("primaryColor", e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-[9px] uppercase text-[#6B7A6C]">Secundária</Label>
                                <div className="flex items-center gap-1 mt-1">
                                    <input type="color" value={secondaryColor} onChange={e => setValue("secondaryColor", e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-[9px] uppercase text-[#6B7A6C]">Fundo</Label>
                                <div className="flex items-center gap-1 mt-1">
                                    <input type="color" value={backgroundColor} onChange={e => setValue("backgroundColor", e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
