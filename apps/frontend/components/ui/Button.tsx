import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors border-2 border-ink shadow-sm active:translate-y-1 active:shadow-none h-11 px-8 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
          variant === 'default' ? "bg-ink text-paper" : "bg-paper text-ink",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
