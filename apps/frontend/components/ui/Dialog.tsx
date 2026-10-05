"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/55" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 grid w-full max-w-lg gap-4 border-2 border-ink bg-paper p-6 shadow-lg duration-200 sm:rounded-sm">
        {children}
      </div>
    </div>
  );
}
