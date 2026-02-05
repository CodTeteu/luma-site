import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
    "flex w-full rounded-xl border bg-white px-4 text-base text-[#2A3B2E] font-[family-name:var(--font-sans)] ring-offset-[#F7F5F0] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#2A3B2E] placeholder:text-[#A5B5A7] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F7F5F0]",
    {
        variants: {
            size: {
                sm: "h-10 text-sm py-2",
                default: "h-12 py-3",
                lg: "h-14 py-4 text-lg",
            },
            state: {
                default: "border-[#E5E0D6] focus:outline-none focus:ring-2 focus:ring-[#C19B58]/20 focus:border-[#C19B58]",
                error: "border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]",
                success: "border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]",
            },
        },
        defaultVariants: {
            size: "default",
            state: "default",
        },
    }
)

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    error?: boolean
    success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, size, error, success, state, ...props }, ref) => {
        // Determine state from error/success props
        const computedState = error ? "error" : success ? "success" : state || "default"

        return (
            <input
                type={type}
                className={cn(
                    inputVariants({ size, state: computedState }),
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

// ============================================
// Textarea
// ============================================

export interface TextareaProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof inputVariants> {
    error?: boolean
    success?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, success, state, ...props }, ref) => {
        const computedState = error ? "error" : success ? "success" : state || "default"

        return (
            <textarea
                className={cn(
                    "flex w-full min-h-[120px] rounded-xl border bg-white px-4 py-3 text-base text-[#2A3B2E] font-[family-name:var(--font-sans)] ring-offset-[#F7F5F0] placeholder:text-[#A5B5A7] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F7F5F0] resize-none",
                    computedState === "error" && "border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]",
                    computedState === "success" && "border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50]",
                    computedState === "default" && "border-[#E5E0D6] focus:outline-none focus:ring-2 focus:ring-[#C19B58]/20 focus:border-[#C19B58]",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

// ============================================
// Form Field Wrapper
// ============================================

interface FormFieldProps {
    children: React.ReactNode
    label?: string
    htmlFor?: string
    error?: string
    hint?: string
    required?: boolean
    className?: string
}

export function FormField({
    children,
    label,
    htmlFor,
    error,
    hint,
    required,
    className
}: FormFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="block text-sm font-medium text-[#2A3B2E] font-[family-name:var(--font-sans)]"
                >
                    {label}
                    {required && <span className="text-[#DC2626] ml-0.5">*</span>}
                </label>
            )}
            {children}
            {error && (
                <p className="text-sm text-[#DC2626] flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {hint && !error && (
                <p className="text-sm text-[#6B7A6C]">{hint}</p>
            )}
        </div>
    )
}

export { Input, Textarea, inputVariants }
