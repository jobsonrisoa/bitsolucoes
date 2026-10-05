import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'open' | 'prog' | 'done' | 'default';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn("badge", variant, className)} {...props} />
  )
}

export { Badge }
