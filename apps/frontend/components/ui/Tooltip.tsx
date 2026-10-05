import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={cn("tooltip", className)}>
      {children}
      <span role="tooltip" className="tooltip-bubble">
        {label}
      </span>
    </span>
  );
}
