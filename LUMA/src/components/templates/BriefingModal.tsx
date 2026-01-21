"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Heart,
    Calendar,
    MapPin,
    Users,
    Palette,
    MessageCircle,
    ChevronRight,
    ChevronLeft,
    Check,
    Sparkles,
    Send,
} from "lucide-react";
import { Template } from "./templateData";
import { useBriefing, BriefingData } from "@/contexts/BriefingContext";

interface BriefingModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: Template | null;
}

interface BriefingFormData {
    brideName: string;
    groomName: string;
    email: string;
    phone: string;
    weddingDate: string;
    ceremonyTime: string;
    partyTime: string;
    ceremonyLocation: string;
    partyLocation: string;
    guestCount: string;
    style: string;
    colors: string;
    message: string;
}

const initialFormData: BriefingFormData = {
    brideName: "",
    groomName: "",
    email: "",
    phone: "",
    weddingDate: "",
    ceremonyTime: "",
    partyTime: "",
    ceremonyLocation: "",
    partyLocation: "",
    guestCount: "",
    style: "",
    colors: "",
    message: "",
};

const steps = [
    { id: 1, title: "Noivos", icon: Heart },
    { id: 2, title: "Evento", icon: Calendar },
    { id: 3, title: "Estilo", icon: Palette },
    { id: 4, title: "Enviar", icon: Check },
];

export function BriefingModal({ isOpen, onClose, template }: BriefingModalProps) {
    const router = useRouter();
    const { setBriefingData } = useBriefing();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<BriefingFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setFormData(initialFormData);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const updateField = (field: keyof BriefingFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep((prev) => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const formatWhatsAppMessage = () => {
        const templateName = template ? `${template.name} (${template.style})` : "Não especificado";
        return `🌸 *NOVO PEDIDO LUMA* 🌸

📋 *Template:* ${templateName}

💑 *Noivos:* ${formData.brideName || "-"} & ${formData.groomName || "-"}
📧 *Email:* ${formData.email || "-"}
📱 *Tel:* ${formData.phone || "-"}

📅 *Data:* ${formData.weddingDate || "-"}
🕐 *Cerimônia:* ${formData.ceremonyTime || "-"}
🎉 *Festa:* ${formData.partyTime || "-"}
👥 *Convidados:* ${formData.guestCount || "-"}

📍 *Cerimônia:* ${formData.ceremonyLocation || "-"}
📍 *Festa:* ${formData.partyLocation || "-"}

🎨 *Estilo:* ${formData.style || "-"}
🌈 *Cores:* ${formData.colors || "-"}

💬 ${formData.message || "-"}`;
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const briefingData: BriefingData = {
            templateId: template?.id || "",
            templateName: template?.name || "",
            templateStyle: template?.style || "",
            ...formData,
            submittedAt: new Date().toISOString(),
            status: "pending",
        };
        setBriefingData(briefingData);

        const message = formatWhatsAppMessage();
        const whatsappUrl = `https://wa.me/5551985367454?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");

        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            router.push("/dashboard");
        }, 1000);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return formData.brideName && formData.groomName;
            case 2: return formData.weddingDate;
            default: return true;
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full h-12 px-4 bg-white border border-[#E5E0D6] rounded-xl text-[15px] focus:outline-none focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58]/20 transition-all placeholder:text-[#6B7A6C]/50";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal - Full height on mobile like iOS sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-lg h-[92vh] md:h-auto md:max-h-[85vh] bg-[#F7F5F0] rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden"
                    >
                        {/* Handle bar - iOS style */}
                        <div className="pt-2 pb-1 flex justify-center md:hidden">
                            <div className="w-10 h-1 bg-[#DCD3C5] rounded-full" />
                        </div>

                        {/* Header - Compact */}
                        <div className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] relative">
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white rounded-full hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 bg-[#C19B58]/20 rounded-full flex items-center justify-center">
                                    <Sparkles size={14} className="text-[#C19B58]" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-white">Solicitar Orçamento</h2>
                                    {template && (
                                        <p className="text-[11px] text-white/60">
                                            {template.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Steps - Compact pills */}
                            <div className="flex gap-1.5">
                                {steps.map((step) => {
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;
                                    return (
                                        <div
                                            key={step.id}
                                            className={`flex-1 h-1 rounded-full transition-all ${isCompleted ? "bg-[#C19B58]" : isActive ? "bg-white" : "bg-white/20"
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {currentStep === 1 && (
                                        <div className="space-y-4">
                                            <div className="text-center mb-5">
                                                <h3 className="text-lg font-semibold text-[#2A3B2E]">Sobre vocês 💍</h3>
                                                <p className="text-[13px] text-[#6B7A6C]">Informações do casal</p>
                                            </div>
                                            <input type="text" value={formData.brideName} onChange={(e) => updateField("brideName", e.target.value)} placeholder="Nome da Noiva *" className={inputClass} />
                                            <input type="text" value={formData.groomName} onChange={(e) => updateField("groomName", e.target.value)} placeholder="Nome do Noivo *" className={inputClass} />
                                            <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" className={inputClass} />
                                            <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="WhatsApp" className={inputClass} />
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-4">
                                            <div className="text-center mb-5">
                                                <h3 className="text-lg font-semibold text-[#2A3B2E]">O Evento 📅</h3>
                                                <p className="text-[13px] text-[#6B7A6C]">Detalhes do casamento</p>
                                            </div>
                                            <div>
                                                <label className="block text-[12px] font-medium text-[#6B7A6C] mb-1.5 uppercase tracking-wide">Data *</label>
                                                <input type="date" value={formData.weddingDate} onChange={(e) => updateField("weddingDate", e.target.value)} className={inputClass} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[12px] font-medium text-[#6B7A6C] mb-1.5 uppercase tracking-wide">Cerimônia</label>
                                                    <input type="time" value={formData.ceremonyTime} onChange={(e) => updateField("ceremonyTime", e.target.value)} className={inputClass} />
                                                </div>
                                                <div>
                                                    <label className="block text-[12px] font-medium text-[#6B7A6C] mb-1.5 uppercase tracking-wide">Festa</label>
                                                    <input type="time" value={formData.partyTime} onChange={(e) => updateField("partyTime", e.target.value)} className={inputClass} />
                                                </div>
                                            </div>
                                            <select value={formData.guestCount} onChange={(e) => updateField("guestCount", e.target.value)} className={inputClass}>
                                                <option value="">Convidados...</option>
                                                <option value="Até 50">Até 50</option>
                                                <option value="50-100">50 a 100</option>
                                                <option value="100-200">100 a 200</option>
                                                <option value="200+">Mais de 200</option>
                                            </select>
                                            <input type="text" value={formData.ceremonyLocation} onChange={(e) => updateField("ceremonyLocation", e.target.value)} placeholder="Local da Cerimônia" className={inputClass} />
                                            <input type="text" value={formData.partyLocation} onChange={(e) => updateField("partyLocation", e.target.value)} placeholder="Local da Festa" className={inputClass} />
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-4">
                                            <div className="text-center mb-5">
                                                <h3 className="text-lg font-semibold text-[#2A3B2E]">Estilo 🎨</h3>
                                                <p className="text-[13px] text-[#6B7A6C]">Suas preferências</p>
                                            </div>
                                            <select value={formData.style} onChange={(e) => updateField("style", e.target.value)} className={inputClass}>
                                                <option value="">Selecione o estilo...</option>
                                                <option value="Clássico">Clássico</option>
                                                <option value="Moderno">Moderno</option>
                                                <option value="Romântico">Romântico</option>
                                                <option value="Rústico">Rústico</option>
                                                <option value="Boho">Boho</option>
                                                <option value="Praia">Praia</option>
                                                <option value="Luxuoso">Luxuoso</option>
                                            </select>
                                            <input type="text" value={formData.colors} onChange={(e) => updateField("colors", e.target.value)} placeholder="Cores preferidas" className={inputClass} />
                                            <textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)} placeholder="Observações..." rows={3} className={`${inputClass} h-auto py-3 resize-none`} />
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-4">
                                            <div className="text-center mb-5">
                                                <div className="w-14 h-14 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Check size={24} className="text-[#C19B58]" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-[#2A3B2E]">Tudo Pronto! 🎉</h3>
                                                <p className="text-[13px] text-[#6B7A6C]">Revise e envie</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 space-y-3 border border-[#E5E0D6]">
                                                <div className="flex items-center gap-3">
                                                    <Heart size={16} className="text-[#C19B58]" />
                                                    <div>
                                                        <p className="text-[11px] text-[#6B7A6C] uppercase">Casal</p>
                                                        <p className="text-[14px] text-[#2A3B2E] font-medium">{formData.brideName} & {formData.groomName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={16} className="text-[#C19B58]" />
                                                    <div>
                                                        <p className="text-[11px] text-[#6B7A6C] uppercase">Data</p>
                                                        <p className="text-[14px] text-[#2A3B2E] font-medium">{formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString("pt-BR") : "-"}</p>
                                                    </div>
                                                </div>
                                                {template && (
                                                    <div className="flex items-center gap-3">
                                                        <Palette size={16} className="text-[#C19B58]" />
                                                        <div>
                                                            <p className="text-[11px] text-[#6B7A6C] uppercase">Template</p>
                                                            <p className="text-[14px] text-[#2A3B2E] font-medium">{template.name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-[#C19B58]/10 rounded-xl p-3 border border-[#C19B58]/20">
                                                <p className="text-[12px] text-[#2A3B2E] text-center">
                                                    Você será redirecionado ao WhatsApp
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer - Fixed */}
                        <div className="px-4 md:px-6 py-3 bg-white border-t border-[#E5E0D6] flex gap-3 safe-area-inset-bottom">
                            {currentStep > 1 && (
                                <button
                                    onClick={prevStep}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#E5E0D6] text-[#6B7A6C] active:bg-[#F7F5F0]"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            )}

                            {currentStep < 4 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!isStepValid()}
                                    className={`flex-1 h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all ${isStepValid()
                                            ? "bg-[#2A3B2E] text-white active:bg-[#1a261d]"
                                            : "bg-[#E5E0D6] text-[#6B7A6C]"
                                        }`}
                                >
                                    Continuar
                                    <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 bg-[#C19B58] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#C19B58]/25 active:bg-[#b08d4b]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Enviar WhatsApp
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
