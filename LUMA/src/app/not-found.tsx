import Link from "next/link";
import { Heart, Home, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50"></div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-[#2A3B2E]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#C19B58]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#2A3B2E] to-[#3E4A3F] flex items-center justify-center shadow-2xl">
                    <Heart size={40} className="text-[#C19B58]" />
                </div>

                {/* 404 Number */}
                <h1 className="text-8xl font-[family-name:var(--font-heading)] text-[#2A3B2E] mb-4 tracking-tight">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                    Ops! Não encontramos este casamento.
                </h2>
                <p className="text-[#6B7A6C] mb-8 leading-relaxed">
                    O link que você acessou pode estar incorreto ou o site ainda não foi publicado.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2A3B2E] text-[#2A3B2E] font-medium rounded-lg hover:bg-[#2A3B2E] hover:text-white transition-colors"
                    >
                        <Home size={18} />
                        Voltar ao Início
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C19B58] to-[#A07D3A] text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <Sparkles size={18} />
                        Criar meu site no LUMA
                    </Link>
                </div>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-4 mt-12">
                    <div className="w-12 h-px bg-[#DCD3C5]"></div>
                    <Heart size={14} className="text-[#C19B58]" fill="currentColor" />
                    <div className="w-12 h-px bg-[#DCD3C5]"></div>
                </div>
            </div>
        </div>
    );
}
