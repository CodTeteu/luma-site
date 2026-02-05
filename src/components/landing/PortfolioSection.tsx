"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Monitor, Smartphone, X, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import Image from "next/image";

const cases = [
    {
        name: "Ana & Pedro",
        style: "Organic Luxury",
        image: "linear-gradient(135deg, #F7F5F0 0%, #E5E0D6 100%)",
        desc: "Um casamento ao ar livre com tons terrosos e texturas naturais.",
        tags: ["Minimalista", "Campo"],
        previewDesktop: "/images/templates/preview-elegance-desktop.jpg",
        previewMobile: "/images/templates/preview-elegance-mobile.jpg",
    },
    {
        name: "Juliana & Roberto",
        style: "Classic Gold",
        image: "linear-gradient(135deg, #1a1a1a 0%, #2A3B2E 100%)",
        desc: "A sofisticação do tradicional com toques de modernidade digital.",
        tags: ["Clássico", "Noite"],
        previewDesktop: "/images/templates/preview-classic-desktop.jpg",
        previewMobile: "/images/templates/preview-classic-mobile.jpg",
    },
    {
        name: "Lucas & Bea",
        style: "Modern Boho",
        image: "linear-gradient(135deg, #C19B58 0%, #D4B56A 100%)",
        desc: "Autenticidade e liberdade em cada detalhe do layout.",
        tags: ["Boho", "Praia"],
        previewDesktop: "/images/templates/preview-garden-desktop.jpg",
        previewMobile: "/images/templates/preview-garden-mobile.jpg",
    },
];

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: typeof cases[0] | null;
    viewMode: "desktop" | "mobile";
}

function PreviewModal({ isOpen, onClose, project, viewMode }: PreviewModalProps) {
    if (!isOpen || !project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl ${viewMode === "desktop" ? "max-w-4xl w-full" : "max-w-sm w-full"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#DCD3C5]">
                        <div className="flex items-center gap-2">
                            {viewMode === "desktop" ? <Monitor size={18} className="text-[#C19B58]" /> : <Smartphone size={18} className="text-[#C19B58]" />}
                            <span className="text-sm font-medium text-[#2A3B2E]">{project.name} - {viewMode === "desktop" ? "Desktop" : "Mobile"}</span>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-[#F7F5F0]">
                            <X size={18} className="text-[#6B7A6C]" />
                        </button>
                    </div>

                    {/* Preview Content */}
                    <div className={`relative ${viewMode === "desktop" ? "h-[60vh]" : "h-[70vh]"} bg-[#F7F5F0]`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {viewMode === "desktop" ? <Monitor size={32} className="text-[#C19B58]" /> : <Smartphone size={32} className="text-[#C19B58]" />}
                                </div>
                                <h3 className="text-lg font-medium text-[#2A3B2E] mb-2 font-[family-name:var(--font-heading)]">
                                    {project.style}
                                </h3>
                                <p className="text-sm text-[#6B7A6C] mb-6">{project.desc}</p>
                                <Link
                                    href="/templates"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-lg font-medium hover:bg-[#b08d4b] transition-colors"
                                >
                                    Ver Todos Templates
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Portfolio section showcasing previous projects.
 */
export function PortfolioSection() {
    const [selectedProject, setSelectedProject] = useState<typeof cases[0] | null>(null);
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePreview = (project: typeof cases[0], mode: "desktop" | "mobile") => {
        setSelectedProject(project);
        setViewMode(mode);
        setIsModalOpen(true);
    };

    return (
        <>
            <section id="portfolio" className="py-24 px-6 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                            Nossas Criações
                        </h2>
                        <p className="text-[#6B7A6C]">
                            Veja o que estamos criando para outros casais e encontre o estilo que mais combina com o seu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {cases.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#DCD3C5]"
                            >
                                <div
                                    className="h-64 relative overflow-hidden bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                    style={{ background: project.image }}
                                >
                                    <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                                        <span className="text-white font-[family-name:var(--font-heading)] text-2xl drop-shadow-md">
                                            {project.name}
                                        </span>
                                    </div>

                                    {/* Overlay Interactions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                                        <span className="text-white font-[family-name:var(--font-heading)] text-2xl mb-2">
                                            Visualizar em:
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handlePreview(project, "desktop")}
                                                className="bg-white text-[#2A3B2E] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C19B58] hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Monitor size={16} />
                                                Computador
                                            </button>
                                            <button
                                                onClick={() => handlePreview(project, "mobile")}
                                                className="bg-white text-[#2A3B2E] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#C19B58] hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Smartphone size={16} />
                                                Celular
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex gap-2 mb-4">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#F7F5F0] text-[#C19B58] rounded-sm font-bold"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-medium text-[#2A3B2E] mb-2">{project.style}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{project.desc}</p>
                                    <Link
                                        href="/templates"
                                        className="inline-flex items-center text-[#C19B58] hover:text-[#b08d4b] text-sm font-medium"
                                    >
                                        Quero um igual{" "}
                                        <ArrowRight
                                            size={14}
                                            className="ml-1 group-hover:translate-x-1 transition-transform"
                                        />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-[#DCD3C5] bg-[#F7F5F0] px-6 py-6">
                        <div>
                            <p className="text-[#2A3B2E] text-lg font-medium">Quer ver todos os estilos disponíveis?</p>
                            <p className="text-[#6B7A6C] text-sm">Acesse nossa galeria completa e escolha o seu favorito.</p>
                        </div>
                        <Link
                            href="/templates"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-full font-medium hover:bg-[#b08d4b] transition-colors"
                        >
                            Ver galeria de templates
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={selectedProject}
                viewMode={viewMode}
            />
        </>
    );
}
