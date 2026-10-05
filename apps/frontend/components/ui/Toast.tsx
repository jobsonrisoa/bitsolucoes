"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'error' | 'success';
  onClose: () => void;
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "pointer-events-auto flex w-full max-w-md flex-col gap-1 border-2 border-ink bg-paper p-4 shadow-sm transition-all duration-250 ease-out",
      variant === 'error' && "border-red text-red",
      variant === 'success' && "border-moss text-moss"
    )}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <button onClick={onClose} className="text-ink hover:text-red">X</button>
      </div>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  )
}
