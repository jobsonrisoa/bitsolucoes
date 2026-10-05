"use client";

import { useEffect } from "react";

interface ArrowKeyNavigationProps {
  children?: React.ReactNode;
  enabled?: boolean;
}

export function ArrowKeyNavigation({ children, enabled = true }: ArrowKeyNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Only handle if target is a button or link
      if (!['BUTTON', 'A'].includes(target.tagName)) return;

      // Get all focusable elements in the container
      const focusableElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      );

      const currentIndex = focusableElements.indexOf(target);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % focusableElements.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      } else {
        return;
      }

      focusableElements[nextIndex]?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  return <>{children}</>;
}
