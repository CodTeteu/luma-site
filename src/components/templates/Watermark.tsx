/**
 * Watermark Component
 * Displayed on Free plan invites with link to create your own
 */

import Link from "next/link";

interface WatermarkProps {
    className?: string;
}

export function Watermark({ className = "" }: WatermarkProps) {
    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
            style={{ pointerEvents: "none" }}
        >
            <div className="bg-gradient-to-t from-black/20 to-transparent py-8 px-4">
                <Link
                    href="https://lumaconvites.com.br"
                    target="_blank"
                    rel="noopener"
                    className="block text-center text-white/90 text-sm font-medium hover:text-white transition-colors"
                    style={{
                        pointerEvents: "auto",
                        textShadow: "0 1px 3px rgba(0,0,0,0.5)"
                    }}
                >
                    <span className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-[#C19B58]">✨</span>
                        Feito com LUMA Convites — Crie o seu grátis
                    </span>
                </Link>
            </div>
        </div>
    );
}
