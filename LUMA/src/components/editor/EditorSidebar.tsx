"use client";

import { useState, useRef } from "react";
import {
    Lock, Palette, Type, Gift, Sparkles, ChevronDown, ChevronUp,
    MapPin, Heart, Home, Clock, Image as ImageIcon, Plus, Trash2, Eye, EyeOff
} from "lucide-react";
import UpgradeModal from "./UpgradeModal";
import ImageCropModal from "./ImageCropModal";
import { Switch } from "@/components/ui/Switch";
import { showToast } from "@/components/ui/Toast";
import { TemplateData, GalleryImage, generateImageId } from "@/types/template";

interface EditorSidebarProps {
    data: TemplateData;
    onChange: <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => void;
}

// Type for nested objects in TemplateData
type NestedTemplateKeys = "couple" | "ceremony" | "reception" | "gallery";

export default function EditorSidebar({ data, onChange }: EditorSidebarProps) {
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [lockedFeature, setLockedFeature] = useState("");
    const [openSection, setOpenSection] = useState<string | null>("home");
    const [isSaving, setIsSaving] = useState(false);

    // Image crop state
    const [cropModal, setCropModal] = useState<{
        isOpen: boolean;
        imageUrl: string;
        aspectRatio: number;
        targetField: string;
    }>({ isOpen: false, imageUrl: "", aspectRatio: 16 / 9, targetField: "" });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeImageField = useRef<{ field: string; aspectRatio: number } | null>(null);

    // Progress Calculation (based on filled fields)
    const calculateProgress = () => {
        let filled = 0;
        let total = 6;

        if (data.groomName) filled++;
        if (data.brideName) filled++;
        if (data.date) filled++;
        if (data.couple?.description) filled++;
        if (data.ceremony?.locationName) filled++;
        if (data.gallery?.images?.length > 0) filled++;

        return Math.round((filled / total) * 100);
    };

    const progress = calculateProgress();

    const handleLockedClick = (feature: string) => {
        setLockedFeature(feature);
        setShowUpgrade(true);
    };

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Update nested field
    const updateNested = <T extends NestedTemplateKeys>(
        parent: T,
        child: string,
        value: unknown
    ) => {
        const currentParent = data[parent];
        onChange(parent, { ...currentParent, [child]: value } as TemplateData[T]);
    };

    // Toggle section visibility
    const toggleVisibility = <T extends NestedTemplateKeys>(section: T) => {
        const current = data[section];
        onChange(section, { ...current, isVisible: !current.isVisible } as TemplateData[T]);
    };

    // Send highlight message to iframe
    const sendHighlight = (field: string) => {
        window.parent.postMessage({ type: "HIGHLIGHT", field }, "*");
    };

    // Handle image selection
    const handleImageClick = (field: string, aspectRatio: number = 16 / 9) => {
        activeImageField.current = { field, aspectRatio };
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeImageField.current) {
            const imageUrl = URL.createObjectURL(file);
            setCropModal({
                isOpen: true,
                imageUrl,
                aspectRatio: activeImageField.current.aspectRatio,
                targetField: activeImageField.current.field,
            });
        }
        e.target.value = "";
    };

    const handleCropConfirm = (croppedImageUrl: string) => {
        const field = cropModal.targetField;

        if (field.includes(".")) {
            const [parent, child] = field.split(".") as [NestedTemplateKeys, string];
            updateNested(parent, child, croppedImageUrl);
        } else {
            onChange(field as keyof TemplateData, croppedImageUrl as TemplateData[keyof TemplateData]);
        }

        setCropModal({ isOpen: false, imageUrl: "", aspectRatio: 16 / 9, targetField: "" });
    };

    // Gallery management
    const addGalleryImage = (imageUrl: string) => {
        const newImage: GalleryImage = {
            id: generateImageId(),
            url: imageUrl,
        };
        const currentImages = data.gallery?.images || [];
        onChange("gallery", {
            ...data.gallery,
            images: [...currentImages, newImage]
        });
    };

    const removeGalleryImage = (id: string) => {
        const currentImages = data.gallery?.images || [];
        onChange("gallery", {
            ...data.gallery,
            images: currentImages.filter((img) => img.id !== id),
        });
    };

    // Save handler
    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSaving(false);
        showToast("Site Salvo com Sucesso!", "success");
    };

    // Section header with visibility toggle
    const SectionHeader = ({
        id,
        icon: Icon,
        title,
        isVisible,
        onToggleVisibility
    }: {
        id: string;
        icon: React.ElementType;
        title: string;
        isVisible: boolean;
        onToggleVisibility: () => void;
    }) => (
        <button
            onClick={() => toggleSection(id)}
            className={`w-full flex items-center justify-between p-4 hover:bg-[#E5E0D6]/50 transition-colors ${openSection === id ? 'bg-[#E5E0D6]/50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-[#6B7A6C]" />
                <span className="font-medium text-[#2A3B2E]">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                <div
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/50 transition-colors"
                    title={isVisible ? "Ocultar seção" : "Mostrar seção"}
                >
                    {isVisible ? (
                        <Eye size={14} className="text-[#6B7A6C]" />
                    ) : (
                        <EyeOff size={14} className="text-[#C19B58]" />
                    )}
                    <Switch
                        checked={isVisible}
                        onChange={onToggleVisibility}
                        size="sm"
                    />
                </div>
                {openSection === id ? (
                    <ChevronUp size={16} className="text-[#6B7A6C]" />
                ) : (
                    <ChevronDown size={16} className="text-[#6B7A6C]" />
                )}
            </div>
        </button>
    );

    return (
        <>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

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
                                    <input
                                        type="text"
                                        value={data.groomName}
                                        onChange={(e) => onChange("groomName", e.target.value)}
                                        onFocus={() => sendHighlight("groomName")}
                                        className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Nome da Noiva</label>
                                    <input
                                        type="text"
                                        value={data.brideName}
                                        onChange={(e) => onChange("brideName", e.target.value)}
                                        onFocus={() => sendHighlight("brideName")}
                                        className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Data</label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => onChange("date", e.target.value)}
                                        onFocus={() => sendHighlight("date")}
                                        className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                    />
                                </div>

                                {/* Hero Image */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Imagem de Capa</label>
                                    <button
                                        onClick={() => handleImageClick("heroImage", 16 / 9)}
                                        className="w-full h-24 rounded-lg border-2 border-dashed border-[#DCD3C5] hover:border-[#C19B58] transition-colors bg-cover bg-center flex items-center justify-center group"
                                        style={{ backgroundImage: data.heroImage ? `url(${data.heroImage})` : undefined }}
                                    >
                                        <div className="bg-black/50 group-hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                                            <ImageIcon size={14} />
                                            Trocar Imagem
                                        </div>
                                    </button>
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
                        <SectionHeader
                            id="couple"
                            icon={Heart}
                            title="O Casal"
                            isVisible={data.couple?.isVisible ?? true}
                            onToggleVisibility={() => toggleVisibility("couple")}
                        />

                        {openSection === 'couple' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                {/* Couple Image */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Foto do Casal</label>
                                    <button
                                        onClick={() => handleImageClick("couple.image", 1)}
                                        className="w-full h-32 rounded-lg border-2 border-dashed border-[#DCD3C5] hover:border-[#C19B58] transition-colors bg-cover bg-center flex items-center justify-center group"
                                        style={{ backgroundImage: data.couple?.image ? `url(${data.couple.image})` : undefined }}
                                    >
                                        <div className="bg-black/50 group-hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
                                            <ImageIcon size={14} />
                                            Trocar Foto
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">História do Casal</label>
                                    <textarea
                                        rows={3}
                                        value={data.couple?.description || ""}
                                        onChange={(e) => updateNested("couple", "description", e.target.value)}
                                        onFocus={() => sendHighlight("couple.description")}
                                        className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F] resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Bio Noiva</label>
                                        <input
                                            type="text"
                                            value={data.couple?.brideBio || ""}
                                            onChange={(e) => updateNested("couple", "brideBio", e.target.value)}
                                            onFocus={() => sendHighlight("couple.brideBio")}
                                            className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Bio Noivo</label>
                                        <input
                                            type="text"
                                            value={data.couple?.groomBio || ""}
                                            onChange={(e) => updateNested("couple", "groomBio", e.target.value)}
                                            onFocus={() => sendHighlight("couple.groomBio")}
                                            className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. GALERIA */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <SectionHeader
                            id="gallery"
                            icon={ImageIcon}
                            title="Galeria"
                            isVisible={data.gallery?.isVisible ?? true}
                            onToggleVisibility={() => toggleVisibility("gallery")}
                        />

                        {openSection === 'gallery' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-3 gap-2">
                                    {data.gallery?.images?.map((image) => (
                                        <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden">
                                            <div
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url(${image.url})` }}
                                            />
                                            <button
                                                onClick={() => removeGalleryImage(image.id)}
                                                className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center"
                                            >
                                                <Trash2
                                                    size={20}
                                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Image Button */}
                                    <button
                                        onClick={() => {
                                            activeImageField.current = { field: "gallery.new", aspectRatio: 1 };
                                            fileInputRef.current?.click();
                                        }}
                                        className="aspect-square rounded-lg border-2 border-dashed border-[#DCD3C5] hover:border-[#C19B58] transition-colors flex items-center justify-center text-[#6B7A6C] hover:text-[#C19B58]"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-[#6B7A6C] text-center">
                                    Clique na foto para remover • Máx. 6 fotos no plano grátis
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 4. CERIMÔNIA */}
                    <div className="border-b border-[#DCD3C5]/50">
                        <SectionHeader
                            id="ceremony"
                            icon={MapPin}
                            title="Cerimônia & Festa"
                            isVisible={data.ceremony?.isVisible ?? true}
                            onToggleVisibility={() => toggleVisibility("ceremony")}
                        />

                        {openSection === 'ceremony' && (
                            <div className="p-4 space-y-4 bg-white/50 animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-3 pb-4 border-b border-[#DCD3C5]/50">
                                    <p className="text-xs font-bold text-[#6B7A6C] uppercase">Cerimônia</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Local</label>
                                        <input
                                            type="text"
                                            value={data.ceremony?.locationName || ""}
                                            onChange={(e) => updateNested("ceremony", "locationName", e.target.value)}
                                            onFocus={() => sendHighlight("ceremony.locationName")}
                                            className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Horário</label>
                                            <input
                                                type="time"
                                                value={data.ceremony?.time || ""}
                                                onChange={(e) => updateNested("ceremony", "time", e.target.value)}
                                                onFocus={() => sendHighlight("ceremony.time")}
                                                className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-[#6B7A6C] uppercase">Recepção</p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Local da Festa</label>
                                        <input
                                            type="text"
                                            value={data.reception?.locationName || ""}
                                            onChange={(e) => updateNested("reception", "locationName", e.target.value)}
                                            onFocus={() => sendHighlight("reception.locationName")}
                                            className="w-full px-3 py-2 text-sm border border-[#DCD3C5] rounded-lg focus:border-[#C19B58] focus:outline-none bg-white text-[#3E4A3F]"
                                        />
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

                    {/* 5. DESIGN (LOCKED) */}
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

                    {/* 6. LISTA DE PRESENTES (LOCKED) */}
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
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1f2d22] transition-colors shadow-lg shadow-[#2A3B2E]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar e Publicar"
                        )}
                    </button>
                    <p className="text-[10px] text-[#6B7A6C] text-center mt-3">
                        {isSaving ? "Publicando alterações..." : "Última alteração salva agora mesmo"}
                    </p>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                featureName={lockedFeature}
            />

            <ImageCropModal
                isOpen={cropModal.isOpen}
                imageUrl={cropModal.imageUrl}
                aspectRatio={cropModal.aspectRatio}
                onConfirm={(url) => {
                    if (cropModal.targetField === "gallery.new") {
                        addGalleryImage(url);
                        setCropModal({ isOpen: false, imageUrl: "", aspectRatio: 16 / 9, targetField: "" });
                    } else {
                        handleCropConfirm(url);
                    }
                }}
                onCancel={() => setCropModal({ isOpen: false, imageUrl: "", aspectRatio: 16 / 9, targetField: "" })}
            />
        </>
    );
}
