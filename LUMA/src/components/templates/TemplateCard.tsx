"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star, Sparkles, Check, Users, Gift, Settings, MessageCircle, RefreshCw } from "lucide-react";
import { Template } from "./templateData";

interface TemplateCardProps {
    template: Template;
    index: number;
    onSelect: (template: Template) => void;
}

const includedBenefits = [
    { icon: MessageCircle, label: "Concierge" },
    { icon: RefreshCw, label: "2 Ajustes" },
    { icon: Settings, label: "Painel Admin" },
    { icon: Users, label: "Convidados" },
    { icon: Gift, label: "Presentes" },
];

/**
 * Template card - Native app-like design for mobile.
 */
export function TemplateCard({ template, index, onSelect }: TemplateCardProps) {
    const handleClick = () => {
        onSelect(template);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-md transition-all duration-200 border border-[#E5E0D6] cursor-pointer flex flex-col active:scale-[0.99]"
            onClick={handleClick}
        >
            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5">
                {template.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C19B58] text-white text-[8px] font-bold uppercase tracking-wider rounded-full shadow">
                        <Star size={8} fill="currentColor" />
                        Popular
                    </span>
                )}
                {template.new && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#2A3B2E] text-white text-[8px] font-bold uppercase tracking-wider rounded-full shadow">
                        <Sparkles size={8} />
                        Novo
                    </span>
                )}
            </div>

            {/* Image Container */}
            <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                <Image
                    src={template.image}
                    alt={`Template ${template.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className="p-3.5 md:p-5 flex-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-[8px] md:text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#F7F5F0] text-[#C19B58] rounded font-bold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title and Style */}
                <h3 className="text-base md:text-lg font-semibold text-[#2A3B2E] mb-0.5 font-[family-name:var(--font-heading)]">
                    {template.name}
                </h3>
                <p className="text-[11px] md:text-xs text-[#C19B58] font-medium mb-1.5">
                    {template.style}
                </p>

                {/* Description - Very short on mobile */}
                <p className="text-[12px] md:text-sm text-[#6B7A6C] leading-snug mb-3 flex-1 line-clamp-2">
                    {template.description}
                </p>

                {/* Price Card - Compact */}
                <div className="bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-[8px] text-white/50 uppercase tracking-wider">Completo</p>
                            <p className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">R$ 197</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-white/60">Pagamento único</p>
                            <p className="text-[9px] text-[#C19B58] font-medium">Tudo incluso ✨</p>
                        </div>
                    </div>

                    {/* Benefits - Compact 3-column grid */}
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10">
                        {includedBenefits.slice(0, 3).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <Check size={8} className="text-[#C19B58] flex-shrink-0" />
                                <span className="text-[8px] text-white/70 truncate">{benefit.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                        {includedBenefits.slice(3).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <Check size={8} className="text-[#C19B58] flex-shrink-0" />
                                <span className="text-[8px] text-white/70 truncate">{benefit.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button - Large touch target */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 md:h-11 bg-[#C19B58] text-white rounded-xl font-semibold text-[14px] shadow-md shadow-[#C19B58]/20 flex items-center justify-center gap-2 active:bg-[#b08d4b] transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    Contratar R$ 197
                    <ArrowRight size={16} />
                </motion.button>
            </div>
        </motion.article>
    );
}
