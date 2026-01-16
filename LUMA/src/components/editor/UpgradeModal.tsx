"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>

                            <div className="flex flex-col">
                                {/* Header with Gold Gradient */}
                                <div className="bg-gradient-to-r from-[#C19B58] to-[#D4B56A] p-8 text-center text-white relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 opacity-20 mix-blend-multiply"
                                        style={{ backgroundImage: 'url("/images/assets/noise-texture.png")' }}
                                    />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -top-20 -right-20 w-60 h-60 border border-white/10 rounded-full"
                                    />

                                    <Sparkles size={40} className="mx-auto mb-4 text-white/90" />
                                    <h2 className="text-2xl font-medium mb-2 font-[family-name:var(--font-heading)]">
                                        Desbloqueie o Plano Gold
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        {featureName ? `Você precisa do Plano Gold para editar "${featureName}".` : "Tenha acesso completo ao seu site."}
                                    </p>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-end justify-center gap-1 mb-8">
                                        <span className="text-4xl font-bold text-[#2A3B2E]">R$ 97</span>
                                        <span className="text-[#6B7A6C] mb-1">/único</span>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-sm text-[#3E4A3F]">
                                            <div className="w-5 h-5 rounded-full bg-[#E5E0D6] flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-[#2A3B2E]" />
                                            </div>
                                            Lista de Presentes com PIX (0% taxa)
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#3E4A3F]">
                                            <div className="w-5 h-5 rounded-full bg-[#E5E0D6] flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-[#2A3B2E]" />
                                            </div>
                                            Personalização Avançada (Cores e Fontes)
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[#3E4A3F]">
                                            <div className="w-5 h-5 rounded-full bg-[#E5E0D6] flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-[#2A3B2E]" />
                                            </div>
                                            Remoção da marca d'água LUMA
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-[#2A3B2E] text-white py-4 rounded-lg font-medium tracking-wide hover:bg-[#1f2d22] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#2A3B2E]/20"
                                    >
                                        Fazer Upgrade Agora
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <p className="text-center text-xs text-[#6B7A6C] mt-4">
                                        Pagamento seguro via cartão ou PIX. Acesso imediato.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
