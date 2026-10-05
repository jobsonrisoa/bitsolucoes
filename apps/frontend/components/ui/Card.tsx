import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-sm border-2 border-ink bg-paper text-ink shadow-md",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
