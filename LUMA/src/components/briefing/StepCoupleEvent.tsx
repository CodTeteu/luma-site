"use client";

import { UseFormReturn } from "react-hook-form";
import { Heart, MapPin, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BriefingFormData } from "@/lib/briefingSchema";

interface StepCoupleEventProps {
    form: UseFormReturn<BriefingFormData>;
}

export function StepCoupleEvent({ form }: StepCoupleEventProps) {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl text-forest font-heading mb-2">
                    O Casal e o Evento
                </h2>
                <p className="text-muted-foreground font-light italic">
                    Conte-nos sobre a essência da união de vocês
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Nome da Noiva */}
                <div className="space-y-3">
                    <Label htmlFor="brideName" className="flex items-center gap-2 text-forest/80">
                        <span className="text-gold text-lg">✦</span> Nome da Noiva
                    </Label>
                    <Input
                        id="brideName"
                        placeholder="Ex: Maria Clara"
                        {...register("brideName")}
                        className={errors.brideName ? "border-red-500/50" : ""}
                    />
                    {errors.brideName && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.brideName.message}</p>
                    )}
                </div>

                {/* Nome do Noivo */}
                <div className="space-y-3">
                    <Label htmlFor="groomName" className="flex items-center gap-2 text-forest/80">
                        <span className="text-gold text-lg">✦</span> Nome do Noivo
                    </Label>
                    <Input
                        id="groomName"
                        placeholder="Ex: João Pedro"
                        {...register("groomName")}
                        className={errors.groomName ? "border-red-500/50" : ""}
                    />
                    {errors.groomName && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.groomName.message}</p>
                    )}
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DCD3C5] to-transparent my-6 opacity-50" />

            <div className="grid md:grid-cols-2 gap-8">
                {/* Data do Casamento */}
                <div className="space-y-3">
                    <Label htmlFor="weddingDate" className="flex items-center gap-2 text-forest/80">
                        <Calendar className="w-4 h-4 text-gold" /> Data do Grande Dia
                    </Label>
                    <Input
                        id="weddingDate"
                        type="date"
                        {...register("weddingDate")}
                        className={errors.weddingDate ? "border-red-500/50" : ""}
                    />
                    {errors.weddingDate && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.weddingDate.message}</p>
                    )}
                </div>

                {/* Horário */}
                <div className="space-y-3">
                    <Label htmlFor="weddingTime" className="flex items-center gap-2 text-forest/80">
                        <Clock className="w-4 h-4 text-gold" /> Horário
                    </Label>
                    <Input
                        id="weddingTime"
                        type="time"
                        {...register("weddingTime")}
                        className={errors.weddingTime ? "border-red-500/50" : ""}
                    />
                    {errors.weddingTime && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.weddingTime.message}</p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Nome do Local */}
                <div className="space-y-3">
                    <Label htmlFor="venueName" className="flex items-center gap-2 text-forest/80">
                        <MapPin className="w-4 h-4 text-gold" /> Nome do Local
                    </Label>
                    <Input
                        id="venueName"
                        placeholder="Ex: Fazenda Vista Verde"
                        {...register("venueName")}
                        className={errors.venueName ? "border-red-500/50" : ""}
                    />
                    {errors.venueName && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.venueName.message}</p>
                    )}
                </div>

                {/* Endereço */}
                <div className="space-y-3">
                    <Label htmlFor="venueAddress" className="flex items-center gap-2 text-forest/80">
                        <MapPin className="w-4 h-4 text-gold opaque-0" /> Endereço Completo
                    </Label>
                    <Input
                        id="venueAddress"
                        placeholder="Rodovia ou Link do Google Maps"
                        {...register("venueAddress")}
                        className={errors.venueAddress ? "border-red-500/50" : ""}
                    />
                    {errors.venueAddress && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.venueAddress.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
