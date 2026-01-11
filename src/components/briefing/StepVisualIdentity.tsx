"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Palette, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BriefingFormData,
    weddingStyles,
    fontPreferences,
} from "@/lib/briefingSchema";

interface StepVisualIdentityProps {
    form: UseFormReturn<BriefingFormData>;
}

interface ColorPickerFieldProps {
    label: string;
    name: "primaryColor" | "secondaryColor" | "backgroundColor";
    form: UseFormReturn<BriefingFormData>;
}

function ColorPickerField({ label, name, form }: ColorPickerFieldProps) {
    const { register, watch, formState: { errors } } = form;
    const colorValue = watch(name);

    return (
        <div className="space-y-2 group">
            <Label htmlFor={name} className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-gold transition-colors">{label}</Label>
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full border border-neutral-200 shadow-sm flex-shrink-0 overflow-hidden relative cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: colorValue }}
                >
                    <input
                        type="color"
                        id={`${name}-picker`}
                        value={colorValue}
                        onChange={(e) => form.setValue(name, e.target.value)}
                        className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 cursor-pointer opacity-0"
                    />
                </div>
                <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">#</span>
                    <Input
                        id={name}
                        placeholder="000000"
                        {...register(name)}
                        className={`pl-6 font-mono uppercase text-sm h-10 ${errors[name] ? "border-red-500" : ""}`}
                        maxLength={7}
                    />
                </div>
            </div>
            {errors[name] && (
                <p className="text-xs text-red-500 font-medium ml-1">{errors[name]?.message}</p>
            )}
        </div>
    );
}

export function StepVisualIdentity({ form }: StepVisualIdentityProps) {
    const { control, watch, formState: { errors } } = form;

    const primaryColor = watch("primaryColor") || "#2A3B2E";
    const secondaryColor = watch("secondaryColor") || "#C19B58";
    const backgroundColor = watch("backgroundColor") || "#F7F5F0";

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl text-forest font-heading mb-2">
                    Identidade Visual
                </h2>
                <p className="text-muted-foreground font-light italic">
                    A estética e a alma do evento
                </p>
            </div>

            <div className="space-y-8">
                {/* Estilo e Fonte Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Estilo do Casamento */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-forest/80">
                            <Palette className="w-4 h-4 text-gold" /> Estilo Principal
                        </Label>
                        <Controller
                            name="weddingStyle"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={errors.weddingStyle ? "border-red-500/50" : ""}>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {weddingStyles.map((style) => (
                                            <SelectItem key={style.value} value={style.value}>
                                                {style.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.weddingStyle && (
                            <p className="text-xs text-red-500 font-medium ml-1">{errors.weddingStyle.message}</p>
                        )}
                    </div>

                    {/* Preferência de Fonte */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-forest/80">
                            <Type className="w-4 h-4 text-gold" /> Tipografia
                        </Label>
                        <Controller
                            name="fontPreference"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={errors.fontPreference ? "border-red-500/50" : ""}>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontPreferences.map((pref) => (
                                            <SelectItem key={pref.value} value={pref.value}>
                                                {pref.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DCD3C5] to-transparent my-4 opacity-50" />

                {/* Paleta de Cores Section */}
                <div className="space-y-6">
                    <Label className="text-forest text-lg font-heading block text-center mb-4">Paleta de Cores</Label>

                    {/* Aesthetic Palette Preview Card */}
                    <div className="w-full h-32 rounded-xl overflow-hidden shadow-sm flex border border-[#DCD3C5]/50 mb-6">
                        <div
                            className="h-full flex-[2] flex items-center justify-center relative p-4 transition-colors duration-500"
                            style={{ backgroundColor: backgroundColor }}
                        >
                            <div className="text-center z-10">
                                <p className="font-heading text-xl mb-1" style={{ color: primaryColor }}>
                                    Maria & João
                                </p>
                                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: primaryColor, opacity: 0.7 }}>
                                    Wedding Day
                                </p>
                            </div>
                        </div>
                        <div
                            className="h-full flex-1 transition-colors duration-500"
                            style={{ backgroundColor: secondaryColor }}
                        />
                        <div
                            className="h-full flex-1 transition-colors duration-500"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F7F5F0]/50 p-6 rounded-2xl border border-[#DCD3C5]/30">
                        <ColorPickerField label="Primária (Texto/Detalhes)" name="primaryColor" form={form} />
                        <ColorPickerField label="Secundária (Destaques)" name="secondaryColor" form={form} />
                        <ColorPickerField label="Background (Fundo)" name="backgroundColor" form={form} />
                    </div>
                </div>
            </div>
        </div>
    );
}
