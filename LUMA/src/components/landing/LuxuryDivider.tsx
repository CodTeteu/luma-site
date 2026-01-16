"use client";

import { motion } from "framer-motion";
import { Diamond } from "lucide-react";

interface LuxuryDividerProps {
    className?: string;
}

/**
 * Decorative divider with animated lines and diamond icon.
 * Used to separate sections with a premium feel.
 */
export function LuxuryDivider({ className = "" }: LuxuryDividerProps) {
    return (
        <div className={`flex items-center justify-start gap-4 ${className}`}>
            <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-[#C19B58]"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ duration: 0.8 }}
            />
            <Diamond size={12} className="text-[#C19B58]" />
            <motion.div
                className="h-px w-16 bg-gradient-to-l from-transparent to-[#C19B58]"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                transition={{ duration: 0.8 }}
            />
        </div>
    );
}
