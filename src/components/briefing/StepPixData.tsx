"use client";

import { UseFormReturn } from "react-hook-form";
import { Key, Info, Smartphone, Mail, FileText, Shuffle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BriefingFormData, pixKeyTypes } from "@/lib/briefingSchema";
import { cn } from "@/lib/utils";

interface StepPixDataProps {
    form: UseFormReturn<BriefingFormData>;
}

function PixTypeCard({
    selected,
    onClick,
    icon: Icon,
    label
}: {
    selected: boolean,
    onClick: () => void,
    icon: React.ComponentType<{ className?: string }>,
    label: string
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative cursor-pointer rounded-lg border transition-all duration-200 overflow-hidden flex flex-col items-center justify-center p-4 gap-2 hover:scale-[1.02]",
                selected
                    ? "border-[#C19B58] bg-[#F7F5F0] shadow-md ring-1 ring-[#C19B58]"
                    : "border-neutral-200 bg-white shadow-sm hover:border-[#C19B58]/50"
            )}
        >
            <Icon className={cn("w-6 h-6", selected ? "text-[#C19B58]" : "text-gray-400")} />
            <span className={cn("text-xs font-bold uppercase tracking-wider", selected ? "text-[#2A3B2E]" : "text-gray-500")}>
                {label}
            </span>
            {selected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-[#C19B58] rounded-full flex items-center justify-center text-white shadow-sm animate-scale-in">
                    <Check size={10} strokeWidth={3} />
                </div>
            )}
        </div>
    )
}

export function StepPixData({ form }: StepPixDataProps) {
    const { register, watch, setValue, formState: { errors } } = form;
    const selectedPixType = watch("pixKeyType");

    // Icons map
    const icons = {
        cpf: FileText,
        celular: Smartphone,
        email: Mail,
        aleatoria: Shuffle
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-2">
                    Lista de Presentes
                </h2>
                <p className="text-[#6B7A6C] text-sm italic">
                    Dados seguros para seus convidados.
                </p>
            </div>

            {/* Warning Card */}
            <div className="p-3 rounded-lg bg-[#F7F5F0] border border-[#DCD3C5] flex gap-3 items-start mb-6">
                <Info className="w-4 h-4 text-[#C19B58] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Atenção</p>
                    <p className="text-[11px] text-[#6B7A6C] leading-relaxed">
                        Verifique a chave PIX com cuidado. Ela será usada para as transferências.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="flex items-center gap-2 text-[#2A3B2E] text-sm font-medium">
                    <Key className="w-3.5 h-3.5 text-[#C19B58]" />
                    Qual o tipo de chave?
                </Label>

                {/* Visual Selection Grid for PIX Type */}
                <div className="grid grid-cols-2 gap-3">
                    {pixKeyTypes.map((type) => (
                        <PixTypeCard
                            key={type.value}
                            label={type.label}
                            icon={icons[type.value as keyof typeof icons] || Key}
                            selected={selectedPixType === type.value}
                            onClick={() => setValue("pixKeyType", type.value)}
                        />
                    ))}
                </div>
                {errors.pixKeyType && <p className="text-red-500 text-xs">{errors.pixKeyType.message}</p>}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="pixKey" className="text-xs uppercase text-[#6B7A6C] tracking-wider ml-1">Chave PIX</Label>
                    <Input
                        id="pixKey"
                        placeholder={
                            selectedPixType === 'email' ? 'exemplo@email.com' :
                                selectedPixType === 'cpf' ? '000.000.000-00' :
                                    selectedPixType === 'celular' ? '(00) 00000-0000' :
                                        'Chave aleatória copiada do app do banco'
                        }
                        {...register("pixKey")}
                        className={errors.pixKey ? "border-red-500/50" : ""}
                    />
                    {errors.pixKey && <p className="text-red-500 text-xs ml-1">{errors.pixKey.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pixHolderName" className="text-xs uppercase text-[#6B7A6C] tracking-wider ml-1">Nome do Titular</Label>
                        <Input
                            id="pixHolderName"
                            placeholder="Nome completo"
                            {...register("pixHolderName")}
                            className={errors.pixHolderName ? "border-red-500/50" : ""}
                        />
                        {errors.pixHolderName && <p className="text-red-500 text-xs ml-1">{errors.pixHolderName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pixBank" className="text-xs uppercase text-[#6B7A6C] tracking-wider ml-1">Banco</Label>
                        <Input
                            id="pixBank"
                            placeholder="Nubank, Itaú..."
                            {...register("pixBank")}
                            className={errors.pixBank ? "border-red-500/50" : ""}
                        />
                        {errors.pixBank && <p className="text-red-500 text-xs ml-1">{errors.pixBank.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
