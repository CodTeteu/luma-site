"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md";
    className?: string;
}

/**
 * Toggle switch component matching LUMA design system
 */
export function Switch({
    checked,
    onChange,
    disabled = false,
    size = "sm",
    className
}: SwitchProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled) {
            onChange(!checked);
        }
    };

    const sizeClasses = size === "sm"
        ? "w-8 h-4"
        : "w-10 h-5";

    const thumbSize = size === "sm"
        ? "w-3 h-3"
        : "w-4 h-4";

    const thumbTranslate = size === "sm"
        ? "translate-x-4"
        : "translate-x-5";

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C19B58]/50 focus:ring-offset-1",
                sizeClasses,
                checked
                    ? "bg-[#C19B58]"
                    : "bg-[#DCD3C5]",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <span
                className={cn(
                    "inline-block rounded-full bg-white shadow transform transition-transform duration-200",
                    thumbSize,
                    checked ? thumbTranslate : "translate-x-0.5"
                )}
            />
        </button>
    );
}
