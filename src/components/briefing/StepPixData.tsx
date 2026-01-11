"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Wallet, Building, User, Key, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BriefingFormData, pixKeyTypes } from "@/lib/briefingSchema";

interface StepPixDataProps {
    form: UseFormReturn<BriefingFormData>;
}

export function StepPixData({ form }: StepPixDataProps) {
    const { register, control, formState: { errors } } = form;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl text-forest font-heading mb-2">
                    Lista de Presentes
                </h2>
                <p className="text-muted-foreground font-light italic">
                    Facilidade para seus convidados, segurança para vocês
                </p>
            </div>

            {/* Elegant Warning Card */}
            <div className="p-4 rounded-lg bg-[#F7F5F0] border border-[#DCD3C5] flex gap-4 items-start">
                <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-medium text-forest">Atenção aos dados bancários</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Estas informações serão exibidas diretamente aos seus convidados para a realização de transferências. Verifique cuidadosamente a chave PIX.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Tipo de Chave */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-forest/80">
                        <Key className="w-4 h-4 text-gold" /> Tipo de Chave
                    </Label>
                    <Controller
                        name="pixKeyType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={errors.pixKeyType ? "border-red-500/50" : ""}>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {pixKeyTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.pixKeyType && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.pixKeyType.message}</p>
                    )}
                </div>

                {/* Chave PIX */}
                <div className="space-y-3">
                    <Label htmlFor="pixKey" className="flex items-center gap-2 text-forest/80">
                        <Key className="w-4 h-4 text-gold opacity-0" /> Chave PIX
                    </Label>
                    <Input
                        id="pixKey"
                        placeholder="Digite a chave"
                        {...register("pixKey")}
                        className={errors.pixKey ? "border-red-500/50" : ""}
                    />
                    {errors.pixKey && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.pixKey.message}</p>
                    )}
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DCD3C5] to-transparent my-2 opacity-50" />

            <div className="grid md:grid-cols-2 gap-8">
                {/* Nome do Titular */}
                <div className="space-y-3">
                    <Label htmlFor="pixHolderName" className="flex items-center gap-2 text-forest/80">
                        <User className="w-4 h-4 text-gold" /> Nome do Titular
                    </Label>
                    <Input
                        id="pixHolderName"
                        placeholder="Nome completo de quem recebe"
                        {...register("pixHolderName")}
                        className={errors.pixHolderName ? "border-red-500/50" : ""}
                    />
                    {errors.pixHolderName && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.pixHolderName.message}</p>
                    )}
                </div>

                {/* Banco */}
                <div className="space-y-3">
                    <Label htmlFor="pixBank" className="flex items-center gap-2 text-forest/80">
                        <Building className="w-4 h-4 text-gold" /> Instituição Bancária
                    </Label>
                    <Input
                        id="pixBank"
                        placeholder="Ex: Nubank, Itaú..."
                        {...register("pixBank")}
                        className={errors.pixBank ? "border-red-500/50" : ""}
                    />
                    {errors.pixBank && (
                        <p className="text-xs text-red-500 font-medium ml-1">{errors.pixBank.message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
