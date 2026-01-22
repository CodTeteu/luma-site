import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19B58] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wide",
    {
        variants: {
            variant: {
                default:
                    "bg-[#2A3B2E] text-[#F7F5F0] hover:bg-[#202E24] shadow-sm hover:shadow-md",
                destructive:
                    "bg-[#9B2C2C] text-white hover:bg-[#7F2424]",
                outline:
                    "border border-[#2A3B2E] text-[#2A3B2E] bg-transparent hover:bg-[#2A3B2E]/5",
                secondary:
                    "bg-[#E5E0D6] text-[#2A3B2E] hover:bg-[#D4CEBF]",
                ghost:
                    "hover:bg-[#2A3B2E]/5 text-[#2A3B2E]",
                link:
                    "text-[#2A3B2E] underline-offset-4 hover:underline",
                gold:
                    "bg-[#C19B58] text-white hover:bg-[#B08D4C] shadow-sm",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-14 rounded-lg px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
