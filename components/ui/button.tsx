import * as React from "react"
// Force refresh
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 border border-white/10",
                destructive:
                    "bg-confusion-500 text-white hover:bg-confusion-600 shadow-lg shadow-confusion-500/20",
                outline:
                    "border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-200 backdrop-blur-md",
                secondary:
                    "bg-white/5 text-gray-100 hover:bg-white/10 border border-white/10 backdrop-blur-md shadow-sm",
                ghost: "hover:bg-white/5 hover:text-white text-gray-300",
                link: "text-primary-400 underline-offset-4 hover:underline",
                glass: "bg-glass-white border border-glass-border backdrop-blur-xl text-white hover:bg-white/10 shadow-lg",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-lg px-4 text-xs",
                lg: "h-14 rounded-2xl px-10 text-base",
                icon: "h-11 w-11",
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
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
