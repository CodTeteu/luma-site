"use client";

import { useState } from "react";
import { Lock, Palette, Type, Gift, Sparkles, ChevronDown, ChevronUp, MapPin, Heart, Home, Clock } from "lucide-react";
import UpgradeModal from "./UpgradeModal";
import { TemplateData } from "@/types/template";

// Type for nested objects in TemplateData
type NestedTemplateKeys = "couple" | "ceremony" | "reception";
type NestedValue = TemplateData[NestedTemplateKeys];

interface EditorSidebarProps {
    data: TemplateData;
    onChange: <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => void;
}

export default function EditorSidebar({ data, onChange }: EditorSidebarProps) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [lockedFeature, setLockedFeature] = useState("");
    const [openSection, setOpenSection] = useState<string | null>("home");

    // Progress Calculation
    const progress = 60;

    const handleLockedClick = (feature: string) => {
        setLockedFeature(feature);
        setShowUpgrade(true);
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const updateNested = (parent: NestedTemplateKeys, child: string, value: string) => {
        const currentParent = data[parent] as NestedValue;
        onChange(parent, { ...currentParent, [child]: value } as TemplateData[typeof parent]);
    };

    return (
        <>
            <div className="w-full h-full bg-[#F7F5F0] border-r border-[#DCD3C5] flex flex-col font-sans">

                {/* HEADER & PROGRESS */}
                <div className="p-6 border-b border-[#DCD3C5] bg-[#F7F5F0]">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">Editor do Site</h2>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C19B58] bg-[#C19B58]/10 px-2 py-1 rounded-full">Plano Grátis</span>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-medium text-[#6B7A6C] mb-1">
                            <span>Nível do Site</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#E5E0D6] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#C19B58] to-[#D4B56A] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <button onClick={() => handleLockedClick("Acesso Completo")} className="text-[10px] text-[#C19B58] font-bold mt-2 hover:underline flex items-center gap-1 uppercase tracking-wide">
                            <Sparkles size={10} />
                            Desbloquear Premium
                        </button>
                    </div>
                </div>

                {/* SECTIONS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* 1. HOME / INÍCIO */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <button
                            onClick={() => toggleSection("home")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-[#E5E0D6]/50 transition-colors ${openSection === 'home' ? 'bg-[#E5E0D6]/50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <Home size={18} className="text-[#6B7A6C]" />
                                <span className="font-medium text-[#2A3B2E]">Capa & Início</span>
                            </div>
                            {openSection === 'home' ? <ChevronUp size={16} className="text-[#6B7A6C]" /> : <ChevronDown size={16} className="text-[#6B7A6C]" />}
                        </button>

                        {openSection === 'home' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Nome do Noivo</label>
                                    <input type="text" value={data.groomName} onChange={(e) => onChange("groomName", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Nome da Noiva</label>
                                    <input type="text" value={data.brideName} onChange={(e) => onChange("brideName", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Data</label>
                                    <input type="date" value={data.date} onChange={(e) => onChange("date", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                </div>

                                {/* UPSELL: Fontes */}
                                <div onClick={() => handleLockedClick("Tipografia")} className="relative opacity-70 hover:opacity-100 transition-opacity cursor-pointer group border border-dashed border-[#DCD3C5] rounded-lg p-3 mt-4 bg-[#F7F5F0]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-[#6B7A6C] flex items-center gap-2"><Type size={12} /> Fontes</span>
                                        <Lock size={12} className="text-[#C19B58]" />
                                    </div>
                                    <div className="h-2 w-2/3 bg-[#E5E0D6] rounded mb-1"></div>
                                    <div className="h-2 w-1/2 bg-[#E5E0D6] rounded"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] bg-[#C19B58] text-white px-2 py-1 rounded shadow-sm font-bold">Mudar Tipografia</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. O CASAL */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <button
                            onClick={() => toggleSection("couple")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-[#E5E0D6]/50 transition-colors ${openSection === 'couple' ? 'bg-[#E5E0D6]/50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={18} className="text-[#6B7A6C]" />
                                <span className="font-medium text-[#2A3B2E]">O Casal</span>
                            </div>
                            {openSection === 'couple' ? <ChevronUp size={16} className="text-[#6B7A6C]" /> : <ChevronDown size={16} className="text-[#6B7A6C]" />}
                        </button>

                        {openSection === 'couple' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">História do Casal</label>
                                    <textarea rows={3} value={data.couple?.description || ""} onChange={(e) => updateNested("couple", "description", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F] resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Bio Noiva</label>
                                        <input type="text" value={data.couple?.brideBio || ""} onChange={(e) => updateNested("couple", "brideBio", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Bio Noivo</label>
                                        <input type="text" value={data.couple?.groomBio || ""} onChange={(e) => updateNested("couple", "groomBio", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. CERIMÔNIA */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <button
                            onClick={() => toggleSection("ceremony")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-[#E5E0D6]/50 transition-colors ${openSection === 'ceremony' ? 'bg-[#E5E0D6]/50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-[#6B7A6C]" />
                                <span className="font-medium text-[#2A3B2E]">Cerimônia & Festa</span>
                            </div>
                            {openSection === 'ceremony' ? <ChevronUp size={16} className="text-[#6B7A6C]" /> : <ChevronDown size={16} className="text-[#6B7A6C]" />}
                        </button>

                        {openSection === 'ceremony' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-3 pb-4 border-b border-[#DCD3C5]/50">
                                    <p className="text-xs font-bold text-[#6B7A6C] uppercase">Cerimônia</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Local</label>
                                        <input type="text" value={data.ceremony?.locationName || ""} onChange={(e) => updateNested("ceremony", "locationName", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Horário</label>
                                            <input type="time" value={data.ceremony?.time || ""} onChange={(e) => updateNested("ceremony", "time", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-[#6B7A6C] uppercase">Recepção</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Local da Festa</label>
                                        <input type="text" value={data.reception?.locationName || ""} onChange={(e) => updateNested("reception", "locationName", e.target.value)} className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]" />
                                    </div>
                                </div>

                                {/* UPSELL: Maps */}
                                <button onClick={() => handleLockedClick("Mapas Interativos")} className="w-full py-2 border border-dashed border-[#C19B58]/30 bg-[#C19B58]/5 rounded-lg text-xs font-medium text-[#C19B58] flex items-center justify-center gap-2 hover:bg-[#C19B58]/10 transition-colors">
                                    <MapPin size={12} />
                                    Liberar Mapas Interativos
                                    <Lock size={10} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 4. DESIGN (LOCKED) */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <button
                            onClick={() => handleLockedClick("Design e Cores")}
                            className="w-full flex items-center justify-between p-4 hover:bg-[#C19B58]/5 group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Palette size={18} className="text-[#6B7A6C] group-hover:text-[#C19B58]" />
                                <span className="font-medium text-[#2A3B2E]">Cores e Design</span>
                            </div>
                            <Lock size={16} className="text-[#C19B58]/50 group-hover:text-[#C19B58]" />
                        </button>
                    </div>

                    {/* 5. LISTA DE PRESENTES (LOCKED) */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <button
                            onClick={() => handleLockedClick("Lista de Presentes")}
                            className="w-full flex items-center justify-between p-4 hover:bg-[#C19B58]/5 group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Gift size={18} className="text-[#6B7A6C] group-hover:text-[#C19B58]" />
                                <span className="font-medium text-[#2A3B2E]">Lista de Presentes (PIX)</span>
                            </div>
                            <Lock size={16} className="text-[#C19B58]/50 group-hover:text-[#C19B58]" />
                        </button>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-[#DCD3C5] bg-[#F7F5F0] z-10">
                    <button className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1f2d22] transition-colors shadow-lg shadow-[#2A3B2E]/20 flex items-center justify-center gap-2">
                        Salvar e Publicar
                    </button>
                    <p className="text-[10px] text-[#6B7A6C] text-center mt-3">
                        Última alteração salva agora mesmo
                    </p>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                featureName={lockedFeature}
            />
        </>
    );
}
