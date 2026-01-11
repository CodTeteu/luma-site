"use client";

import { useState } from "react";
import { Lock, Palette, Type, Gift, Sparkles, ChevronDown, ChevronUp, Image as ImageIcon, MapPin, Heart, Home, Clock } from "lucide-react";
import UpgradeModal from "./UpgradeModal";
import { TemplateData } from "@/types/template";

interface EditorSidebarProps {
    data: TemplateData;
    onChange: (field: keyof TemplateData | string, value: any) => void;
}

export default function EditorSidebar({ data, onChange }: EditorSidebarProps) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [lockedFeature, setLockedFeature] = useState("");
    const [openSection, setOpenSection] = useState<string | null>("home");

    // Progress Calculation (Fake based on "completeness" or just fixed to incentivize upgrade)
    // Let's make it 60% fixed for Free tier to show they are missing out.
    const progress = 60;

    const handleLockedClick = (feature: string) => {
        setLockedFeature(feature);
        setShowUpgrade(true);
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const updateNested = (parent: keyof TemplateData, child: string, value: string) => {
        // This is a naive deep merge update for the sidebar inputs
        const currentParent = data[parent] as any;
        onChange(parent, { ...currentParent, [child]: value });
    };

    return (
        <>
            <div className="w-full h-full bg-white border-r border-gray-100 flex flex-col font-sans">

                {/* HEADER & PROGRESS */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-[#1a3c34]">Editor do Site</h2>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-1 rounded-full">Plano Grátis</span>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                            <span>Nível do Site</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[var(--gold)] to-yellow-300 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <button onClick={() => handleLockedClick("Acesso Completo")} className="text-[10px] text-[var(--gold)] font-medium mt-2 hover:underline flex items-center gap-1">
                            <Sparkles size={10} />
                            Desbloquear recursos Premium para atingir 100%
                        </button>
                    </div>
                </div>

                {/* SECTIONS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* 1. HOME / INÍCIO */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => toggleSection("home")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${openSection === 'home' ? 'bg-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <Home size={18} className="text-gray-400" />
                                <span className="font-medium text-gray-700">Capa & Início</span>
                            </div>
                            {openSection === 'home' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>

                        {openSection === 'home' && (
                            <div className="p-4 space-y-4 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Nome do Noivo</label>
                                    <input type="text" value={data.groomName} onChange={(e) => onChange("groomName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Nome da Noiva</label>
                                    <input type="text" value={data.brideName} onChange={(e) => onChange("brideName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">Data</label>
                                    <input type="date" value={data.date} onChange={(e) => onChange("date", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                </div>

                                {/* UPSELL: Fontes */}
                                <div onClick={() => handleLockedClick("Tipografia")} className="relative opacity-70 hover:opacity-100 transition-opacity cursor-pointer group border border-dashed border-gray-300 rounded-lg p-3 mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-500 flex items-center gap-2"><Type size={12} /> Fontes</span>
                                        <Lock size={12} className="text-[var(--gold)]" />
                                    </div>
                                    <div className="h-2 w-2/3 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                                    <div className="absolute inset-0 bg-white/50 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] bg-[var(--gold)] text-white px-2 py-1 rounded shadow-sm font-bold">Mudar Tipografia</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. O CASAL */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => toggleSection("couple")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${openSection === 'couple' ? 'bg-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={18} className="text-gray-400" />
                                <span className="font-medium text-gray-700">O Casal</span>
                            </div>
                            {openSection === 'couple' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>

                        {openSection === 'couple' && (
                            <div className="p-4 space-y-4 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">História do Casal</label>
                                    <textarea rows={3} value={data.couple?.description || ""} onChange={(e) => updateNested("couple", "description", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Bio Noiva</label>
                                        <input type="text" value={data.couple?.brideBio || ""} onChange={(e) => updateNested("couple", "brideBio", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Bio Noivo</label>
                                        <input type="text" value={data.couple?.groomBio || ""} onChange={(e) => updateNested("couple", "groomBio", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. CERIMÔNIA */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => toggleSection("ceremony")}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${openSection === 'ceremony' ? 'bg-gray-50' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-gray-400" />
                                <span className="font-medium text-gray-700">Cerimônia & Festa</span>
                            </div>
                            {openSection === 'ceremony' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>

                        {openSection === 'ceremony' && (
                            <div className="p-4 space-y-4 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">

                                <div className="space-y-3 pb-4 border-b border-gray-200/50">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Cerimônia</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Local</label>
                                        <input type="text" value={data.ceremony?.locationName || ""} onChange={(e) => updateNested("ceremony", "locationName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock size={10} /> Horário</label>
                                            <input type="time" value={data.ceremony?.time || ""} onChange={(e) => updateNested("ceremony", "time", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Recepção</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">Local da Festa</label>
                                        <input type="text" value={data.reception?.locationName || ""} onChange={(e) => updateNested("reception", "locationName", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[var(--gold)] focus:outline-none bg-white" />
                                    </div>
                                </div>

                                {/* UPSELL: Maps Avançado */}
                                <button onClick={() => handleLockedClick("Mapas Interativos")} className="w-full py-2 border border-dashed border-[var(--gold)]/30 bg-[var(--gold)]/5 rounded-lg text-xs font-medium text-[var(--gold)] flex items-center justify-center gap-2 hover:bg-[var(--gold)]/10 transition-colors">
                                    <MapPin size={12} />
                                    Liberar Mapas Interativos
                                    <Lock size={10} />
                                </button>

                            </div>
                        )}
                    </div>

                    {/* 4. DESIGN (LOCKED) */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => handleLockedClick("Design e Cores")}
                            className="w-full flex items-center justify-between p-4 hover:bg-[var(--gold)]/5 group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Palette size={18} className="text-gray-400 group-hover:text-[var(--gold)]" />
                                <span className="font-medium text-gray-700 group-hover:text-[#1a3c34]">Cores e Design</span>
                            </div>
                            <Lock size={16} className="text-gray-300 group-hover:text-[var(--gold)]" />
                        </button>
                    </div>

                    {/* 5. LISTA DE PRESENTES (LOCKED) */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => handleLockedClick("Lista de Presentes")}
                            className="w-full flex items-center justify-between p-4 hover:bg-[var(--gold)]/5 group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Gift size={18} className="text-gray-400 group-hover:text-[var(--gold)]" />
                                <span className="font-medium text-gray-700 group-hover:text-[#1a3c34]">Lista de Presentes (PIX)</span>
                            </div>
                            <Lock size={16} className="text-gray-300 group-hover:text-[var(--gold)]" />
                        </button>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-100 bg-white z-10">
                    <button className="w-full py-3 bg-[#1a3c34] text-white rounded-lg font-medium text-sm hover:bg-[#122b25] transition-colors shadow-lg shadow-[#1a3c34]/20 flex items-center justify-center gap-2">
                        Salvar e Publicar
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-3">
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
