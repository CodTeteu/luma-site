"use client";

import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "seu email";

    return (
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center"
            >
                {/* Icon */}
                <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Mail size={40} className="text-[#C19B58]" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                    Verifique seu Email
                </h1>

                {/* Description */}
                <p className="text-[#6B7A6C] mb-2">
                    Enviamos um link de confirmação para:
                </p>
                <p className="text-[#2A3B2E] font-medium mb-8 break-all">
                    {email}
                </p>

                {/* Instructions */}
                <div className="bg-white rounded-xl p-6 border border-[#DCD3C5] mb-8 text-left">
                    <h3 className="font-medium text-[#2A3B2E] mb-4">Próximos passos:</h3>
                    <ol className="space-y-3 text-sm text-[#6B7A6C]">
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                            <span>Abra sua caixa de entrada (verifique spam/promoções)</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                            <span>Clique no link de confirmação no email</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                            <span>Faça login normalmente após confirmar</span>
                        </li>
                    </ol>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-[#2A3B2E] text-white rounded-lg font-medium hover:bg-[#1a261d] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Voltar para Login
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-2 w-full py-3 border border-[#DCD3C5] text-[#6B7A6C] rounded-lg font-medium hover:bg-white transition-colors"
                    >
                        <RefreshCw size={18} />
                        Atualizar página
                    </button>
                </div>

                {/* Help text */}
                <p className="text-xs text-[#6B7A6C] mt-8">
                    Não recebeu o email? Verifique a pasta de spam ou tente se cadastrar novamente.
                </p>
            </motion.div>
        </div>
    );
}

export default function CheckEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        }>
            <CheckEmailContent />
        </Suspense>
    );
}
