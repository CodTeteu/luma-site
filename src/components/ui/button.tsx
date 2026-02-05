import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { ButtonSpinner } from "./loading"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C19B58] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#2A3B2E] text-[#F7F5F0] hover:bg-[#1A2B1E] shadow-sm hover:shadow-md",
                destructive:
                    "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
                outline:
                    "border border-[#2A3B2E] text-[#2A3B2E] bg-transparent hover:bg-[#2A3B2E]/5",
                secondary:
                    "bg-[#E5E0D6] text-[#2A3B2E] hover:bg-[#D4CEBF]",
                ghost:
                    "hover:bg-[#2A3B2E]/5 text-[#2A3B2E]",
                link:
                    "text-[#2A3B2E] underline-offset-4 hover:underline",
                gold:
                    "bg-[#C19B58] text-white hover:bg-[#A88347] shadow-md shadow-[#C19B58]/25 hover:shadow-lg",
            },
            size: {
                sm: "h-9 px-4 text-xs [&_svg]:size-3.5",
                default: "h-11 px-6 text-sm [&_svg]:size-4",
                lg: "h-14 px-8 text-base [&_svg]:size-5",
                xl: "h-16 px-10 text-lg [&_svg]:size-5",
                icon: "h-11 w-11 [&_svg]:size-5",
                "icon-sm": "h-9 w-9 [&_svg]:size-4",
                "icon-lg": "h-14 w-14 [&_svg]:size-6",
                // Touch-friendly sizes for mobile
                touch: "h-12 px-6 text-base min-w-[44px] [&_svg]:size-5",
                "touch-lg": "h-14 px-8 text-base min-w-[44px] [&_svg]:size-5",
            },
            fullWidth: {
                true: "w-full",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
    loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        fullWidth,
        asChild = false,
        isLoading = false,
        loadingText,
        children,
        disabled,
        ...props
    }, ref) => {
        const Comp = asChild ? Slot : "button"

        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Comp>
            )
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <ButtonSpinner />
                        {loadingText || "Carregando..."}
                    </>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
