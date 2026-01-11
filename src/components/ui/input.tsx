import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-lg border border-[#DCD3C5] bg-white/70 px-3 py-2 text-base text-[#3E4A3F] ring-offset-[#F7F5F0] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#3E4A3F] placeholder:text-[#9CA39B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C19B58] focus-visible:border-[#C19B58] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
