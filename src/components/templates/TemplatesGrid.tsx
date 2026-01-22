"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateCard } from "./TemplateCard";
import { BriefingModal } from "./BriefingModal";
import { templates, categories, Template } from "./templateData";

/**
 * Skeleton loader for template cards during loading.
 */
function TemplateCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D6] animate-pulse">
            <div className="h-40 sm:h-48 md:h-56 bg-[#E5E0D6]" />
            <div className="p-3.5 md:p-5 space-y-3">
                <div className="flex gap-1">
                    <div className="h-4 w-12 bg-[#E5E0D6] rounded" />
                    <div className="h-4 w-16 bg-[#E5E0D6] rounded" />
                </div>
                <div className="h-5 w-3/4 bg-[#E5E0D6] rounded" />
                <div className="h-3 w-1/2 bg-[#E5E0D6] rounded" />
                <div className="h-12 w-full bg-[#E5E0D6] rounded" />
                <div className="h-20 w-full bg-[#E5E0D6] rounded-xl" />
                <div className="h-12 w-full bg-[#C19B58]/30 rounded-xl" />
            </div>
        </div>
    );
}

/**
 * Grid of template cards - Native app-like experience.
 */
export function TemplatesGrid() {
    const [activeCategory, setActiveCategory] = useState("todos");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Show loading state when switching categories
    const handleCategoryChange = (categoryId: string) => {
        if (categoryId !== activeCategory) {
            setIsLoading(true);
            setActiveCategory(categoryId);
            setTimeout(() => setIsLoading(false), 300);
        }
    };

    const filteredTemplates = activeCategory === "todos"
        ? templates
        : templates.filter(t => t.category === activeCategory);

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    return (
        <>
            <section className="py-6 md:py-16 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Filter Pills - Horizontal scroll, app-like */}
                    <div className="mb-5 md:mb-12 -mx-4 px-4">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`
                                        flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200
                                        ${activeCategory === category.id
                                            ? "bg-[#2A3B2E] text-white shadow-md"
                                            : "bg-white text-[#3E4A3F] border border-[#E5E0D6] active:bg-[#F7F5F0]"
                                        }
                                    `}
                                >
                                    {category.label}
                                    <span className={`ml-1 text-[11px] ${activeCategory === category.id ? "text-[#C19B58]" : "text-[#6B7A6C]"}`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                // Skeleton loading state
                                <>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <motion.div
                                            key={`skeleton-${i}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <TemplateCardSkeleton />
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                // Actual template cards
                                filteredTemplates.map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <TemplateCard
                                            template={template}
                                            index={index}
                                            onSelect={handleTemplateSelect}
                                        />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {!isLoading && filteredTemplates.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className="text-[#6B7A6C] text-[15px]">
                                Nenhum template encontrado.
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Briefing Modal */}
            <BriefingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                template={selectedTemplate}
            />
        </>
    );
}
